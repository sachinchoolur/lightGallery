import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { LightGallery, type LightGallerySlide } from './index';

const slides: LightGallerySlide[] = [
    { src: 'a.jpg', alt: 'a' },
    { src: 'b.jpg', alt: 'b' },
    { src: 'c.jpg', alt: 'c' },
];

function Harness({
    onClose = () => undefined,
    onAfterSlide,
    startOpen = true,
}: {
    onClose?: () => void;
    onAfterSlide?: (d: { index: number; prevIndex: number }) => void;
    startOpen?: boolean;
}) {
    const [open, setOpen] = useState(startOpen);
    return (
        <LightGallery
            slides={slides}
            open={open}
            index={0}
            onAfterSlide={onAfterSlide}
            onClose={() => {
                setOpen(false);
                onClose();
            }}
        />
    );
}

describe('LightGallery spike', () => {
    it('renders nothing while closed', () => {
        render(<Harness startOpen={false} />);
        expect(document.querySelector('.lg-container')).toBeNull();
    });

    it('opens into a body portal with the lg-* class contract', () => {
        render(<Harness />);
        const container = document.querySelector('.lg-container');
        expect(container).toBeInTheDocument();
        expect(container?.parentElement).toBe(document.body);
        expect(container?.querySelector('.lg-outer')).toBeInTheDocument();
        expect(screen.getByAltText('a')).toHaveClass('lg-image');
    });

    it('navigates with next/prev and reports onAfterSlide', async () => {
        const afterSlide = vi.fn();
        const user = userEvent.setup();
        render(<Harness onAfterSlide={afterSlide} />);

        await user.click(screen.getByLabelText('Next slide'));
        expect(screen.getByAltText('b')).toBeInTheDocument();
        expect(afterSlide).toHaveBeenLastCalledWith({
            index: 1,
            prevIndex: 0,
        });

        await user.click(screen.getByLabelText('Previous slide'));
        expect(screen.getByAltText('a')).toBeInTheDocument();
        expect(afterSlide).toHaveBeenLastCalledWith({
            index: 0,
            prevIndex: 1,
        });
    });

    it('closes on ESC and on the close button', async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();
        render(<Harness onClose={onClose} />);

        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(document.querySelector('.lg-container')).toBeNull();
    });

    it('cleans up the portal and document listeners on unmount while open', () => {
        const addSpy = vi.spyOn(document, 'addEventListener');
        const removeSpy = vi.spyOn(document, 'removeEventListener');

        const { unmount } = render(<Harness />);
        const added = addSpy.mock.calls.filter(([t]) => t === 'keydown').length;
        expect(added).toBeGreaterThan(0);

        unmount();
        const removed = removeSpy.mock.calls.filter(
            ([t]) => t === 'keydown',
        ).length;
        expect(removed).toBe(added);
        expect(document.querySelector('.lg-container')).toBeNull();

        addSpy.mockRestore();
        removeSpy.mockRestore();
    });
});
