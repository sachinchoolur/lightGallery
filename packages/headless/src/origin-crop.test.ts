import { describe, expect, it } from 'vitest';

import {
    WHOLE_IMAGE,
    getOriginCropFlight,
    getOriginWindow,
    isWholeImage,
    parseBackgroundFit,
    parseCssPosition,
    parseCssUrl,
    parseObjectFit,
    type FractionRect,
    type OriginCropFlightInput,
} from './origin-crop';

describe('isWholeImage', () => {
    it('accepts the whole image and rounding noise', () => {
        expect(isWholeImage(WHOLE_IMAGE)).toBe(true);
        expect(
            isWholeImage({ x: 0.0001, y: 0, width: 0.9999, height: 1 }),
        ).toBe(true);
    });

    it('rejects a crop', () => {
        expect(isWholeImage({ x: 0.1, y: 0, width: 0.8, height: 1 })).toBe(
            false,
        );
    });
});

describe('parseCssPosition', () => {
    it('defaults to the centre', () => {
        expect(parseCssPosition(undefined)).toEqual({
            x: { percent: 50, px: 0 },
            y: { percent: 50, px: 0 },
        });
        expect(parseCssPosition('')).toEqual(parseCssPosition(undefined));
        expect(parseCssPosition('garbage')).toEqual(
            parseCssPosition(undefined),
        );
    });

    it('reads computed percentages and px', () => {
        expect(parseCssPosition('50% 50%')).toEqual(parseCssPosition(''));
        expect(parseCssPosition('0% 100%')).toEqual({
            x: { percent: 0, px: 0 },
            y: { percent: 100, px: 0 },
        });
        expect(parseCssPosition('10px 20.5px')).toEqual({
            x: { percent: 0, px: 10 },
            y: { percent: 0, px: 20.5 },
        });
    });

    it('reads keywords in either order and a single value', () => {
        expect(parseCssPosition('top left')).toEqual(parseCssPosition('0% 0%'));
        expect(parseCssPosition('right bottom')).toEqual(
            parseCssPosition('100% 100%'),
        );
        expect(parseCssPosition('left')).toEqual(parseCssPosition('0% 50%'));
    });

    it('reads calc offsets from edge-relative positions', () => {
        // `right 10px bottom 20px` computes to calc() pairs.
        expect(parseCssPosition('calc(100% - 10px) calc(100% + 5px)')).toEqual(
            {
                x: { percent: 100, px: -10 },
                y: { percent: 100, px: 5 },
            },
        );
    });

    it('reads only the first background layer', () => {
        expect(parseCssPosition('0% 0%, 50% 50%')).toEqual(
            parseCssPosition('0% 0%'),
        );
    });
});

describe('parseObjectFit / parseBackgroundFit', () => {
    it('maps object-fit keywords, defaulting to fill', () => {
        expect(parseObjectFit('cover')).toBe('cover');
        expect(parseObjectFit('Contain')).toBe('contain');
        expect(parseObjectFit('scale-down')).toBe('scale-down');
        expect(parseObjectFit('none')).toBe('none');
        expect(parseObjectFit('')).toBe('fill');
        expect(parseObjectFit(undefined)).toBe('fill');
    });

    it('maps background-size keywords and rejects lengths', () => {
        expect(parseBackgroundFit('cover')).toBe('cover');
        expect(parseBackgroundFit('contain, auto')).toBe('contain');
        expect(parseBackgroundFit('auto')).toBe('none');
        expect(parseBackgroundFit('auto auto')).toBe('none');
        expect(parseBackgroundFit('100% 100%')).toBe('fill');
        expect(parseBackgroundFit('50px')).toBeUndefined();
        expect(parseBackgroundFit('')).toBeUndefined();
    });
});

describe('parseCssUrl', () => {
    it('reads the first url of a background-image', () => {
        expect(parseCssUrl('url("https://x.test/a.jpg")')).toBe(
            'https://x.test/a.jpg',
        );
        expect(parseCssUrl("url('a.jpg'), url(b.jpg)")).toBe('a.jpg');
        expect(parseCssUrl('url(a.jpg)')).toBe('a.jpg');
    });

    it('returns undefined without a url', () => {
        expect(parseCssUrl('none')).toBeUndefined();
        expect(parseCssUrl(undefined)).toBeUndefined();
        expect(parseCssUrl('url()')).toBeUndefined();
    });
});

