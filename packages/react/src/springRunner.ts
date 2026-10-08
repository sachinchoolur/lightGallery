import {
    isSpringSettled,
    stepSpring,
    type SpringConfig,
    type SpringState,
} from '@lightgallery/headless';

/**
 * rAF driver for the shared spring math: advances one spring per track
 * each frame and hands the values to the caller's DOM writer. The math
 * (and therefore the feel) lives in @lightgallery/headless; this file
 * only owns scheduling.
 */

export interface SpringTrack extends SpringConfig {
    from: number;
    /** Seed velocity, px/ms — the gesture's windowed release velocity. */
    velocity: number;
    target: number;
}

/** Frame gap clamp so a background-tab pause cannot teleport a spring. */
const MAX_FRAME_MS = 64;

export function runSprings(
    tracks: SpringTrack[],
    onFrame: (values: number[]) => void,
    onDone?: () => void,
): () => void {
    let raf = 0;
    let last = Date.now();
    const states: SpringState[] = tracks.map((t) => ({
        position: t.from,
        velocity: t.velocity,
    }));
    const frame = () => {
        // Date.now over the rAF timestamp: one clock for seeding and
        // stepping (and the one fake timers drive in tests). Clamp into
        // [0, MAX]: a paused tab cannot teleport the spring and a
        // non-monotonic reading cannot blow it up (negative dt turns
        // the decay exponential).
        const now = Date.now();
        const dt = Math.min(Math.max(now - last, 0), MAX_FRAME_MS);
        last = now;
        let settled = true;
        tracks.forEach((t, i) => {
            states[i] = stepSpring(states[i]!, t.target, dt, t);
            if (!isSpringSettled(states[i]!, t.target)) {
                settled = false;
            }
        });
        if (settled) {
            onFrame(tracks.map((t) => t.target));
            onDone?.();
            return;
        }
        onFrame(states.map((s) => s.position));
        raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
}
