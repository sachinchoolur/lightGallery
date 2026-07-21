import { useEffect, useRef } from 'react';

import type { LgPlugin, PluginContext } from '../types';

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

function useMediumZoomPlugin(ctx: PluginContext): void {
    const settings = ctx.settings as unknown as MediumZoomSettings;
    const enabled = settings.mediumZoom;
    const { layout } = ctx;
    const margin = settings.margin;
    const ctxRef = useRef(ctx);
    ctxRef.current = ctx;

    useEffect(() => {
        if (!enabled) {
            return;
        }
        layout.setOuterClass('lg-medium-zoom', true);
        layout.overrideMediaPosition(() => ({ top: margin, bottom: margin }));
        return () => {
            layout.setOuterClass('lg-medium-zoom', false);
            layout.overrideMediaPosition(null);
        };
    }, [enabled, margin, layout]);

    // Backdrop color + click-anywhere-to-close. Applied on afterOpen — the
    // portal DOM exists by then (plugin hooks run outside the portal).
    useEffect(() => {
        if (!enabled) {
            return;
        }
        let outerEl: HTMLElement | null = null;
        let backdropEl: HTMLElement | null = null;
        const close = () => ctxRef.current.actions.closeGallery();
        const apply = () => {
            const { refs, items, state, settings: cfg } = ctxRef.current;
            outerEl = refs.getOuter();
            backdropEl =
                outerEl?.parentElement?.querySelector<HTMLElement>(
                    '.lg-backdrop',
                ) ?? null;
            if (backdropEl) {
                backdropEl.style.backgroundColor =
                    items[state.currentIndex]?.lgBackgroundColor ??
                    (cfg as unknown as MediumZoomSettings).backgroundColor;
            }
            outerEl?.addEventListener('click', close);
        };
        const cleanup = () => {
            outerEl?.removeEventListener('click', close);
            if (backdropEl) {
                backdropEl.style.backgroundColor = '';
            }
            outerEl = null;
            backdropEl = null;
        };
        const offOpen = ctxRef.current.events.on('afterOpen', apply);
        const offClose = ctxRef.current.events.on('afterClose', cleanup);
        if (ctxRef.current.state.open) {
            apply();
        }
        return () => {
            offOpen();
            offClose();
            cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);
}

const MediumZoom: LgPlugin<MediumZoomSettings> = {
    name: 'mediumZoom',
    defaults: mediumZoomSettings,
    // 2.x reassigned core.settings with these; presets apply at merge time
    // instead, and user props still win.
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
    usePlugin: useMediumZoomPlugin,
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        mediumZoom: Partial<MediumZoomSettings>;
    }
}

export default MediumZoom;
