import { useMemo, type ReactElement, type ReactNode } from 'react';

import {
    useGalleryActions,
    useGalleryInternal,
    useGallerySettings,
    useGalleryState,
} from '../context';
import type { GalleryItem } from '../types';
import type {
    LgPlugin,
    PluginContext,
    ResolvedPluginSettings,
} from './types';

/** Build the per-render plugin context (ADR 0001 §5). */
export function usePluginContext(): PluginContext {
    const state = useGalleryState();
    const actions = useGalleryActions();
    const settings = useGallerySettings() as ResolvedPluginSettings;
    const internal = useGalleryInternal();
    return useMemo(
        () => ({
            state,
            actions,
            settings,
            items: internal.items,
            events: internal.events,
            gestureLock: internal.gestureSeam,
            layout: internal.layout,
            refs: internal.refs,
        }),
        [state, actions, settings, internal],
    );
}

/** Typed access to a plugin's own (flat-merged) settings. */
export function usePluginSettings<T extends object>(): T &
    ResolvedPluginSettings {
    return useGallerySettings() as T & ResolvedPluginSettings;
}

function PluginRunner({ plugin }: { plugin: LgPlugin }): null {
    const ctx = usePluginContext();
    // Each plugin runs in its own component (keyed by name), so its hooks
    // follow the rules of hooks even when the plugins array changes.
    plugin.usePlugin!(ctx);
    return null;
}

/** Mounts every plugin's `usePlugin` hook, in plugins-array order. */
export function PluginRunners(): ReactElement {
    const internal = useGalleryInternal();
    return (
        <>
            {internal.plugins
                .filter((plugin) => plugin.usePlugin)
                .map((plugin) => (
                    <PluginRunner key={plugin.name} plugin={plugin} />
                ))}
        </>
    );
}

/** Render one slot kind for every plugin that fills it, in order. */
export function PluginSlots({
    kind,
}: {
    kind: 'toolbar' | 'components' | 'outer';
}): ReactElement {
    const internal = useGalleryInternal();
    return (
        <>
            {internal.plugins.map((plugin) => {
                const Slot = plugin.slots?.[kind];
                return Slot ? <Slot key={plugin.name} /> : null;
            })}
        </>
    );
}

/** First plugin slide renderer that returns content wins. */
export function resolvePluginSlideContent(
    plugins: readonly LgPlugin[],
    item: GalleryItem,
    index: number,
    ctx: PluginContext,
): ReactNode | undefined {
    for (const plugin of plugins) {
        const content = plugin.slideRenderer?.(item, index, ctx);
        if (content !== undefined) {
            return content;
        }
    }
    return undefined;
}

/** Wrap slide content with every plugin's slideWrapper (first = outermost). */
export function wrapSlideContent(
    plugins: readonly LgPlugin[],
    content: ReactNode,
    props: { item: GalleryItem; index: number; isCurrent: boolean },
): ReactNode {
    return plugins.reduceRight((acc, plugin) => {
        const Wrapper = plugin.slots?.slideWrapper;
        return Wrapper ? <Wrapper {...props}>{acc}</Wrapper> : acc;
    }, content);
}
