import { computed, Injectable, signal } from '@angular/core';
import {
    createGalleryState,
    galleryReducer,
    type GalleryAction,
    type GalleryState,
    type SlideDirection,
} from '@lightgallery/headless';

/**
 * Signals store over the shared headless reducer (ADR 0001 §2). Provided
 * per gallery instance via the component's `providers` — never root.
 *
 * The reducer stays the single source of truth; this class is dispatch
 * plumbing plus narrow `computed()` selectors so consumers subscribe to
 * exactly what they render (the Angular analog of the React context
 * split). Zoneless by construction: signals drive change detection.
 */
@Injectable()
export class LightGalleryStore {
    private readonly stateSignal = signal<GalleryState>(
        createGalleryState({ slidesCount: 0 }),
    );

    readonly state = this.stateSignal.asReadonly();
    readonly isOpen = computed(() => this.stateSignal().open);
    readonly currentIndex = computed(() => this.stateSignal().currentIndex);
    readonly previousIndex = computed(() => this.stateSignal().previousIndex);
    readonly slidesCount = computed(() => this.stateSignal().slidesCount);
    readonly loop = computed(() => this.stateSignal().loop);
    readonly transitioning = computed(() => this.stateSignal().transitioning);
    readonly slideDirection = computed(
        () => this.stateSignal().slideDirection,
    );
    readonly loadedSlides = computed(() => this.stateSignal().loadedSlides);
    readonly galleryOn = computed(() => this.stateSignal().galleryOn);

    dispatch(action: GalleryAction): void {
        this.stateSignal.set(galleryReducer(this.stateSignal(), action));
    }

    open(index?: number): void {
        this.dispatch({ type: 'OPEN', index });
    }

    close(): void {
        this.dispatch({ type: 'CLOSE' });
    }

    next(): void {
        this.dispatch({ type: 'NEXT' });
    }

    prev(): void {
        this.dispatch({ type: 'PREV' });
    }

    goTo(index: number, direction?: SlideDirection): void {
        this.dispatch({ type: 'GO_TO', index, direction });
    }

    setSlidesCount(count: number): void {
        this.dispatch({ type: 'SET_SLIDES_COUNT', count });
    }

    setLoop(loop: boolean): void {
        this.dispatch({ type: 'SET_LOOP', loop });
    }
}
