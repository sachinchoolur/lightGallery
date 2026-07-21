import type { ReactNode } from 'react';
import type {
    GalleryItem as HeadlessGalleryItem,
    RectLike,
    UserSettings,
} from '@lightgallery/headless';

import type { HasVideoDetail } from './events';
import type { LgPlugin } from './plugins/types';

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
    /** Fired before next/prev navigation commits (2.x parity). */
    onBeforeNextSlide?: (detail: { index: number }) => void;
    onBeforePrevSlide?: (detail: { index: number; fromTouch: boolean }) => void;
    /** A slide's content mounted (2.x `afterAppendSlide`). */
    onAfterAppendSlide?: (detail: { index: number }) => void;
    /** The caption for a slide rendered (2.x `afterAppendSubHtml`). */
    onAfterAppendSubHtml?: (detail: { index: number }) => void;
    /** The window resized while the gallery is open. */
    onContainerResize?: (detail: { index: number }) => void;
    onBeforeClose?: () => void;
    onAfterClose?: () => void;
    /** Mouse-drag lifecycle (2.x `dragstart`/`dragmove`/`dragend`). */
    onDragStart?: () => void;
    onDragMove?: () => void;
    onDragEnd?: () => void;
    /** A video poster/play button was activated. */
    onPosterClick?: () => void;
    /** A slide with video content mounted (informational, 2.x `hasVideo`). */
    onHasVideo?: (detail: HasVideoDetail) => void;
    /** Autoplay plugin lifecycle. */
    onAutoplayStart?: (detail: { index: number }) => void;
    onAutoplay?: (detail: { index: number }) => void;
    onAutoplayStop?: (detail: { index: number }) => void;
    /** Rotate plugin events (also consumed by other plugins via the bus). */
    onRotateLeft?: (detail: { rotate: number }) => void;
    onRotateRight?: (detail: { rotate: number }) => void;
    onFlipHorizontal?: (detail: { flipHorizontal: number }) => void;
    onFlipVertical?: (detail: { flipVertical: number }) => void;
}

/**
 * Per-plugin settings props, named by plugin (ADR 0001 §5) and typed via
 * module augmentation from each plugin entry:
 * `<LightGallery plugins={[Zoom]} zoom={{ scale: 1.3 }} />`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LightGalleryPluginSettings {}

export interface LightGalleryProps
    extends UserSettings,
        LightGalleryCallbacks,
        Partial<LightGalleryPluginSettings> {
    /** Plugin modules (ADR 0001 §5): `plugins={[Thumbnail, Zoom, Video]}`. */
    plugins?: LgPlugin[];

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
