import '@testing-library/jest-dom';
import lightGallery from '../src';
import { LightGallerySettings } from '../src/lg-settings';
import { LightGallery } from '../src/lightgallery';
import OriginCrop from '../src/plugins/originCrop/lg-origin-crop';

describe('origin crop plugin', () => {
    // A square grid tile cropped with `object-fit: cover` shows a window
    // of the image. The built-in flight squashes the whole slide into the
    // tile; with the plugin the window lands on the tile at a uniform
    // scale while two boxes around the slides crop the rest, opening with
    // the flight.
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
    const scales = (value: string) => {
        const match = /scale3d\(([^,]+), ([^,]+), 1\)/.exec(value);
        return match ? [parseFloat(match[1]), parseFloat(match[2])] : [];
    };
    // Mutation records and the plugin's close step arrive on microtasks,
    // as they do in a browser at the end of each task.
    const flush = async () => {
        await Promise.resolve();
        await Promise.resolve();
    };
    const step = async (ms: number) => {
        jest.advanceTimersByTime(ms);
        await flush();
    };
    let spies: jest.SpyInstance[];
    let naturalWidth: jest.SpyInstance;
    let naturalHeight: jest.SpyInstance;
    // Other suites may leave client-size accessors defined closer to the
    // element than Element.prototype, where a spy would be shadowed:
    // define the stage size as own accessors and put the previous
    // descriptors back afterwards.
    const clientSize: Record<string, PropertyDescriptor | undefined> = {};
    const defineClientSize = (property: string, size: number) => {
        clientSize[property] = Object.getOwnPropertyDescriptor(
            HTMLElement.prototype,
            property,
        );
        Object.defineProperty(HTMLElement.prototype, property, {
            configurable: true,
            get(this: Element) {
                return this.classList.contains('lg-outer') ? size : 0;
            },
        });
    };
    beforeEach(() => {
        jest.useFakeTimers();
        naturalWidth = jest
            .spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get')
            .mockReturnValue(240);
        naturalHeight = jest
            .spyOn(HTMLImageElement.prototype, 'naturalHeight', 'get')
            .mockReturnValue(160);
        spies = [
            naturalWidth,
            naturalHeight,
            // Tiles are 100×100 squares; the stage is 1000×800 at the
            // viewport origin.
            jest
                .spyOn(Element.prototype, 'getBoundingClientRect')
                .mockImplementation(function (this: Element) {
                    return this.classList.contains('tile')
                        ? rect(100, 200, 100, 100)
                        : rect(0, 0, 1000, 800);
                }),
        ];
        defineClientSize('clientWidth', 1000);
        defineClientSize('clientHeight', 800);
        document.head.innerHTML = `<style>
            .lg-outer { padding: 0; }
            .cover { object-fit: cover; }
            .left { object-position: 0% 50%; }
            .bg {
                background-image: url(c-thumb.png);
                background-size: cover;
            }
        </style>`;
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png" data-lg-size="1500-1000">
                    <img class="tile cover" src="a-thumb.png" />
                </a>
                <a href="b.png" data-lg-size="1500-1000">
                    <img class="tile" src="b-thumb.png" />
                </a>
                <a href="c.png" data-lg-size="1500-1000" class="tile bg"></a>
                <a href="d.png" data-lg-size="1500-1000">
                    <img class="tile cover left" src="d-thumb.png" />
                </a>
            </div>`;
    });
    afterEach(() => {
        spies.forEach((spy) => spy.mockRestore());
        Object.keys(clientSize).forEach((property) => {
            const previous = clientSize[property];
            if (previous) {
                Object.defineProperty(
                    HTMLElement.prototype,
                    property,
                    previous,
                );
            } else {
                delete (
                    HTMLElement.prototype as unknown as Record<string, unknown>
                )[property];
            }
        });
        document.head.innerHTML = '';
        jest.useRealTimers();
    });
    const init = (settings: Partial<LightGallerySettings> = {}) =>
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            zoomFromOrigin: true,
            startAnimationDuration: 400,
            backdropDuration: 300,
            plugins: [OriginCrop],
            ...settings,
        });
    const trigger = (index: number) =>
        document.querySelectorAll('#lightGallery a')[index] as HTMLElement;
    const currentItem = () =>
        document.querySelector('.lg-item.lg-current') as HTMLElement;
    const inner = () => document.querySelector('.lg-inner') as HTMLElement;
    const content = () => document.querySelector('.lg-content') as HTMLElement;
    const boxes = () =>
        Array.from(
            document.querySelectorAll('.lg-origin-crop'),
        ) as HTMLElement[];
    const outerBox = () => boxes()[0];
    const innerBox = () => boxes()[1];
    // Stage 1000×800 at the origin, tile 100×100 at (100, 200): the outer
    // box's bottom-right corner meets the tile's, the inner box's top-left
    // corner meets the tile's.
    const OUTER_START = 'translate3d(-800px, -500px, 0)';
    const INNER_START = 'translate3d(900px, 700px, 0)';
    const REST = 'translate3d(0, 0, 0)';

    it('wraps the slides alone in two stage boxes', () => {
        init();
        const [outer, innerOne] = boxes();
        expect(boxes()).toHaveLength(2);
        expect(outer.parentElement).toBe(content());
        expect(innerOne.parentElement).toBe(outer);
        expect(inner().parentElement).toBe(innerOne);
        // The arrows stay in the stage, outside the crop.
        expect(document.querySelector('.lg-prev')!.parentElement).toBe(
            content(),
        );
        // Inert: they fill the stage and carry nothing else.
        expect(outer.getAttribute('style')).toBe(
            'position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;',
        );
    });

    it('flies the crop window at a uniform scale and reveals the rest', async () => {
        init();
        trigger(0).click();
        // Before anything shows, the boxes crop the stage to the tile.
        expect(outerBox().style.transform).toBe(OUTER_START);
        expect(innerBox().style.transform).toBe(INNER_START);
        expect(outerBox().style.overflow).toBe('hidden');
        expect(innerBox().style.overflow).toBe('hidden');
        expect(outerBox().style.transitionProperty).toBe('none');

        await step(0);
        const item = currentItem();
        // The 3:2 image fits the stage at 1000×666.67; the tile shows its
        // middle two thirds, so both axes scale by 100/666.67. Inside the
        // shifted boxes the window centres in the tile-sized box at the
        // stage's top-left: (100-1000)/2 and (100-800)/2.
        const [scaleX, scaleY] = scales(item.style.transform);
        expect(scaleX).toBeCloseTo(0.15, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(item.style.transform).toMatch(
            /^translate3d\(-450px, -350px, 0\)/,
        );

        // The core flips the slide to rest; the boxes open with it, on
        // the slide's duration.
        await step(100);
        expect(item.style.transform).toBe(REST);
        [outerBox(), innerBox()].forEach((box) => {
            expect(box.style.transform).toBe(REST);
            expect(box.style.transitionProperty).toBe('transform');
            expect(box.style.transitionDuration).toBe('400ms');
        });

        // The core settles the flight; the boxes let go.
        await step(500);
        expect(item.getAttribute('style')).toBeNull();
        [outerBox(), innerBox()].forEach((box) => {
            expect(box.style.transform).toBe('');
            expect(box.style.overflow).toBe('');
            expect(box.style.transitionProperty).toBe('');
        });
    });

    it('never styles the core elements', async () => {
        init();
        trigger(0).click();
        await step(0);
        await step(100);
        expect(content().style.transform).toBe('');
        expect(content().style.overflow).toBe('');
        expect(inner().style.transform).toBe('');
        expect(inner().style.transitionProperty).toBe('');
        expect(inner().style.transitionTimingFunction).toBe('ease');
    });

    it('keeps the built-in flight for an uncropped thumbnail', async () => {
        // The default object-fit stretches the file into the square tile,
        // so the flight has to stretch too: no crop, non-uniform scale.
        const lg = init();
        lg.openGallery(1, trigger(1));
        await step(0);
        const item = currentItem();
        const [scaleX, scaleY] = scales(item.style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(item.style.transform).toMatch(
            /^translate3d\(-350px, -150px, 0\)/,
        );
        expect(outerBox().style.transform).toBe('');
        expect(innerBox().style.transform).toBe('');
    });

    it('is the built-in flight without the plugin', async () => {
        // The core alone squashes a cropped tile as it always did.
        const lg = init({ plugins: [] });
        expect(boxes()).toHaveLength(0);
        lg.openGallery(0, trigger(0));
        await step(0);
        const [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
    });

    it('can be disabled by its setting', async () => {
        const lg = init({ originCrop: false } as Partial<LightGallerySettings>);
        expect(boxes()).toHaveLength(0);
        lg.openGallery(0, trigger(0));
        await step(0);
        const [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
    });

    it('follows object-position', async () => {
        const lg = init();
        lg.openGallery(3, trigger(3));
        await step(0);
        // The tile shows the left two thirds: the window centre sits a
        // sixth of the width (166.67px) left of the image centre, 25px
        // once scaled, so the slide starts 25px further right. The crop
        // is the tile's box either way.
        expect(currentItem().style.transform).toMatch(
            /^translate3d\(-425px, -350px, 0\)/,
        );
        expect(outerBox().style.transform).toBe(OUTER_START);
        expect(innerBox().style.transform).toBe(INNER_START);
    });

    it('flies a background-image thumbnail from its crop', async () => {
        const lg = init();
        lg.openGallery(2, trigger(2));
        await step(0);
        const [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.15, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(outerBox().style.transform).toBe(OUTER_START);
        // The background image is the dummy that flies.
        expect(document.querySelector('.lg-dummy-img')).toHaveAttribute(
            'src',
            'c-thumb.png',
        );
    });

    it('sizes the dummy to the region a pre-cropped file covers', async () => {
        // A square thumbnail file: its pixels are the centre square of
        // the 3:2 image, so the dummy covers only that square of the
        // fitted image box (666.67px wide, starting a sixth in).
        naturalWidth.mockReturnValue(300);
        naturalHeight.mockReturnValue(300);
        init();
        trigger(0).click();
        await step(0);
        const dummy = document.querySelector('.lg-dummy-img') as HTMLElement;
        expect(parseFloat(dummy.style.width)).toBeCloseTo(666.667, 2);
        expect(parseFloat(dummy.style.height)).toBeCloseTo(666.667, 2);
        expect(parseFloat(dummy.style.marginLeft)).toBeCloseTo(-333.333, 2);
        expect(parseFloat(dummy.style.marginTop)).toBeCloseTo(-333.333, 2);
    });

    it('closes onto the crop window with the stage boxes', async () => {
        const lg = init();
        trigger(0).click();
        await step(0);
        await step(100);
        await step(500);
        const item = currentItem();
        expect(outerBox().style.transform).toBe('');

        lg.closeGallery();
        await flush();
        expect(item).toHaveClass('lg-start-end-progress');
        const [scaleX, scaleY] = scales(item.style.transform);
        expect(scaleX).toBeCloseTo(0.15, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(item.style.transform).toMatch(
            /^translate3d\(-450px, -350px, 0\)/,
        );
        expect(outerBox().style.transform).toBe(OUTER_START);
        expect(innerBox().style.transform).toBe(INNER_START);
        [outerBox(), innerBox()].forEach((box) => {
            expect(box.style.overflow).toBe('hidden');
            expect(box.style.transitionProperty).toBe('transform');
            expect(box.style.transitionDuration).toBe('400ms');
        });

        // Gone: the boxes are inert again for the next open.
        await step(600);
        [outerBox(), innerBox()].forEach((box) => {
            expect(box.style.transform).toBe('');
            expect(box.style.overflow).toBe('');
        });
    });

    it('hands an opening flight still running over to the close', async () => {
        const lg = init();
        trigger(0).click();
        await step(0);
        lg.closeGallery();
        await flush();
        expect(outerBox().style.transform).toBe(OUTER_START);
        expect(outerBox().style.transitionProperty).toBe('transform');
        // The opening flip no longer moves the stage.
        await step(100);
        expect(outerBox().style.transform).toBe(OUTER_START);
    });

    it('lets go of the core on destroy', () => {
        const lg = init();
        lg.destroy();
        expect(boxes()).toHaveLength(0);
        expect(lg.getOriginTransform).toBe(
            LightGallery.prototype.getOriginTransform,
        );
        expect(lg.getDummyImgStyles).toBe(
            LightGallery.prototype.getDummyImgStyles,
        );
    });
});
