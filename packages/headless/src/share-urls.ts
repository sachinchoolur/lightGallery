/**
 * Share link builders for the share plugin, ported from the 2.x
 * `lg-*-share-utils` files as pure functions — the page URL fallback is a
 * parameter instead of `window.location.href`.
 */

import type { GalleryItem } from './items';

export function getFacebookShareLink(
    item: GalleryItem<unknown>,
    currentUrl: string,
): string {
    return (
        '//www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(item.facebookShareUrl || currentUrl)
    );
}

export function getTwitterShareLink(
    item: GalleryItem<unknown>,
    currentUrl: string,
): string {
    const url = encodeURIComponent(item.twitterShareUrl || currentUrl);
    const text = item.tweetText ?? '';
    return `//twitter.com/intent/tweet?text=${text}&url=${url}`;
}

export function getPinterestShareLink(
    item: GalleryItem<unknown>,
    currentUrl: string,
): string {
    const media = encodeURIComponent(item.src ?? '');
    const url = encodeURIComponent(item.pinterestShareUrl || currentUrl);
    const description = item.pinterestText ?? '';
    return `//www.pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`;
}
