import { getVideoInfo } from '@lightgallery/headless';
import type { LgFeature, LgGalleryItem } from '@lightgallery/angular';

/**
 * vimeoThumbnail feature (2.x `lg-vimeo-thumbnail`): fetches Vimeo oEmbed
 * thumbnails for vimeo items. Implemented as an async `transformItems`
 * (ADR §5) — the gallery runtime aborts the fetches when the items change
 * or the gallery is destroyed.
 */

export interface VimeoThumbnailSettings {
    /** Auto-load thumbnails for Vimeo videos. */
    showVimeoThumbnails: boolean;
    /** Use the thumbnail variant with a play button. */
    showThumbnailWithPlayButton: boolean;
}

export const vimeoThumbnailSettings: VimeoThumbnailSettings = {
    showVimeoThumbnails: true,
    showThumbnailWithPlayButton: false,
};

interface VimeoOembedResponse {
    thumbnail_url?: string;
    thumbnail_url_with_play_button?: string;
}

async function fetchVimeoThumb(
    item: LgGalleryItem,
    withPlayButton: boolean,
    signal?: AbortSignal,
): Promise<LgGalleryItem> {
    try {
        const response = await fetch(
            'https://vimeo.com/api/oembed.json?url=' +
                encodeURIComponent(item.src ?? ''),
            { signal },
        );
        const info = (await response.json()) as VimeoOembedResponse;
        const thumb = withPlayButton
            ? info.thumbnail_url_with_play_button
            : info.thumbnail_url;
        return thumb ? { ...item, thumb } : item;
    } catch {
        return item;
    }
}

export function withVimeoThumbnail(
    options: Partial<VimeoThumbnailSettings> = {},
): LgFeature<VimeoThumbnailSettings> {
    return {
        name: 'vimeoThumbnail',
        defaults: vimeoThumbnailSettings,
        options,
        transformItems: async (items, signal, settings) => {
            const cfg = settings as unknown as
                | VimeoThumbnailSettings
                | undefined;
            if (cfg && !cfg.showVimeoThumbnails) {
                return items;
            }
            const withPlayButton = !!cfg?.showThumbnailWithPlayButton;
            const result: LgGalleryItem[] = [];
            for (const item of items) {
                const isVimeo = !!getVideoInfo(item.src, false)?.vimeo;
                result.push(
                    isVimeo
                        ? await fetchVimeoThumb(item, withPlayButton, signal)
                        : item,
                );
            }
            return result;
        },
    };
}
