import { ShareSettings, shareSettings } from './lg-share-settings';

import { getShareListHTML } from './lg-share-utils';
import setLgShareMarkup from './lg-share-markup';

import { setFacebookShareLink } from './lg-fb-share-utils';
import { setTwitterShareLink } from './lg-twitter-share-utils';
import { setPinterestShareLink } from './lg-pinterest-share-utils';
import { LightGallery } from '../../lightgallery';
import { lGEvents } from '../../lg-events';

export class Share {
    core: LightGallery;
    settings: ShareSettings;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.settings = Object.assign({}, shareSettings, this.core.settings);

        this.init();

        return this;
    }

    init() {
        setLgShareMarkup(this.core.outer);

        this.core.outer
            .find('.lg-share .lg-dropdown')
            .append(this.getShareListHtml());

        this.core.LGel.on(
            `${lGEvents.afterSlide}.share`,
            this.onAfterSlide.bind(this),
        );
    }

    getShareListHtml() {
        let shareHtml = '';
        shareHtml += this.settings.facebook
            ? getShareListHTML('facebook', this.settings.facebookDropdownText)
            : '';
        shareHtml += this.settings.twitter
            ? getShareListHTML('twitter', this.settings.twitterDropdownText)
            : '';
        shareHtml += this.settings.pinterest
            ? getShareListHTML('pinterest', this.settings.pinterestDropdownText)
            : '';
        return shareHtml;
    }

    onAfterSlide(event: CustomEvent) {
        const { index } = event.detail;
        console.log('calling');
        setTimeout(() => {
            setFacebookShareLink(
                this.core.outer.find('.lg-share-facebook'),
                this.core.galleryItems[index],
            );

            setTwitterShareLink(
                this.core.outer.find('.lg-share-twitter'),
                this.core.galleryItems[index],
            );

            setPinterestShareLink(
                this.core.outer.find('.lg-share-pinterest'),
                this.core.galleryItems[index],
            );
        }, 100);
    }
    destroy(): void {
        this.core.outer.find('.lg-dropdown-overlay').remove();
        this.core.outer.find('.lg-share').remove();
        this.core.LGel.off('.lg.share');
    }
}

window.lgModules = window.lgModules || {};
window.lgModules.share = Share;
