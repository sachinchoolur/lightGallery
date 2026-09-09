import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';

const slides: GalleryItem[] = [
    { src: 'a.jpg', alt: 'a' },
    { src: 'b.jpg', alt: 'b' },
    { src: 'c.jpg', alt: 'c' },
    { src: 'd.jpg', alt: 'd' },
    { src: 'e.jpg', alt: 'e' },
];

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

/**
 * jsdom has no PointerEvent constructor; a MouseEvent with the pointer
 * fields defined on it walks and quacks enough for both React's synthetic
 * pointer events and our window-level listeners.
 */
function firePointer(
    target: EventTarget,
    type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
    init: { x?: number; y?: number; pointerId?: number; pointerType?: string },
) {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: init.x ?? 0,
        clientY: init.y ?? 0,
    });
    Object.defineProperty(event, 'pointerId', {
        value: init.pointerId ?? 1,
    });
    Object.defineProperty(event, 'pointerType', {
        value: init.pointerType ?? 'touch',
    });
    Object.defineProperty(event, 'isPrimary', {
        value: (init.pointerId ?? 1) === 1,
    });
    act(() => {
        target.dispatchEvent(event);
    });
}

function Harness({
    onClose,
    ...rest
}: Record<string, unknown> & { onClose?: () => void }) {
    const [open, setOpen] = useState(true);
    return (
        <LightGallery
            slides={slides}
            open={open}
            onClose={() => {
                setOpen(false);
                (onClose as (() => void) | undefined)?.();
            }}
            {...rest}
        />
    );
}

function openAndLoad(extraProps: Record<string, unknown> = {}) {
    const utils = render(<Harness {...extraProps} />);
    tick(450);
    fireEvent.load(screen.getByAltText('a'));
    return utils;
}

function currentSlide(): HTMLElement {
    return document.querySelector<HTMLElement>('.lg-item.lg-current')!;
}

