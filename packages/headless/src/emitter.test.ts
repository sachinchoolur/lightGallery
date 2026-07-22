import { describe, expect, it, vi } from 'vitest';

import { createEmitter } from './emitter';

interface TestMap {
    afterSlide: { index: number };
    beforeOpen: undefined;
}

describe('createEmitter', () => {
    it('delivers typed payloads to subscribers', () => {
        const emitter = createEmitter<TestMap>();
        const listener = vi.fn();
        emitter.on('afterSlide', listener);
        emitter.emit('afterSlide', { index: 2 });
        expect(listener).toHaveBeenCalledWith({ index: 2 });
    });

    it('unsubscribes via the returned function', () => {
        const emitter = createEmitter<TestMap>();
        const listener = vi.fn();
        const off = emitter.on('beforeOpen', listener);
        off();
        emitter.emit('beforeOpen', undefined);
        expect(listener).not.toHaveBeenCalled();
    });

    it('supports plugin-private event names outside the map', () => {
        const emitter = createEmitter<TestMap>();
        const listener = vi.fn();
        emitter.on('rotateLeft', listener);
        emitter.emit('rotateLeft', { rotate: -90 });
        expect(listener).toHaveBeenCalledWith({ rotate: -90 });
    });

    it('is safe to unsubscribe from inside a listener', () => {
        const emitter = createEmitter<TestMap>();
        const calls: string[] = [];
        const offA: (() => void)[] = [];
        offA.push(
            emitter.on('beforeOpen', () => {
                calls.push('a');
                offA[0]!();
            }),
        );
        emitter.on('beforeOpen', () => calls.push('b'));
        emitter.emit('beforeOpen', undefined);
        emitter.emit('beforeOpen', undefined);
        expect(calls).toEqual(['a', 'b', 'b']);
    });

    it('ignores emits with no subscribers', () => {
        const emitter = createEmitter<TestMap>();
        expect(() =>
            emitter.emit('afterSlide', { index: 0 }),
        ).not.toThrow();
    });
});
