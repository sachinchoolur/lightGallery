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
import utils from '../src/lg-utils';
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
    it('Should parse data-sources into an array of picture sources', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png" data-sources='[{"srcset":"a-m.png","media":"(min-width:481px)"},{"srcset":"a-s.png","media":"(min-width:376px)"}]'>
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        expect(LG.galleryItems[0].sources).toEqual([
            { srcset: 'a-m.png', media: '(min-width:481px)' },
            { srcset: 'a-s.png', media: '(min-width:376px)' },
        ]);
        // The slide markup consumes the parsed array as-is.
        const markup = utils.getImgMarkup(
            0,
            'a.png',
            '',
            undefined,
            undefined,
            LG.galleryItems[0].sources,
        );
        expect(markup.match(/<source /g)).toHaveLength(2);
        expect(markup).toContain('srcset="a-m.png"');
    });
    it('Should drop malformed data-sources with a warning', () => {
        const warn = jest
            .spyOn(console, 'warn')
            .mockImplementation(() => undefined);
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png" data-sources='not json'>
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        expect(LG.galleryItems[0].sources).toBeUndefined();
        expect(warn).toHaveBeenCalledWith(
            expect.stringContaining('docs/responsive-loading/'),
        );
        warn.mockRestore();
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

    it('flies from the transform a plugin gives for the trigger', () => {
        // getOriginTransform is the flight's hook: replaced on the
        // instance, it sets where the opening flight starts and where the
        // closing one ends.
        const lg = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            { zoomFromOrigin: true, startAnimationDuration: 400 },
        );
        const trigger = document.querySelector(
            '#lightGallery a',
        ) as HTMLElement;
        const calls: HTMLElement[] = [];
        lg.getOriginTransform = (element) => {
            calls.push(element);
            return 'translate3d(1px, 2px, 0) scale3d(0.5, 0.5, 1)';
        };
        trigger.click();
        jest.advanceTimersByTime(20);
        const item = document.querySelector(
            '.lg-item.lg-current',
        ) as HTMLElement;
        expect(item.style.transform).toBe(
            'translate3d(1px, 2px, 0) scale3d(0.5, 0.5, 1)',
        );
        jest.advanceTimersByTime(1000);
        lg.closeGallery();
        expect(item.style.transform).toBe(
            'translate3d(1px, 2px, 0) scale3d(0.5, 0.5, 1)',
        );
        expect(calls).toEqual([trigger, trigger]);
    });
});

