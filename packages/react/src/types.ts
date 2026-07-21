import type { ReactNode } from 'react';
import type {
    GalleryItem as HeadlessGalleryItem,
    RectLike,
    UserSettings,
} from '@lightgallery/headless';

/** Gallery item with the caption narrowed to a React node (ADR 0001 §7). */
export type GalleryItem = HeadlessGalleryItem<ReactNode>;

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

export interface InitDetail {
    instance: LightGalleryRefHandle;
}

/**
 * Imperative handle covering vanilla's public methods (ADR 0001 §3). Also
 * passed to `onInit` for parity with `event.detail.instance`.
 */
export interface LightGalleryRefHandle {
    openGallery(index?: number): void;
    closeGallery(): void;
    goToSlide(index: number): void;
    nextSlide(): void;
    prevSlide(): void;
    /** API parity with vanilla; updates are prop-driven in React. */
    refresh(): void;
}

/** Typed render props replacing 2.x HTML-string options (ADR 0001 §4). */
export interface RenderSlots {
    caption?: (item: GalleryItem, index: number) => ReactNode;
    counter?: (current: number, total: number) => ReactNode;
    prevButton?: () => ReactNode;
    nextButton?: () => ReactNode;
}

export interface LightGalleryCallbacks {
    onInit?: (detail: InitDetail) => void;
    onBeforeOpen?: () => void;
    onAfterOpen?: () => void;
    onSlideItemLoad?: (detail: SlideItemLoadDetail) => void;
    onBeforeSlide?: (detail: SlideEventDetail) => void;
    onAfterSlide?: (detail: SlideEventDetail) => void;
    onBeforeClose?: () => void;
    onAfterClose?: () => void;
    /** Mouse-drag lifecycle (2.x `dragstart`/`dragmove`/`dragend`). */
    onDragStart?: () => void;
    onDragMove?: () => void;
    onDragEnd?: () => void;
}

export interface LightGalleryProps extends UserSettings, LightGalleryCallbacks {
    /**
     * The gallery data. When omitted, items come from `<LightGalleryItem>`
     * children (uncontrolled mode).
     */
    slides?: GalleryItem[];

    /**
     * Controlled: whether the lightbox is open. Leave undefined for
     * uncontrolled mode where `<LightGalleryItem>` clicks open the gallery.
     */
    open?: boolean;

    /** Called when the gallery requests to close (ESC / close button / tap). */
    onClose?: () => void;

    /** Controlled slide index. */
    index?: number;

    /** Called when the gallery requests a different slide. */
    onIndexChange?: (index: number) => void;

    /** Initial slide for uncontrolled index. */
    defaultIndex?: number;

    /** Extra class for the `lg-container` element (2.x `addClass`). */
    className?: string;

    /** Where the portal mounts; defaults to `document.body`. */
    container?: HTMLElement | null;

    /**
     * Zoom-from-origin rect (viewport coordinates) for controlled mode,
     * where there is no trigger element to measure.
     */
    originRect?: RectLike | null;

    render?: RenderSlots;

    children?: ReactNode;
}
