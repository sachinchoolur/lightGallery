import { autoplayDefaultIcons } from '@lightgallery/headless';
import {
    computed,
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    onScopeDispose,
    ref,
    watch,
} from 'vue';

import {
    LG_PLUGIN_CONTEXT,
    type LgPluginContext,
    type LgVuePlugin,
} from '../types';
import {
    LG_ICONS,
    resolveCustomIcons,
} from '../../icons';

/**
 * Autoplay plugin (2.x `lg-autoplay`): slideshow timer with progress bar.
 * The toolbar button and the timer talk over the event bus; run-state is
 * mirrored to the `lg-show-autoplay` outer class (2.x parity, drives the
 * progress-bar CSS).
 */

export interface AutoplaySettings {
    /** Enable the autoplay plugin. */
    autoplay: boolean;
    /** Start the slideshow as soon as the first slide loads. */
    slideShowAutoplay: boolean;
    /** Time (ms) between transitions (added to `speed`). */
    slideShowInterval: number;
    /** Show the progress bar. */
    progressBar: boolean;
    /** Keep the slideshow running after user navigation. */
    forceSlideShowAutoplay: boolean;
    /** Show the play/pause toolbar button. */
    autoplayControls: boolean;
    /**
     * @deprecated Set these labels on the core `strings` object instead —
     * an explicitly set key here still wins (alias).
     */
    autoplayPluginStrings?: { toggleAutoplay?: string };
}

export const autoplaySettings: AutoplaySettings = {
    autoplay: true,
    slideShowAutoplay: false,
    slideShowInterval: 5000,
    progressBar: true,
    forceSlideShowAutoplay: false,
    autoplayControls: true,
};

const TOGGLE_EVENT = 'lg-autoplay-toggle';

type AutoplayResolved = AutoplaySettings & { speed: number };

export const AutoplayButton = defineComponent({
    name: 'LgAutoplayButton',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const lgIcons = inject(LG_ICONS, undefined);
        return () => {
            const cfg = ctx.settings.value as unknown as AutoplayResolved;
            if (!cfg.autoplay || !cfg.autoplayControls) {
                return null;
            }
            const ci = resolveCustomIcons(
                lgIcons?.value,
                ['autoplayPlay', 'autoplayPause'],
                autoplayDefaultIcons,
            );
            return h(
                'button',
                {
                    type: 'button',
                    class: ['lg-autoplay-button lg-icon', ci?.cls],
                    'aria-label':
                        cfg.autoplayPluginStrings?.toggleAutoplay ??
                        ctx.settings.value.strings.toggleAutoplay,
                    onClick: () => ctx.events.emit(TOGGLE_EVENT, undefined),
                },
                ci?.children,
            );
        };
    },
});

export const AutoplayProgress = defineComponent({
    name: 'LgAutoplayProgress',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const running = ref(false);
        const cycle = ref(0);
        // Two-phase start: the remounted bar must PAINT at width 0 before
        // lg-start lands — a fresh element has no prior style, so flipping
        // the class in the same frame renders the bar full instead of
        // animating (2.x staged this with a 20ms timer).
        const armed = ref(false);
        let armTimer: ReturnType<typeof setTimeout> | null = null;
        watch([running, cycle], () => {
            armed.value = false;
            if (armTimer !== null) {
                clearTimeout(armTimer);
                armTimer = null;
            }
            if (!running.value) {
                return;
            }
            armTimer = setTimeout(() => {
                armed.value = true;
                armTimer = null;
            }, 20);
        });
        const offs = [
            ctx.events.on('autoplayStart', () => {
                running.value = true;
                cycle.value++;
            }),
            ctx.events.on('autoplayStop', () => (running.value = false)),
            ctx.events.on('beforeSlide', () => cycle.value++),
        ];
        onBeforeUnmount(() => {
            offs.forEach((off) => off());
            if (armTimer !== null) {
                clearTimeout(armTimer);
            }
        });
        return () => {
            const cfg = ctx.settings.value as unknown as AutoplayResolved;
            if (!cfg.autoplay || !cfg.progressBar) {
                return null;
            }
            const duration = cfg.speed + cfg.slideShowInterval;
            return h(
                'div',
                {
                    class: [
                        'lg-progress-bar',
                        { 'lg-start': running.value && armed.value },
                    ],
                },
                // Recreating the element restarts the width transition
                // each cycle (keyed remount, sibling-parity trick).
                h('div', {
                    key: cycle.value,
                    class: 'lg-progress',
                    style: running.value
                        ? { transition: `width ${duration}ms ease 0s` }
                        : undefined,
                }),
            );
        };
    },
});