function counterText(): string | undefined {
    return (
        document.querySelector('.lg-counter-current')?.textContent ?? undefined
    );
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    act(() => {
        vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
});

describe('tap release vs origin flight', () => {
    it('spares a flight-owned slide, still cleans the rest', () => {
        openAndLoad();
        const cur = currentSlide();
        const other =
            document.querySelectorAll<HTMLElement>('.lg-item')[1] ?? cur;
        // Simulate the backdrop-tap close interleave: the closing
        // transform is already painted (real events drain microtasks
        // between the outer closeOnTap listener and this window
        // release) when the tap's restore runs.
        cur.classList.add('lg-start-end-progress');
        cur.style.transform =
            'translate3d(-100px, -50px, 0) scale3d(0.2, 0.2, 1)';
        if (other !== cur) {
            other.style.transform = 'translate3d(50px, 0, 0)';
        }

        firePointer(cur, 'pointerdown', { x: 40, y: 200 });
        firePointer(window, 'pointerup', { x: 40, y: 200 });

        // The flight keeps its transform; stray drag leftovers clear.
        expect(cur.style.transform).toContain('scale3d(0.2');
        if (other !== cur) {
            expect(other.style.transform).toBe('');
        }
        cur.classList.remove('lg-start-end-progress');
        cur.style.transform = '';
    });
});

describe('horizontal swipe', () => {
    it('follows the finger with ref-written transforms and navigates past the threshold', () => {
        const onAfterSlide = vi.fn();
        openAndLoad({ onAfterSlide });

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        // Drag start assigns neighbor position classes for the drag.
        expect(document.querySelector('.lg-item.lg-next-slide')).not.toBeNull();

        firePointer(window, 'pointermove', { x: 180, y: 100 });
        expect(item.style.transform).toBe('translate3d(-20px, 0px, 0px)');
        expect(document.querySelector('.lg-outer')).toHaveClass('lg-dragging');

        firePointer(window, 'pointermove', { x: 120, y: 100 });
        firePointer(window, 'pointerup', { x: 120, y: 100 });

        // Inline transforms and drag classes are handed back to React.
        expect(item.style.transform).toBe('');
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-dragging',
        );
        expect(counterText()).toBe('2');

        tick(550);
        expect(onAfterSlide).toHaveBeenCalledWith({
            index: 1,
            prevIndex: 0,
            fromTouch: true,
            fromThumb: false,
        });
    });

    it('springs the slide change and restores the forced slide mode at settle', () => {
        // A non-slide mode: the commit must force lg-slide for the flight
        // and hand it back only when the spring settles (not on a timer).
        openAndLoad({ mode: 'lg-fade' });
        const item = currentSlide();
        // jsdom measures 0 — a real width routes the release through the
        // navigation spring instead of the degenerate fallback.
        Object.defineProperty(item, 'offsetWidth', {
            value: 400,
            configurable: true,
        });
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 120, y: 100 });
        firePointer(window, 'pointerup', { x: 120, y: 100 });

        // Navigation commits immediately...
        expect(counterText()).toBe('2');
        expect(document.querySelector('.lg-outer')).toHaveClass('lg-slide');
        // ...while the spring still owns the visuals: the outgoing slide
        // keeps its inline transform, transitions are opted out inline.
        expect(item.style.transform).not.toBe('');
        expect(item.style.transitionProperty).toBe('none');

        tick(2000);
        // Settle hands everything back to React.
        expect(item.style.transform).toBe('');
        expect(item.style.transitionProperty).toBe('');
        expect(document.querySelector('.lg-outer')).not.toHaveClass('lg-slide');
    });

    it('does not spring a vertical drag when the gallery cannot close', () => {
        // closable:false (the inline setup) forces swipeToClose off, so
        // the drag applied nothing; springing would jump the slide to the
        // drag offset and animate it back.
        openAndLoad({ closable: false });
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 200, y: 260 });
        expect(item.style.transform).toBe('');
        firePointer(window, 'pointerup', { x: 200, y: 260 });
        expect(item.style.transform).toBe('');
        tick(2000);
        expect(item.style.transform).toBe('');
    });

    it('still springs a vertical drag back when it can close', () => {
        openAndLoad();
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 200, y: 260 });
        expect(item.style.transform).not.toBe('');
        firePointer(window, 'pointerup', { x: 200, y: 260 });
        expect(item.style.transform).not.toBe('');
        tick(2000);
        expect(item.style.transform).toBe('');
    });

    it('snaps the released slide home before transitions come back', () => {
        // The inline transform has to go while transition-property is
        // still none. Handing back first animates the snap, and the
        // outgoing slide is seen drifting toward the centre while its
        // fade is still running.
        // A non-slide mode: the forced lg-slide geometry must be gone by
        // the hand-back too, or the slides animate between the two modes.
        openAndLoad({ mode: 'lg-fade' });
        const item = currentSlide();
        Object.defineProperty(item, 'offsetWidth', {
            value: 400,
            configurable: true,
        });
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 120, y: 100 });
        firePointer(window, 'pointerup', { x: 120, y: 100 });

        const outer = document.querySelector('.lg-outer')!;
        let transformAtHandback: string | undefined;
        let slideModeAtHandback: boolean | undefined;
        const realRemove = outer.classList.remove.bind(outer.classList);
        vi.spyOn(outer.classList, 'remove').mockImplementation(
            (...names: string[]) => {
                if (names.includes('lg-dragging')) {
                    transformAtHandback = item.style.transform;
                    slideModeAtHandback = outer.classList.contains('lg-slide');
                }
                realRemove(...names);
            },
        );

        tick(2000);
        expect(transformAtHandback).toBe('');
        expect(slideModeAtHandback).toBe(false);
        expect(item.style.transform).toBe('');
    });

    it('snaps back below the threshold', () => {
        openAndLoad();
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        // 18px: past the axis commit (10) but under both swipeThreshold and
        // the flick minimum distance — must snap back. (Tests run on real
        // performance.now, so any larger travel would count as a flick.)
        firePointer(window, 'pointermove', { x: 182, y: 100 });
        firePointer(window, 'pointerup', { x: 182, y: 100 });
        expect(counterText()).toBe('1');
        expect(item.style.transform).toBe('');
    });

    it('ignores drags that do not start on a slide', () => {
        openAndLoad();
        const toolbar = document.querySelector('.lg-toolbar')!;
        firePointer(toolbar, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointerup', { x: 100, y: 100 });
        expect(counterText()).toBe('1');
    });

    it('a second pointer suspends the swipe (reserved for pinch)', () => {
        openAndLoad();
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100, pointerId: 1 });
        firePointer(item, 'pointerdown', { x: 240, y: 100, pointerId: 2 });
        firePointer(window, 'pointermove', { x: 80, y: 100, pointerId: 1 });
        expect(item.style.transform).toBe('');
        firePointer(window, 'pointerup', { x: 80, y: 100, pointerId: 1 });
        firePointer(window, 'pointerup', { x: 240, y: 100, pointerId: 2 });
        expect(counterText()).toBe('1');
    });

    it('respects enableSwipe=false for touch but still allows mouse drag', () => {
        const onDragStart = vi.fn();
        openAndLoad({ enableSwipe: false, onDragStart });
        const item = currentSlide();

        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointerup', { x: 100, y: 100 });
        expect(counterText()).toBe('1');

        firePointer(item, 'pointerdown', {
            x: 200,
            y: 100,
            pointerType: 'mouse',
        });
        expect(onDragStart).toHaveBeenCalledTimes(1);
        firePointer(window, 'pointermove', {
            x: 100,
            y: 100,
            pointerType: 'mouse',
        });
        firePointer(window, 'pointerup', {
            x: 100,
            y: 100,
            pointerType: 'mouse',
        });
        expect(counterText()).toBe('2');
    });

    it('emits the mouse drag lifecycle callbacks', () => {
        const onDragStart = vi.fn();
        const onDragMove = vi.fn();
        const onDragEnd = vi.fn();
        openAndLoad({ onDragStart, onDragMove, onDragEnd });
        const item = currentSlide();

        firePointer(item, 'pointerdown', {
            x: 200,
            y: 100,
            pointerType: 'mouse',
        });
        expect(document.querySelector('.lg-outer')).toHaveClass('lg-grabbing');
        firePointer(window, 'pointermove', {
            x: 150,
            y: 100,
            pointerType: 'mouse',
        });
        firePointer(window, 'pointerup', {
            x: 150,
            y: 100,
            pointerType: 'mouse',
        });
        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragMove).toHaveBeenCalled();
        expect(onDragEnd).toHaveBeenCalledTimes(1);
        expect(document.querySelector('.lg-outer')).toHaveClass('lg-grab');
    });
});

