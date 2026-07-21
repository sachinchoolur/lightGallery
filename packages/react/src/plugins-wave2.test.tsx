import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';
import Autoplay from './plugins/autoplay';
import Comment from './plugins/comment';
import Fullscreen from './plugins/fullscreen';
import Hash from './plugins/hash';
import MediumZoom from './plugins/mediumZoom';
import Pager from './plugins/pager';
import RelativeCaption from './plugins/relativeCaption';
import Rotate from './plugins/rotate';
import Share from './plugins/share';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';
import VimeoThumbnail from './plugins/vimeoThumbnail';
import Zoom from './plugins/zoom';

const slides: GalleryItem[] = [
    { src: 'a.jpg', alt: 'a', thumb: 'a-t.jpg', caption: 'Caption A' },
    { src: 'b.jpg', alt: 'b', thumb: 'b-t.jpg' },
    { src: 'c.jpg', alt: 'c', thumb: 'c-t.jpg' },
];

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

function renderGallery(props: Record<string, unknown> = {}) {
    const utils = render(
        <LightGallery
            slides={slides}
            open={true}
            onClose={() => undefined}
            {...props}
        />,
    );
    tick(450);
    return utils;
}

function loadCurrent(alt = 'a') {
    fireEvent.load(document.querySelector(`img.lg-image[alt="${alt}"]`)!);
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
    window.history.replaceState(null, '', window.location.pathname);
});

describe('autoplay plugin', () => {
    it('starts/stops the slideshow from the toolbar button', () => {
        const onAutoplayStart = vi.fn();
        const onAutoplayStop = vi.fn();
        renderGallery({
            plugins: [Autoplay],
            onAutoplayStart,
            onAutoplayStop,
        });
        loadCurrent();

        fireEvent.click(screen.getByLabelText('Toggle Autoplay'));
        expect(onAutoplayStart).toHaveBeenCalledWith({ index: 0 });
        const outer = document.querySelector('.lg-outer');
        expect(outer).toHaveClass('lg-show-autoplay');
        expect(document.querySelector('.lg-progress-bar')).toHaveClass(
            'lg-start',
        );

        // speed 400 + interval 5000 → next slide fires at 5400.
        tick(5500);
        expect(counterText()).toBe('2');
        tick(600);

        fireEvent.click(screen.getByLabelText('Toggle Autoplay'));
        expect(onAutoplayStop).toHaveBeenCalled();
        expect(outer).not.toHaveClass('lg-show-autoplay');
        tick(6000);
        expect(counterText()).toBe('2');
    });

    it('stops on user navigation (forceSlideShowAutoplay off)', () => {
        renderGallery({ plugins: [Autoplay] });
        loadCurrent();
        fireEvent.click(screen.getByLabelText('Toggle Autoplay'));
        fireEvent.click(screen.getByLabelText('Next slide'));
        tick(600);
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-show-autoplay',
        );
    });
});

describe('fullscreen plugin', () => {
    it('renders nothing when the Fullscreen API is unavailable', () => {
        renderGallery({ plugins: [Fullscreen] });
        expect(document.querySelector('.lg-fullscreen')).toBeNull();
    });

    it('toggles fullscreen when supported', () => {
        Object.defineProperty(document, 'fullscreenEnabled', {
            value: true,
            configurable: true,
        });
        const request = vi.fn();
        document.documentElement.requestFullscreen = request;

        renderGallery({ plugins: [Fullscreen] });
        fireEvent.click(screen.getByLabelText('Toggle Fullscreen'));
        expect(request).toHaveBeenCalledTimes(1);

        delete (document.documentElement as { requestFullscreen?: unknown })
            .requestFullscreen;
        Reflect.deleteProperty(document, 'fullscreenEnabled');
    });
});

