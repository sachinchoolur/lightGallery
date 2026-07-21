import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
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

    it('opens at the clicked item, navigates, and closes on ESC', () => {
        render(<Grid />);

        fireEvent.click(screen.getByTestId('trigger-b'));
        expect(document.querySelector('.lg-container')).toBeInTheDocument();
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('2');
        expect(screen.getByAltText('b')).toHaveClass('lg-image');
        tick(450);

        fireEvent.load(screen.getByAltText('b'));
        fireEvent.click(screen.getByLabelText('Next slide'));
        tick(600);
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('3');

        fireEvent.keyDown(document, { key: 'Escape' });
        tick(450);
        expect(document.querySelector('.lg-container')).toBeNull();
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
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('3');
        tick(450);

        fireEvent.load(screen.getByAltText('c'));
        act(() => ref.current!.prevSlide());
        tick(600);
        expect(
            document.querySelector('.lg-counter-current')?.textContent,
        ).toBe('2');

        act(() => ref.current!.closeGallery());
        tick(450);
        expect(document.querySelector('.lg-container')).toBeNull();
    });
});
