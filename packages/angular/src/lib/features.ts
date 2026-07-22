import {
    InjectionToken,
    type Provider,
    type Signal,
    type TemplateRef,
    type Type,
} from '@angular/core';
import type {
    CoreSettings,
    GalleryAction,
    GalleryState,
    TypedEmitter,
} from '@lightgallery/headless';

import type { LgGalleryActions, LgGestureSeam } from './runtime';
import type { LgEventMap, LgGalleryItem } from './types';

/**
 * The feature-provider plugin contract (ADR 0001 §5). Features are VALUES on
 * the `[features]` input — never module/root providers — so two galleries on
 * a page can differ; the runtime registers them behind the `LG_FEATURE`
 * multi-token inside a per-gallery feature injector.
 */

/** Flat settings bag: core settings + every feature's merged settings. */
export type ResolvedFeatureSettings = CoreSettings & Record<string, unknown>;

export interface LgMediaPosition {
    top: number;
    bottom: number;
}

export interface LgFeatureLayout {
    /** Declaratively toggle a class on the `.lg-outer` element. */
    setOuterClass(className: string, active: boolean): void;
    /** Toggle the footer area (`lg-components-open`) — thumbnail toggle. */
    toggleComponents(): void;
    /**
     * mediumZoom's core-method override (wave 2): replace the media
     * container position measurement. Pass `null` to restore the default.
     */
    overrideMediaPosition(fn: (() => LgMediaPosition) | null): void;
}

export interface LgFeatureRefs {
    getOuter(): HTMLElement | null;
    getInner(): HTMLElement | null;
    getCurrentSlide(): HTMLElement | null;
}

/**
 * What feature components/services inject via {@link LG_PLUGIN_CONTEXT} —
 * the React `PluginContext` mirrored field-for-field onto signals, plus
 * `emit` (Angular deviation, documented: outputs live on the component, so
 * features that must fire public outputs — video's `hasVideo`,
 * `slideItemLoad` — go through the same fan-out the core uses).
 */
export interface LgPluginContext {
    state: Signal<GalleryState>;
    settings: Signal<ResolvedFeatureSettings>;
    items: Signal<readonly LgGalleryItem[]>;
    actions: LgGalleryActions & {
        dispatch(action: GalleryAction): void;
    };
    events: TypedEmitter<LgEventMap>;
    gestureLock: LgGestureSeam;
    layout: LgFeatureLayout;
    refs: LgFeatureRefs;
    emit<K extends keyof LgEventMap>(name: K, detail: LgEventMap[K]): void;
}

export const LG_PLUGIN_CONTEXT = new InjectionToken<LgPluginContext>(
    'LG_PLUGIN_CONTEXT',
);

/**
 * Inputs every `slots.slideWrapper` component receives (zoom, rotate). The
 * wrapped content arrives as a `content` template to render wherever the
 * wrapper decides — the Angular expression of React's
 * `<Wrapper>{children}</Wrapper>` (documented deviation: a `TemplateRef`
 * input instead of `<ng-content>`, so wrappers can render children bare
 * when disabled without conditional-projection pitfalls).
 */
export interface LgSlideWrapperInputs {
    item: LgGalleryItem;
    index: number;
    isCurrent: boolean;
    content: TemplateRef<unknown>;
}

/** Slide-content replacement (video): first matching feature wins. */
export interface LgSlideRenderer {
    /** Rendered with `{ item, index }` inputs instead of the built-ins. */
    component: Type<unknown>;
    /** Whether this renderer owns the given item (video items only, etc.). */
    canRender(item: LgGalleryItem): boolean;
}

export interface LgFeatureSlots {
    /** Buttons appended to `.lg-toolbar`. */
    toolbar?: Type<unknown>;
    /** Footer area (`.lg-components`): thumbnails, pager. */
    components?: Type<unknown>;
    /** Overlay panels inside `.lg-outer`: share dropdown, comment box. */
    outer?: Type<unknown>;
    /** Wraps slide content (zoom/rotate); see {@link LgSlideWrapperInputs}. */
    slideWrapper?: Type<unknown>;
}

export interface LgFeature<TSettings extends object = object> {
    /** Settings prop name (ADR naming table); also the duplicate-guard key. */
    name: string;
    /** Feature defaults, merged NON-mutating below user settings. */
    defaults?: TSettings;
    /** Opinionated core-settings overrides applied at merge (mediumZoom). */
    presets?: Partial<CoreSettings>;
    /** User options carried by the `withX({...})` factory call. */
    options?: Partial<TSettings>;
    /**
     * Per-gallery DI (services, effects). Instantiated inside the gallery's
     * feature injector; services that must run eagerly (hash's open-from-URL
     * effect) register under {@link LG_FEATURE_INIT}.
     */
    providers?: Provider[];
    slots?: LgFeatureSlots;
    slideRenderer?: LgSlideRenderer;
    /**
     * Transform the item list (vimeoThumbnail, wave 2); may be async. The
     * signal aborts when the inputs change or the gallery is destroyed.
     */
    transformItems?: (
        items: LgGalleryItem[],
        signal?: AbortSignal,
        settings?: ResolvedFeatureSettings,
    ) => LgGalleryItem[] | Promise<LgGalleryItem[]>;
}

/** Multi-token carrying each registered feature in the feature injector. */
export const LG_FEATURE = new InjectionToken<LgFeature>('LG_FEATURE');

/**
 * Eager-init multi-token: anything provided here is instantiated as soon as
 * the gallery builds its feature injector (while the gallery may still be
 * closed) — the home for feature effects that must run outside the overlay
 * (ADR §5; the hash feature's open-from-URL effect in wave 2).
 *
 * ```ts
 * providers: [
 *     MyFeatureService,
 *     { provide: LG_FEATURE_INIT, useExisting: MyFeatureService, multi: true },
 * ]
 * ```
 */
export const LG_FEATURE_INIT = new InjectionToken<readonly unknown[]>(
    'LG_FEATURE_INIT',
);

/** De-duplicate features by name (first wins), warning on duplicates. */
export function dedupeFeatures(
    features: readonly LgFeature[],
): LgFeature[] {
    const seen = new Set<string>();
    const result: LgFeature[] = [];
    for (const feature of features) {
        if (seen.has(feature.name)) {
            console.warn(
                `lightGallery: duplicate feature "${feature.name}" ignored.`,
            );
            continue;
        }
        seen.add(feature.name);
        result.push(feature);
    }
    return result;
}