describe('getOriginWindow', () => {
    // A 3:2 image (the lg-size), thumbnails as a 240×160 downscale.
    const imageSize = { width: 1500, height: 1000 };
    const thumbSize = { width: 240, height: 160 };

    it('is the whole image for an uncropped thumbnail', () => {
        const box = { left: 10, top: 20, width: 240, height: 160 };
        const origin = getOriginWindow({ box, imageSize, thumbSize });
        expect(origin.rect).toEqual(box);
        expect(isWholeImage(origin.window)).toBe(true);
        expect(isWholeImage(origin.region)).toBe(true);
    });

    it('is the whole image for a stretched (fill) thumbnail', () => {
        // The default object-fit stretches the file into the tile; the
        // flight then has to stretch too, so the window stays whole.
        const box = { left: 10, top: 20, width: 100, height: 100 };
        const origin = getOriginWindow({
            box,
            imageSize,
            thumbSize,
            fit: 'fill',
        });
        expect(origin.rect).toEqual(box);
        expect(isWholeImage(origin.window)).toBe(true);
    });

    it('windows a cover-cropped square tile to the centre of the image', () => {
        const box = { left: 10, top: 20, width: 100, height: 100 };
        const origin = getOriginWindow({
            box,
            imageSize,
            thumbSize,
            fit: 'cover',
        });
        expect(origin.rect).toEqual(box);
        // Cover scale = 100/160; painted 150×100, offset -25px: the
        // middle 100/150 of the width.
        expect(origin.window.x).toBeCloseTo(1 / 6, 5);
        expect(origin.window.y).toBeCloseTo(0, 5);
        expect(origin.window.width).toBeCloseTo(2 / 3, 5);
        expect(origin.window.height).toBeCloseTo(1, 5);
        expect(isWholeImage(origin.region)).toBe(true);
    });

    it('follows object-position across the free space', () => {
        const box = { left: 0, top: 0, width: 100, height: 100 };
        const left = getOriginWindow({
            box,
            imageSize,
            thumbSize,
            fit: 'cover',
            position: parseCssPosition('0% 50%'),
        });
        expect(left.window.x).toBeCloseTo(0, 5);
        const right = getOriginWindow({
            box,
            imageSize,
            thumbSize,
            fit: 'cover',
            position: parseCssPosition('100% 50%'),
        });
        expect(right.window.x).toBeCloseTo(1 / 3, 5);
        const nudged = getOriginWindow({
            box,
            imageSize,
            thumbSize,
            fit: 'cover',
            position: parseCssPosition('calc(100% - 15px) 50%'),
        });
        // `right 15px` shifts the painted file 15px further left: the
        // window starts 65px into its 150px width and the tile's last
        // 15px show nothing, so the rect shrinks to the painted 85px.
        expect(nudged.window.x).toBeCloseTo(65 / 150, 5);
        expect(nudged.window.width).toBeCloseTo(85 / 150, 5);
        expect(nudged.rect.width).toBeCloseTo(85, 5);
    });

    it('assumes the image aspect for a background image', () => {
        // No file size (a background thumbnail): cover math on the
        // image's own aspect gives the same window.
        const box = { left: 0, top: 0, width: 100, height: 100 };
        const origin = getOriginWindow({ box, imageSize, fit: 'cover' });
        expect(origin.window.x).toBeCloseTo(1 / 6, 5);
        expect(origin.window.width).toBeCloseTo(2 / 3, 5);
    });

    it('shrinks the rect to the painted area of a contained thumbnail', () => {
        // A 3:2 file letterboxed in a square: 100×66.67 centred.
        const box = { left: 10, top: 20, width: 100, height: 100 };
        const origin = getOriginWindow({
            box,
            imageSize,
            thumbSize,
            fit: 'contain',
        });
        expect(origin.rect.left).toBeCloseTo(10, 5);
        expect(origin.rect.top).toBeCloseTo(20 + (100 - 200 / 3) / 2, 5);
        expect(origin.rect.width).toBeCloseTo(100, 5);
        expect(origin.rect.height).toBeCloseTo(200 / 3, 5);
        expect(isWholeImage(origin.window)).toBe(true);
    });

    it('windows a natural-size thumbnail overflowing its box', () => {
        // object-fit: none on a 240×160 file in a 100×100 box, centred:
        // the visible part is the middle 100×100 of the file.
        const box = { left: 0, top: 0, width: 100, height: 100 };
        const origin = getOriginWindow({
            box,
            imageSize,
            thumbSize,
            fit: 'none',
        });
        expect(origin.rect).toEqual(box);
        expect(origin.window.x).toBeCloseTo(70 / 240, 5);
        expect(origin.window.y).toBeCloseTo(30 / 160, 5);
        expect(origin.window.width).toBeCloseTo(100 / 240, 5);
        expect(origin.window.height).toBeCloseTo(100 / 160, 5);
    });

    it('falls back to the stretch for natural-size fits without a file size', () => {
        const box = { left: 0, top: 0, width: 100, height: 100 };
        const origin = getOriginWindow({ box, imageSize, fit: 'none' });
        expect(origin.rect).toEqual(box);
        expect(isWholeImage(origin.window)).toBe(true);
    });

    it('takes a pre-cropped file as a centred crop of the image', () => {
        // A square thumbnail file shown square: its pixels are the
        // centre square of the 3:2 image, and the dummy must cover only
        // that region.
        const box = { left: 0, top: 0, width: 100, height: 100 };
        const origin = getOriginWindow({
            box,
            imageSize,
            thumbSize: { width: 300, height: 300 },
            fit: 'cover',
        });
        const width = 1000 / 1500;
        expect(origin.region.x).toBeCloseTo((1 - width) / 2, 5);
        expect(origin.region.y).toBeCloseTo(0, 5);
        expect(origin.region.width).toBeCloseTo(width, 5);
        expect(origin.region.height).toBeCloseTo(1, 5);
        expect(origin.window).toEqual(origin.region);
    });

    it('composes a cover crop of a pre-cropped file', () => {
        // A 4:3 file (the centre 4:3 of the image) cover-fitted into a
        // square tile: the tile shows the centre square of that region.
        const box = { left: 0, top: 0, width: 100, height: 100 };
        const origin = getOriginWindow({
            box,
            imageSize: { width: 1600, height: 800 },
            thumbSize: { width: 400, height: 300 },
            fit: 'cover',
        });
        // Region: 4:3 of a 2:1 image = width 2/3, x = 1/6.
        expect(origin.region.width).toBeCloseTo(2 / 3, 5);
        // Window: the square is 3/4 of the file's width, centred.
        expect(origin.window.width).toBeCloseTo((2 / 3) * (3 / 4), 5);
        expect(origin.window.x).toBeCloseTo(1 / 6 + (2 / 3) * (1 / 8), 5);
        expect(origin.window.height).toBeCloseTo(1, 5);
    });

    it('is uncropped for a degenerate box or image', () => {
        const box = { left: 0, top: 0, width: 0, height: 0 };
        expect(getOriginWindow({ box, imageSize, fit: 'cover' })).toEqual({
            rect: box,
            window: WHOLE_IMAGE,
            region: WHOLE_IMAGE,
        });
        const usable = { left: 0, top: 0, width: 100, height: 100 };
        expect(
            getOriginWindow({
                box: usable,
                imageSize: { width: 0, height: 0 },
                fit: 'cover',
            }).window,
        ).toEqual(WHOLE_IMAGE);
    });
});

