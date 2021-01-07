import { ShareSettings, shareSettings } from './lg-share-settings';

import { getShareListHTML } from './lg-share-utils';
import setLgShareMarkup from './lg-share-markup';

import { setFacebookShareLink } from './lg-fb-share-utils';
import { setTwitterShareLink } from './lg-twitter-share-utils';
import { setPinterestShareLink } from './lg-pinterest-share-utils';
import { LightGallery } from '../../lightgallery';

export class Share {
    core: LightGallery;
    s: ShareSettings;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, shareSettings, this.core.s);

        this.init();

        return this;
    }

    init() {
        setLgShareMarkup(this.core.outer);

        this.core.outer
            .find('.lg-share .lg-dropdown')
            .append(this.getShareListHtml());

        this.core.LGel.on(
            'onAfterSlide.lg.share',
            this.onAfterSlide.bind(this),
        );
    }

    getShareListHtml() {
        let shareHtml = '';
        shareHtml += this.s.facebook
            ? getShareListHTML('facebook', this.s.facebookDropdownText)
            : '';
        shareHtml += this.s.twitter
            ? getShareListHTML('twitter', this.s.twitterDropdownText)
            : '';
        shareHtml += this.s.pinterest
            ? getShareListHTML('pinterest', this.s.pinterestDropdownText)
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
    destroy(clear?: boolean): void {
        if (clear) {
            this.core.outer.find('.lg-dropdown-overlay').remove();
            this.core.outer.find('.lg-share').remove();
            this.core.LGel.off('.lg.share');
        }
    }
}

window.lgModules = window.lgModules || {};
window.lgModules.share = Share;
