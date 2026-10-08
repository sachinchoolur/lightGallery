import { describe, expect, it } from 'vitest';

import {
    SPRING_BOUNCE_DAMPING,
    isSpringSettled,
    project,
    stepSpring,
    type SpringState,
} from './spring';

function run(
    initial: SpringState,
    target: number,
    config?: Parameters<typeof stepSpring>[3],
): { states: SpringState[]; settledAt: number } {
    let state = initial;
    const states: SpringState[] = [state];
    for (let frame = 1; frame <= 300; frame++) {
        state = stepSpring(state, target, 16, config);
        states.push(state);
        if (isSpringSettled(state, target)) {
            return { states, settledAt: frame * 16 };
        }
    }
    return { states, settledAt: Infinity };
}

describe('project', () => {
    it('projects by the deceleration-rate series', () => {
        // 1 px/ms at the default rate travels 0.995/0.005 = 199px.
        expect(project(1)).toBeCloseTo(199, 5);
        expect(project(-0.5)).toBeCloseTo(-99.5, 5);
        expect(project(0)).toBe(0);
    });
});

describe('spring stepper', () => {
    it('settles to the target without overshoot at damping 1', () => {
        const { states, settledAt } = run({ position: 200, velocity: 0 }, 0);
        expect(settledAt).toBeLessThan(1000);
        // Monotonic approach: never crosses the target.
        for (const s of states) {
            expect(s.position).toBeGreaterThanOrEqual(-0.31);
        }
    });

    it('overshoots once and returns at bounce damping', () => {
        const { states, settledAt } = run({ position: 200, velocity: 0 }, 0, {
            dampingRatio: SPRING_BOUNCE_DAMPING,
        });
        expect(settledAt).toBeLessThan(1200);
        const min = Math.min(...states.map((s) => s.position));
        expect(min).toBeLessThan(-1); // crossed past the target...
        expect(min).toBeGreaterThan(-40); // ...but modestly
    });

    it('carries seeded release velocity through the boundary', () => {
        // At the target but moving away fast: the spring must travel
        // WITH the velocity first, then come back.
        const { states } = run({ position: 0, velocity: 1 }, 0);
        const max = Math.max(...states.map((s) => s.position));
        expect(max).toBeGreaterThan(20);
        expect(states[1]!.position).toBeGreaterThan(0);
    });

    it('is step-size independent (closed form)', () => {
        const config = { dampingRatio: 0.82 };
        let a: SpringState = { position: 100, velocity: -0.4 };
        for (let i = 0; i < 10; i++) {
            a = stepSpring(a, 0, 16, config);
        }
        let b: SpringState = { position: 100, velocity: -0.4 };
        for (let i = 0; i < 40; i++) {
            b = stepSpring(b, 0, 4, config);
        }
        expect(a.position).toBeCloseTo(b.position, 6);
        expect(a.velocity).toBeCloseTo(b.velocity, 6);
    });

    it('reports settled only near-rest at the target', () => {
        expect(isSpringSettled({ position: 0.1, velocity: 0.001 }, 0)).toBe(
            true,
        );
        expect(isSpringSettled({ position: 5, velocity: 0 }, 0)).toBe(false);
        expect(isSpringSettled({ position: 0, velocity: 0.5 }, 0)).toBe(false);
    });
});
