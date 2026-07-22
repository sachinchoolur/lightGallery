import { computed, watch } from 'vue';

import type { LgPluginContext, LgVuePlugin } from '../types';

/**
 * relativeCaption plugin (2.x `lg-relative-caption`): positions the slide
 * caption directly under the image instead of the full-width bar. Presets
 * force `captionPosition: 'slide'` (the 2.x plugin mutated settings; this
 * port is non-mutating). Visibility is driven inline on the caption
 * element — same noted deviation as the sibling ports.
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

function setupRelativeCaption(ctx: LgPluginContext): void {
    watch(
        computed(
            () =>
                (
                    ctx.settings
                        .value as unknown as RelativeCaptionSettings
                ).relativeCaption,
        ),
        (enabled, _prev, onCleanup) => {
            ctx.layout.setOuterClass('lg-relative-caption', !!enabled);
            if (!enabled) {
                return;
            }
            const timers = new Set<ReturnType<typeof setTimeout>>();
            const reposition = (): void => {
                const slide = ctx.refs.getCurrentSlide();
                if (slide?.classList.contains('lg-complete')) {
                    positionCaption(slide);
                }
            };
            const deferred = (delay: number) => (): void => {
                const timer = setTimeout(() => {
                    timers.delete(timer);
                    reposition();
                }, delay);
                timers.add(timer);
            };
            const offs = [
                ctx.events.on('slideItemLoad', deferred(50)),
                ctx.events.on('afterSlide', deferred(0)),
            ];
            window.addEventListener('resize', reposition);
            onCleanup(() => {
                ctx.layout.setOuterClass('lg-relative-caption', false);
                offs.forEach((off) => off());
                timers.forEach((timer) => clearTimeout(timer));
                window.removeEventListener('resize', reposition);
            });
        },
        { immediate: true },
    );
}

const RelativeCaption: LgVuePlugin<RelativeCaptionSettings> = {
    name: 'relativeCaption',
    defaults: relativeCaptionSettings,
    presets: {
        captionPosition: 'slide',
    },
    setup: setupRelativeCaption,
};

export default RelativeCaption;
