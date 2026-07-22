/**
 * Framework-free typed event emitter — the plugin/core event bus shared by
 * every framework runtime (React ADR 0001 §1 boundary note; Angular ADR
 * 0001 §5). Each framework supplies its own event map type; unknown event
 * names stay usable for plugin-private events.
 */

type Listener = (detail: never) => void;

export interface TypedEmitter<TMap extends object> {
    /** Subscribe; returns the unsubscribe function. */
    on<K extends keyof TMap & string>(
        name: K,
        listener: (detail: TMap[K]) => void,
    ): () => void;
    on(name: string, listener: (detail: unknown) => void): () => void;
    emit<K extends keyof TMap & string>(name: K, detail: TMap[K]): void;
    emit(name: string, detail?: unknown): void;
}

export function createEmitter<TMap extends object>(): TypedEmitter<TMap> {
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
