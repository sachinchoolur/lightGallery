import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
    type LightGalleryRefHandle,
} from './index';

const items: GalleryItem[] = [
    { src: 'a.jpg', alt: 'a', thumb: 'a-thumb.jpg' },
    { src: 'b.jpg', alt: 'b', thumb: 'b-thumb.jpg' },
    { src: 'c.jpg', alt: 'c', thumb: 'c-thumb.jpg' },
];

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

function Grid(props: Record<string, unknown>) {
    return (
        <LightGallery {...props}>
            {items.map((item) => (
                <LightGalleryItem
                    key={item.src}
                    item={item}
                    href={item.src}
                    data-testid={`trigger-${item.alt}`}
                >
                    <img src={item.thumb} alt={`${item.alt} thumbnail`} />
                </LightGalleryItem>
            ))}
        </LightGallery>
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

describe('uncontrolled mode', () => {
    it('renders the trigger children inline and no gallery', () => {
        render(<Grid />);
        expect(screen.getByTestId('trigger-a').tagName).toBe('A');
        expect(screen.getByAltText('a thumbnail')).toBeInTheDocument();
        expect(document.querySelector('.lg-container')).toBeNull();
    });

    it('decode-gates the slide completion (no partial paint)', async () => {
        render(<Grid />);
        fireEvent.click(screen.getByTestId('trigger-a'));
        tick(450);
        const img = screen.getByAltText('a') as HTMLImageElement;
        // jsdom has no decode() — the gate is synchronous there; a
        // controlled decode makes the ordering observable.
        let settleDecode!: () => void;
        Object.defineProperty(img, 'decode', {
            value: () =>
                new Promise<void>((resolve) => {
                    settleDecode = resolve;
                }),
        });
        fireEvent.load(img);
        // Loaded but not decoded: the slide must NOT complete — a
        // completion here is exactly the partial paint the gate blocks.
        expect(
            document.querySelector('.lg-item.lg-current.lg-complete'),
        ).toBeNull();
        await act(async () => {
            settleDecode();
            await Promise.resolve();
        });
        expect(
            document.querySelector('.lg-item.lg-current.lg-complete'),
        ).not.toBeNull();
    });

    it('completes under StrictMode (double-mount must not swallow loads)', () => {
        // StrictMode's mount→cleanup→remount cycle flips unmount flags;
        // a flag that is only SET in cleanup (never reset on mount)
        // silently swallows every slide completion in dev.
        render(
            <StrictMode>
                <Grid />
            </StrictMode>,
        );
        fireEvent.click(screen.getByTestId('trigger-a'));
        tick(450);
        fireEvent.load(screen.getByAltText('a'));
        expect(
            document.querySelector('.lg-item.lg-current.lg-complete'),
        ).not.toBeNull();
    });

    it('opens at the clicked item, navigates, and closes on ESC', () => {
        render(<Grid />);

        fireEvent.click(screen.getByTestId('trigger-b'));
        expect(document.querySelector('.lg-container')).toBeInTheDocument();
        expect(document.querySelector('.lg-counter-current')?.textContent).toBe(
            '2',
        );
        expect(screen.getByAltText('b')).toHaveClass('lg-image');
        tick(450);

        fireEvent.load(screen.getByAltText('b'));
        fireEvent.click(screen.getByLabelText('Next slide'));
        tick(600);
        expect(document.querySelector('.lg-counter-current')?.textContent).toBe(
            '3',
        );

        fireEvent.keyDown(document, { key: 'Escape' });
        tick(450);
        expect(document.querySelector('.lg-container.lg-show')).toBeNull();
        // Triggers survive the close.
        expect(screen.getByTestId('trigger-a')).toBeInTheDocument();
    });

    it('notifies onClose in uncontrolled mode too', () => {
        const onClose = vi.fn();
        render(<Grid onClose={onClose} />);
        fireEvent.click(screen.getByTestId('trigger-a'));
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
        tick(450);
    });

    it('drives the gallery through the imperative ref handle', () => {
        const ref = createRef<LightGalleryRefHandle>();
        const onInit = vi.fn();
        render(
            <LightGallery ref={ref} slides={items} onInit={onInit}>
                {null}
            </LightGallery>,
        );
        expect(onInit).toHaveBeenCalledTimes(1);
        expect(onInit.mock.calls[0]![0]!.instance).toBe(ref.current);

        act(() => ref.current!.openGallery(2));
        expect(document.querySelector('.lg-container')).toBeInTheDocument();
        expect(document.querySelector('.lg-counter-current')?.textContent).toBe(
            '3',
        );
        tick(450);

        fireEvent.load(screen.getByAltText('c'));
        act(() => ref.current!.prevSlide());
        tick(600);
        expect(document.querySelector('.lg-counter-current')?.textContent).toBe(
            '2',
        );

        act(() => ref.current!.closeGallery());
        tick(450);
        expect(document.querySelector('.lg-container.lg-show')).toBeNull();
    });
});

describe('zoom-from-origin dummy image', () => {
    it('holds the real image until the flight transition actually ends', () => {
        // The landing is gated on the slide's own transitionend: a fixed
        // offset lands mid-flight whenever the transition starts late
        // (busy main thread) and the image is fast (cached).
        const transitionEvent = (type: string, propertyName: string) =>
            Object.assign(new Event(type, { bubbles: true }), {
                propertyName,
            });
        const rectSpy = vi
            .spyOn(Element.prototype, 'getBoundingClientRect')
            .mockReturnValue({
                left: 10,
                top: 10,
                width: 100,
                height: 80,
                right: 110,
                bottom: 90,
                x: 10,
                y: 10,
                toJSON: () => ({}),
            } as DOMRect);
        render(
            <LightGallery>
                {items.map((item) => (
                    <LightGalleryItem
                        key={item.src}
                        item={{ ...item, lgSize: '1600-1067' }}
                        href={item.src}
                        data-testid={`trigger-${item.alt}`}
                    >
                        <img src={item.thumb} alt={`${item.alt} thumbnail`} />
                    </LightGalleryItem>
                ))}
            </LightGallery>,
        );
        fireEvent.click(screen.getByTestId('trigger-a'));
        tick(20);
        const item = document.querySelector('.lg-item.lg-current')!;
        expect(document.querySelector('img.lg-dummy-img')).toBeInTheDocument();

        // Late start, then well past the fixed offset: still flying.
        tick(280);
        act(() => {
            item.dispatchEvent(transitionEvent('transitionstart', 'transform'));
        });
        tick(400);
        expect(document.querySelector('img.lg-object')).toBeNull();
        expect(item).toHaveClass('lg-start-end-progress');

        act(() => {
            item.dispatchEvent(transitionEvent('transitionend', 'transform'));
        });
        expect(document.querySelector('img.lg-object')).toBeInTheDocument();
        expect(item).not.toHaveClass('lg-start-end-progress');
        rectSpy.mockRestore();
    });

    it('flies the thumb as lg-dummy-img and drops it after the load settles', () => {
        // jsdom rects are 0×0; a real-looking rect makes computeOrigin
        // produce a flight (lgSize is the other precondition).
        const rectSpy = vi
            .spyOn(Element.prototype, 'getBoundingClientRect')
            .mockReturnValue({
                left: 10,
                top: 10,
                width: 100,
                height: 80,
                right: 110,
                bottom: 90,
                x: 10,
                y: 10,
                toJSON: () => ({}),
            } as DOMRect);
        render(
            <LightGallery>
                {items.map((item) => (
                    <LightGalleryItem
                        key={item.src}
                        item={{ ...item, lgSize: '1600-1067' }}
                        href={item.src}
                        data-testid={`trigger-${item.alt}`}
                    >
                        <img src={item.thumb} alt={`${item.alt} thumbnail`} />
                    </LightGalleryItem>
                ))}
            </LightGallery>,
        );
        fireEvent.click(screen.getByTestId('trigger-a'));
        tick(20);

        // 2.x first-slide contract: ONLY the thumb-dummy exists during
        // the flight — the real image must not fetch/decode mid-flight.
        const dummy = document.querySelector('img.lg-dummy-img');
        expect(dummy).toBeInTheDocument();
        expect(dummy).toHaveAttribute('src', 'a-thumb.jpg');
        expect(document.querySelector('img.lg-object')).toBeNull();
        expect(
            document.querySelector('.lg-item.lg-first-slide'),
        ).toBeInTheDocument();
        expect(
            document.querySelector('.lg-outer.lg-first-slide-loading'),
        ).toBeInTheDocument();

        // Flight lands (no transition here: the fallback offset), the
        // real image mounts and the dummy stays on top.
        tick(620);
        const real = document.querySelector('img.lg-object');
        expect(real).toBeInTheDocument();
        expect(document.querySelector('img.lg-dummy-img')).toBeInTheDocument();

        // Real image load settles (deferred completion), then the 300ms
        // drop buffer removes the dummy and the loading classes.
        fireEvent.load(real!);
        tick(400 + 130);
        tick(310);
        expect(document.querySelector('img.lg-dummy-img')).toBeNull();
        expect(document.querySelector('.lg-item.lg-first-slide')).toBeNull();
        expect(
            document.querySelector('.lg-outer.lg-first-slide-loading'),
        ).toBeNull();
        // The real image is now the visible one.
        expect(
            document.querySelector('.lg-item.lg-current.lg-complete'),
        ).toBeInTheDocument();
        rectSpy.mockRestore();
    });
});
