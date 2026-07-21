import {
    createContext,
    useContext,
    type Context,
    type Dispatch,
} from 'react';
import type {
    CoreSettings,
    GalleryAction,
    GalleryState,
    RectLike,
} from '@lightgallery/headless';
import type {
    GalleryItem,
    LightGalleryCallbacks,
    RenderSlots,
} from './types';

/**
 * Context split per ADR 0001 §3: `StateContext` changes per slide/drag
 * commit; `ActionsContext`, `SettingsContext` and `SlotContext` are stable
 * (or change only with props) so toolbar/thumbnail consumers can subscribe
 * narrowly.
 */

export interface GalleryActions {
    openGallery: (index?: number) => void;
    closeGallery: () => void;
    goToSlide: (index: number) => void;
    nextSlide: () => void;
    prevSlide: () => void;
    refresh: () => void;
    dispatch: Dispatch<GalleryAction>;
}

export type EmitFn = <K extends keyof LightGalleryCallbacks>(
    name: K,
    ...args: Parameters<NonNullable<LightGalleryCallbacks[K]>>
) => void;

/** One `<LightGalleryItem>` registration (uncontrolled mode). */
export interface ItemRegistration {
    item: GalleryItem;
    element: HTMLElement | null;
}

/** Internal plumbing shared between the root and the outlet/slides. */
export interface GalleryInternal {
    items: GalleryItem[];
    emit: EmitFn;
    registerItem: (registration: ItemRegistration) => () => void;
    getItemIndex: (registration: ItemRegistration) => number;
    /** Zoom-from-origin rect for a slide: `originRect` prop or trigger rect. */
    getOriginRect: (index: number) => RectLike | null;
    /** Slide-end bounce (`lg-left-end` / `lg-right-end`). */
    edgeBounce: 'left' | 'right' | null;
}

export const StateContext = createContext<GalleryState | null>(null);
export const ActionsContext = createContext<GalleryActions | null>(null);
export const SettingsContext = createContext<CoreSettings | null>(null);
export const SlotContext = createContext<RenderSlots>({});
export const InternalContext = createContext<GalleryInternal | null>(null);

function useRequiredContext<T>(context: Context<T | null>, name: string): T {
    const value = useContext(context);
    if (value === null) {
        throw new Error(
            `lightGallery: ${name} is only available inside <LightGallery>.`,
        );
    }
    return value;
}

export function useGalleryState(): GalleryState {
    return useRequiredContext(StateContext, 'gallery state');
}

export function useGalleryActions(): GalleryActions {
    return useRequiredContext(ActionsContext, 'gallery actions');
}

export function useGallerySettings(): CoreSettings {
    return useRequiredContext(SettingsContext, 'gallery settings');
}

export function useGallerySlots(): RenderSlots {
    return useContext(SlotContext);
}

export function useGalleryInternal(): GalleryInternal {
    return useRequiredContext(InternalContext, 'gallery internals');
}
