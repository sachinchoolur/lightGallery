import { useEffect } from 'react';

import type { LgPlugin, PluginContext } from '../types';

/**
 * relativeCaption plugin (2.x `lg-relative-caption`): positions the slide
 * caption directly under the image instead of the full-width bar. Presets
 * force `captionPosition: 'slide'` (the 2.x plugin mutated `addClass`; this
 * port is non-mutating). Instead of the `lg-show-caption` slide class (which
 * React's className ownership would wipe), visibility is driven inline on
 * the caption element — noted deviation.
 */

export interface RelativeCaptionSettings {
    /** Enable/disable relative caption positioning. */
    relativeCaption: boolean;
}

export const relativeCaptionSettings: RelativeCaptionSettings = {
    relativeCaption: true,
};

function positionCaption(slide: HTMLElement): void {
    const media = slide.querySelector<HTMLElement>('.lg-object');
    const caption = slide.querySelector<HTMLElement>('.lg-sub-html');
    if (!media || !caption) {
        return;
    }
    const rect = media.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    caption.style.width = `${rect.width}px`;
    caption.style.left = `${rect.left - slideRect.left}px`;
    caption.style.right = 'auto';
    const captionHeight = caption.getBoundingClientRect().height;
    const bottom = slideRect.bottom - rect.bottom - captionHeight;
    caption.style.top = 'auto';
    caption.style.bottom = `${Math.max(bottom, 0)}px`;
    caption.style.opacity = '1';
}

function useRelativeCaptionPlugin(ctx: PluginContext): void {
    const enabled = (ctx.settings as unknown as RelativeCaptionSettings)
        .relativeCaption;
    const { layout, refs, events } = ctx;

    useEffect(() => {
        layout.setOuterClass('lg-relative-caption', enabled);
        return () => layout.setOuterClass('lg-relative-caption', false);
    }, [enabled, layout]);

    useEffect(() => {
        if (!enabled) {
            return;
        }
        const reposition = () => {
            const slide = refs.getCurrentSlide();
            if (slide?.classList.contains('lg-complete')) {
                positionCaption(slide);
            }
        };
        const timers: number[] = [];
        const deferred = (delay: number) => () => {
            timers.push(window.setTimeout(reposition, delay));
        };
        const offs = [
            events.on('slideItemLoad', deferred(50)),
            events.on('afterSlide', deferred(0)),
        ];
        window.addEventListener('resize', reposition);
        return () => {
            offs.forEach((off) => off());
            timers.forEach((timer) => window.clearTimeout(timer));
            window.removeEventListener('resize', reposition);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);
}

const RelativeCaption: LgPlugin<RelativeCaptionSettings> = {
    name: 'relativeCaption',
    defaults: relativeCaptionSettings,
    presets: {
        captionPosition: 'slide',
    },
    usePlugin: useRelativeCaptionPlugin,
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        relativeCaption: Partial<RelativeCaptionSettings>;
    }
}

export default RelativeCaption;
