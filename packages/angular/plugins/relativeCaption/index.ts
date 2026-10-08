import {
    effect,
    inject,
    Injectable,
    untracked,
} from '@angular/core';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
} from '@lightgallery/angular';

/**
 * relativeCaption feature (2.x `lg-relative-caption`): positions the slide
 * caption directly under the image instead of the full-width bar. Presets
 * force `captionPosition: 'slide'` (the 2.x plugin mutated settings; this
 * port is non-mutating). Visibility is driven inline on the caption element
 * — same noted deviation as the React port (no `lg-show-caption` class).
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

@Injectable()
export class LgRelativeCaptionService {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    private readonly timers = new Set<ReturnType<typeof setTimeout>>();

    constructor() {
        effect((onCleanup) => {
            const enabled = (
                this.ctx.settings() as unknown as RelativeCaptionSettings
            ).relativeCaption;
            this.ctx.layout.setOuterClass('lg-relative-caption', enabled);
            if (!enabled) {
                return;
            }
            untracked(() => {
                const reposition = (): void => {
                    const slide = this.ctx.refs.getCurrentSlide();
                    if (slide?.classList.contains('lg-complete')) {
                        positionCaption(slide);
                    }
                };
                const deferred = (delay: number) => (): void => {
                    const timer = setTimeout(() => {
                        this.timers.delete(timer);
                        reposition();
                    }, delay);
                    this.timers.add(timer);
                };
                const offs = [
                    this.ctx.events.on('slideItemLoad', deferred(50)),
                    this.ctx.events.on('afterSlide', deferred(0)),
                ];
                window.addEventListener('resize', reposition);
                onCleanup(() => {
                    this.ctx.layout.setOuterClass(
                        'lg-relative-caption',
                        false,
                    );
                    offs.forEach((off) => off());
                    this.timers.forEach((timer) => clearTimeout(timer));
                    this.timers.clear();
                    window.removeEventListener('resize', reposition);
                });
            });
        });
    }
}

export function withRelativeCaption(
    options: Partial<RelativeCaptionSettings> = {},
): LgFeature<RelativeCaptionSettings> {
    return {
        name: 'relativeCaption',
        defaults: relativeCaptionSettings,
        options,
        presets: {
            captionPosition: 'slide',
        },
        providers: [
            LgRelativeCaptionService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgRelativeCaptionService,
                multi: true,
            },
        ],
    };
}
