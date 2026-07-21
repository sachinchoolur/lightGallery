import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';

const slides: GalleryItem[] = [
    { src: 'a.jpg', alt: 'a', caption: <h4>Caption A</h4> },
    { src: 'b.jpg', alt: 'b' },
    { src: 'c.jpg', alt: 'c', captionHtml: '<h4 id="raw-c">Raw C</h4>' },
    { src: 'd.jpg', alt: 'd' },
    { src: 'e.jpg', alt: 'e' },
];

// Defaults: backdropDuration 300, speed 400 → transition settles at 500.
const BACKDROP = 300;
const SLIDE_SETTLE = 400 + 100 + 50;

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

function openSettled() {
    tick(BACKDROP + 150);
}

function Harness({
    startOpen = true,
    onClose,
    ...rest
}: { startOpen?: boolean } & Record<string, unknown>) {
    const [open, setOpen] = useState(startOpen);
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

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    act(() => {
        vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
});

describe('open/close lifecycle (controlled)', () => {
    it('renders nothing while closed', () => {
        render(<Harness startOpen={false} />);
        expect(document.querySelector('.lg-container')).toBeNull();
    });

    it('opens into a body portal with the vanilla lg-* class timeline', () => {
        render(<Harness />);

        const container = document.querySelector('.lg-container');
        expect(container).toBeInTheDocument();
        expect(container?.parentElement).toBe(document.body);
        expect(container).toHaveClass('lg-show');
        expect(container).not.toHaveClass('lg-show-in');

        const outer = document.querySelector('.lg-outer');
        expect(outer).toHaveClass('lg-use-css3', 'lg-css3', 'lg-slide');
        // No lgSize on the items → startClass fallback path.
        expect(outer).toHaveClass('lg-start-zoom');
        expect(outer?.querySelector('.lg-inner')).toBeInTheDocument();
        expect(outer?.querySelector('.lg-toolbar')).toBeInTheDocument();

        tick(10);
        expect(container).toHaveClass('lg-show-in');
        expect(document.querySelector('.lg-backdrop')).toHaveClass('in');

        tick(BACKDROP);
        expect(outer).toHaveClass('lg-visible');
    });

    it('fires open lifecycle callbacks in order', () => {
        const calls: string[] = [];
        render(
            <Harness
                onBeforeOpen={() => calls.push('beforeOpen')}
                onAfterOpen={() => calls.push('afterOpen')}
            />,
        );
        expect(calls).toEqual(['beforeOpen', 'afterOpen']);
    });

    it('closes on ESC with the closing animation, then unmounts', () => {
        const onClose = vi.fn();
        const onBeforeClose = vi.fn();
        const onAfterClose = vi.fn();
        render(
            <Harness
                onClose={onClose}
                onBeforeClose={onBeforeClose}
                onAfterClose={onAfterClose}
            />,
        );
        openSettled();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onBeforeClose).toHaveBeenCalledTimes(1);
        // Portal stays mounted for the exit animation.
        const container = document.querySelector('.lg-container');
        expect(container).toBeInTheDocument();
        expect(container).not.toHaveClass('lg-show-in');
        expect(onAfterClose).not.toHaveBeenCalled();

        tick(BACKDROP + 100);
        expect(document.querySelector('.lg-container')).toBeNull();
        expect(onAfterClose).toHaveBeenCalledTimes(1);
    });

    it('ignores ESC when escKey is off and close button when closable is off', () => {
        const onClose = vi.fn();
        const { unmount } = render(
            <Harness onClose={onClose} escKey={false} />,
        );
        openSettled();
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).not.toHaveBeenCalled();
        unmount();

        render(<Harness onClose={onClose} closable={false} />);
        openSettled();
        // No close button rendered at all.
        expect(document.querySelector('.lg-close')).toBeNull();
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).not.toHaveBeenCalled();
    });

    it('closes on tap of the empty area but not on the image', () => {
        const onClose = vi.fn();
        render(<Harness onClose={onClose} />);
        openSettled();

        const img = screen.getByAltText('a');
        fireEvent.mouseDown(img);
        fireEvent.mouseUp(img);
        expect(onClose).not.toHaveBeenCalled();

        const item = document.querySelector('.lg-item.lg-current')!;
        fireEvent.mouseDown(item);
        fireEvent.mouseUp(item);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('body state', () => {
    it('locks html/body classes symmetrically', () => {
        render(<Harness hideScrollbar={true} />);
        expect(document.documentElement).toHaveClass('lg-on');
        expect(document.body).toHaveClass('lg-overlay-open');

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(document.documentElement).not.toHaveClass('lg-on');
        expect(document.body).not.toHaveClass('lg-overlay-open');
        tick(BACKDROP + 100);
        expect(document.querySelector('.lg-container')).toBeNull();
    });
});

describe('navigation and transitions', () => {
    it('navigates with the transition class timeline and fires callbacks once', () => {
        const before = vi.fn();
        const after = vi.fn();
        render(<Harness onBeforeSlide={before} onAfterSlide={after} />);
        openSettled();
        // Complete the first slide so navigation animates.
        fireEvent.load(screen.getByAltText('a'));

        fireEvent.click(screen.getByLabelText('Next slide'));
        expect(before).toHaveBeenCalledTimes(1);
        expect(before).toHaveBeenCalledWith({
            index: 1,
            prevIndex: 0,
            fromTouch: false,
            fromThumb: false,
        });
        expect(after).not.toHaveBeenCalled();

        // Repositioning window: old slide keeps lg-current, outer no-trans.
        const outer = document.querySelector('.lg-outer');
        expect(outer).toHaveClass('lg-no-trans');
        const items = document.querySelectorAll('.lg-item');
        expect(items[0]).toHaveClass('lg-current');
        expect(items[1]).toHaveClass('lg-next-slide');

        tick(50);
        expect(items[1]).toHaveClass('lg-current');
        expect(items[0]).toHaveClass('lg-prev-slide');
        expect(items[0]).not.toHaveClass('lg-current');
        expect(outer).not.toHaveClass('lg-no-trans');

        tick(SLIDE_SETTLE);
        expect(after).toHaveBeenCalledTimes(1);
        expect(after).toHaveBeenCalledWith({
            index: 1,
            prevIndex: 0,
            fromTouch: false,
            fromThumb: false,
        });
        expect(before).toHaveBeenCalledTimes(1);
    });

    it('blocks further navigation while a transition is running', () => {
        render(<Harness />);
        openSettled();
        fireEvent.load(screen.getByAltText('a'));

        fireEvent.click(screen.getByLabelText('Next slide'));
        fireEvent.click(screen.getByLabelText('Next slide'));
        tick(SLIDE_SETTLE + 50);
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('2');
    });

    it('updates the counter and loops past the last slide', () => {
        render(<Harness />);
        openSettled();
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('1');
        expect(document.querySelector('.lg-counter-all')?.textContent).toBe(
            '5',
        );

        fireEvent.click(screen.getByLabelText('Previous slide'));
        tick(SLIDE_SETTLE + 50);
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('5');
    });

    it('bounces at the end without loop instead of wrapping', () => {
        render(<Harness loop={false} index={4} />);
        openSettled();

        fireEvent.click(screen.getByLabelText('Next slide'));
        const outer = document.querySelector('.lg-outer');
        expect(outer).toHaveClass('lg-right-end');
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('5');
        tick(400);
        expect(outer).not.toHaveClass('lg-right-end');
    });

    it('disables the end controls with hideControlOnEnd', () => {
        render(
            <Harness
                loop={false}
                slideEndAnimation={false}
                hideControlOnEnd={true}
            />,
        );
        openSettled();
        expect(screen.getByLabelText('Previous slide')).toBeDisabled();
        expect(screen.getByLabelText('Next slide')).not.toBeDisabled();
    });
});

describe('image loading', () => {
    it('marks slides complete on load (spinner until then) and preloads neighbors', () => {
        const onSlideItemLoad = vi.fn();
        render(<Harness onSlideItemLoad={onSlideItemLoad} />);
        openSettled();

        // All 5 slides are mounted (numberOfSlideItemsInDom default) but only
        // the current one has content before it completes.
        expect(document.querySelectorAll('.lg-item').length).toBe(5);
        expect(document.querySelectorAll('img.lg-image').length).toBe(1);

        const current = document.querySelector('.lg-item.lg-current');
        expect(current).not.toHaveClass('lg-complete');

        fireEvent.load(screen.getByAltText('a'));
        expect(current).toHaveClass('lg-complete');
        expect(onSlideItemLoad).toHaveBeenCalledWith({
            index: 0,
            delay: 410,
            isFirstSlide: true,
        });

        // preload=2 → slides 1 and 2 load after the current completes.
        expect(document.querySelectorAll('img.lg-image').length).toBe(3);
        expect(screen.getByAltText('b')).toBeInTheDocument();
        expect(screen.getByAltText('c')).toBeInTheDocument();
    });

    it('shows the error message when the image fails', () => {
        render(<Harness />);
        openSettled();
        fireEvent.error(screen.getByAltText('a'));
        expect(
            screen.getByText('Oops... Failed to load content...'),
        ).toHaveClass('lg-error-msg');
        expect(
            document.querySelector('.lg-item.lg-current'),
        ).toHaveClass('lg-complete');
    });
});

describe('captions', () => {
    it('renders ReactNode captions in the caption bar', () => {
        render(<Harness />);
        openSettled();
        const subHtml = document.querySelector(
            '.lg-components .lg-sub-html',
        );
        expect(subHtml).toBeInTheDocument();
        expect(subHtml).not.toHaveClass('lg-empty-html');
        expect(screen.getByText('Caption A')).toBeInTheDocument();
    });

    it('marks slides without captions as empty', () => {
        render(<Harness index={1} />);
        openSettled();
        expect(document.querySelector('.lg-sub-html')).toHaveClass(
            'lg-empty-html',
        );
    });

    it('renders raw HTML only via the captionHtml opt-in', () => {
        render(<Harness index={2} />);
        openSettled();
        expect(document.querySelector('#raw-c')).toHaveTextContent('Raw C');
    });

    it('supports the render.caption slot and captionPosition="slide"', () => {
        render(
            <Harness
                captionPosition="slide"
                render={{
                    caption: (_item: GalleryItem, index: number) => (
                        <em>slot caption {index}</em>
                    ),
                }}
            />,
        );
        openSettled();
        expect(
            document.querySelector('.lg-item .lg-sub-html'),
        ).toHaveTextContent('slot caption 0');
        expect(document.querySelector('.lg-components .lg-sub-html')).toBeNull();
    });
});

describe('controlled index', () => {
    function IndexHarness({ onIndexChange }: { onIndexChange: (i: number) => void }) {
        const [index, setIndex] = useState(0);
        return (
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                index={index}
                onIndexChange={(next) => {
                    setIndex(next);
                    onIndexChange(next);
                }}
            />
        );
    }

    it('round-trips internal navigation through onIndexChange', () => {
        const onIndexChange = vi.fn();
        render(<IndexHarness onIndexChange={onIndexChange} />);
        openSettled();
        fireEvent.load(screen.getByAltText('a'));

        fireEvent.click(screen.getByLabelText('Next slide'));
        expect(onIndexChange).toHaveBeenCalledWith(1);
        tick(SLIDE_SETTLE + 50);
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('2');
    });
});

describe('cleanup', () => {
    it('unmounting while open removes the portal, listeners, timers and body lock', () => {
        const docAdd = vi.spyOn(document, 'addEventListener');
        const docRemove = vi.spyOn(document, 'removeEventListener');
        const winAdd = vi.spyOn(window, 'addEventListener');
        const winRemove = vi.spyOn(window, 'removeEventListener');

        const { unmount } = render(<Harness />);
        openSettled();
        expect(document.documentElement).toHaveClass('lg-on');

        unmount();

        expect(document.querySelector('.lg-container')).toBeNull();
        expect(document.documentElement).not.toHaveClass('lg-on');
        expect(vi.getTimerCount()).toBe(0);

        const added = docAdd.mock.calls.map(([type]) => type);
        const removed = docRemove.mock.calls.map(([type]) => type);
        expect(removed.sort()).toEqual(added.sort());
        const addedWin = winAdd.mock.calls.map(([type]) => type);
        const removedWin = winRemove.mock.calls.map(([type]) => type);
        expect(removedWin.sort()).toEqual(addedWin.sort());

        docAdd.mockRestore();
        docRemove.mockRestore();
        winAdd.mockRestore();
        winRemove.mockRestore();
    });
});