describe('vertical drag-to-close', () => {
    it('fades the backdrop with the drag and closes past the projected ratio', () => {
        const onClose = vi.fn();
        openAndLoad({ onClose });
        const item = currentSlide();
        const backdrop = document.querySelector<HTMLElement>('.lg-backdrop')!;

        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 200, y: 150 });
        expect(backdrop.style.opacity).not.toBe('');
        expect(item.style.transform).toContain('scale3d');

        firePointer(window, 'pointermove', { x: 200, y: 460 });
        expect(document.querySelector('.lg-outer')).toHaveClass(
            'lg-hide-items',
        );

        firePointer(window, 'pointerup', { x: 200, y: 460 });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('restores everything on a sub-threshold vertical drag', () => {
        const onClose = vi.fn();
        openAndLoad({ onClose });
        const item = currentSlide();
        const backdrop = document.querySelector<HTMLElement>('.lg-backdrop')!;

        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 200, y: 160 });
        firePointer(window, 'pointerup', { x: 200, y: 160 });

        expect(onClose).not.toHaveBeenCalled();
        // The release spring glides everything home, then restores.
        tick(2000);
        expect(backdrop.style.opacity).toBe('');
        expect(item.style.transform).toBe('');
    });

    it('never closes from a drag when swipeToClose is off', () => {
        const onClose = vi.fn();
        openAndLoad({ onClose, swipeToClose: false });
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 200, y: 300 });
        firePointer(window, 'pointerup', { x: 200, y: 300 });
        expect(onClose).not.toHaveBeenCalled();
    });
});

