import type { Component, ComputedRef, InjectionKey } from 'vue';
import type {
    CoreSettings,
    GalleryAction,
    TypedEmitter,
} from '@lightgallery/headless';

import type { GalleryStore, LgGalleryActions } from '../store';
import type { LgGestureSeam } from '../runtime';
import type { LgEventMap, LgGalleryItem } from '../types';

/**
 * The plugin contract (ADR 0001 §5), validated against all 13 vanilla
 * plugins. Plugins are VALUES on the `:plugins` prop — never `app.use()`
 * globals — so two galleries on a page can differ, each plugin subpath
 * tree-shakes independently, and SSR stays isolated.
 */

/** Flat settings bag: core settings + every plugin's merged settings. */
export type ResolvedPluginSettings = CoreSettings & Record<string, unknown>;

export interface LgMediaPosition {
    top: number;
    bottom: number;
}

export interface LgPluginLayout {
    /** Declaratively toggle a class on the `.lg-outer` element. */
    setOuterClass(className: string, active: boolean): void;
    /** Toggle the footer area (`lg-components-open`) — thumbnail toggle. */
    toggleComponents(): void;
    /**
     * mediumZoom's core-method override: replace the media container
     * position measurement. Pass `null` to restore the default.
     */
    overrideMediaPosition(fn: (() => LgMediaPosition) | null): void;
}

export interface LgPluginRefs {
    getOuter(): HTMLElement | null;
    getInner(): HTMLElement | null;
    getCurrentSlide(): HTMLElement | null;
}

/**
 * What a plugin's `setup(ctx)` receives (and what its slot components can
 * also assemble via `inject`) — the sibling `PluginContext` mirrored onto
 * Vue reactivity, plus `emit` so plugins can fire the public kebab-case
 * component events through the same fan-out the core uses.
 */
export interface LgPluginContext {
    store: GalleryStore;
    actions: LgGalleryActions & {
        dispatch(action: GalleryAction): void;
    };
    settings: ComputedRef<ResolvedPluginSettings>;
    items: ComputedRef<readonly LgGalleryItem[]>;
    events: TypedEmitter<LgEventMap>;
    gestureLock: LgGestureSeam;
    layout: LgPluginLayout;
    refs: LgPluginRefs;
    emit<K extends keyof LgEventMap>(name: K, detail: LgEventMap[K]): void;
}

export interface LgPluginSlots {
    /** Buttons appended to `.lg-toolbar`. */
    toolbar?: Component;
    /** Footer area (`.lg-components`): thumbnails, pager. */
    components?: Component;
    /** Overlay panels inside `.lg-outer`: share dropdown, comment box. */
    outer?: Component;
    /**
     * Wraps slide content (zoom transform, rotate wrap). Receives
     * `{ item, index, isCurrent }` props and the wrapped content through
     * its default slot; first plugin in the array = outermost wrapper.
     */
    slideWrapper?: Component;
}

/** Slide-content replacement (video): first plugin whose renderer owns
 * the item wins; the component receives `{ item, index }` props. */
export interface LgSlideRenderer {
    component: Component;
    canRender(item: LgGalleryItem): boolean;
}

export interface LgVuePlugin<TSettings extends object = object> {
    /** Settings key (ADR naming table); also the duplicate-guard key. */
    name: string;
    /** Merged NON-mutating below user settings (headless owns the merge). */
    defaults?: TSettings;
    /** Opinionated core-settings overrides applied at merge (mediumZoom). */
    presets?: Partial<CoreSettings>;
    /**
     * Runs inside `<LightGallery>`'s setup — watchers/timers/listeners
     * registered here are torn down by `onScopeDispose` automatically.
     * Runs whether the gallery is open or closed (hash's deep links).
     */
    setup?: (ctx: LgPluginContext) => void;
    slots?: LgPluginSlots;
    slideRenderer?: LgSlideRenderer;
    /**
     * Transform the item list (vimeoThumbnail); may be async. The signal
     * aborts when the inputs change or the gallery unmounts.
     */
    transformItems?: (
        items: LgGalleryItem[],
        signal?: AbortSignal,
        settings?: ResolvedPluginSettings,
    ) => LgGalleryItem[] | Promise<LgGalleryItem[]>;
}

/** Injection key plugin slot components use to reach the context. */
export const LG_PLUGIN_CONTEXT: InjectionKey<LgPluginContext> =
    Symbol('lgPluginContext');

/** De-duplicate plugins by name (first wins), warning on duplicates. */
export function dedupePlugins(
    plugins: readonly LgVuePlugin[],
): LgVuePlugin[] {
    const seen = new Set<string>();
    const result: LgVuePlugin[] = [];
    for (const plugin of plugins) {
        if (seen.has(plugin.name)) {
            console.warn(
                `lightGallery: duplicate plugin "${plugin.name}" ignored.`,
            );
            continue;
        }
        seen.add(plugin.name);
        result.push(plugin);
    }
    return result;
}
