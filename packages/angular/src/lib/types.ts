import type { GalleryItem } from '@lightgallery/headless';

/**
 * Gallery item with the caption narrowed to a plain string (ADR 0001 §4):
 * rich captions use the `*lgCaption` template slot; raw HTML only via the
 * explicitly named `captionHtml` opt-in (Angular-sanitized `[innerHTML]`).
 */
export type LgGalleryItem = GalleryItem<string>;

/** Event payload shapes — identical to the React track's (ADR 0001 §6). */
export interface SlideEventDetail {
    index: number;
    prevIndex: number;
    fromTouch: boolean;
    fromThumb: boolean;
}

export interface SlideItemLoadDetail {
    index: number;
    /** For the first slide, the entrance-animation duration + 10ms (2.x parity). */
    delay: number;
    isFirstSlide: boolean;
}

export interface HasVideoDetail {
    index: number;
    src?: string;
    html5Video?: unknown;
    hasPoster: boolean;
}

/**
 * Imperative surface covering vanilla's public methods (ADR 0001 §3) —
 * implemented by `LgGalleryComponent` and reachable in templates via
 * `#lg="lgGallery"`. Also the payload of `(init)` for parity with 2.x
 * `event.detail.instance`.
 */
export interface LgGalleryHandle {
    openGallery(index?: number): void;
    closeGallery(): void;
    goToSlide(index: number): void;
    nextSlide(): void;
    prevSlide(): void;
    /** API parity with vanilla; updates are input-driven in Angular. */
    refresh(): void;
}

export interface InitDetail {
    instance: LgGalleryHandle;
}

/**
 * All bus events and their payloads (ADR 0001 §6: outputs without the `on`
 * prefix, payload details identical to React). Core fires the lifecycle
 * subset in plan 003; gesture/plugin events fire from plans 004–006.
 */
export interface LgEventMap {
    init: InitDetail;
    beforeOpen: void;
    afterOpen: void;
    slideItemLoad: SlideItemLoadDetail;
    beforeSlide: SlideEventDetail;
    afterSlide: SlideEventDetail;
    beforeNextSlide: { index: number };
    beforePrevSlide: { index: number; fromTouch: boolean };
    afterAppendSlide: { index: number };
    afterAppendSubHtml: { index: number };
    containerResize: { index: number };
    beforeClose: void;
    afterClose: void;
    dragStart: void;
    dragMove: void;
    dragEnd: void;
    posterClick: void;
    hasVideo: HasVideoDetail;
    autoplayStart: { index: number };
    autoplay: { index: number };
    autoplayStop: { index: number };
    rotateLeft: { rotate: number };
    rotateRight: { rotate: number };
    flipHorizontal: { flipHorizontal: number };
    flipVertical: { flipVertical: number };
}
