/**
 * Gesture-release physics: momentum projection and a damped-spring
 * stepper. Releases compute where momentum would land (`project`),
 * clamp that into bounds, and animate there with a spring seeded by the
 * live release velocity — velocity stays continuous across the
 * finger-lift boundary, which is most of what native feel is.
 *
 * The stepper advances the standard damped harmonic oscillator by its
 * closed-form solution over each frame, so step size never affects the
 * trajectory and the state (position + velocity) can re-seed a new
 * spring at any interruption point.
 */

export interface SpringState {
    position: number;
    /** px per ms (same unit as the windowed gesture velocity). */
    velocity: number;
}

export interface SpringConfig {
    /** 1 = never overshoot; < 1 overshoots and returns. */
    dampingRatio?: number;
    /** Rad/s — higher settles faster. */
    naturalFrequency?: number;
}

/** Settling toward an in-bounds target: no overshoot. */
export const SPRING_SETTLE_DAMPING = 1;

/** Settling against a clamped bound: one soft bounce. */
export const SPRING_BOUNCE_DAMPING = 0.82;

export const SPRING_NATURAL_FREQUENCY = 12;

/**
 * Momentum projection: how far a release keeps traveling when it loses
 * `1 - decelerationRate` of its velocity every millisecond (the classic
 * scroll-view constant; 0.995 ≈ half a percent per ms).
 */
export const DECELERATION_RATE = 0.995;

export function project(
    velocity: number,
    decelerationRate: number = DECELERATION_RATE,
): number {
    return (velocity * decelerationRate) / (1 - decelerationRate);
}

/**
 * Advance a spring toward `target` by `dtMs`, exactly (closed form with
 * the current state as initial conditions).
 */
export function stepSpring(
    state: SpringState,
    target: number,
    dtMs: number,
    {
        dampingRatio = SPRING_SETTLE_DAMPING,
        naturalFrequency = SPRING_NATURAL_FREQUENCY,
    }: SpringConfig = {},
): SpringState {
    const t = dtMs / 1000;
    const w0 = naturalFrequency;
    const zeta = Math.min(dampingRatio, 1);
    const x0 = state.position - target;
    const v0 = state.velocity * 1000; // px/s for the oscillator
    const decay = Math.exp(-zeta * w0 * t);

    let x: number;
    let v: number;
    if (zeta < 1) {
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        const a = x0;
        const b = (v0 + zeta * w0 * x0) / wd;
        const cos = Math.cos(wd * t);
        const sin = Math.sin(wd * t);
        x = decay * (a * cos + b * sin);
        v =
            decay *
            ((b * wd - zeta * w0 * a) * cos - (a * wd + zeta * w0 * b) * sin);
    } else {
        const b = v0 + w0 * x0;
        x = decay * (x0 + b * t);
        v = decay * (b - w0 * (x0 + b * t));
    }
    return { position: target + x, velocity: v / 1000 };
}

/** Whether a spring is close enough to stop animating. */
export function isSpringSettled(
    state: SpringState,
    target: number,
    restDelta = 0.3,
    restVelocity = 0.012,
): boolean {
    return (
        Math.abs(state.position - target) < restDelta &&
        Math.abs(state.velocity) < restVelocity
    );
}
