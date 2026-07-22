import {
    computed,
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    shallowRef,
    watch,
    type PropType,
} from 'vue';
import {
    flipHorizontal,
    flipVertical,
    getRotateTransform,
    getSlideType,
    initialRotateSlice,
    rotateLeft,
    rotateRight,
    type RotateSlice,
} from '@lightgallery/headless';

import { LG_PLUGIN_CONTEXT, type LgVuePlugin } from '../types';
import type { LgGalleryItem } from '../../types';

/**
 * Rotate plugin (2.x `lg-rotate`): rotate/flip the current image.
 * Transform ownership follows the slide-wrapper pattern; compose with
 * zoom as `[Zoom, Rotate]` so zoom stays outermost (2.x DOM order).
 *
 * Deviation (shared with the siblings): 2.x kept rotate values for every
 * visited slide until close; here values live in the slide's wrapper, so
 * they reset if a slide leaves the windowed DOM.
 */

export interface RotateStrings {
    flipVertical: string;
    flipHorizontal: string;
    rotateLeft: string;
    rotateRight: string;
}

export interface RotateSettings {
    /** Enable the rotate buttons. */
    rotate: boolean;
    /** Rotate transition speed (ms). */
    rotateSpeed: number;
    rotateLeft: boolean;
    rotateRight: boolean;
    flipHorizontal: boolean;
    flipVertical: boolean;
    rotatePluginStrings: RotateStrings;
}

export const rotateSettings: RotateSettings = {
    rotate: true,
    rotateSpeed: 400,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true,
    rotatePluginStrings: {
        flipVertical: 'Flip vertical',
        flipHorizontal: 'Flip horizontal',
        rotateLeft: 'Rotate left',
        rotateRight: 'Rotate right',
    },
};

const ROTATE_LEFT_EVENT = 'lg-rotate-left';
const ROTATE_RIGHT_EVENT = 'lg-rotate-right';
const FLIP_HOR_EVENT = 'lg-flip-hor';
const FLIP_VER_EVENT = 'lg-flip-ver';

type RotateResolved = RotateSettings & Record<string, unknown>;

export const RotateToolbar = defineComponent({
    name: 'LgRotateToolbar',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const emitBus = (name: string): void =>
            ctx.events.emit(name, undefined);
        return () => {
            const cfg = ctx.settings.value as unknown as RotateResolved;
            if (!cfg.rotate) {
                return null;
            }
            const strings = cfg.rotatePluginStrings;
            return [
                cfg.flipVertical
                    ? h('button', {
                          type: 'button',
                          class: 'lg-flip-ver lg-icon',
                          'aria-label': strings.flipVertical,
                          onClick: () => emitBus(FLIP_VER_EVENT),
                      })
                    : null,
                cfg.flipHorizontal
                    ? h('button', {
                          type: 'button',
                          class: 'lg-flip-hor lg-icon',
                          'aria-label': strings.flipHorizontal,
                          onClick: () => emitBus(FLIP_HOR_EVENT),
                      })
                    : null,
                cfg.rotateLeft
                    ? h('button', {
                          type: 'button',
                          class: 'lg-rotate-left lg-icon',
                          'aria-label': strings.rotateLeft,
                          onClick: () => emitBus(ROTATE_LEFT_EVENT),
                      })
                    : null,
                cfg.rotateRight
                    ? h('button', {
                          type: 'button',
                          class: 'lg-rotate-right lg-icon',
                          'aria-label': strings.rotateRight,
                          onClick: () => emitBus(ROTATE_RIGHT_EVENT),
                      })
                    : null,
            ];
        };
    },
});

export const RotateWrapper = defineComponent({
    name: 'LgRotateWrapper',
    props: {
        item: {
            type: Object as PropType<LgGalleryItem>,
            required: true,
        },
        index: { type: Number, required: true },
        isCurrent: { type: Boolean, default: false },
    },
    setup(props, { slots }) {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const settings = computed(
            () => ctx.settings.value as unknown as RotateResolved,
        );
        const enabled = computed(
            () =>
                settings.value.rotate &&
                getSlideType(props.item) === 'image',
        );
        const slice = shallowRef<RotateSlice>(initialRotateSlice);
        const emitTimers = new Set<ReturnType<typeof setTimeout>>();

        function commit(
            transition: (slice: RotateSlice) => RotateSlice,
            eventName:
                | 'rotateLeft'
                | 'rotateRight'
                | 'flipHorizontal'
                | 'flipVertical',
        ): void {
            const next = transition(slice.value);
            slice.value = next;
            // The public event fires once the transition settled (2.x).
            const timer = setTimeout(() => {
                emitTimers.delete(timer);
                switch (eventName) {
                    case 'rotateLeft':
                        ctx.emit('rotateLeft', { rotate: next.rotate });
                        break;
                    case 'rotateRight':
                        ctx.emit('rotateRight', { rotate: next.rotate });
                        break;
                    case 'flipHorizontal':
                        ctx.emit('flipHorizontal', {
                            flipHorizontal: next.flipHorizontal,
                        });
                        break;
                    case 'flipVertical':
                        ctx.emit('flipVertical', {
                            flipVertical: next.flipVertical,
                        });
                }
            }, settings.value.rotateSpeed + 10);
            emitTimers.add(timer);
        }

        watch(
            [computed(() => props.isCurrent), enabled],
            ([current, isEnabled], _prev, onCleanup) => {
                if (!current || !isEnabled) {
                    return;
                }
                const offs = [
                    ctx.events.on(ROTATE_LEFT_EVENT, () =>
                        commit(rotateLeft, 'rotateLeft'),
                    ),
                    ctx.events.on(ROTATE_RIGHT_EVENT, () =>
                        commit(rotateRight, 'rotateRight'),
                    ),
                    ctx.events.on(FLIP_HOR_EVENT, () =>
                        commit(flipHorizontal, 'flipHorizontal'),
                    ),
                    ctx.events.on(FLIP_VER_EVENT, () =>
                        commit(flipVertical, 'flipVertical'),
                    ),
                ];
                onCleanup(() => offs.forEach((off) => off()));
            },
            { immediate: true },
        );
        onBeforeUnmount(() =>
            emitTimers.forEach((timer) => clearTimeout(timer)),
        );

        return () => {
            if (!enabled.value) {
                return slots.default?.();
            }
            return h(
                'div',
                {
                    class: 'lg-img-rotate',
                    style: {
                        position: 'absolute',
                        inset: '0',
                        transform: getRotateTransform(slice.value),
                        transitionDuration: `${settings.value.rotateSpeed}ms`,
                    },
                },
                slots.default?.(),
            );
        };
    },
});

const Rotate: LgVuePlugin<RotateSettings> = {
    name: 'rotate',
    defaults: rotateSettings,
    slots: {
        toolbar: RotateToolbar,
        slideWrapper: RotateWrapper,
    },
};

export default Rotate;
