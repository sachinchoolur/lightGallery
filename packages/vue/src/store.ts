import {
    computed,
    shallowRef,
    type ComputedRef,
    type InjectionKey,
    type ShallowRef,
} from 'vue';
import {
    createGalleryState,
    galleryReducer,
    type GalleryAction,
    type GalleryState,
    type SlideDirection,
} from '@lightgallery/headless';

/**
 * Reactivity adapter over the shared headless reducer (Vue ADR 0001 §2).
 *
 * The state lives in a `shallowRef` replaced WHOLESALE per dispatch — the
 * exact semantic of the reducer. Deliberately not `reactive()`: a deep
 * proxy over headless state would (a) hand consumers a mutable surface
 * into reducer-owned objects and (b) proxy every slide object for no
 * benefit, since transitions always produce a fresh state. Narrow
 * `computed()` selectors are the subscription surface — consumers track
 * exactly what they render (the Vue expression of the React context split
 * / Angular narrow-selector rule).
 */
export interface GalleryStore {
    readonly state: Readonly<ShallowRef<GalleryState>>;
    readonly isOpen: ComputedRef<boolean>;
    readonly currentIndex: ComputedRef<number>;
    readonly previousIndex: ComputedRef<number>;
    readonly slidesCount: ComputedRef<number>;
    readonly loop: ComputedRef<boolean>;
    readonly transitioning: ComputedRef<boolean>;
    readonly slideDirection: ComputedRef<SlideDirection | undefined>;
    readonly loadedSlides: ComputedRef<ReadonlySet<number>>;
    readonly galleryOn: ComputedRef<boolean>;
    dispatch(action: GalleryAction): void;
    open(index?: number): void;
    close(): void;
    next(): void;
    prev(): void;
    goTo(index: number, direction?: SlideDirection): void;
    setSlidesCount(count: number): void;
    setLoop(loop: boolean): void;
}

export function createGalleryStore(): GalleryStore {
    const state = shallowRef<GalleryState>(
        createGalleryState({ slidesCount: 0 }),
    );

    const dispatch = (action: GalleryAction): void => {
        state.value = galleryReducer(state.value, action);
    };

    return {
        state,
        isOpen: computed(() => state.value.open),
        currentIndex: computed(() => state.value.currentIndex),
        previousIndex: computed(() => state.value.previousIndex),
        slidesCount: computed(() => state.value.slidesCount),
        loop: computed(() => state.value.loop),
        transitioning: computed(() => state.value.transitioning),
        slideDirection: computed(() => state.value.slideDirection),
        loadedSlides: computed(() => state.value.loadedSlides),
        galleryOn: computed(() => state.value.galleryOn),
        dispatch,
        open: (index) => dispatch({ type: 'OPEN', index }),
        close: () => dispatch({ type: 'CLOSE' }),
        next: () => dispatch({ type: 'NEXT' }),
        prev: () => dispatch({ type: 'PREV' }),
        goTo: (index, direction) =>
            dispatch({ type: 'GO_TO', index, direction }),
        setSlidesCount: (count) =>
            dispatch({ type: 'SET_SLIDES_COUNT', count }),
        setLoop: (loop) => dispatch({ type: 'SET_LOOP', loop }),
    };
}

/** Imperative surface exposed by `<LightGallery>` (ADR §3). */
export interface LgGalleryActions {
    openGallery(index?: number): void;
    closeGallery(): void;
    goToSlide(index: number): void;
    nextSlide(): void;
    prevSlide(): void;
    /** API parity with vanilla; updates are prop-driven in Vue. */
    refresh(): void;
}

/**
 * Typed injection keys — the context split (ADR §2): selectors and actions
 * under separate keys so slot/plugin consumers inject only what they track.
 */
export const LG_STORE: InjectionKey<GalleryStore> = Symbol('lgStore');
export const LG_ACTIONS: InjectionKey<LgGalleryActions> =
    Symbol('lgActions');
