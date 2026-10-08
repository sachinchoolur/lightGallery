import { describe, expect, it } from 'vitest';

import {
    getWindowedVelocity,
    pushVelocitySample,
    type VelocitySample,
} from './velocity';

function record(points: Array<[number, number, number]>): VelocitySample[] {
    let samples: VelocitySample[] = [];
    for (const [x, y, t] of points) {
        samples = pushVelocitySample(samples, { x, y, t });
    }
    return samples;
}

describe('windowed velocity', () => {
    it('reads the speed of the final window, not the whole gesture', () => {
        // Slow 100px over 1s, then a 48px burst in 48ms.
        const samples = record([
            [0, 0, 0],
            [50, 0, 500],
            [100, 0, 1000],
            [116, 0, 1016],
            [132, 0, 1032],
            [148, 0, 1048],
        ]);
        const v = getWindowedVelocity(samples, 1048);
        expect(v.x).toBeCloseTo(1, 5);
        expect(v.y).toBe(0);
    });

    it('reads zero after a pause-then-lift (stale samples pruned)', () => {
        const samples = record([
            [0, 0, 0],
            [80, 0, 100],
            [160, 0, 200],
        ]);
        // Finger rested 300ms before lifting: nothing in the window.
        expect(getWindowedVelocity(samples, 500)).toEqual({ x: 0, y: 0 });
    });

    it('reads zero for sub-pixel drift and single samples', () => {
        expect(
            getWindowedVelocity(
                record([
                    [0, 0, 0],
                    [0.5, 0.5, 50],
                ]),
                50,
            ),
        ).toEqual({ x: 0, y: 0 });
        expect(getWindowedVelocity(record([[10, 10, 0]]), 0)).toEqual({
            x: 0,
            y: 0,
        });
    });

    it('keeps the buffer pruned to the window', () => {
        const samples = record([
            [0, 0, 0],
            [10, 0, 40],
            [20, 0, 80],
            [30, 0, 120],
            [40, 0, 160],
        ]);
        // Everything older than 100ms behind the newest sample is gone.
        expect(samples[0]!.t).toBe(80);
        expect(samples.length).toBe(3);
    });

    it('reads zero when the window span is too short to measure', () => {
        // Two samples 0.4ms apart would read 150 px/ms — noise.
        expect(
            getWindowedVelocity(
                record([
                    [0, 0, 1000],
                    [60, 0, 1000.4],
                ]),
                1000.4,
            ),
        ).toEqual({ x: 0, y: 0 });
    });

    it('is signed per axis', () => {
        const samples = record([
            [100, 50, 0],
            [40, 90, 60],
        ]);
        const v = getWindowedVelocity(samples, 60);
        expect(v.x).toBeCloseTo(-1, 5);
        expect(v.y).toBeCloseTo(40 / 60, 5);
    });
});
