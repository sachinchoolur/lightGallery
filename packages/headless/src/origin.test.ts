import { describe, expect, it } from 'vitest';

import {
    fitImageSize,
    getCenterCloseTransform,
    getOriginTransform,
    isUsableOriginRect,
    parseImageSize,
} from './origin';
import { getSlideType } from './items';

describe('parseImageSize', () => {
    it('parses a plain width-height pair', () => {
        expect(parseImageSize('1920-1280', 1000)).toEqual({
            width: 1920,
            height: 1280,
        });
    });

    it('picks the responsive entry for the viewport width', () => {
        const list = '240-160-375, 400-267-480, 1600-1067';
        expect(parseImageSize(list, 320)).toEqual({ width: 240, height: 160 });
        expect(parseImageSize(list, 400)).toEqual({ width: 400, height: 267 });
        expect(parseImageSize(list, 1200)).toEqual({
            width: 1600,
            height: 1067,
        });
    });

    it('returns undefined for missing or malformed sizes', () => {
        expect(parseImageSize(undefined, 1000)).toBeUndefined();
        expect(parseImageSize('not-a-size', 1000)).toBeUndefined();
    });
});

describe('fitImageSize', () => {
    it('fits into the container preserving aspect ratio', () => {
        expect(fitImageSize({ width: 2000, height: 1000 }, 1000, 800)).toEqual(
            { width: 1000, height: 500 },
        );
    });

    it('never scales up beyond the natural size', () => {
        expect(fitImageSize({ width: 400, height: 300 }, 1000, 800)).toEqual({
            width: 400,
            height: 300,
        });
    });
});

describe('getOriginTransform', () => {
    it('translates and scales the centered image onto the trigger rect', () => {
        const transform = getOriginTransform({
            triggerRect: { left: 100, top: 200, width: 200, height: 100 },
            containerRect: { left: 0, top: 0, width: 1000, height: 800 },
            top: 0,
            bottom: 0,
            imageSize: { width: 800, height: 400 },
        });
        // x = (1000-200)/2 - 100 + 0 = 300; y = (800-100)/2 - 200 = 150
        // scale = 200/800 = 0.25, 100/400 = 0.25
        expect(transform).toBe(
            'translate3d(-300px, -150px, 0) scale3d(0.25, 0.25, 1)',
        );
    });

    it('accounts for toolbar/caption offsets', () => {
        const transform = getOriginTransform({
            triggerRect: { left: 0, top: 0, width: 100, height: 100 },
            containerRect: { left: 0, top: 0, width: 1000, height: 800 },
            top: 50,
            bottom: 150,
            imageSize: { width: 200, height: 200 },
        });
        // available height = 800-200 = 600; x = 450; y = 250 + top(50) = 300
        expect(transform).toBe(
            'translate3d(-450px, -300px, 0) scale3d(0.5, 0.5, 1)',
        );
    });
});

describe('isUsableOriginRect', () => {
    it('accepts a rect with a positive size', () => {
        expect(
            isUsableOriginRect({ left: 10, top: 20, width: 100, height: 80 }),
        ).toBe(true);
    });

    it('rejects the 0×0 rect a hidden trigger measures', () => {
        expect(
            isUsableOriginRect({ left: 0, top: 0, width: 0, height: 0 }),
        ).toBe(false);
        expect(
            isUsableOriginRect({ left: 10, top: 20, width: 100, height: 0 }),
        ).toBe(false);
    });

    it('rejects a missing or non-finite rect', () => {
        expect(isUsableOriginRect(null)).toBe(false);
        expect(isUsableOriginRect(undefined)).toBe(false);
        expect(
            isUsableOriginRect({ left: NaN, top: 0, width: 10, height: 10 }),
        ).toBe(false);
    });
});

describe('getCenterCloseTransform', () => {
    it('shrinks in place to half size by default', () => {
        expect(getCenterCloseTransform()).toBe(
            'translate3d(0, 0, 0) scale3d(0.5, 0.5, 1)',
        );
    });

    it('takes a custom scale', () => {
        expect(getCenterCloseTransform(0.25)).toBe(
            'translate3d(0, 0, 0) scale3d(0.25, 0.25, 1)',
        );
    });
});

describe('getSlideType', () => {
    it('classifies items', () => {
        expect(getSlideType({ src: 'a.jpg' })).toBe('image');
        expect(getSlideType({ src: 'a.html', iframe: true })).toBe('iframe');
        expect(getSlideType({ video: { source: [] } })).toBe('video');
        expect(getSlideType({ src: 'v.mp4', poster: 'p.jpg' })).toBe('video');
    });
});
