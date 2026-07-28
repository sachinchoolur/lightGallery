import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';
import Thumbnail, { thumbnailSettings } from './plugins/thumbnail';
import Video from './plugins/video';
import Zoom, { zoomSettings } from './plugins/zoom';
import type { LgPlugin } from './plugins/types';

const slides: GalleryItem[] = [
    { src: 'a.jpg', alt: 'a', thumb: 'a-t.jpg' },
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
    // Thumb images share alt text with slide images; target the slide img.
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
});

describe('plugin runtime', () => {
    it('renders slots in plugins-array order and runs usePlugin hooks', () => {
        const calls: string[] = [];
        const makePlugin = (name: string): LgPlugin => ({
            name,
            slots: {
                toolbar: () => (
                    <button type="button" data-testid={`btn-${name}`} />
                ),
            },
            usePlugin: () => {
                useEffect(() => {
                    calls.push(`${name}:mount`);
                    return () => {
                        calls.push(`${name}:unmount`);
                    };
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, []);
            },
        });
        const { unmount } = renderGallery({
            plugins: [makePlugin('one'), makePlugin('two')],
        });

        const toolbar = document.querySelector('.lg-toolbar')!;
        const buttons = toolbar.querySelectorAll('[data-testid^="btn-"]');
        expect([...buttons].map((el) => el.getAttribute('data-testid'))).toEqual(
            ['btn-one', 'btn-two'],
        );
        expect(calls).toEqual(['one:mount', 'two:mount']);

        unmount();
        expect(calls).toContain('one:unmount');
        expect(calls).toContain('two:unmount');
    });

    it('merges plugin defaults and per-plugin props without mutating them', () => {
        const userZoom = { scale: 3 };
        const defaultsSnapshot = JSON.parse(JSON.stringify(zoomSettings));
        let seenScale: unknown;
        const probe: LgPlugin = {
            name: 'probe',
            usePlugin: (ctx) => {
                seenScale = ctx.settings.scale;
            },
        };
        renderGallery({ plugins: [Zoom, probe], zoom: userZoom });

        expect(seenScale).toBe(3);
        expect(userZoom).toEqual({ scale: 3 });
        expect(zoomSettings).toEqual(defaultsSnapshot);
        expect(thumbnailSettings.thumbWidth).toBe(100);
    });

    it('applies presets below user settings and supports transformItems', async () => {
        const plugin: LgPlugin = {
            name: 'preset-plugin',
            presets: { counter: false, speed: 999 },
            transformItems: (items) => [
                ...items,
                { src: 'extra.jpg', alt: 'extra' },
            ],
        };
        renderGallery({ plugins: [plugin], speed: 100 });
        // transformItems resolves through the async pipeline.
        await act(async () => undefined);
        // Preset wins over the default; user wins over the preset.
        expect(document.querySelector('.lg-counter')).toBeNull();
        expect(
            (
                document.querySelector('.lg-inner') as HTMLElement
            ).style.transitionDuration,
        ).toBe('100ms');
        // 3 base + 1 transformed item, all mounted (tiny gallery).
        expect(document.querySelectorAll('.lg-item').length).toBe(4);
    });

    it('lets slideWrapper wrap and slideRenderer replace slide content', () => {
        const plugin: LgPlugin = {
            name: 'wrapper-plugin',
            slots: {
                slideWrapper: ({ children, index }) => (
                    <div data-testid={`wrap-${index}`}>{children}</div>
                ),
            },
            slideRenderer: (item, index) =>
                index === 1 ? (
                    <em data-testid="replaced">{item.alt}</em>
                ) : undefined,
        };
        renderGallery({ plugins: [plugin] });
        loadCurrent();
        // Slide 0: default image inside the wrapper.
        expect(
            screen.getByTestId('wrap-0').querySelector('img.lg-image'),
        ).not.toBeNull();
        // Slide 1: replaced content, also wrapped.
        expect(
            screen.getByTestId('wrap-1').querySelector('[data-testid="replaced"]'),
        ).not.toBeNull();
    });
});

describe('thumbnail plugin', () => {
    it('renders the strip with active sync and click navigation', () => {
        renderGallery({ plugins: [Thumbnail] });
        loadCurrent();

        const strip = document.querySelector('.lg-components .lg-thumb-outer');
        expect(strip).not.toBeNull();
        const thumbs = document.querySelectorAll('.lg-thumb-item');
        expect(thumbs.length).toBe(3);
        expect(thumbs[0]).toHaveClass('active');
        expect(document.querySelector('.lg-outer')).toHaveClass(
            'lg-has-thumb',
            'lg-animate-thumb',
        );

        fireEvent.click(thumbs[2]!);
        expect(counterText()).toBe('3');
        tick(600);
        expect(thumbs[2]).toHaveClass('active');
        expect(thumbs[0]).not.toHaveClass('active');
    });

    it('hides the toggle button unless allowMediaOverlap permits it', () => {
        renderGallery({
            plugins: [Thumbnail],
            thumbnail: { toggleThumb: true },
        });
        expect(document.querySelector('.lg-toggle-thumb')).toBeNull();
    });

    it('can be disabled entirely', () => {
        renderGallery({ plugins: [Thumbnail], thumbnail: { thumbnail: false } });
        expect(document.querySelector('.lg-thumb-outer')).toBeNull();
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-has-thumb',
        );
    });
});

