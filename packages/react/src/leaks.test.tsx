import { act, fireEvent, render } from '@testing-library/react';
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

const ALL_PLUGINS = [
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
];

const slides: GalleryItem[] = Array.from({ length: 6 }, (_ignored, i) => ({
    src: `img-${i}.jpg`,
    alt: `img ${i}`,
    thumb: `thumb-${i}.jpg`,
}));

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

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
    Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });
    act(() => {
        target.dispatchEvent(event);
    });
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

describe('global leak audit', () => {
    it('all 13 plugins: open, interact, unmount → no leaked listeners or timers', () => {
        const docAdd = vi.spyOn(document, 'addEventListener');
        const docRemove = vi.spyOn(document, 'removeEventListener');
        const winAdd = vi.spyOn(window, 'addEventListener');
        const winRemove = vi.spyOn(window, 'removeEventListener');

        const { unmount } = render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                plugins={ALL_PLUGINS}
                comment={{
                    commentBox: true,
                    renderComments: () => <p>c</p>,
                }}
            />,
        );
        tick(450);
        fireEvent.load(document.querySelector('img.lg-image[alt="img 0"]')!);

        // Navigate via button, swipe, zoom double-click, thumb drag.
        fireEvent.click(document.querySelectorAll('.lg-thumb-item')[2]!);
        tick(600);
        const item = document.querySelector('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 300, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointerup', { x: 100, y: 100 });
        tick(600);
        tick(400); // enableZoomAfter
        const zoomPan = document.querySelector('.lg-item.lg-current .lg-zoom-pan');
        if (zoomPan) {
            fireEvent.dblClick(zoomPan);
        }
        const thumbTrack = document.querySelector('.lg-thumb')!;
        firePointer(thumbTrack, 'pointerdown', { x: 100, y: 10 });
        firePointer(window, 'pointermove', { x: 50, y: 10 });
        firePointer(window, 'pointerup', { x: 50, y: 10 });

        unmount();

        expect(document.querySelector('.lg-container')).toBeNull();
        expect(vi.getTimerCount()).toBe(0);
        // React keeps its own delegated listeners (mouseover/out,
        // selectionchange) on the document for the page lifetime; audit only
        // the event types our code attaches.
        const OUR_DOC_EVENTS = [
            'keydown',
            'fullscreenchange',
            'webkitfullscreenchange',
        ];
        const countByType = (calls: unknown[][], only?: string[]) =>
            calls
                .map(([type]) => type as string)
                .filter((type) => !only || only.includes(type))
                .sort();
        expect(countByType(docRemove.mock.calls, OUR_DOC_EVENTS)).toEqual(
            countByType(docAdd.mock.calls, OUR_DOC_EVENTS),
        );
        expect(countByType(winRemove.mock.calls)).toEqual(
            countByType(winAdd.mock.calls),
        );

        docAdd.mockRestore();
        docRemove.mockRestore();
        winAdd.mockRestore();
        winRemove.mockRestore();
    });

    it('pointermove causes zero React renders with all plugins mounted', () => {
        let renders = 0;
        function Probe() {
            renders++;
            return null;
        }
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                plugins={ALL_PLUGINS}
            >
                <Probe />
            </LightGallery>,
        );
        tick(450);
        fireEvent.load(document.querySelector('img.lg-image[alt="img 0"]')!);

        const item = document.querySelector('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 300, y: 100 });
        const rendersAfterDown = renders;
        for (let i = 0; i < 8; i++) {
            firePointer(window, 'pointermove', { x: 280 - i * 10, y: 100 });
        }
        expect(renders).toBe(rendersAfterDown);
        firePointer(window, 'pointerup', { x: 200, y: 100 });
        tick(600);
    });
});
