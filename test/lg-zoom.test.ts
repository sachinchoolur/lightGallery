/**
 * v2 zoom wiring around the shared @lightgallery/headless math. The math
 * itself is canonically tested in packages/headless/src/zoom-math.test.ts —
 * these cover the v2-side adapters and guard against the shared functions
 * being reimplemented locally again.
 */
import Zoom from '../src/plugins/zoom/lg-zoom';

import '@testing-library/jest-dom';

// ts-jest compiles with the DOM-only root tsconfig (`types: []`) —
// declare the node bits the ratchet needs instead of adding @types/node
// to the whole program.
declare const require: (id: string) => {
    readFileSync(p: string, enc: string): string;
    resolve(...parts: string[]): string;
};
declare const __dirname: string;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const clampPinchPan = Zoom.prototype.clampPinchPan as (
    this: unknown,
    pan: { x: number; y: number },
    scale: number,
) => { x: number; y: number };

const clampThis = {
    core: {
        getSlideItem: () => ({
            find: () => ({
                first: () => ({
                    get: () => ({ offsetWidth: 800, offsetHeight: 600 }),
                }),
            }),
        }),
    },
    containerRect: { width: 1000, height: 800 },
};

const actualSizeScale = Zoom.prototype.getActualSizeScale as (
    this: unknown,
    naturalWidth: number,
    width: number,
) => number;

describe('pinch pan clamp adapter', () => {
    it('measures the layout size and clamps via the shared bounds', () => {
        // 800x600 at x2 in a 1000x800 stage → bounds ±300 x, ±200 y.
        expect(clampPinchPan.call(clampThis, { x: 500, y: -500 }, 2)).toEqual({
            x: 300,
            y: -200,
        });
        expect(clampPinchPan.call(clampThis, { x: 100, y: 50 }, 2)).toEqual({
            x: 100,
            y: 50,
        });
        expect(clampPinchPan.call(clampThis, { x: 50, y: 40 }, 1)).toEqual({
            x: 0,
            y: 0,
        });
    });
});

describe('actual-size scale adapter', () => {
    it('delegates the shared math and keeps the 2.x upscale floor', () => {
        expect(actualSizeScale.call(null, 1600, 800)).toBe(2);
        expect(actualSizeScale.call(null, 1600, 0)).toBe(2);
        // Documented deviation: rendered above natural never dips below 1.
        expect(actualSizeScale.call(null, 400, 800)).toBe(1);
    });
});

describe('headless math stays imported (resurrection ratchet)', () => {
    it('keeps the deleted local reimplementations deleted', () => {
        const src: string = fs.readFileSync(
            path.resolve(__dirname, '../src/plugins/zoom/lg-zoom.ts'),
            'utf8',
        );
        // Distinctive fragments of the math that moved to
        // @lightgallery/headless — reappearing here means someone forked
        // the shared behavior again.
        for (const fragment of [
            'endDist / startDist', // pinch distance-ratio scale
            'speedX', // pan-release momentum speeds
            '/ touchDuration + 1',
            'Math.max(0.5,', // elastic pinch floor
            '(point.x - startPan.x)', // focal projection
        ]) {
            expect(src).not.toContain(fragment);
        }
    });
});
