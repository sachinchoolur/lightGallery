import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { hashSettings, HashSettings } from './lg-hash-settings';

declare global {
    interface Window {
        $LG: (selector: any) => lgQuery;
    }
}

const $LG = window.$LG;

export class Hash {
    core: LightGallery;
    settings: HashSettings;
    oldHash!: string;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.settings = Object.assign({}, hashSettings, this.core.settings);

        if (this.settings.hash) {
            this.oldHash = window.location.hash;
            this.init();
        }

        return this;
    }

    private init() {
        // Change hash value on after each slide transition
        this.core.LGel.on('onAfterSlide.lg.hash', this.onAfterSlide.bind(this));
        this.core.LGel.on('onCloseAfter.lg.hash', this.onCloseAfter.bind(this));

        // Listen hash change and change the slide according to slide value
        $LG(window).on(
            `hashchange.lg.hash.global${this.core.lgId}`,
            this.onHashchange.bind(this),
        );
    }

    private onAfterSlide(event: CustomEvent) {
        let slideName = this.core.galleryItems[event.detail.index].slideName;
        slideName = this.core.settings.customSlideName
            ? slideName || event.detail.index
            : event.detail.index;
        if (history.replaceState) {
            history.replaceState(
                null,
                '',
                window.location.pathname +
                    window.location.search +
                    '#lg=' +
                    this.core.settings.galleryId +
                    '&slide=' +
                    slideName,
            );
        } else {
            window.location.hash =
                'lg=' + this.core.settings.galleryId + '&slide=' + slideName;
        }
    }

    private onCloseAfter() {
        // Reset to old hash value
        if (
            this.oldHash &&
            this.oldHash.indexOf('lg=' + this.core.settings.galleryId) < 0
        ) {
            if (history.replaceState) {
                history.replaceState(null, '', this.oldHash);
            } else {
                window.location.hash = this.oldHash;
            }
        } else {
            if (history.replaceState) {
                history.replaceState(
                    null,
                    document.title,
                    window.location.pathname + window.location.search,
                );
            } else {
                window.location.hash = '';
            }
        }
    }

    private onHashchange() {
        if (!this.core.lgOpened) return;
        const _hash = window.location.hash;
        const index = this.core.getIndexFromUrl(_hash);

        // it galleryId doesn't exist in the url close the gallery
        if (_hash.indexOf('lg=' + this.core.settings.galleryId) > -1) {
            this.core.slide(index, false, false);
        } else if (this.core.lGalleryOn) {
            this.core.destroy();
        }
    }

    destroy(clear?: boolean): void {
        if (!this.settings.hash) {
            return;
        }
        if (clear) {
            this.core.LGel.off('.lg.hash');
            $LG(window).off(`hashchange.lg.hash.global${this.core.lgId}`);
        }
    }
}

window.lgModules = window.lgModules || {};
window.lgModules.hash = Hash;
