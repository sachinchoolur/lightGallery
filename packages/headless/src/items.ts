/**
 * Framework-free gallery item data model, ported from the 2.x `GalleryItem`
 * shape (`src/lg-utils.ts`) minus the DOM-scraping era fields. Data always
 * arrives typed — there is no selector/attribute scraping in 3.x.
 *
 * The caption is generic so each framework can narrow it to its own node type
 * (React narrows `TCaption` to `ReactNode`). Raw-HTML captions go through the
 * deliberately loud `captionHtml` field instead.
 */

import { getVideoInfo } from './video-urls';

export interface ImageSources {
    media?: string;
    srcset: string;
    sizes?: string;
    type?: string;
}

export interface GalleryItem<TCaption = unknown> {
    /** URL of the media. */
    src?: string;

    /** srcset attribute values for the main image. */
    srcset?: string;

    /** srcset sizes attribute for the main image. */
    sizes?: string;

    /** `<source>` attributes for rendering the image inside a `<picture>`. */
    sources?: ImageSources[];

    /** Thumbnail URL (used by thumbnail plugin and gallery triggers). */
    thumb?: string;

    /** alt attribute for the image. */
    alt?: string;

    /** Title attribute (videos). */
    title?: string;

    /** Caption for the slide, rendered by the framework layer. */
    caption?: TCaption;

    /**
     * Raw-HTML caption opt-in — the explicit analog of 2.x `subHtml` strings.
     * Rendered with the framework's raw-HTML escape hatch
     * (`dangerouslySetInnerHTML` in React); prefer `caption`.
     */
    captionHtml?: string;

    /** Render the src inside an iframe instead of an image. */
    iframe?: boolean;

    /** Title for the iframe. */
    iframeTitle?: string;

    /**
     * HTML5 video sources (video plugin, plan 005). Kept loosely typed until
     * the video plugin lands.
     */
    video?: unknown;

    /** Poster URL for video slides. */
    poster?: string;

    /**
     * Download URL for the media. Pass `false` to hide the download button
     * for this slide.
     */
    downloadUrl?: string | false;

    /** Filename for the download attribute. */
    download?: string | boolean;

    /**
     * Natural size of the full image as `"width-height"` (2.x
     * `data-lg-size`), optionally a comma separated responsive list
     * `"240-160-375, 1600-1067"`. Required for the zoom-from-origin open
     * animation.
     */
    lgSize?: string;

    /** Actual image width in px (zoom plugin actual-size math, plan 005). */
    width?: string;

    /** Custom slide name for the hash plugin. */
    slideName?: string;

    /** Share plugin: per-item Facebook share URL (defaults to the page URL). */
    facebookShareUrl?: string;

    /** Share plugin: tweet text. */
    tweetText?: string;

    /** Share plugin: per-item Twitter share URL. */
    twitterShareUrl?: string;

    /** Share plugin: per-item Pinterest share URL (must be absolute). */
    pinterestShareUrl?: string;

    /** Share plugin: Pinterest post description. */
    pinterestText?: string;

    /** mediumZoom plugin: per-item backdrop color. */
    lgBackgroundColor?: string;
}

export type SlideType = 'image' | 'video' | 'iframe';

/**
 * Classify a gallery item: html5 `video` sources, a `poster`, or a
 * YouTube/Vimeo/Wistia src URL make it a video (2.x `getSlideType` +
 * `__slideVideoInfo` combined).
 */
export function getSlideType(item: GalleryItem<unknown>): SlideType {
    if (
        item.video ||
        item.poster ||
        getVideoInfo(item.src, false) !== undefined
    ) {
        return 'video';
    }
    if (item.iframe) {
        return 'iframe';
    }
    return 'image';
}