describe('mousewheel', () => {
    it('navigates on wheel and throttles to one slide per second', () => {
        openAndLoad({ mousewheel: true });
        const outer = document.querySelector('.lg-outer')!;

        fireEvent.wheel(outer, { deltaY: 100 });
        expect(counterText()).toBe('2');
        tick(550);

        // Within the 1s throttle window: ignored.
        fireEvent.wheel(outer, { deltaY: 100 });
        expect(counterText()).toBe('2');

        tick(600);
        fireEvent.wheel(outer, { deltaY: -100 });
        expect(counterText()).toBe('1');
        tick(550);
    });

    it('does nothing when mousewheel is off (default)', () => {
        openAndLoad();
        fireEvent.wheel(document.querySelector('.lg-outer')!, {
            deltaY: 100,
        });
        expect(counterText()).toBe('1');
    });
});

describe('keyboard', () => {
    it('navigates with arrow keys when keyPress is on', () => {
        openAndLoad();
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        expect(counterText()).toBe('2');
        tick(550);
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
        expect(counterText()).toBe('1');
        tick(550);
    });

    it('ignores arrows when keyPress is off', () => {
        openAndLoad({ keyPress: false });
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        expect(counterText()).toBe('1');
    });

    it('mirrors the physical arrows and stamps dir in rtl', () => {
        openAndLoad({ direction: 'rtl' });
        expect(
            document.querySelector('.lg-container')!.getAttribute('dir'),
        ).toBe('rtl');
        // ArrowLeft advances in RTL (the strip flows right-to-left).
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
        expect(counterText()).toBe('2');
        tick(550);
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        expect(counterText()).toBe('1');
        tick(550);
    });
});

describe('performance and cleanup', () => {
    it('does not re-render React on pointermove', () => {
        let renders = 0;
        function Probe() {
            renders++;
            return null;
        }
        render(
            <LightGallery slides={slides} open={true} onClose={() => undefined}>
                <Probe />
            </LightGallery>,
        );
        tick(450);
        fireEvent.load(screen.getByAltText('a'));

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        const rendersAfterDown = renders;
        for (let i = 0; i < 5; i++) {
            firePointer(window, 'pointermove', { x: 180 - i * 10, y: 100 });
        }
        expect(renders).toBe(rendersAfterDown);
        firePointer(window, 'pointerup', { x: 130, y: 100 });
    });

    it('unmounting mid-drag removes the window pointer listeners', () => {
        const winAdd = vi.spyOn(window, 'addEventListener');
        const winRemove = vi.spyOn(window, 'removeEventListener');

        const { unmount } = openAndLoad();
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 150, y: 100 });

        unmount();

        const pointerTypes = ['pointermove', 'pointerup', 'pointercancel'];
        const added = winAdd.mock.calls
            .map(([type]) => type)
            .filter((type) => pointerTypes.includes(type));
        const removed = winRemove.mock.calls
            .map(([type]) => type)
            .filter((type) => pointerTypes.includes(type));
        expect(removed.sort()).toEqual(added.sort());

        winAdd.mockRestore();
        winRemove.mockRestore();
    });

    it('pointercancel aborts the gesture cleanly', () => {
        openAndLoad();
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointercancel', { x: 100, y: 100 });
        expect(item.style.transform).toBe('');
        expect(counterText()).toBe('1');
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-dragging',
        );
    });
});