describe('video plugin', () => {
    const videoSlides: GalleryItem[] = [
        { src: '//www.youtube.com/watch?v=abc123', alt: 'yt' },
        { src: 'b.jpg', alt: 'b' },
        {
            src: 'https://vimeo.com/112836958',
            alt: 'vimeo',
            poster: 'poster.jpg',
        },
    ];

    it('renders the YouTube embed and marks the slide complete', () => {
        // loadYouTubePoster off: test the immediate-embed path.
        renderGallery({
            slides: videoSlides,
            plugins: [Video],
            loadYouTubePoster: false,
        });
        const frame = document.querySelector<HTMLIFrameElement>(
            'iframe.lg-video-object.lg-youtube',
        );
        expect(frame).not.toBeNull();
        expect(frame!.src).toContain('/embed/abc123');
        expect(frame!.src).toContain('enablejsapi=1');
        expect(
            document.querySelector('.lg-item.lg-current'),
        ).toHaveClass('lg-complete');
        expect(
            document.querySelector('.lg-outer')?.getAttribute(
                'data-lg-slide-type',
            ),
        ).toBe('video');
    });

    it('shows the poster first and swaps to the player on click', () => {
        const onPosterClick = vi.fn();
        renderGallery({
            slides: videoSlides,
            plugins: [Video],
            index: 2,
            onPosterClick,
        });
        expect(document.querySelector('img.lg-video-poster')).not.toBeNull();
        expect(document.querySelector('iframe.lg-vimeo')).toBeNull();

        fireEvent.click(screen.getByLabelText('Play video'));
        expect(onPosterClick).toHaveBeenCalledTimes(1);
        const frame = document.querySelector<HTMLIFrameElement>(
            'iframe.lg-video-object.lg-vimeo',
        );
        expect(frame).not.toBeNull();
        expect(frame!.src).toContain('player.vimeo.com/video/112836958');
    });

    it('pauses the video when navigating away', () => {
        renderGallery({
            slides: videoSlides,
            plugins: [Video],
            loadYouTubePoster: false,
        });
        const frame = document.querySelector<HTMLIFrameElement>(
            'iframe.lg-youtube',
        )!;
        const postMessage = vi.fn();
        Object.defineProperty(frame, 'contentWindow', {
            value: { postMessage },
        });

        fireEvent.click(screen.getByLabelText('Next slide'));
        expect(postMessage).toHaveBeenCalledWith(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*',
        );
        tick(600);
    });
});

