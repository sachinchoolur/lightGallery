import { clampIndex } from './index';

/**
 * Framework-free gallery state machine. React (and later Angular/Vue) wrap
 * this with their own reactivity; every transition lives here so behavior is
 * identical across frameworks and testable without any DOM.
 */

export type SlideDirection = 'next' | 'prev';

export interface GalleryState {
    open: boolean;
    currentIndex: number;
    previousIndex: number;
    slidesCount: number;
    loop: boolean;
    /**
     * True once any slide media has finished loading (or failed) since the
     * gallery opened — 2.x `lGalleryOn`. Distinguishes the first slide
     * (backdrop/zoom entrance, no slide animation) from navigation.
     */
    galleryOn: boolean;
    /**
     * True while a slide transition runs — 2.x `lgBusy`. Navigation actions
     * are ignored until `TRANSITION_END`.
     */
    transitioning: boolean;
    /** Direction of the last navigation; drives prev/next slide classes. */
    slideDirection?: SlideDirection;
    /** Indexes whose media has fully loaded (`lg-complete`). */
    loadedSlides: ReadonlySet<number>;
}

export type GalleryAction =
    | { type: 'OPEN'; index?: number }
    | { type: 'CLOSE' }
    | { type: 'GO_TO'; index: number; direction?: SlideDirection }
    | { type: 'NEXT' }
    | { type: 'PREV' }
    | { type: 'SET_SLIDES_COUNT'; count: number }
    | { type: 'SET_LOOP'; loop: boolean }
    | { type: 'SLIDE_LOADED'; index: number }
    | { type: 'SLIDE_ERROR'; index: number }
    | { type: 'TRANSITION_END' };

export interface CreateGalleryStateOptions {
    slidesCount: number;
    loop?: boolean;
    index?: number;
}

const EMPTY_LOADED: ReadonlySet<number> = new Set();

export function createGalleryState(
    options: CreateGalleryStateOptions,
): GalleryState {
    const loop = options.loop ?? true;
    const index = clampIndex(options.index ?? 0, options.slidesCount, false);
    return {
        open: false,
        currentIndex: index,
        previousIndex: index,
        slidesCount: options.slidesCount,
        loop,
        galleryOn: false,
        transitioning: false,
        slideDirection: undefined,
        loadedSlides: EMPTY_LOADED,
    };
}

function goTo(
    state: GalleryState,
    rawIndex: number,
    direction?: SlideDirection,
): GalleryState {
    // A slide transition is in progress — 2.x `lgBusy` parity: ignore
    // navigation until it settles.
    if (state.transitioning) {
        return state;
    }
    const index = clampIndex(rawIndex, state.slidesCount, state.loop);
    if (index === state.currentIndex) {
        return state;
    }
    return {
        ...state,
        previousIndex: state.currentIndex,
        currentIndex: index,
        // The first slide render (right after OPEN) is not a transition.
        transitioning: state.open && state.galleryOn,
        slideDirection:
            direction ?? (index > state.currentIndex ? 'next' : 'prev'),
    };
}

export function galleryReducer(
    state: GalleryState,
    action: GalleryAction,
): GalleryState {
    switch (action.type) {
        case 'OPEN': {
            const index = clampIndex(
                action.index ?? state.currentIndex,
                state.slidesCount,
                false,
            );
            return {
                ...state,
                open: true,
                currentIndex: index,
                previousIndex: index,
                galleryOn: false,
                transitioning: false,
                slideDirection: undefined,
                loadedSlides: EMPTY_LOADED,
            };
        }
        case 'CLOSE':
            if (!state.open) {
                return state;
            }
            // Slide content unmounts on close, so load state resets too.
            return {
                ...state,
                open: false,
                galleryOn: false,
                transitioning: false,
                slideDirection: undefined,
                loadedSlides: EMPTY_LOADED,
            };
        case 'GO_TO':
            return goTo(state, action.index, action.direction);
        case 'NEXT': {
            // At the last slide without loop, stay put (slide-end animation
            // is a rendering concern; the state must not wrap).
            if (
                !state.loop &&
                state.currentIndex >= state.slidesCount - 1
            ) {
                return state;
            }
            return goTo(state, state.currentIndex + 1, 'next');
        }
        case 'PREV': {
            if (!state.loop && state.currentIndex <= 0) {
                return state;
            }
            return goTo(state, state.currentIndex - 1, 'prev');
        }
        case 'SET_SLIDES_COUNT': {
            const slidesCount = Math.max(0, action.count);
            if (slidesCount === state.slidesCount) {
                return state;
            }
            const loadedSlides = new Set(
                [...state.loadedSlides].filter((idx) => idx < slidesCount),
            );
            return {
                ...state,
                slidesCount,
                currentIndex: clampIndex(
                    state.currentIndex,
                    slidesCount,
                    false,
                ),
                previousIndex: clampIndex(
                    state.previousIndex,
                    slidesCount,
                    false,
                ),
                loadedSlides,
            };
        }
        case 'SET_LOOP':
            if (state.loop === action.loop) {
                return state;
            }
            return { ...state, loop: action.loop };
        case 'SLIDE_LOADED': {
            if (state.loadedSlides.has(action.index)) {
                return state;
            }
            const loadedSlides = new Set(state.loadedSlides);
            loadedSlides.add(action.index);
            return { ...state, loadedSlides, galleryOn: true };
        }
        case 'SLIDE_ERROR':
            // The slide shows an error message instead of media; the gallery
            // still counts as running so navigation animates normally.
            if (state.galleryOn) {
                return state;
            }
            return { ...state, galleryOn: true };
        case 'TRANSITION_END':
            if (!state.transitioning) {
                return state;
            }
            return { ...state, transitioning: false };
    }
}
