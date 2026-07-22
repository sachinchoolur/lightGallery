import type { GalleryItem, UserSettings } from '@lightgallery/headless';

/**
 * Gallery item with the caption narrowed to a plain string (ADR 0001 §4):
 * rich captions use the `#caption` scoped slot; raw HTML only via the
 * explicitly named `captionHtml` opt-in (`v-html`, consumer-sanitized).
 */
export type LgGalleryItem = GalleryItem<string>;

/** Event payload shapes — identical to the sibling tracks' (ADR 0001 §6). */
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

/** Imperative surface (`defineExpose`) — same handle as the siblings. */
export interface InitDetail {
    instance: {
        openGallery(index?: number): void;
        closeGallery(): void;
        goToSlide(index: number): void;
        nextSlide(): void;
        prevSlide(): void;
        refresh(): void;
    };
}

/**
 * Bus events and their payloads (ADR 0001 §6). Bus names are camelCase
 * (shared with the sibling tracks); component emits use the kebab-case
 * mirror (`beforeSlide` → `@before-slide`).
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

/** camelCase bus name → kebab-case emit name (single source of truth). */
export const LG_EVENT_EMIT_NAMES = {
    init: 'init',
    beforeOpen: 'before-open',
    afterOpen: 'after-open',
    slideItemLoad: 'slide-item-load',
    beforeSlide: 'before-slide',
    afterSlide: 'after-slide',
    beforeNextSlide: 'before-next-slide',
    beforePrevSlide: 'before-prev-slide',
    afterAppendSlide: 'after-append-slide',
    afterAppendSubHtml: 'after-append-sub-html',
    containerResize: 'container-resize',
    beforeClose: 'before-close',
    afterClose: 'after-close',
    dragStart: 'drag-start',
    dragMove: 'drag-move',
    dragEnd: 'drag-end',
    posterClick: 'poster-click',
    hasVideo: 'has-video',
    autoplayStart: 'autoplay-start',
    autoplay: 'autoplay',
    autoplayStop: 'autoplay-stop',
    rotateLeft: 'rotate-left',
    rotateRight: 'rotate-right',
    flipHorizontal: 'flip-horizontal',
    flipVertical: 'flip-vertical',
} as const satisfies Record<keyof LgEventMap, string>;

/**
 * `<LightGallery>` props: the core settings (same-named, camelCase, typed
 * from headless `UserSettings`) plus the framework-layer props.
 */
export interface LgGalleryProps extends UserSettings {
    /**
     * The gallery data. When omitted, items come from `<LgItem>` triggers
     * in the default slot (uncontrolled mode).
     */
    slides?: LgGalleryItem[];
    /** Teleport target for the overlay (element or selector). */
    container?: string | HTMLElement;
    /** Extra class for the `lg-container` element (2.x `addClass`). */
    className?: string;
    /**
     * Zoom-from-origin rect (viewport coordinates) for controlled mode,
     * where there is no trigger element to measure.
     */
    originRect?: {
        left: number;
        top: number;
        width: number;
        height: number;
    } | null;
}
