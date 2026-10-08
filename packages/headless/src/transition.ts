/**
 * Settle gate for a CSS transition: call back once the transition of
 * `property` on `element` has actually ended.
 *
 * A fixed timer measured from the moment the target value is applied
 * lands at the same wall-clock offset whether or not the transition has
 * started, but the transition only starts at the first style recalc
 * after the value lands — on a busy main thread (a gallery's first
 * layout, a big thumbnail decode) that can be well past the offset.
 * Anything gated on the fixed timer then fires mid-flight.
 *
 * Contract:
 * - No `transitionstart` within `fallbackMs` → the element is not
 *   transitioning (reduced motion, identity transform, no CSS) and the
 *   gate settles on the timer, exactly like the fixed timer did.
 * - `transitionstart` re-bases the timer on the real start; `transitionend`
 *   settles immediately. Interrupted transitions (`transitioncancel`)
 *   leave the timer running so a restart still settles in time.
 * - Events bubbling from descendants, or for other properties, are
 *   ignored. The callback runs at most once.
 *
 * Returns a disposer; disposing after settle is a no-op.
 */
export interface TransitionSettleEvent {
    target: unknown;
    propertyName?: string;
}

/** Structural slice of a DOM element: headless carries no DOM lib. */
export interface TransitionSettleTarget {
    addEventListener(
        type: string,
        listener: (event: TransitionSettleEvent) => void,
    ): void;
    removeEventListener(
        type: string,
        listener: (event: TransitionSettleEvent) => void,
    ): void;
}

export function onTransitionSettle(
    element: TransitionSettleTarget,
    property: string,
    fallbackMs: number,
    callback: () => void,
): () => void {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const isOwn = (event: TransitionSettleEvent) =>
        event.target === element && event.propertyName === property;
    const dispose = () => {
        clearTimeout(timer);
        element.removeEventListener('transitionstart', onStart);
        element.removeEventListener('transitionend', onEnd);
    };
    const settle = () => {
        if (settled) {
            return;
        }
        settled = true;
        dispose();
        callback();
    };
    const onStart = (event: TransitionSettleEvent) => {
        if (isOwn(event)) {
            clearTimeout(timer);
            timer = setTimeout(settle, fallbackMs);
        }
    };
    const onEnd = (event: TransitionSettleEvent) => {
        if (isOwn(event)) {
            settle();
        }
    };
    element.addEventListener('transitionstart', onStart);
    element.addEventListener('transitionend', onEnd);
    timer = setTimeout(settle, fallbackMs);
    return () => {
        settled = true;
        dispose();
    };
}
