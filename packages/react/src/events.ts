import type {
    SlideEventDetail,
    SlideItemLoadDetail,
} from './types';

/**
 * The internal event bus (ADR 0001 §5): core lifecycle events fan out to it
 * (alongside the public `onXxx` callback props), and plugins use it to talk
 * to each other (rotate → zoom) and to the core-adjacent components
 * (toolbar buttons → slide wrappers).
 */

export interface HasVideoDetail {
    index: number;
    src?: string;
    html5Video?: unknown;
    hasPoster: boolean;
}

/** Known event payloads; plugin-private events may use any other name. */
export interface LgEventMap {
    beforeOpen: undefined;
    afterOpen: undefined;
    beforeClose: undefined;
    afterClose: undefined;
    beforeSlide: SlideEventDetail;
    afterSlide: SlideEventDetail;
    slideItemLoad: SlideItemLoadDetail;
    posterClick: undefined;
    hasVideo: HasVideoDetail;
    dragStart: undefined;
    dragMove: undefined;
    dragEnd: undefined;
    init: unknown;
}

type Listener = (detail: never) => void;

export interface LgEventEmitter {
    /** Subscribe; returns the unsubscribe function. */
    on<K extends keyof LgEventMap>(
        name: K,
        listener: (detail: LgEventMap[K]) => void,
    ): () => void;
    on(name: string, listener: (detail: unknown) => void): () => void;
    emit<K extends keyof LgEventMap>(name: K, detail: LgEventMap[K]): void;
    emit(name: string, detail?: unknown): void;
}

export function createEmitter(): LgEventEmitter {
    const listeners = new Map<string, Set<Listener>>();
    return {
        on(name: string, listener: (detail: never) => void) {
            let set = listeners.get(name);
            if (!set) {
                set = new Set();
                listeners.set(name, set);
            }
            set.add(listener as Listener);
            return () => {
                set.delete(listener as Listener);
            };
        },
        emit(name: string, detail?: unknown) {
            const set = listeners.get(name);
            if (!set) {
                return;
            }
            // Copy so unsubscribing inside a listener is safe.
            [...set].forEach((listener) =>
                (listener as (d: unknown) => void)(detail),
            );
        },
    };
}
