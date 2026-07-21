import {
    useCallback,
    useEffect,
    useReducer,
    useState,
    type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import {
    createGalleryState,
    galleryReducer,
} from '@lightgallery/headless';

/**
 * SPIKE (plan 002): minimal controlled render path proving the architecture —
 * headless reducer + portal + vanilla `lg-*` class contract + ESC close.
 * The real component (plan 003) grows from this shape after ADR sign-off.
 */

export interface LightGallerySlide {
    src: string;
    alt?: string;
}

export interface LightGalleryProps {
    slides: LightGallerySlide[];
    /** Controlled: whether the lightbox is open. */
    open: boolean;
    /** Called when the gallery requests to close (ESC / close button). */
    onClose: () => void;
    /** Slide to show when opening. */
    index?: number;
    onAfterSlide?: (detail: { index: number; prevIndex: number }) => void;
    loop?: boolean;
}

export function LightGallery({
    slides,
    open,
    onClose,
    index = 0,
    onAfterSlide,
    loop = true,
}: LightGalleryProps): ReactElement | null {
    const [mounted, setMounted] = useState(false);
    const [state, dispatch] = useReducer(
        galleryReducer,
        { slidesCount: slides.length, loop, index },
        createGalleryState,
    );

    // Portal targets exist only in the browser; render nothing during SSR.
    useEffect(() => {
        setMounted(true);
    }, []);

    // Controlled open/close → reducer.
    useEffect(() => {
        dispatch(open ? { type: 'OPEN', index } : { type: 'CLOSE' });
    }, [open, index]);

    useEffect(() => {
        dispatch({ type: 'SET_SLIDES_COUNT', count: slides.length });
    }, [slides.length]);

    // ESC closes while open; listener removed on close/unmount.
    useEffect(() => {
        if (!open) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    useEffect(() => {
        if (state.open && state.currentIndex !== state.previousIndex) {
            onAfterSlide?.({
                index: state.currentIndex,
                prevIndex: state.previousIndex,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentIndex]);

    const next = useCallback(() => dispatch({ type: 'NEXT' }), []);
    const prev = useCallback(() => dispatch({ type: 'PREV' }), []);

    if (!mounted || !state.open) {
        return null;
    }

    const slide = slides[state.currentIndex];

    return createPortal(
        <div className="lg-container lg-show lg-show-in">
            <div className="lg-backdrop lg-show-in" />
            <div className="lg-outer lg-visible lg-grab">
                <div className="lg-content">
                    <div className="lg-inner">
                        <div className="lg-item lg-current lg-complete">
                            {slide && (
                                <img
                                    className="lg-object lg-image"
                                    src={slide.src}
                                    alt={slide.alt ?? ''}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg-toolbar lg-group">
                    <button
                        type="button"
                        aria-label="Close gallery"
                        className="lg-close lg-icon"
                        onClick={onClose}
                    />
                </div>
                <button
                    type="button"
                    aria-label="Previous slide"
                    className="lg-prev lg-icon"
                    onClick={prev}
                />
                <button
                    type="button"
                    aria-label="Next slide"
                    className="lg-next lg-icon"
                    onClick={next}
                />
            </div>
        </div>,
        document.body,
    );
}
