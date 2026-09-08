/**
 * Dummy test
 */
// declare const MutationObserver: any;
// import MutationObserver from '@sheerun/mutationobserver-shim';
//window.MutationObserver = MutationObserver;
import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import Autoplay from '../src/plugins/autoplay/lg-autoplay';
import Fullscreen from '../src/plugins/fullscreen/lg-fullscreen';
import Pager from '../src/plugins/pager/lg-pager';
import Rotate from '../src/plugins/rotate/lg-rotate';
import Share from '../src/plugins/share/lg-share';
import Thumbnails from '../src/plugins/thumbnail/lg-thumbnail';
import Zoom from '../src/plugins/zoom/lg-zoom';

describe('Initialize', () => {
    it('Should be able to initialize lightGallery', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        expect(document.querySelector('.lg-container')).toBeInTheDocument();
    });
    it('Should be able to display close button', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        expect(
            document.querySelector('button[aria-label="Close gallery"]'),
        ).toBeInTheDocument();
    });
    it('Should not display close icon', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            closable: false,
        });
        expect(
            document.querySelector('button[aria-label="closeGallery"]'),
        ).not.toBeInTheDocument();
    });
});
describe('decode gate (onSlideObjectLoad adapter)', () => {
    // Prototype-extraction harness (same pattern as test/lg-zoom.test.ts):
    // the gate's ordering is pinned without a full gallery open.
    const onSlideObjectLoad = LightGallery.prototype.onSlideObjectLoad as (
        this: unknown,
        $slide: unknown,
        isHTML5VideoWithoutPoster: boolean,
        onLoad: () => void,
        onError: () => void,
    ) => void;

    const makeSlide = (img: HTMLImageElement) => ({
        find: () => ({
            first: () => ({ get: () => img, on: () => undefined }),
        }),
    });

    it('holds completion until decode settles (cached-image path)', async () => {
        const img = new Image();
        Object.defineProperty(img, 'complete', { value: true });
        Object.defineProperty(img, 'naturalWidth', { value: 100 });
        let settleDecode!: () => void;
        Object.defineProperty(img, 'decode', {
            value: () =>
                new Promise<void>((resolve) => {
                    settleDecode = resolve;
                }),
        });
        const onLoad = jest.fn();
        onSlideObjectLoad.call({}, makeSlide(img), false, onLoad, jest.fn());
        // Loaded (cached) but not decoded: completion must wait — a
        // flip here is exactly the partial paint the gate blocks.
        expect(onLoad).not.toHaveBeenCalled();
        settleDecode();
        await Promise.resolve();
        await Promise.resolve();
        expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('stays synchronous without decode support (jsdom default)', () => {
        const img = new Image();
        Object.defineProperty(img, 'complete', { value: true });
        Object.defineProperty(img, 'naturalWidth', { value: 100 });
        const onLoad = jest.fn();
        onSlideObjectLoad.call({}, makeSlide(img), false, onLoad, jest.fn());
        expect(onLoad).toHaveBeenCalledTimes(1);
    });
});

describe('Controls', () => {
    it('Should be able to display controls', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        await waitFor(() => {
            expect(document.querySelector('.lg-next')).toBeInTheDocument();
            expect(document.querySelector('.lg-prev')).toBeInTheDocument();
        });
    });
    it('Should not show controls if there is only one item in the slide', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        await waitFor(() => {
            expect(
                document.querySelector('.lg-single-item'),
            ).toBeInTheDocument();
        });
    });
});
describe('Plugins', () => {
    it('Should be able to initialize autoplay plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Autoplay],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-autoplay-button')).toBeTruthy(),
        );
    });
    it('Should be able to initialize Fullscreen plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        (document as any).fullscreenEnabled = true;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Fullscreen],
            fullScreen: true,
        });
        await waitFor(() => {
            console.log(document.querySelector('.lg-fullscreen'));
            expect(document.querySelector('.lg-fullscreen')).toBeTruthy();
        });
    });
    it('Should be able to initialize Pager plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Pager],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-pager-cont')).toBeTruthy(),
        );
    });
    it('Should be able to initialize Rotate plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Rotate],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-rotate-left')).toBeTruthy(),
        );
    });
    it('Should be able to initialize share plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Share],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-share')).toBeTruthy(),
        );
    });
    it('Should be able to initialize thumbnails plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Thumbnails],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-thumb-outer')).toBeTruthy(),
        );
    });
    it('Should be able to initialize zoom plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Zoom],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-zoom-in')).toBeTruthy(),
        );
    });
    it('Should disable the previous arrow', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                loop: false,
                slideEndAnimation: false,
                hideControlOnEnd: true,
            },
        );
        LG.openGallery();
        await waitFor(() => {
            expect(document.querySelector('.lg-prev')).toBeDisabled();
            expect(document.querySelector('.lg-next')).not.toBeDisabled();
        });
    });
    it('Should disable the next arrow', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                loop: false,
                slideEndAnimation: false,
                hideControlOnEnd: true,
            },
        );
        LG.openGallery(1);
        await waitFor(() => {
            expect(document.querySelector('.lg-next')).toBeDisabled();
            expect(document.querySelector('.lg-prev')).not.toBeDisabled();
        });
    });
    it('Should fetch poster from youtube videos', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="//www.youtube.com/watch?v=EIUJfXk3_3w">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        LG.openGallery(0);
        expect(LG.galleryItems[0].poster).toBe(
            '//img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        );
    });
    it('Should not fetch poster from youtube videos when turned off via settings', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="//www.youtube.com/watch?v=EIUJfXk3_3w">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                loadYouTubePoster: false,
            },
        );
        LG.openGallery(0);
        // The YouTube endpoint is skipped; the facade chain still falls
        // back to the item thumb (videoFacade default).
        expect(LG.galleryItems[0].poster).toBe('b.png');
        expect(LG.galleryItems[0].poster).not.toContain('img.youtube.com');
    });
    it('Should not fetch poster from youtube videos for image slide', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        LG.openGallery(0);
        expect(LG.galleryItems[0].poster).toBeUndefined();
    });
    it('Should not fetch poster from youtube videos for other video slides', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="//vimeo.com/112836958">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        LG.openGallery(0);
        // No YouTube endpoint for Vimeo; the facade chain resolves the
        // item thumb instead (videoFacade default).
        expect(LG.galleryItems[0].poster).toBe('b.png');
        expect(LG.galleryItems[0].poster).not.toContain('img.youtube.com');
    });
});

