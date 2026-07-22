import { computed, watch } from 'vue';

import type { LgPluginContext, LgVuePlugin } from '../types';

/**
 * mediumZoom plugin (2.x `lg-medium-zoom`): a medium.com-like minimal
 * gallery. In 2.x this plugin mutated `core.settings` and monkey-patched
 * `getMediaContainerPosition`; here it is `presets` + the ADR §5
 * `layout.overrideMediaPosition` — non-mutating by construction.
 */

export interface MediumZoomSettings {
    /** Enable/disable the medium-like zoom experience. */
    mediumZoom: boolean;
    /** Space between the gallery outer area and the image (px). */
    margin: number;
    /** Backdrop color; per-item override via `item.lgBackgroundColor`. */
    backgroundColor: string;
}

export const mediumZoomSettings: MediumZoomSettings = {
    mediumZoom: true,
    margin: 40,
    backgroundColor: '#000',
};

function setupMediumZoom(ctx: LgPluginContext): void {
    const cfg = (): MediumZoomSettings =>
        ctx.settings.value as unknown as MediumZoomSettings;

    watch(
        [
            computed(() => cfg().mediumZoom),
            computed(() => cfg().margin),
        ],
        ([enabled, margin], _prev, onCleanup) => {
            if (!enabled) {
                return;
            }
            ctx.layout.setOuterClass('lg-medium-zoom', true);
            ctx.layout.overrideMediaPosition(() => ({
                top: margin as number,
                bottom: margin as number,
            }));
            onCleanup(() => {
                ctx.layout.setOuterClass('lg-medium-zoom', false);
                ctx.layout.overrideMediaPosition(null);
            });
        },
        { immediate: true },
    );

    // Backdrop color + click-anywhere-to-close, applied on afterOpen —
    // the overlay DOM exists by then (setup runs outside it).
    watch(
        computed(() => cfg().mediumZoom),
        (enabled, _prev, onCleanup) => {
            if (!enabled) {
                return;
            }
            let outerEl: HTMLElement | null = null;
            let backdropEl: HTMLElement | null = null;
            const close = (): void => ctx.actions.closeGallery();
            const apply = (): void => {
                outerEl = ctx.refs.getOuter();
                backdropEl =
                    outerEl?.parentElement?.querySelector<HTMLElement>(
                        '.lg-backdrop',
                    ) ?? null;
                if (backdropEl) {
                    backdropEl.style.backgroundColor =
                        ctx.items.value[ctx.store.currentIndex.value]
                            ?.lgBackgroundColor ?? cfg().backgroundColor;
                }
                outerEl?.addEventListener('click', close);
            };
            const cleanup = (): void => {
                outerEl?.removeEventListener('click', close);
                if (backdropEl) {
                    backdropEl.style.backgroundColor = '';
                }
                outerEl = null;
                backdropEl = null;
            };
            const offOpen = ctx.events.on('afterOpen', apply);
            const offClose = ctx.events.on('afterClose', cleanup);
            if (ctx.store.isOpen.value) {
                apply();
            }
            onCleanup(() => {
                offOpen();
                offClose();
                cleanup();
            });
        },
        { immediate: true },
    );
}

const MediumZoom: LgVuePlugin<MediumZoomSettings> = {
    name: 'mediumZoom',
    defaults: mediumZoomSettings,
    // 2.x reassigned core.settings with these; presets apply at merge
    // time instead, and user settings still win.
    presets: {
        controls: false,
        download: false,
        counter: false,
        showCloseIcon: false,
        closeOnTap: false,
        enableSwipe: false,
        enableDrag: false,
        swipeToClose: false,
    },
    setup: setupMediumZoom,
};

export default MediumZoom;
