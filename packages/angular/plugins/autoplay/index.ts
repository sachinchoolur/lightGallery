import { autoplayDefaultIcons } from '@lightgallery/headless';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Injectable,
    signal,
    untracked,
} from '@angular/core';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    LgCiComponent,
    resolveIconSlot,
    type LgFeature,
} from '@lightgallery/angular';

/**
 * Autoplay feature (2.x `lg-autoplay`): slideshow timer with progress bar.
 * The toolbar button and the timer service talk over the event bus;
 * run-state is mirrored to the `lg-show-autoplay` outer class (2.x parity,
 * drives the progress-bar CSS).
 */

export interface AutoplaySettings {
    /** Enable the autoplay feature. */
    autoplay: boolean;
    /** Start the slideshow as soon as the first slide loads. */
    slideShowAutoplay: boolean;
    /**
     * Time (ms) between transitions (added to `speed`). The countdown
     * starts once the slide on screen has loaded, so a slow connection
     * never advances past an image before it is visible.
     */
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
/**
 * Timer → progress bar: a countdown started (`counting`), or the timer is
 * holding at zero for the slide on screen to load.
 */
const CYCLE_EVENT = 'lg-autoplay-cycle';

interface AutoplayCycleDetail {
    counting: boolean;
}

type AutoplayResolved = AutoplaySettings & { speed: number };

@Component({
    selector: 'lg-autoplay-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LgCiComponent],
    template: `
        @if (settings().autoplay && settings().autoplayControls) {
        <button
            type="button"
            class="lg-autoplay-button lg-icon lg-icon-custom"
            [attr.aria-label]="
                settings().autoplayPluginStrings?.toggleAutoplay ??
                coreStrings().toggleAutoplay
            "
            (click)="ctx.events.emit(TOGGLE, undefined)"
        >
            <lg-ci
                [slot]="customIcon()"
                [names]="['autoplayPlay', 'autoplayPause']"
                [icons]="defaultIcons"
            />
        </button>
        }
    `,
})
export class LgAutoplayButtonComponent {
    protected readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly customIcon = computed(() =>
        resolveIconSlot(this.ctx.icons?.(), [
            'autoplayPlay',
            'autoplayPause',
        ]),
    );
    protected readonly defaultIcons = autoplayDefaultIcons;
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as AutoplayResolved,
    );
    protected readonly coreStrings = computed(
        () => this.ctx.settings().strings,
    );
    protected readonly TOGGLE = TOGGLE_EVENT;
}