function setupAutoplay(ctx: LgPluginContext): void {
    let interval: ReturnType<typeof setInterval> | null = null;
    let fromAuto = false;
    let pausedOnDrag = false;
    let pausedOnSlideChange = false;

    const cfg = (): AutoplayResolved =>
        ctx.settings.value as unknown as AutoplayResolved;

    const stop = (): void => {
        if (interval !== null) {
            clearInterval(interval);
            interval = null;
            ctx.layout.setOuterClass('lg-show-autoplay', false);
            ctx.emit('autoplayStop', {
                index: ctx.store.currentIndex.value,
            });
        }
    };
    const start = (): void => {
        if (interval !== null) {
            return;
        }
        ctx.layout.setOuterClass('lg-show-autoplay', true);
        ctx.emit('autoplayStart', {
            index: ctx.store.currentIndex.value,
        });
        interval = setInterval(() => {
            const state = ctx.store.state.value;
            const next =
                state.currentIndex + 1 < state.slidesCount
                    ? state.currentIndex + 1
                    : 0;
            fromAuto = true;
            ctx.emit('autoplay', { index: next });
            ctx.actions.navigate(next, 'next');
        }, cfg().speed + cfg().slideShowInterval);
    };

    // Narrow boolean sources: a re-run tears the running show down via
    // its cleanup, so it must fire only when these flags actually flip.
    watch(
        [
            computed(() => cfg().autoplay),
            computed(() => ctx.store.isOpen.value),
        ],
        ([enabled, open], _prev, onCleanup) => {
            if (!enabled || !open) {
                return;
            }
            const offs = [
                ctx.events.on(TOGGLE_EVENT, () => {
                    if (interval !== null) {
                        stop();
                    } else {
                        start();
                    }
                }),
                // Pause during drags; resume after (2.x behavior).
                ctx.events.on('dragStart', () => {
                    if (interval !== null) {
                        stop();
                        pausedOnDrag = true;
                    }
                }),
                ctx.events.on('dragEnd', () => {
                    if (pausedOnDrag) {
                        pausedOnDrag = false;
                        start();
                    }
                }),
                // User navigation stops the show unless forced.
                ctx.events.on('beforeSlide', () => {
                    if (!fromAuto && interval !== null) {
                        stop();
                        pausedOnSlideChange = true;
                    } else {
                        pausedOnSlideChange = false;
                    }
                    fromAuto = false;
                }),
                ctx.events.on('afterSlide', () => {
                    if (
                        pausedOnSlideChange &&
                        interval === null &&
                        cfg().forceSlideShowAutoplay
                    ) {
                        pausedOnSlideChange = false;
                        start();
                    }
                }),
            ];
            let startedFromLoad: (() => void) | null = null;
            if (cfg().slideShowAutoplay) {
                startedFromLoad = ctx.events.on('slideItemLoad', () => {
                    startedFromLoad?.();
                    startedFromLoad = null;
                    start();
                });
            }
            onCleanup(() => {
                offs.forEach((off) => off());
                startedFromLoad?.();
                stop();
            });
        },
        { immediate: true },
    );
    onScopeDispose(stop);
}

const Autoplay: LgVuePlugin<AutoplaySettings> = {
    name: 'autoplay',
    defaults: autoplaySettings,
    slots: {
        toolbar: AutoplayButton,
        outer: AutoplayProgress,
    },
    setup: setupAutoplay,
};

export default Autoplay;
