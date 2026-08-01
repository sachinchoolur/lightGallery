/**
 * v2 zoom wiring around the shared @lightgallery/headless math. The math
 * itself is canonically tested in packages/headless/src/zoom-math.test.ts,
 * and headless-ratchet.test.ts guards against local reimplementations —
 * these cover the v2-side adapters.
 */
import Zoom from '../src/plugins/zoom/lg-zoom';

import '@testing-library/jest-dom';

const clampPinchPan = Zoom.prototype.clampPinchPan as (
    this: unknown,
    pan: { x: number; y: number },
    scale: number,
) => { x: number; y: number };

const makeClampThis = (bottom: number) => ({
    core: {
        getSlideItem: () => ({
            find: () => ({
                first: () => ({
                    get: () => ({ offsetWidth: 800, offsetHeight: 600 }),
                }),
            }),
        }),
        mediaContainerPosition: { top: 0, bottom },
    },
    containerRect: { width: 1000, height: 800 },
    // Private stage clamp, borrowed off the prototype like the adapter.
    clampPanToStage: (Zoom.prototype as unknown as Record<string, unknown>)[
        'clampPanToStage'
    ],
});
const clampThis = makeClampThis(0);

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

    it('extends the pan-up floor by the vacated components strip', () => {
        // Same geometry with a 120px strip below the content box: the
        // pan-up floor sits 120px earlier — the image's bottom edge
        // stops flush with the SCREEN bottom (content bottom + strip)
        // instead of exposing the vacated strip; the downward bound is
        // unchanged.
        const stageThis = makeClampThis(120);
        expect(clampPinchPan.call(stageThis, { x: 0, y: -500 }, 2)).toEqual({
            x: 0,
            y: -80,
        });
        expect(clampPinchPan.call(stageThis, { x: 0, y: 500 }, 2)).toEqual({
            x: 0,
            y: 200,
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
