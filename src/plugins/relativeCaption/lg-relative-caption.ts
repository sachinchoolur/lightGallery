/**
 * lightGallery caption for placing captions relative to the image
 */

import { lGEvents } from '../../lg-events';
import { LightGallerySettings } from '../../lg-settings';
import { LightGallery } from '../../lightgallery';
import {
    RelativeCaptionSettings,
    relativeCaptionSettings,
} from './lg-relative-caption-settings';

export default class RelativeCaption {
    core: LightGallery;
    settings: RelativeCaptionSettings;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin instance
        this.core = instance;

        // Override some of lightGallery default settings
        const defaultSettings: Partial<LightGallerySettings> = {
            addClass: this.core.settings.addClass + ' lg-relative-caption',
        };

        this.core.settings = { ...this.core.settings, ...defaultSettings };

        // extend module default settings with lightGallery core settings
        this.settings = {
            ...relativeCaptionSettings,
            ...this.core.settings,
            ...defaultSettings,
        };

        return this;
    }

    init(): void {
        if (!this.settings.relativeCaption) {
            return;
        }
        this.core.LGel.on(`${lGEvents.slideItemLoad}.caption`, (event) => {
            const { index, delay } = event.detail;
            setTimeout(() => {
                this.setRelativeCaption(index);
            }, delay);
        });
        this.core.LGel.on(`${lGEvents.afterSlide}.caption`, (event) => {
            const { index } = event.detail;
            setTimeout(() => {
                const slide = this.core.getSlideItem(index);
                if (slide.hasClass('lg-complete')) {
                    this.setRelativeCaption(index);
                }
            });
        });
        this.core.LGel.on(`${lGEvents.beforeSlide}.caption`, (event) => {
            const { index } = event.detail;
            setTimeout(() => {
                const slide = this.core.getSlideItem(index);
                slide.removeClass('lg-show-caption');
            });
        });
    }

    private setCaptionStyle(index: number, rect: ClientRect) {
        const $subHtmlInner = this.core
            .getSlideItem(index)
            .find('.lg-relative-caption-item');
        const $subHtml = this.core.getSlideItem(index).find('.lg-sub-html');
        const subHtmlRect = $subHtmlInner.get().getBoundingClientRect();
        let top = rect.bottom;
        if (rect.height + subHtmlRect.height >= rect.bottom) {
            top -= subHtmlRect.height;
        }
        $subHtml
            .css('width', `${rect.width}px`)
            .css('left', `${rect.left}px`)
            .css('top', `${top}px`);
    }

    private setRelativeCaption(index: number) {
        const slide = this.core.getSlideItem(index);
        if (slide.hasClass('lg-current')) {
            const rect = this.core
                .getSlideItem(index)
                .find('.lg-object')
                .get()
                .getBoundingClientRect();
            this.setCaptionStyle(index, rect);
            slide.addClass('lg-show-caption');
        }
    }

    destroy(): void {
        this.core.LGel.off('.caption');
    }
}