describe('hash plugin', () => {
    it('opens from a deep link with a clamped slide index', () => {
        window.location.hash = '#lg=g1&slide=99';
        render(
            <LightGallery plugins={[Hash]} slides={slides} hash={{ galleryId: 'g1' }}>
                {null}
            </LightGallery>,
        );
        tick(150);
        expect(document.querySelector('.lg-container')).toBeInTheDocument();
        // slide=99 clamps to the last slide (2.x passed it through).
        expect(counterText()).toBe('3');
        expect(document.body).toHaveClass('lg-from-hash');
        tick(500);
    });

    it('writes the slide to the hash and restores it on close', () => {
        render(
            <LightGallery plugins={[Hash]} slides={slides} hash={{ galleryId: 'g2' }}>
                {null}
            </LightGallery>,
        );
        act(() => {
            fireEvent.click(document.body); // no-op, settle
        });
        // Open via deep-link is not used here; open through the ref-less
        // uncontrolled path: simulate afterSlide by opening from hash.
        window.location.hash = '#lg=g2&slide=1';
        tick(150);
        expect(counterText()).toBe('2');
        loadCurrent('b');

        fireEvent.keyDown(document, { key: 'Escape' });
        tick(500);
        expect(window.location.hash).not.toContain('lg=g2');
    });
});

describe('pager plugin', () => {
    it('renders dots with active sync and click navigation', () => {
        renderGallery({ plugins: [Pager] });
        loadCurrent();
        const dots = document.querySelectorAll('.lg-pager-cont');
        expect(dots.length).toBe(3);
        expect(dots[0]).toHaveClass('lg-pager-active');

        fireEvent.click(dots[2]!.querySelector('.lg-pager')!);
        expect(counterText()).toBe('3');
        tick(600);
        expect(dots[2]).toHaveClass('lg-pager-active');
    });
});

describe('share plugin', () => {
    it('renders per-slide share links and toggles the dropdown', () => {
        renderGallery({ plugins: [Share] });
        const button = screen.getByLabelText('Share');
        const links = button.querySelectorAll('.lg-dropdown a');
        expect(links.length).toBe(3);
        expect(links[0]!.getAttribute('href')).toContain('facebook.com');
        expect(links[1]!.getAttribute('href')).toContain('twitter.com');
        expect(links[2]!.getAttribute('href')).toContain(
            encodeURIComponent('a.jpg'),
        );

        fireEvent.click(button);
        expect(document.querySelector('.lg-outer')).toHaveClass(
            'lg-dropdown-active',
        );
        fireEvent.click(document.querySelector('.lg-dropdown-overlay')!);
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-dropdown-active',
        );
    });
});

describe('rotate plugin', () => {
    it('rotates and flips the current slide with the axis correction', () => {
        const onRotateRight = vi.fn();
        renderGallery({ plugins: [Rotate], onRotateRight });
        loadCurrent();
        const wrapper = () =>
            document.querySelector<HTMLElement>(
                '.lg-item.lg-current .lg-img-rotate',
            )!;
        expect(wrapper()).not.toBeNull();

        fireEvent.click(screen.getByLabelText('Rotate right'));
        expect(wrapper().style.transform).toBe(
            'rotate(90deg) scale3d(1, 1, 1)',
        );
        tick(450);
        expect(onRotateRight).toHaveBeenCalledWith({ rotate: 90 });

        // At 90°, a horizontal flip toggles the vertical axis (2.x).
        fireEvent.click(screen.getByLabelText('Flip horizontal'));
        expect(wrapper().style.transform).toBe(
            'rotate(90deg) scale3d(1, -1, 1)',
        );
        tick(450);
    });

    it('composes inside the zoom wrapper', () => {
        renderGallery({ plugins: [Zoom, Rotate] });
        loadCurrent();
        const zoomWrap = document.querySelector(
            '.lg-item.lg-current .lg-zoom-scale',
        );
        expect(zoomWrap?.querySelector('.lg-img-rotate')).not.toBeNull();
    });
});

describe('comment plugin', () => {
    it('renders the panel via renderComments and toggles it', () => {
        renderGallery({
            plugins: [Comment],
            comment: {
                commentBox: true,
                renderComments: (item: GalleryItem) => (
                    <p data-testid="comments">Comments for {item.alt}</p>
                ),
            },
        });
        expect(screen.getByTestId('comments')).toHaveTextContent(
            'Comments for a',
        );
        fireEvent.click(screen.getByLabelText('Toggle Comments'));
        expect(document.querySelector('.lg-outer')).toHaveClass(
            'lg-comment-active',
        );
        fireEvent.click(document.querySelector('.lg-comment-overlay')!);
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-comment-active',
        );
    });
});

