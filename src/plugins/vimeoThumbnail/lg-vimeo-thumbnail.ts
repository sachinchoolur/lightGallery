import { lGEvents } from '../../lg-events';
import { LightGallery } from '../../lightgallery';
import {
    vimeoSettings,
    VimeoThumbnailSettings,
} from './lg-vimeo-thumbnail-settings';

/**
 * Creates the vimeo thumbnails plugin.
 * @param {object} element - lightGallery element
 */
export default class VimeoThumbnail {
    core: LightGallery;
    settings: VimeoThumbnailSettings;

    constructor(instance: LightGallery) {
        this.core = instance;

        // extend module default settings with lightGallery core settings
        this.settings = { ...vimeoSettings, ...this.core.settings };

        return this;
    }

    public init(): void {
        if (!this.settings.showVimeoThumbnails) {
            return;
        }

        this.core.LGel.on(`${lGEvents.init}.vimeothumbnails`, (event) => {
            const pluginInstance = event.detail.instance;
            const thumbCont = pluginInstance.$container
                .find('.lg-thumb-outer')
                .get();
            if (thumbCont) {
                this.setVimeoThumbnails(pluginInstance);
            }
        });
    }

    async setVimeoThumbnails(dynamicGallery: LightGallery): Promise<void> {
        for (let i = 0; i < dynamicGallery.galleryItems.length; i++) {
            const item = dynamicGallery.galleryItems[i];
            const slideVideoInfo = item.__slideVideoInfo || {};
            if (slideVideoInfo.vimeo) {
                const response = await fetch(
                    'https://vimeo.com/api/oembed.json?url=' +
                        encodeURIComponent(item.src as string),
                );
                const vimeoInfo = await response.json();
                dynamicGallery.$container
                    .find('.lg-thumb-item')
                    .eq(i)
                    .find('img')
                    .attr(
                        'src',
                        this.settings.showThumbnailWithPlayButton
                            ? vimeoInfo.thumbnail_url_with_play_button
                            : vimeoInfo.thumbnail_url,
                    );
            }
        }
    }

    public destroy(): void {
        // Remove all event listeners added by vimeothumbnails plugin
        this.core.LGel.off('.lg.vimeothumbnails');
        this.core.LGel.off('.vimeothumbnails');
    }
}