@Component({
    selector: 'lg-autoplay-progress',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().autoplay && settings().progressBar) {
        <div
            class="lg-progress-bar"
            [class.lg-start]="running() && counting() && armed()"
        >
            <!-- Recreating the element restarts the width transition
                     each cycle (the React key={cycle} trick). -->
            @for (cycle of [cycle()]; track cycle) {
            <div
                class="lg-progress"
                [style.transition]="
                    running() && counting()
                        ? 'width ' + duration() + 'ms ease 0s'
                        : null
                "
            ></div>
            }
        </div>
        }
    `,
})
export class LgAutoplayProgressComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as AutoplayResolved,
    );
    protected readonly running = signal(false);
    // False while the timer waits for the slide on screen to load: the
    // bar sits at zero until the countdown really starts.
    protected readonly counting = signal(false);
    protected readonly cycle = signal(0);
    // Two-phase start: the remounted bar must PAINT at width 0 before
    // lg-start lands — a fresh element has no prior style, so flipping
    // the class in the same frame renders the bar full instead of
    // animating (2.x staged this with a 20ms timer).
    protected readonly armed = signal(false);
    protected readonly duration = computed(
        () => this.settings().speed + this.settings().slideShowInterval,
    );

    constructor() {
        let armTimer: ReturnType<typeof setTimeout> | null = null;
        const rearm = () => {
            this.armed.set(false);
            if (armTimer !== null) {
                clearTimeout(armTimer);
                armTimer = null;
            }
            if (!this.running() || !this.counting()) {
                return;
            }
            armTimer = setTimeout(() => {
                this.armed.set(true);
                armTimer = null;
            }, 20);
        };
        const offs = [
            this.ctx.events.on('autoplayStart', () => {
                this.running.set(true);
                rearm();
            }),
            this.ctx.events.on('autoplayStop', () => {
                this.running.set(false);
                this.counting.set(false);
                rearm();
            }),
            this.ctx.events.on(CYCLE_EVENT, (detail) => {
                this.counting.set((detail as AutoplayCycleDetail).counting);
                this.cycle.update((value) => value + 1);
                rearm();
            }),
        ];
        inject(DestroyRef).onDestroy(() => {
            offs.forEach((off) => off());
            if (armTimer !== null) {
                clearTimeout(armTimer);
            }
        });
    }
}

/** The slideshow timer (React `useAutoplayPlugin` twin). */
@Injectable()
export class LgAutoplayService {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    private timer: ReturnType<typeof setTimeout> | null = null;
    private running = false;
    /** Index the countdown waits on; its slide has not loaded yet. */
    private waitingFor: number | null = null;
    private fromAuto = false;
    private pausedOnDrag = false;
    private pausedOnSlideChange = false;

    // Narrow computeds: the effect must re-run only when these BOOLEANS
    // change, never per state/settings object identity (a re-run tears the
    // running show down through its cleanup).
    private readonly enabled = computed(
        () => (this.ctx.settings() as unknown as AutoplayResolved).autoplay,
    );
    private readonly open = computed(() => this.ctx.state().open);

    constructor() {
        effect((onCleanup) => {
            if (!this.enabled() || !this.open()) {
                return;
            }
            untracked(() => this.bind(onCleanup));
        });
        inject(DestroyRef).onDestroy(() => this.stop());
    }

    private settings(): AutoplayResolved {
        return untracked(this.ctx.settings) as unknown as AutoplayResolved;
    }

    private clearTimer(): void {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.waitingFor = null;
    }

    private countdown(): void {
        this.clearTimer();
        const cfg = this.settings();
        this.timer = setTimeout(() => {
            this.timer = null;
            this.advance();
        }, cfg.speed + cfg.slideShowInterval);
        this.ctx.events.emit(CYCLE_EVENT, { counting: true });
    }

    // Arm the countdown for the slide at `index`. A slide still loading
    // holds it (and the bar at zero) until its slideItemLoad arrives, so a
    // slow connection never skips past images the viewer has not seen.
    private schedule(index: number): void {
        this.clearTimer();
        if (untracked(this.ctx.state).loadedSlides.has(index)) {
            this.countdown();
            return;
        }
        this.waitingFor = index;
        this.ctx.events.emit(CYCLE_EVENT, { counting: false });
    }

    private advance(): void {
        const state = untracked(this.ctx.state);
        // Mid-transition (a tiny interval, or a long slideDelay) the core
        // ignores navigation; try again after another cycle.
        if (state.transitioning) {
            this.countdown();
            return;
        }
        const next =
            state.currentIndex + 1 < state.slidesCount
                ? state.currentIndex + 1
                : 0;
        this.fromAuto = true;
        this.ctx.emit('autoplay', { index: next });
        this.ctx.actions.navigate(next, 'next');
        if (this.running) {
            this.schedule(next);
        }
    }

    private stop(): void {
        if (!this.running) {
            return;
        }
        this.running = false;
        this.clearTimer();
        this.ctx.layout.setOuterClass('lg-show-autoplay', false);
        this.ctx.emit('autoplayStop', {
            index: untracked(this.ctx.state).currentIndex,
        });
    }

    private start(): void {
        if (this.running) {
            return;
        }
        this.running = true;
        this.ctx.layout.setOuterClass('lg-show-autoplay', true);
        const index = untracked(this.ctx.state).currentIndex;
        this.ctx.emit('autoplayStart', { index });
        this.schedule(index);
    }

    private bind(onCleanup: (fn: () => void) => void): void {
        const events = this.ctx.events;
        const offs = [
            events.on(TOGGLE_EVENT, () => {
                if (this.running) {
                    this.stop();
                } else {
                    this.start();
                }
            }),
            // Pause during drags; resume after (2.x behavior).
            events.on('dragStart', () => {
                if (this.running) {
                    this.stop();
                    this.pausedOnDrag = true;
                }
            }),
            events.on('dragEnd', () => {
                if (this.pausedOnDrag) {
                    this.pausedOnDrag = false;
                    this.start();
                }
            }),
            // User-initiated navigation stops the show unless forced.
            events.on('beforeSlide', () => {
                if (!this.fromAuto && this.running) {
                    this.stop();
                    this.pausedOnSlideChange = true;
                } else {
                    this.pausedOnSlideChange = false;
                }
                this.fromAuto = false;
            }),
            events.on('afterSlide', () => {
                if (
                    this.pausedOnSlideChange &&
                    !this.running &&
                    this.settings().forceSlideShowAutoplay
                ) {
                    this.pausedOnSlideChange = false;
                    this.start();
                }
            }),
            // The awaited slide settled (loaded, or failed and shows its
            // error message): start its countdown.
            events.on('slideItemLoad', (detail) => {
                if (this.running && this.waitingFor === detail.index) {
                    this.countdown();
                }
            }),
        ];

        let startedFromLoad: (() => void) | null = null;
        if (this.settings().slideShowAutoplay) {
            startedFromLoad = events.on('slideItemLoad', () => {
                startedFromLoad?.();
                startedFromLoad = null;
                this.start();
            });
        }

        onCleanup(() => {
            offs.forEach((off) => off());
            startedFromLoad?.();
            this.stop();
        });
    }
}

export function withAutoplay(
    options: Partial<AutoplaySettings> = {},
): LgFeature<AutoplaySettings> {
    return {
        name: 'autoplay',
        defaults: autoplaySettings,
        options,
        slots: {
            toolbar: LgAutoplayButtonComponent,
            outer: LgAutoplayProgressComponent,
        },
        providers: [
            LgAutoplayService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgAutoplayService,
                multi: true,
            },
        ],
    };
}
