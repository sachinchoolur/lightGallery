import type { ComponentType, ReactNode } from 'react';
import type { CoreSettings, GalleryState } from '@lightgallery/headless';

import type { GalleryActions, GestureSeam } from '../context';
import type { LgEventEmitter } from '../events';
import type { GalleryItem } from '../types';

/**
 * The plugin contract (ADR 0001 §5), validated against all 13 vanilla
 * plugins in plan 002. Implementation notes vs the ADR snippet:
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

/** Flat settings bag: core settings + every plugin's merged settings. */
export type ResolvedPluginSettings = CoreSettings & Record<string, unknown>;

export interface PluginLayout {
    /** Declaratively toggle a class on the `.lg-outer` element. */
    setOuterClass(className: string, active: boolean): void;
    /** Toggle the footer area (`lg-components-open`) — thumbnail toggle. */
    toggleComponents(): void;
    /** mediumZoom's core-method override (wired for plan 006). */
    overrideMediaPosition?(fn: unknown): void;
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
    /** Overlay panels inside `.lg-outer`: share dropdown, comment box. */
    outer?: ComponentType<PluginSlotProps>;
    /** Wraps slide content: zoom transform, rotate wrap. */
    slideWrapper?: ComponentType<SlideWrapperProps>;
}

export interface LgPlugin<
    TSettings extends object = Record<string, unknown>,
> {
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
    /** Transform the item list (vimeoThumbnail); may be async. */
    transformItems?: (
        items: GalleryItem[],
    ) => GalleryItem[] | Promise<GalleryItem[]>;
    /** Opinionated core-settings overrides applied at merge (mediumZoom). */
    presets?: Partial<CoreSettings>;
}
