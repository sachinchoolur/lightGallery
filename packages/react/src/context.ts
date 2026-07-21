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
    PointerRecord,
    RectLike,
    SlideDirection,
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
    /**
     * Internal: navigate with an explicit direction (gesture releases at the
     * loop edges need it); honors controlled-index mode like `goToSlide`.
     */
    navigate: (index: number, direction?: SlideDirection) => void;
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

/**
 * The gesture seam plugins consume (ADR 0001 §5): the zoom plugin (005)
 * claims the lock while pinching/zoom-dragging — core swipe stands down —
 * and reads the live pointer records for its multi-pointer math. Mutable by
 * design: it changes per pointer event and must never trigger renders.
 */
export interface GestureSeam {
    /** Current lock owner; `null` means core swipe/drag may act. */
    lockOwner: 'pinch' | 'zoomSwipe' | null;
    claim(owner: 'pinch' | 'zoomSwipe' | null): void;
    /** Live pointers inside the gallery (multi-pointer bookkeeping). */
    pointers: PointerRecord[];
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
    gestureSeam: GestureSeam;
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