describe('getOriginCropFlight', () => {
    const NUMBER = '(-?[\\d.]+(?:e-?\\d+)?)';
    const TRANSLATE = new RegExp(`translate3d\\(${NUMBER}px, ${NUMBER}px, 0\\)`);
    const SCALE = new RegExp(`scale3d\\(${NUMBER}, ${NUMBER}, 1\\)`);
    const parse = (transform: string) => {
        const translate = TRANSLATE.exec(transform)!;
        const scale = SCALE.exec(transform);
        return {
            x: parseFloat(translate[1]!),
            y: parseFloat(translate[2]!),
            scaleX: scale ? parseFloat(scale[1]!) : 1,
            scaleY: scale ? parseFloat(scale[2]!) : 1,
        };
    };

    /**
     * Where the flight's first frame puts things on screen: the crop (the
     * intersection of the two translated stage boxes) and the window of
     * the image (carried by both boxes, then the slide's transform about
     * the stage centre).
     */
    const firstFrame = (input: OriginCropFlightInput) => {
        const { containerRect, top, bottom, imageSize, window } = input;
        const flight = getOriginCropFlight(input);
        const outer = parse(flight.outer);
        const inner = parse(flight.inner);
        const slide = parse(flight.transform);

        const stage = {
            left: containerRect.left,
            top: containerRect.top + top,
            width: containerRect.width,
            height: containerRect.height - (top + bottom),
        };
        const outerLeft = stage.left + outer.x;
        const outerTop = stage.top + outer.y;
        const innerLeft = outerLeft + inner.x;
        const innerTop = outerTop + inner.y;
        const cropLeft = Math.max(outerLeft, innerLeft);
        const cropTop = Math.max(outerTop, innerTop);
        const crop = {
            left: cropLeft,
            top: cropTop,
            width: Math.min(outerLeft, innerLeft) + stage.width - cropLeft,
            height: Math.min(outerTop, innerTop) + stage.height - cropTop,
        };

        // The slide fills the inner box; its centre is the transform origin.
        const centreX = innerLeft + stage.width / 2;
        const centreY = innerTop + stage.height / 2;
        const windowLeft =
            centreX +
            slide.x +
            slide.scaleX * (window.x * imageSize.width - imageSize.width / 2);
        const windowTop =
            centreY +
            slide.y +
            slide.scaleY * (window.y * imageSize.height - imageSize.height / 2);
        const landed = {
            left: windowLeft,
            top: windowTop,
            width: slide.scaleX * window.width * imageSize.width,
            height: slide.scaleY * window.height * imageSize.height,
        };
        return { flight, crop, landed };
    };

    const expectRect = (
        actual: { left: number; top: number; width: number; height: number },
        expected: { left: number; top: number; width: number; height: number },
    ) => {
        expect(actual.left).toBeCloseTo(expected.left, 6);
        expect(actual.top).toBeCloseTo(expected.top, 6);
        expect(actual.width).toBeCloseTo(expected.width, 6);
        expect(actual.height).toBeCloseTo(expected.height, 6);
    };

    it('meets the stage boxes on the trigger and scales uniformly', () => {
        // Stage 1000×800 at the origin, a square tile at (100, 200) showing
        // the middle two thirds of a 3:2 image fitted at 1000×666.67.
        const { flight } = firstFrame({
            triggerRect: { left: 100, top: 200, width: 100, height: 100 },
            containerRect: { left: 0, top: 0, width: 1000, height: 800 },
            top: 0,
            bottom: 0,
            imageSize: { width: 1000, height: 2000 / 3 },
            window: { x: 1 / 6, y: 0, width: 2 / 3, height: 1 },
        });
        expect(flight.outer).toBe('translate3d(-800px, -500px, 0)');
        expect(flight.inner).toBe('translate3d(900px, 700px, 0)');
        const slide = parse(flight.transform);
        expect(slide.x).toBeCloseTo(-450, 6);
        expect(slide.y).toBeCloseTo(-350, 6);
        expect(slide.scaleX).toBeCloseTo(0.15, 6);
        expect(slide.scaleY).toBeCloseTo(0.15, 6);
    });

    const cases: [string, OriginCropFlightInput][] = [
        [
            'a centred crop',
            {
                triggerRect: { left: 100, top: 200, width: 100, height: 100 },
                containerRect: { left: 0, top: 0, width: 1000, height: 800 },
                top: 0,
                bottom: 0,
                imageSize: { width: 1000, height: 2000 / 3 },
                window: { x: 1 / 6, y: 0, width: 2 / 3, height: 1 },
            },
        ],
        [
            'an off-centre crop below a toolbar',
            {
                triggerRect: { left: 640, top: 90, width: 180, height: 120 },
                containerRect: { left: 0, top: 0, width: 1280, height: 720 },
                top: 48,
                bottom: 120,
                imageSize: { width: 414, height: 552 },
                window: { x: 0, y: 0.1, width: 1, height: 0.5625 },
            },
        ],
        [
            'an inline gallery offset in the page',
            {
                triggerRect: { left: 30, top: 700, width: 240, height: 90 },
                containerRect: { left: 20, top: 400, width: 800, height: 500 },
                top: 20,
                bottom: 30,
                imageSize: { width: 675, height: 450 },
                window: { x: 0.2, y: 0.35, width: 0.6, height: 0.3375 },
            },
        ],
    ];

    it.each(cases)(
        'lands the window on the trigger inside the crop: %s',
        (_, input) => {
            const { crop, landed } = firstFrame(input);
            expectRect(crop, input.triggerRect);
            expectRect(landed, input.triggerRect);
        },
    );

    it('rests with the whole image when the boxes and slide are at rest', () => {
        // The flight's last frame: every transform at identity leaves the
        // image centred in the uncropped stage, as without the plugin.
        const window: FractionRect = { x: 0, y: 0, width: 1, height: 1 };
        const { flight } = firstFrame({
            triggerRect: { left: 0, top: 0, width: 1000, height: 800 },
            containerRect: { left: 0, top: 0, width: 1000, height: 800 },
            top: 0,
            bottom: 0,
            imageSize: { width: 1000, height: 800 },
            window,
        });
        expect(parse(flight.outer)).toEqual({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
        expect(parse(flight.inner)).toEqual({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
        expect(parse(flight.transform)).toEqual({
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
        });
    });
});