describe('zoom-from-origin flight landing', () => {
    // The first-slide real image must land only once the flight's
    // transform transition has ended — a fixed offset lands mid-flight
    // whenever the transition starts late (busy main thread) and the
    // image is fast (cached), swapping it in over the scaling thumb.
    const transitionEvent = (type: string, propertyName: string) =>
        Object.assign(new Event(type, { bubbles: true }), { propertyName });
    let rectSpy: jest.SpyInstance;
    beforeEach(() => {
        jest.useFakeTimers();
        rectSpy = jest
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
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png" data-lg-size="1600-1067">
                    <img src="a-thumb.png" />
                </a>
            </div>`;
    });
    afterEach(() => {
        rectSpy.mockRestore();
        jest.useRealTimers();
    });
    const open = () => {
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            zoomFromOrigin: true,
            startAnimationDuration: 400,
        });
        // Click the trigger: the flight needs the origin element.
        (document.querySelector('#lightGallery a') as HTMLElement).click();
        jest.advanceTimersByTime(20);
        // Only the thumb dummy flies; the real image is held back.
        expect(document.querySelector('.lg-dummy-img')).toHaveAttribute(
            'src',
            'a-thumb.png',
        );
        expect(document.querySelector('.lg-object')).toBeNull();
        return document.querySelector('.lg-item.lg-current') as HTMLElement;
    };

    it('lands on the fixed offset when no transition ever starts', () => {
        open();
        jest.advanceTimersByTime(470);
        expect(document.querySelector('.lg-object')).toBeNull();
        jest.advanceTimersByTime(30);
        expect(document.querySelector('.lg-object')).toBeInTheDocument();
    });

    it('holds the real image until the flight transition ends', () => {
        const item = open();
        jest.advanceTimersByTime(280);
        item.dispatchEvent(transitionEvent('transitionstart', 'transform'));
        // Past the fixed offset, still flying: nothing lands.
        jest.advanceTimersByTime(400);
        expect(document.querySelector('.lg-object')).toBeNull();
        expect(document.querySelector('.lg-dummy-img')).toBeInTheDocument();
        item.dispatchEvent(transitionEvent('transitionend', 'transform'));
        expect(document.querySelector('.lg-object')).toBeInTheDocument();
        expect(item).not.toHaveClass('lg-start-end-progress');
        expect(item.getAttribute('style')).toBeNull();
    });
});
