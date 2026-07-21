import { describe, expect, it } from 'vitest';

import {
    getHorizontalDragTransforms,
    getSwipeAxis,
    getSwipeReleaseVerdict,
    getVerticalDragEffects,
    removePointer,
    resolveSwipeTarget,
    shouldCloseOnVerticalDrag,
    upsertPointer,
} from './gestures';

describe('getSwipeAxis', () => {
    it('commits to an axis only past the 15px threshold', () => {
        expect(getSwipeAxis(10, 5, undefined)).toBeUndefined();
        expect(getSwipeAxis(16, 5, undefined)).toBe('horizontal');
        expect(getSwipeAxis(-20, 5, undefined)).toBe('horizontal');
        expect(getSwipeAxis(5, 16, undefined)).toBe('vertical');
    });

    it('is sticky once committed', () => {
        expect(getSwipeAxis(0, 100, 'horizontal')).toBe('horizontal');
        expect(getSwipeAxis(100, 0, 'vertical')).toBe('vertical');
    });
});

describe('getHorizontalDragTransforms', () => {
    it('moves the current slide by the delta and neighbors with a gutter', () => {
        const transforms = getHorizontalDragTransforms(-100, 1000);
        // gutter = 150 - 10 = 140
        expect(transforms.current).toBe('translate3d(-100px, 0px, 0px)');
        expect(transforms.prev).toBe('translate3d(-1240px, 0px, 0px)');
        expect(transforms.next).toBe('translate3d(1040px, 0px, 0px)');
    });

    it('shrinks the gutter as the drag grows', () => {
        const near = getHorizontalDragTransforms(-10, 1000);
        const far = getHorizontalDragTransforms(-500, 1000);
        // gutter: 149 vs 100
        expect(near.next).toBe('translate3d(1139px, 0px, 0px)');
        expect(far.next).toBe('translate3d(600px, 0px, 0px)');
    });
});

describe('getVerticalDragEffects', () => {
    it('fades the backdrop and shrinks the slide with the drag', () => {
        const effects = getVerticalDragEffects(200, 1000, 800);
        expect(effects.backdropOpacity).toBeCloseTo(0.75);
        expect(effects.transform).toBe(
            'translate3d(0px, 200px, 0px) scale3d(0.9, 0.9, 1)',
        );
        expect(effects.hideUi).toBe(true);
    });

    it('keeps the UI until the close threshold', () => {
        expect(getVerticalDragEffects(80, 1000, 800).hideUi).toBe(false);
        expect(getVerticalDragEffects(-150, 1000, 800).hideUi).toBe(true);
    });
});

describe('getSwipeReleaseVerdict', () => {
    const threshold = 50;

    it('navigates past the distance threshold (negative delta = next)', () => {
        expect(
            getSwipeReleaseVerdict({ deltaX: -60, durationMs: 500, threshold }),
        ).toBe('next');
        expect(
            getSwipeReleaseVerdict({ deltaX: 60, durationMs: 500, threshold }),
        ).toBe('prev');
    });

    it('snaps back below the threshold at slow speed', () => {
        expect(
            getSwipeReleaseVerdict({ deltaX: -40, durationMs: 400, threshold }),
        ).toBe('stay');
    });

    it('honors quick flicks below the distance threshold', () => {
        // 40px in 80ms = 0.5 px/ms > FLICK_VELOCITY
        expect(
            getSwipeReleaseVerdict({ deltaX: -40, durationMs: 80, threshold }),
        ).toBe('next');
        // ...but never for tiny travels (taps)
        expect(
            getSwipeReleaseVerdict({ deltaX: -10, durationMs: 10, threshold }),
        ).toBe('stay');
    });
});

describe('shouldCloseOnVerticalDrag', () => {
    const settings = { closable: true, swipeToClose: true };

    it('closes past 100px when closable and swipeToClose', () => {
        expect(shouldCloseOnVerticalDrag(150, settings)).toBe(true);
        expect(shouldCloseOnVerticalDrag(-150, settings)).toBe(true);
        expect(shouldCloseOnVerticalDrag(80, settings)).toBe(false);
    });

    it('never closes when disabled', () => {
        expect(
            shouldCloseOnVerticalDrag(200, { ...settings, closable: false }),
        ).toBe(false);
        expect(
            shouldCloseOnVerticalDrag(200, {
                ...settings,
                swipeToClose: false,
            }),
        ).toBe(false);
    });
});

describe('resolveSwipeTarget', () => {
    it('steps within bounds', () => {
        expect(resolveSwipeTarget('next', 1, 5, false)).toBe(2);
        expect(resolveSwipeTarget('prev', 1, 5, false)).toBe(0);
        expect(resolveSwipeTarget('stay', 1, 5, true)).toBeNull();
    });

    it('wraps at the ends only with loop and 3+ slides (2.x touch rule)', () => {
        expect(resolveSwipeTarget('next', 4, 5, true)).toBe(0);
        expect(resolveSwipeTarget('prev', 0, 5, true)).toBe(4);
        expect(resolveSwipeTarget('next', 4, 5, false)).toBeNull();
        expect(resolveSwipeTarget('next', 1, 2, true)).toBeNull();
        expect(resolveSwipeTarget('prev', 0, 2, true)).toBeNull();
    });
});

describe('pointer bookkeeping', () => {
    it('upserts and removes pointer records immutably', () => {
        const a = { id: 1, startX: 0, startY: 0, x: 0, y: 0 };
        const one = upsertPointer([], a);
        const two = upsertPointer(one, {
            id: 2,
            startX: 5,
            startY: 5,
            x: 5,
            y: 5,
        });
        expect(two).toHaveLength(2);
        expect(one).toHaveLength(1);

        const moved = upsertPointer(two, { ...a, x: 10 });
        expect(moved).toHaveLength(2);
        expect(moved[0]!.x).toBe(10);
        expect(two[0]!.x).toBe(0);

        expect(removePointer(moved, 1).map((p) => p.id)).toEqual([2]);
    });
});