describe('mediumZoom plugin', () => {
    it('applies presets, backdrop color and click-to-close', () => {
        const onClose = vi.fn();
        renderGallery({
            plugins: [MediumZoom],
            onClose,
            slides: [
                { ...slides[0], lgBackgroundColor: 'rgb(20, 30, 40)' },
                ...slides.slice(1),
            ],
        });
        // Presets: controls/counter/close hidden.
        expect(document.querySelector('.lg-counter')).toBeNull();
        expect(document.querySelector('.lg-prev')).toBeNull();
        expect(document.querySelector('.lg-close')).toBeNull();
        expect(document.querySelector('.lg-outer')).toHaveClass(
            'lg-medium-zoom',
        );
        expect(
            (document.querySelector('.lg-backdrop') as HTMLElement).style
                .backgroundColor,
        ).toBe('rgb(20, 30, 40)');

        fireEvent.click(document.querySelector('.lg-outer')!);
        expect(onClose).toHaveBeenCalled();
    });

    it('overrides the media container position with the margin', () => {
        renderGallery({ plugins: [MediumZoom], mediumZoom: { margin: 25 } });
        const content = document.querySelector<HTMLElement>('.lg-content')!;
        expect(content.style.top).toBe('25px');
        expect(content.style.bottom).toBe('25px');
    });
});

describe('relativeCaption plugin', () => {
    it('moves captions into the slide and reveals them after load', () => {
        renderGallery({ plugins: [RelativeCaption] });
        // Preset captionPosition: 'slide' → caption inside .lg-item.
        const caption = document.querySelector<HTMLElement>(
            '.lg-item .lg-sub-html',
        );
        expect(caption).not.toBeNull();
        expect(document.querySelector('.lg-components .lg-sub-html')).toBeNull();
        expect(document.querySelector('.lg-outer')).toHaveClass(
            'lg-relative-caption',
        );

        loadCurrent();
        tick(100);
        expect(caption!.style.opacity).toBe('1');
    });
});

describe('vimeoThumbnail plugin', () => {
    it('swaps vimeo item thumbs via the oEmbed API', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            json: () =>
                Promise.resolve({
                    thumbnail_url: 'https://i.vimeocdn.com/thumb.jpg',
                }),
        });
        vi.stubGlobal('fetch', fetchMock);

        renderGallery({
            plugins: [VimeoThumbnail, Thumbnail],
            slides: [
                { src: 'https://vimeo.com/112836958', alt: 'v' },
                ...slides.slice(1),
            ],
        });
        await act(async () => undefined);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0]![0]).toContain('vimeo.com/api/oembed');
        const thumb = document.querySelector(
            '.lg-thumb-item img',
        ) as HTMLImageElement;
        expect(thumb.src).toContain('i.vimeocdn.com/thumb.jpg');

        vi.unstubAllGlobals();
    });
});

describe('all 13 plugins together', () => {
    it('composes without conflicts', () => {
        renderGallery({
            plugins: [
                Thumbnail,
                Zoom,
                Video,
                Autoplay,
                Fullscreen,
                Hash,
                Pager,
                Share,
                Rotate,
                Comment,
                MediumZoom,
                RelativeCaption,
                VimeoThumbnail,
            ],
            comment: { commentBox: true },
        });
        loadCurrent();
        const outer = document.querySelector('.lg-outer')!;
        expect(outer).toHaveClass(
            'lg-has-thumb',
            'lg-use-transition-for-zoom',
            'lg-medium-zoom',
            'lg-relative-caption',
        );
        // mediumZoom presets suppress the counter/controls; the strip,
        // pager, share and autoplay UI all render.
        expect(document.querySelector('.lg-thumb-outer')).not.toBeNull();
        expect(document.querySelector('.lg-pager-outer')).not.toBeNull();
        expect(document.querySelector('.lg-share')).not.toBeNull();
        expect(document.querySelector('.lg-autoplay-button')).not.toBeNull();
        expect(document.querySelector('.lg-counter')).toBeNull();
        tick(600);
    });
});
