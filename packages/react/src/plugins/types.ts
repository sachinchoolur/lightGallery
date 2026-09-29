import type { ComponentType, ReactNode } from 'react';
import type {
    CoreSettings,
    FractionRect,
    GalleryState,
    ImageSize,
    RectLike,
} from '@lightgallery/headless';

import type { GalleryActions, GestureSeam } from '../context';
import type { LgEventEmitter } from '../events';
import type { OriginAnimation } from '../GalleryOutlet';
import type { GalleryItem } from '../types';

/**
 * The plugin contract (ADR 0001 §5), validated against all 13 vanilla
 * plugins during the architecture spike. Implementation notes vs the ADR
 * snippet:
 * - `gestureLock` is the full gesture seam (a superset of `{ claim }`): the
 *   zoom plugin also reads the live pointer records for pinch math.
 * - `PluginContext` additionally carries `items` (every vanilla plugin reads
 *   `core.galleryItems`) and `layout.setOuterClass`/`toggleComponents` — the
 *   declarative replacements for vanilla's direct outer-element class
 *   mutations (React owns `className`).
 */

/** Slot components receive no props; they read the gallery via hooks. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginSlotProps {}

export interface SlideWrapperProps {
    item: GalleryItem;
    index: number;
    isCurrent: boolean;
    children: ReactNode;
}

/**
 * Props of a `slidesWrapper` slot: it wraps the whole slide list
 * (`.lg-inner`) and follows the zoom-from-origin flight of the opening or
 * closing slide (origin crop's stage boxes).
 */
export interface SlidesWrapperProps {
    originAnim: OriginAnimation | null;
    children: ReactNode;
}

/** What a plugin sees when a zoom-from-origin flight is measured. */
export interface OriginFlightInput {
    index: number;
    /**
     * The element the flight was measured from (the trigger's img, else
     * the trigger itself); null when an explicit `originRect` was given.
     */
    trigger: HTMLElement | null;
    triggerRect: RectLike;
    containerRect: RectLike;
    /** Media container offsets (toolbar; caption + thumb strip), px. */
    top: number;
    bottom: number;
    /** The fitted image box the flight lands on. */
    imageSize: ImageSize;
}

/** A plugin's flight for a trigger, in place of the built-in one. */
export interface OriginFlightOverride {
    /** The slide's transform on the trigger. */
    transform: string;
    /** Transforms for a `slidesWrapper`'s outer and inner boxes. */
    boxes?: { outer: string; inner: string };
    /** The part of the image the flight's dummy covers (default: whole). */
    region?: FractionRect;
    /** Source of the flight's dummy when the gallery has none. */
    dummySrc?: string;
}

/** Returning null or undefined keeps the built-in flight. */
export type OriginFlightResolver = (
    input: OriginFlightInput,
) => OriginFlightOverride | null | undefined;

/** Flat settings bag: core settings + every plugin's merged settings. */
export type ResolvedPluginSettings = CoreSettings & Record<string, unknown>;

export interface MediaPosition {
    top: number;
    bottom: number;
}

export interface PluginLayout {
    /** Declaratively toggle a class on the `.lg-outer` element. */
    setOuterClass(className: string, active: boolean): void;
    /** Toggle the footer area (`lg-components-open`) — thumbnail toggle. */
    toggleComponents(): void;
    /**
     * mediumZoom's core-method override: replace the media container
     * position measurement. Pass `null` to restore the default.
     */
    overrideMediaPosition(fn: (() => MediaPosition) | null): void;
    /**
     * originCrop's core-method override: resolve the zoom-from-origin
     * flight for a trigger. Pass `null` to restore the built-in flight.
     */
    overrideOriginFlight(fn: OriginFlightResolver | null): void;
}

export interface PluginRefs {
    getOuter(): HTMLElement | null;
    getInner(): HTMLElement | null;
    getCurrentSlide(): HTMLElement | null;
}

export interface PluginContext {
    state: GalleryState;
    actions: GalleryActions;
    settings: ResolvedPluginSettings;
    items: GalleryItem[];
    events: LgEventEmitter;
    gestureLock: GestureSeam;
    layout: PluginLayout;
    refs: PluginRefs;
}

export interface LgPluginSlots {
    /** Buttons appended to `.lg-toolbar`. */
    toolbar?: ComponentType<PluginSlotProps>;
    /** Footer area (`.lg-components`): thumbnails, pager. */
    components?: ComponentType<PluginSlotProps>;
    /** Overlay panels inside `.lg-outer`: the comment box. */
    outer?: ComponentType<PluginSlotProps>;
    /** Wraps slide content: zoom transform, rotate wrap. */
    slideWrapper?: ComponentType<SlideWrapperProps>;
    /** Wraps the slide list (`.lg-inner`): origin crop's stage boxes. */
    slidesWrapper?: ComponentType<SlidesWrapperProps>;
}

export interface LgPlugin<TSettings extends object = object> {
    name: string;
    /** Merged NON-mutating below user settings (headless owns the merge). */
    defaults?: TSettings;
    slots?: LgPluginSlots;
    /** Replace a slide's content; `undefined` passes through. */
    slideRenderer?: (
        item: GalleryItem,
        index: number,
        ctx: PluginContext,
    ) => ReactNode | undefined;
    /**
     * Effect hook run inside the gallery (rules of hooks apply — each plugin
     * runs in its own runner component keyed by plugin name).
     */
    usePlugin?: (ctx: PluginContext) => void;
    /**
     * Transform the item list (vimeoThumbnail); may be async. The signal
     * aborts when the inputs change or the gallery unmounts; the resolved
     * settings carry the plugin's own merged options.
     */
    transformItems?: (
        items: GalleryItem[],
        signal?: AbortSignal,
        settings?: ResolvedPluginSettings,
    ) => GalleryItem[] | Promise<GalleryItem[]>;
    /** Opinionated core-settings overrides applied at merge (mediumZoom). */
    presets?: Partial<CoreSettings>;
}
