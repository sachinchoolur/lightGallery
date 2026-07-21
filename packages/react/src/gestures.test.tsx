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
    return document.querySelector('.lg-counter-current')?.textContent ?? undefined;
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

    it('snaps back below the threshold', () => {
        openAndLoad();
        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        // 18px: past the axis commit (15) but under both swipeThreshold and
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
    it('fades the backdrop with the drag and closes past 100px', () => {
        const onClose = vi.fn();
        openAndLoad({ onClose });
        const item = currentSlide();
        const backdrop = document.querySelector<HTMLElement>('.lg-backdrop')!;

        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 200, y: 150 });
        expect(backdrop.style.opacity).not.toBe('');
        expect(item.style.transform).toContain('scale3d');

        firePointer(window, 'pointermove', { x: 200, y: 260 });
        expect(document.querySelector('.lg-outer')).toHaveClass(
            'lg-hide-items',
        );

        firePointer(window, 'pointerup', { x: 200, y: 260 });
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
