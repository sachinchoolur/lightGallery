import { lGEvents } from '../../lg-events';
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { hashSettings, HashSettings } from './lg-hash-settings';

export default class Hash {
    core: LightGallery;
    settings: HashSettings;
    oldHash!: string;
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;
        // extend module default settings with lightGallery core settings
        this.settings = { ...hashSettings, ...this.core.settings };
        return this;
    }

    public init(): void {
        if (!this.settings.hash) {
            return;
        }
        this.oldHash = window.location.hash;
        setTimeout(() => {
            this.buildFromHash();
        }, 100);
        // Change hash value on after each slide transition
        this.core.LGel.on(
            `${lGEvents.afterSlide}.hash`,
            this.onAfterSlide.bind(this),
        );
        this.core.LGel.on(
            `${lGEvents.afterClose}.hash`,
            this.onCloseAfter.bind(this),
        );

        // Listen hash change and change the slide according to slide value
        this.$LG(window).on(
            `hashchange.lg.hash.global${this.core.lgId}`,
            this.onHashchange.bind(this),
        );
    }

    private onAfterSlide(event: CustomEvent) {
        let slideName = this.core.galleryItems[event.detail.index].slideName;
        slideName = this.settings.customSlideName
            ? slideName || event.detail.index
            : event.detail.index;
        if (history.replaceState) {
            history.replaceState(
                null,
                '',
                window.location.pathname +
                    window.location.search +
                    '#lg=' +
                    this.settings.galleryId +
                    '&slide=' +
                    slideName,
            );
        } else {
            window.location.hash =
                'lg=' + this.settings.galleryId + '&slide=' + slideName;
        }
    }

    /**
     * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
     * @param {String} hash
     * @returns {Number} Index of the slide.
     */
    getIndexFromUrl(hash = window.location.hash): number {
        const slideName = hash.split('&slide=')[1];
        let _idx = 0;

        if (this.settings.customSlideName) {
            for (
                let index = 0;
                index < this.core.galleryItems.length;
                index++
            ) {
                const dynamicEl = this.core.galleryItems[index];
                if (dynamicEl.slideName === slideName) {
                    _idx = index;
                    break;
                }
            }
        } else {
            _idx = parseInt(slideName, 10);
        }

        return isNaN(_idx) ? 0 : _idx;
    }

    // Build Gallery if gallery id exist in the URL
    buildFromHash(): boolean | undefined {
        // if dynamic option is enabled execute immediately
        const _hash = window.location.hash;
        if (_hash.indexOf('lg=' + this.settings.galleryId) > 0) {
            // This class is used to remove the initial animation if galleryId present in the URL
            this.$LG(document.body).addClass('lg-from-hash');

            const index = this.getIndexFromUrl(_hash);

            this.core.openGallery(index);
            return true;
        }
    }

    private onCloseAfter() {
        // Reset to old hash value
        if (
            this.oldHash &&
            this.oldHash.indexOf('lg=' + this.settings.galleryId) < 0
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
        const index = this.getIndexFromUrl(_hash);

        // it galleryId doesn't exist in the url close the gallery
        if (_hash.indexOf('lg=' + this.settings.galleryId) > -1) {
            this.core.slide(index, false, false);
        } else if (this.core.lGalleryOn) {
            this.core.closeGallery();
        }
    }

    closeGallery(): void {
        if (this.settings.hash) {
            this.$LG(document.body).removeClass('lg-from-hash');
        }
    }

    destroy(): void {
        this.core.LGel.off('.lg.hash');
        this.core.LGel.off('.hash');
        this.$LG(window).off(`hashchange.lg.hash.global${this.core.lgId}`);
    }
}