describe('zoom plugin', () => {
    function firePointer(
        target: EventTarget,
        type: 'pointerdown' | 'pointermove' | 'pointerup',
        init: { x: number; y: number; pointerId?: number },
    ) {
        const event = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: init.x,
            clientY: init.y,
        });
        Object.defineProperty(event, 'pointerId', {
            value: init.pointerId ?? 1,
        });
        Object.defineProperty(event, 'pointerType', { value: 'touch' });
        act(() => {
            target.dispatchEvent(event);
        });
    }

    function zoomIn() {
        loadCurrent();
        tick(350); // enableZoomAfter
        // Double-click zoom is gated to the image itself (2.x behavior).
        fireEvent.dblClick(
            document.querySelector('.lg-zoom-pan img.lg-image')!,
        );
    }

    it('shows the actual-size button and zooms on double click', () => {
        renderGallery({ plugins: [Zoom] });
        expect(
            screen.getByLabelText('View actual size'),
        ).toHaveClass('lg-actual-size');
        // Zoom in/out buttons hidden by default (2.x showZoomInOutIcons).
        expect(document.querySelector('.lg-zoom-in')).toBeNull();

        zoomIn();
        const scaleEl = document.querySelector<HTMLElement>('.lg-zoom-scale')!;
        // jsdom has no layout → the actual-size fallback scale is 2.
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        expect(document.querySelector('.lg-outer')).toHaveClass('lg-zoomed');

        // Double click again zooms back out.
        fireEvent.dblClick(
            document.querySelector('.lg-zoom-pan img.lg-image')!,
        );
        expect(scaleEl.style.transform).toBe('scale3d(1, 1, 1)');
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-zoomed',
        );
    });

    it('steps scale from the toolbar buttons when enabled', () => {
        renderGallery({
            plugins: [Zoom],
            zoom: { showZoomInOutIcons: true, scale: 0.5 },
        });
        loadCurrent();
        fireEvent.click(screen.getByLabelText('Zoom in'));
        expect(
            document.querySelector<HTMLElement>('.lg-zoom-scale')!.style
                .transform,
        ).toBe('scale3d(1.5, 1.5, 1)');
        fireEvent.click(screen.getByLabelText('Zoom out'));
        expect(
            document.querySelector<HTMLElement>('.lg-zoom-scale')!.style
                .transform,
        ).toBe('scale3d(1, 1, 1)');
    });

    it('does not leak a tap into a phantom pinch (pointer ledger)', () => {
        renderGallery({ plugins: [Zoom] });
        loadCurrent();
        tick(350);
        const pan = document.querySelector<HTMLElement>('.lg-zoom-pan')!;
        const scaleEl =
            document.querySelector<HTMLElement>('.lg-zoom-scale')!;

        // A plain tap on the (unzoomed) slide: down + up, no gesture.
        firePointer(pan, 'pointerdown', { x: 100, y: 100, pointerId: 11 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 11 });

        // Next single finger must NOT read as a second pinch pointer.
        firePointer(pan, 'pointerdown', { x: 200, y: 100, pointerId: 12 });
        firePointer(window, 'pointermove', {
            x: 260,
            y: 160,
            pointerId: 12,
        });
        // A leaked tap pointer would misroute this into a pinch and
        // scale the slide; the rendered rest transform must not change.
        expect(scaleEl.style.transform).toBe('scale3d(1, 1, 1)');
        firePointer(window, 'pointerup', { x: 260, y: 160, pointerId: 12 });
    });

    it('pans (not pinches) after a double-tap zoom', () => {
        renderGallery({ plugins: [Zoom] });
        loadCurrent();
        tick(350);
        const img = document.querySelector<HTMLElement>(
            '.lg-zoom-pan img.lg-image',
        )!;
        const scaleEl =
            document.querySelector<HTMLElement>('.lg-zoom-scale')!;

        // Touch double-tap on the image zooms in (fallback scale 2).
        firePointer(img, 'pointerdown', { x: 50, y: 50, pointerId: 21 });
        firePointer(window, 'pointerup', { x: 50, y: 50, pointerId: 21 });
        tick(100);
        firePointer(img, 'pointerdown', { x: 50, y: 50, pointerId: 22 });
        firePointer(window, 'pointerup', { x: 50, y: 50, pointerId: 22 });
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');

        // The next single finger pans — a leaked tap pointer would
        // misroute this into a pinch and change the scale.
        firePointer(img, 'pointerdown', { x: 60, y: 60, pointerId: 23 });
        firePointer(window, 'pointermove', {
            x: 120,
            y: 120,
            pointerId: 23,
        });
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        firePointer(window, 'pointerup', { x: 120, y: 120, pointerId: 23 });
    });

    it('snaps a pinch release into [1, actual size] despite infiniteZoom', () => {
        renderGallery({ plugins: [Zoom] });
        loadCurrent();
        tick(350);
        const pan = document.querySelector<HTMLElement>('.lg-zoom-pan')!;
        const scaleEl =
            document.querySelector<HTMLElement>('.lg-zoom-scale')!;

        // Pinch far beyond the actual-size scale (jsdom fallback max: 2).
        firePointer(pan, 'pointerdown', { x: 100, y: 100, pointerId: 41 });
        firePointer(pan, 'pointerdown', { x: 200, y: 100, pointerId: 42 });
        firePointer(window, 'pointermove', {
            x: 500,
            y: 100,
            pointerId: 42,
        });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 41 });
        // 2.x pinch touchend rule: release lands on actual size even with
        // the infiniteZoom default.
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        firePointer(window, 'pointerup', { x: 500, y: 100, pointerId: 42 });

        // Reset to the unzoomed state, then pinch inwards below fit and
        // release: back to scale 1. Starting from scale 1 exercises the
        // commit-equals-previous-state path (React must still write).
        fireEvent.dblClick(
            document.querySelector('.lg-zoom-pan img.lg-image')!,
        );
        firePointer(pan, 'pointerdown', { x: 100, y: 100, pointerId: 43 });
        firePointer(pan, 'pointerdown', { x: 300, y: 100, pointerId: 44 });
        firePointer(window, 'pointermove', {
            x: 140,
            y: 100,
            pointerId: 44,
        });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 43 });
        expect(scaleEl.style.transform).toBe('scale3d(1, 1, 1)');
        firePointer(window, 'pointerup', { x: 140, y: 100, pointerId: 44 });
    });

    it('disables transitions during a pinch and settles on release', () => {
        renderGallery({ plugins: [Zoom] });
        loadCurrent();
        tick(350);
        const pan = document.querySelector<HTMLElement>('.lg-zoom-pan')!;
        const scaleEl =
            document.querySelector<HTMLElement>('.lg-zoom-scale')!;

        firePointer(pan, 'pointerdown', { x: 100, y: 100, pointerId: 31 });
        firePointer(pan, 'pointerdown', { x: 200, y: 100, pointerId: 32 });
        // Live pinch tracks 1:1 — no easing between finger positions.
        expect(pan.style.transition).toBe('none');
        expect(scaleEl.style.transition).toBe('none');

        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 31 });
        // Release snaps with the 2.x settle ease.
        expect(scaleEl.style.transition).toBe(
            'transform 0.8s cubic-bezier(0, 0, 0.25, 1)',
        );
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 32 });
    });

    it('projects a zoomed-pan release with 2.x momentum, clamped to bounds', () => {
        renderGallery({ plugins: [Zoom] });
        loadCurrent();
        tick(350);
        const pan = document.querySelector<HTMLElement>('.lg-zoom-pan')!;
        const img = document.querySelector<HTMLElement>(
            '.lg-zoom-pan img.lg-image',
        )!;
        // jsdom has no layout: stub the metrics the pan bounds derive
        // from. Image fitted at 400x300, natural 1600 → actual-size scale
        // 4; at that scale the pan bounds are ±600 x, ±450 y.
        Object.defineProperty(img, 'offsetWidth', { value: 400 });
        Object.defineProperty(img, 'offsetHeight', { value: 300 });
        Object.defineProperty(img, 'naturalWidth', { value: 1600 });
        const slide = img.closest<HTMLElement>('.lg-item')!;
        Object.defineProperty(slide, 'offsetWidth', { value: 400 });
        Object.defineProperty(slide, 'offsetHeight', { value: 300 });

        fireEvent.dblClick(img);
        expect(
            document.querySelector<HTMLElement>('.lg-zoom-scale')!.style
                .transform,
        ).toBe('scale3d(4, 4, 1)');

        // 100px drag over 100ms: speed = 100/100 + 1 = 2 → the release
        // travels double the finger delta (2.x `touchendZoom`).
        firePointer(pan, 'pointerdown', { x: 300, y: 100, pointerId: 51 });
        tick(100);
        firePointer(window, 'pointermove', { x: 200, y: 100, pointerId: 51 });
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 51 });
        expect(pan.style.transform).toBe('translate3d(-200px, 0px, 0)');
        // The projected pan settles with the 2.x post-gesture ease.
        expect(pan.style.transition).toBe(
            'transform 0.8s cubic-bezier(0, 0, 0.25, 1)',
        );

        // A flick (100px in 20ms) passes speed 2 and gains the extra step
        // (factor 7); the projection -200 + -700 clamps into the -600
        // bound instead of overshooting.
        firePointer(pan, 'pointerdown', { x: 300, y: 100, pointerId: 52 });
        tick(20);
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 52 });
        expect(pan.style.transform).toBe('translate3d(-600px, 0px, 0)');
    });

    it('suppresses swipe navigation while zoomed and resets on slide change', () => {
        renderGallery({ plugins: [Zoom] });
        zoomIn();
        expect(document.querySelector('.lg-outer')).toHaveClass('lg-zoomed');

        // A drag past the swipe threshold must NOT navigate while zoomed.
        const item = document.querySelector('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 300, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointerup', { x: 100, y: 100 });
        expect(counterText()).toBe('1');

        // Navigation via the button resets the zoom.
        fireEvent.click(screen.getByLabelText('Next slide'));
        tick(600);
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-zoomed',
        );
        expect(counterText()).toBe('2');

        // And swipe works again after the reset.
        const next = document.querySelector('.lg-item.lg-current')!;
        fireEvent.load(screen.getByAltText('b'));
        firePointer(next, 'pointerdown', { x: 300, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointerup', { x: 100, y: 100 });
        expect(counterText()).toBe('3');
        tick(600);
    });
});
