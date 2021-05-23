import { lGEvents } from '../../lg-events';
import { LightGallerySettings } from '../../lg-settings';
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import {
    MediumZoomSettings,
    mediumZoomSettings,
} from './lg-medium-zoom-settings';

export default class MediumZoom {
    core: LightGallery;
    settings: MediumZoomSettings;
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;

        // Set margin
        this.core.getMediaContainerPosition = () => {
            return {
                top: this.settings.margin,
                bottom: this.settings.margin,
            };
        };

        // Override some of lightGallery default settings
        const defaultSettings: Partial<LightGallerySettings> = {
            controls: false,
            download: false,
            counter: false,
            showCloseIcon: false,
            extraProps: ['lgBackgroundColor'],
            closeOnTap: false,
            enableSwipe: false,
            enableDrag: false,
            swipeToClose: false,
            addClass: this.core.settings.addClass + ' lg-medium-zoom',
        };

        this.core.settings = { ...this.core.settings, ...defaultSettings };

        // extend module default settings with lightGallery core settings
        this.settings = {
            ...mediumZoomSettings,
            ...this.core.settings,
            ...defaultSettings,
        };

        return this;
    }

    private toggleItemClass() {
        for (let index = 0; index < this.core.items.length; index++) {
            const $element = this.$LG(this.core.items[index]);
            $element.toggleClass('lg-medium-zoom-item');
        }
    }

    init(): void {
        if (!this.settings.mediumZoom) {
            return;
        }
        this.core.LGel.on(`${lGEvents.beforeOpen}.medium`, () => {
            this.core.$backdrop.css(
                'background-color',
                this.core.galleryItems[this.core.index].lgBackgroundColor ||
                    this.settings.backgroundColor,
            );
        });
        this.toggleItemClass();

        this.core.outer.on('click.lg.medium', () => {
            this.core.closeGallery();
        });
    }

    destroy(): void {
        this.toggleItemClass();
    }
}