describe('closing without a thumbnail to return to', () => {
    // A collage hides its overflow items behind a "+N photos" tile: their
    // triggers measure 0×0 at the viewport origin, and the close flight
    // used to aim there, shrinking the slide into the top-left corner.
    const CENTER = 'translate3d(0, 0, 0) scale3d(0.5, 0.5, 1)';
    const rect = (left: number, top: number, width: number, height: number) =>
        ({
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
            x: left,
            y: top,
            toJSON: () => ({}),
        } as DOMRect);
    let spies: jest.SpyInstance[];
    beforeEach(() => {
        jest.useFakeTimers();
        spies = [
            jest
                .spyOn(Element.prototype, 'getBoundingClientRect')
                .mockImplementation(function (this: Element) {
                    return this.closest('[hidden]')
                        ? rect(0, 0, 0, 0)
                        : rect(10, 10, 100, 80);
                }),
            jest
                .spyOn(Element.prototype, 'clientWidth', 'get')
                .mockReturnValue(100),
            jest
                .spyOn(Element.prototype, 'clientHeight', 'get')
                .mockReturnValue(80),
        ];
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png" data-lg-size="1600-1067">
                    <img src="a-thumb.png" />
                </a>
                <a href="b.png" data-lg-size="1600-1067" hidden>
                    <img src="b-thumb.png" />
                </a>
            </div>`;
    });
    afterEach(() => {
        spies.forEach((spy) => spy.mockRestore());
        jest.useRealTimers();
    });
    const init = (settings: Record<string, unknown> = {}) =>
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            zoomFromOrigin: true,
            startAnimationDuration: 400,
            backdropDuration: 300,
            ...settings,
        });
    const trigger = (index: number) =>
        document.querySelectorAll('#lightGallery a')[index] as HTMLElement;

    it('shrinks to the centre and fades when the current trigger is hidden', () => {
        const lg = init();
        trigger(0).click();
        jest.advanceTimersByTime(1000);
        lg.slide(1, false, false, 'next');
        jest.advanceTimersByTime(1000);

        lg.closeGallery();
        const outer = document.querySelector('.lg-outer')!;
        expect(outer).toHaveClass('lg-closing');
        expect(outer).toHaveClass('lg-zoom-from-image');
        expect(outer).toHaveClass('lg-close-to-center');
        const item = document.querySelector(
            '.lg-item.lg-current',
        ) as HTMLElement;
        expect(item).toHaveClass('lg-start-end-progress');
        expect(item.style.transform).toBe(CENTER);
        expect(item.style.transitionDuration).toBe('400ms');

        jest.advanceTimersByTime(600);
        expect(outer).not.toHaveClass('lg-close-to-center');
        expect(outer).not.toHaveClass('lg-closing');
        expect(outer).not.toHaveClass('lg-zoom-from-image');
    });

    it('still flies back to a visible trigger', () => {
        const lg = init();
        trigger(0).click();
        jest.advanceTimersByTime(1000);

        lg.closeGallery();
        const outer = document.querySelector('.lg-outer')!;
        expect(outer).toHaveClass('lg-closing');
        expect(outer).not.toHaveClass('lg-close-to-center');
        const item = document.querySelector(
            '.lg-item.lg-current',
        ) as HTMLElement;
        expect(item).toHaveClass('lg-start-end-progress');
        expect(item.style.transform).toContain('scale3d(');
        expect(item.style.transform).not.toBe(CENTER);
    });

    it('opens from a hidden trigger with the start class, not a flight', () => {
        const lg = init();
        lg.openGallery(1, trigger(1));
        jest.advanceTimersByTime(20);
        const outer = document.querySelector('.lg-outer')!;
        expect(outer).toHaveClass('lg-start-zoom');
        const item = document.querySelector(
            '.lg-item.lg-current',
        ) as HTMLElement;
        expect(item).not.toHaveClass('lg-start-end-progress');
        expect(item.style.transform).toBe('');
    });

    it('shrinks to the centre when zoomFromOrigin is off', () => {
        // The startClass open scales up from the centre; the zoom close
        // mirrors it rather than cutting to the old fade.
        const lg = init({ zoomFromOrigin: false });
        lg.openGallery(1, trigger(1));
        jest.advanceTimersByTime(1000);

        lg.closeGallery();
        const outer = document.querySelector('.lg-outer')!;
        expect(outer).toHaveClass('lg-closing');
        expect(outer).toHaveClass('lg-close-to-center');
        const item = document.querySelector(
            '.lg-item.lg-current',
        ) as HTMLElement;
        expect(item.style.transform).toBe(CENTER);
    });
});

describe('vertical drag when the gallery cannot close', () => {
    // closable:false (the inline-gallery setup) forces swipeToClose off,
    // so a vertical drag applies nothing. The release must not spring
    // either: springing jumps the slide to the drag offset first.
    const fireTouch = (target: Element, type: string, pageY: number) => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        const touch = { pageX: 200, pageY };
        Object.defineProperty(event, 'touches', {
            value: type === 'touchend' ? [] : [touch],
        });
        Object.defineProperty(event, 'changedTouches', { value: [touch] });
        target.dispatchEvent(event);
    };
    const dragDown = (): HTMLElement => {
        const slide = document.querySelector('.lg-item.lg-current')!;
        fireTouch(slide, 'touchstart', 100);
        fireTouch(slide, 'touchmove', 180);
        fireTouch(slide, 'touchmove', 260);
        fireTouch(slide, 'touchend', 260);
        jest.advanceTimersByTime(50);
        return document.querySelector('.lg-container')!;
    };
    const open = (settings: Record<string, unknown>) => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png"><img src="a-t.png" /></a>
                <a href="b.png"><img src="b-t.png" /></a>
                <a href="c.png"><img src="c-t.png" /></a>
            </div>`;
        const lg = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            { zoomFromOrigin: false, ...settings },
        );
        lg.openGallery(0);
        jest.advanceTimersByTime(500);
        return lg;
    };
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    it('leaves the slide alone when closable is false', () => {
        open({ closable: false });
        const container = dragDown();
        // springVerticalRestore marks the container as it starts; the
        // slide keeps no inline transform either.
        expect(container).not.toHaveClass('lg-dragging-vertical');
        expect(
            document.querySelector<HTMLElement>('.lg-item.lg-current')!.style
                .transform,
        ).toBe('');
    });

    it('still springs the drag back when the gallery can close', () => {
        open({});
        expect(dragDown()).toHaveClass('lg-dragging-vertical');
    });
});

