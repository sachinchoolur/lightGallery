/**
 * Rolling-window velocity tracking. Release decisions must read the
 * velocity of the gesture's final instant, not its whole-gesture
 * average: a drag that pauses and then flicks reads fast, and a drag
 * that ends resting reads zero. Sessions push a sample per move; the
 * release reads the window ending at the release timestamp.
 */

export interface VelocitySample {
    x: number;
    y: number;
    /** Timestamp in ms (same clock as the release read). */
    t: number;
}

export interface Velocity {
    /** px/ms, signed. */
    x: number;
    y: number;
}

/** How far back a release looks when reading the gesture velocity. */
export const VELOCITY_WINDOW_MS = 100;

/** Below this displacement (px) an axis reads as at rest. */
const MIN_DISPLACEMENT = 1;

/**
 * Append a sample, pruning everything older than the window — the
 * buffer stays a handful of entries regardless of gesture length.
 */
export function pushVelocitySample(
    samples: readonly VelocitySample[],
    sample: VelocitySample,
    windowMs: number = VELOCITY_WINDOW_MS,
): VelocitySample[] {
    return [
        ...samples.filter((s) => sample.t - s.t <= windowMs),
        sample,
    ];
}

/**
 * Velocity (px/ms per axis) over the samples inside the window ending
 * at `releaseTime`. Fewer than two recent samples — the finger rested
 * before lifting — reads as zero, as does sub-pixel drift.
 */
export function getWindowedVelocity(
    samples: readonly VelocitySample[],
    releaseTime: number,
    windowMs: number = VELOCITY_WINDOW_MS,
): Velocity {
    const recent = samples.filter((s) => releaseTime - s.t <= windowMs);
    if (recent.length < 2) {
        return { x: 0, y: 0 };
    }
    const first = recent[0]!;
    const last = recent[recent.length - 1]!;
    const dt = last.t - first.t;
    if (dt <= 0) {
        return { x: 0, y: 0 };
    }
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    return {
        x: Math.abs(dx) > MIN_DISPLACEMENT ? dx / dt : 0,
        y: Math.abs(dy) > MIN_DISPLACEMENT ? dy / dt : 0,
    };
}
