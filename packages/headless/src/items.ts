/**
 * Framework-free gallery item data model, ported from the 2.x `GalleryItem`
 * shape (`src/lg-utils.ts`) minus the DOM-scraping era fields. Data always
 * arrives typed — there is no selector/attribute scraping in 3.x.
 *
 * The caption is generic so each framework can narrow it to its own node type
 * (React narrows `TCaption` to `ReactNode`). Raw-HTML captions go through the
 * deliberately loud `captionHtml` field instead.
 */

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

    /** Custom slide name for the hash plugin (plan 006). */
    slideName?: string;
}

export type SlideType = 'image' | 'video' | 'iframe';

/**
 * Classify a gallery item. Video URL detection (YouTube/Vimeo/Wistia) is the
 * video plugin's job (plan 005, `video-urls.ts`); at the core level an item is
 * a video when it declares html5 `video` sources or a `poster`.
 */
export function getSlideType(item: GalleryItem<unknown>): SlideType {
    if (item.video || item.poster) {
        return 'video';
    }
    if (item.iframe) {
        return 'iframe';
    }
    return 'image';
}
