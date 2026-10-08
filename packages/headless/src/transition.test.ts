import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { onTransitionSettle, type TransitionSettleEvent } from './transition';

interface FakeEvent extends TransitionSettleEvent {
    type: string;
}
type Listener = (event: FakeEvent) => void;

/** Minimal bubbling event target — the helper reads target + propertyName. */
class FakeElement {
    private listeners = new Map<string, Set<Listener>>();
    constructor(private parent: FakeElement | null = null) {}
    addEventListener(type: string, listener: Listener): void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)!.add(listener);
    }
    removeEventListener(type: string, listener: Listener): void {
        this.listeners.get(type)?.delete(listener);
    }
    dispatchEvent(event: FakeEvent): boolean {
        event.target = this;
        this.bubble(event);
        return true;
    }
    private bubble(event: FakeEvent): void {
        this.listeners.get(event.type)?.forEach((fn) => fn(event));
        this.parent?.bubble(event);
    }
    fire(type: string, propertyName: string): void {
        this.dispatchEvent({ type, propertyName, target: null });
    }
}

describe('onTransitionSettle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it('settles on the fallback timer when no transition ever starts', () => {
        const el = new FakeElement();
        const cb = vi.fn();
        onTransitionSettle(el, 'transform', 500, cb);
        vi.advanceTimersByTime(499);
        expect(cb).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('re-bases the timer on transitionstart and settles on transitionend', () => {
        const el = new FakeElement();
        const cb = vi.fn();
        onTransitionSettle(el, 'transform', 500, cb);
        // The transition starts late (busy main thread): the fixed
        // offset must NOT fire while it is still running.
        vi.advanceTimersByTime(300);
        el.fire('transitionstart', 'transform');
        vi.advanceTimersByTime(400);
        expect(cb).not.toHaveBeenCalled();
        el.fire('transitionend', 'transform');
        expect(cb).toHaveBeenCalledTimes(1);
        // Settled once: the re-based timer is gone.
        vi.advanceTimersByTime(1000);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('still settles from the re-based timer when transitionend is lost', () => {
        const el = new FakeElement();
        const cb = vi.fn();
        onTransitionSettle(el, 'transform', 500, cb);
        vi.advanceTimersByTime(300);
        el.fire('transitionstart', 'transform');
        vi.advanceTimersByTime(499);
        expect(cb).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('ignores other properties and events bubbling from descendants', () => {
        const el = new FakeElement();
        const child = new FakeElement(el);
        const cb = vi.fn();
        onTransitionSettle(el, 'transform', 500, cb);
        el.fire('transitionend', 'opacity');
        child.fire('transitionend', 'transform');
        expect(cb).not.toHaveBeenCalled();
        // A descendant's start must not re-base the timer either.
        child.fire('transitionstart', 'transform');
        vi.advanceTimersByTime(500);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('never calls back after dispose', () => {
        const el = new FakeElement();
        const cb = vi.fn();
        const dispose = onTransitionSettle(el, 'transform', 500, cb);
        dispose();
        el.fire('transitionend', 'transform');
        vi.advanceTimersByTime(1000);
        expect(cb).not.toHaveBeenCalled();
    });
});
