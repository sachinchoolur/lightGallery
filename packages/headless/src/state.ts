import { clampIndex } from './index';

/**
 * Framework-free gallery state machine. React (and later Angular/Vue) wrap
 * this with their own reactivity; every transition lives here so behavior is
 * identical across frameworks and testable without any DOM.
 */

export interface GalleryState {
    open: boolean;
    currentIndex: number;
    previousIndex: number;
    slidesCount: number;
    loop: boolean;
}

export type GalleryAction =
    | { type: 'OPEN'; index?: number }
    | { type: 'CLOSE' }
    | { type: 'GO_TO'; index: number }
    | { type: 'NEXT' }
    | { type: 'PREV' }
    | { type: 'SET_SLIDES_COUNT'; count: number };

export interface CreateGalleryStateOptions {
    slidesCount: number;
    loop?: boolean;
    index?: number;
}

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
    };
}

function goTo(state: GalleryState, rawIndex: number): GalleryState {
    const index = clampIndex(rawIndex, state.slidesCount, state.loop);
    if (index === state.currentIndex) {
        return state;
    }
    return {
        ...state,
        previousIndex: state.currentIndex,
        currentIndex: index,
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
            };
        }
        case 'CLOSE':
            return state.open ? { ...state, open: false } : state;
        case 'GO_TO':
            return goTo(state, action.index);
        case 'NEXT': {
            // At the last slide without loop, stay put (slide-end animation
            // is a rendering concern; the state must not wrap).
            if (
                !state.loop &&
                state.currentIndex >= state.slidesCount - 1
            ) {
                return state;
            }
            return goTo(state, state.currentIndex + 1);
        }
        case 'PREV': {
            if (!state.loop && state.currentIndex <= 0) {
                return state;
            }
            return goTo(state, state.currentIndex - 1);
        }
        case 'SET_SLIDES_COUNT': {
            const slidesCount = Math.max(0, action.count);
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
            };
        }
    }
}