describe('per-property transition durations', () => {
    // The mode transitions declare `transform` then `opacity`; the
    // runtime publishes the speed so the stylesheet can give each its
    // own duration instead of one inherited value stretching the fade.
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    it('publishes the slide speed to the slides', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png"><img src="a-t.png" /></a>
            </div>`;
        const lg = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            { zoomFromOrigin: false, speed: 250 },
        );
        lg.openGallery(0);
        jest.advanceTimersByTime(500);
        const inner = document.querySelector<HTMLElement>('.lg-inner')!;
        expect(inner.style.getPropertyValue('--lg-speed')).toBe('250ms');
    });
});

describe('drag hand-back ordering', () => {
    // Everything that changes a slide's resting place has to happen
    // while lg-dragging still pins transition-duration to 0s. Anything
    // done after it animates, and the outgoing slide is seen gliding
    // back toward the centre as it fades.
    const endDragVisuals = (
        LightGallery.prototype as unknown as Record<string, () => void>
    )['endDragVisuals'];

    const record = (mode: string): string[] => {
        const order: string[] = [];
        const outer = {
            find: () => ({
                removeAttr: () => {
                    order.push('clear-inline-styles');
                },
            }),
            get: () => ({
                get offsetHeight() {
                    order.push('flush');
                    return 0;
                },
            }),
            removeClass: (name: string) => {
                order.push(`remove:${name}`);
            },
        };
        endDragVisuals.call({ settings: { mode }, outer });
        return order;
    };

    it('drops the styles and the forced mode before handing back', () => {
        expect(record('lg-fade')).toEqual([
            'clear-inline-styles',
            'remove:lg-slide',
            'flush',
            'remove:lg-dragging',
        ]);
    });

    it('leaves the mode class alone when slide IS the mode', () => {
        expect(record('lg-slide')).toEqual([
            'clear-inline-styles',
            'flush',
            'remove:lg-dragging',
        ]);
    });
});

describe('fitted media size follows the current slide', () => {
    // Everything that measures against the fitted size (actual-size
    // zoom, the close flight) reads one cached value. Caching it only at
    // open makes a portrait slide reached by navigation measure against
    // the opening slide's landscape width: the zoom animates to the
    // wrong scale and then snaps when the natural-px swap lands.
    const STAGE = { width: 1000, height: 800 };
    let widthSpy: jest.SpyInstance;
    let heightSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.useFakeTimers();
        widthSpy = jest
            .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
            .mockImplementation(function (this: HTMLElement) {
                return this.classList.contains('lg-outer') ? STAGE.width : 0;
            });
        heightSpy = jest
            .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
            .mockImplementation(function (this: HTMLElement) {
                return this.classList.contains('lg-outer') ? STAGE.height : 0;
            });
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png" data-lg-size="1600-1067">
                    <img src="a-t.png" />
                </a>
                <a href="b.png" data-lg-size="1067-1600">
                    <img src="b-t.png" />
                </a>
            </div>`;
    });
    afterEach(() => {
        widthSpy.mockRestore();
        heightSpy.mockRestore();
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    it('recomputes the fit when the slide changes', () => {
        const lg = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            { zoomFromOrigin: false, speed: 0 },
        );
        const outer = document.querySelector<HTMLElement>('.lg-outer')!;
        outer.style.padding = '0px';

        lg.openGallery(0);
        jest.advanceTimersByTime(500);
        // Landscape: width-constrained by the 1000px stage.
        const landscape = lg.currentImageSize!;
        expect(Math.round(landscape.width)).toBe(1000);

        lg.slide(1, false, false, 'next');
        jest.advanceTimersByTime(500);
        // Portrait: height-constrained, so a much narrower box.
        const portrait = lg.currentImageSize!;
        expect(Math.round(portrait.height)).toBe(800);
        expect(Math.round(portrait.width)).toBe(534);
        expect(portrait.width).toBeLessThan(landscape.width);
    });
});
