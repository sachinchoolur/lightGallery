import { describe, expect, it } from 'vitest';

import {
    flipHorizontal,
    flipVertical,
    getRotateFitScale,
    getRotateTransform,
    initialRotateSlice,
    isOrientationSwapped,
    rotateLeft,
    rotateRight,
} from './plugin-slices';
import {
    getFacebookShareLink,
    getPinterestShareLink,
    getTwitterShareLink,
} from './share-urls';

describe('rotate slice', () => {
    it('rotates in 90 degree steps', () => {
        expect(rotateRight(initialRotateSlice).rotate).toBe(90);
        expect(rotateLeft(initialRotateSlice).rotate).toBe(-90);
        expect(rotateRight(rotateRight(initialRotateSlice)).rotate).toBe(180);
    });

    it('flips the requested axis at 0/180 degrees', () => {
        expect(flipHorizontal(initialRotateSlice).flipHorizontal).toBe(-1);
        expect(flipVertical(initialRotateSlice).flipVertical).toBe(-1);
        const at180 = { ...initialRotateSlice, rotate: 180 };
        expect(flipHorizontal(at180).flipHorizontal).toBe(-1);
    });

    it('swaps the flip axis at 90/270 degrees (2.x behavior)', () => {
        const at90 = { ...initialRotateSlice, rotate: 90 };
        expect(flipHorizontal(at90).flipVertical).toBe(-1);
        expect(flipHorizontal(at90).flipHorizontal).toBe(1);
        const atMinus90 = { ...initialRotateSlice, rotate: -90 };
        expect(flipVertical(atMinus90).flipHorizontal).toBe(-1);
    });

    it('serializes to the 2.x transform string', () => {
        expect(
            getRotateTransform({
                rotate: 90,
                flipHorizontal: -1,
                flipVertical: 1,
            }),
        ).toBe('rotate(90deg) scale3d(-1, 1, 1)');
    });

    it('detects orientation-swapping rotations across full turns', () => {
        const at = (rotate: number) => ({ ...initialRotateSlice, rotate });
        expect(isOrientationSwapped(at(0))).toBe(false);
        expect(isOrientationSwapped(at(90))).toBe(true);
        expect(isOrientationSwapped(at(180))).toBe(false);
        expect(isOrientationSwapped(at(270))).toBe(true);
        expect(isOrientationSwapped(at(-90))).toBe(true);
        expect(isOrientationSwapped(at(450))).toBe(true);
        expect(isOrientationSwapped(at(-360))).toBe(false);
    });

    it('computes the refit scale for swapped orientations only', () => {
        const at = (rotate: number) => ({ ...initialRotateSlice, rotate });
        // Landscape 921x614 in a 1265x614 stage rotated 90°: the 921px
        // width runs vertically → fit by stage height.
        expect(getRotateFitScale(921, 614, 1265, 614, at(90))).toBeCloseTo(
            614 / 921,
        );
        expect(getRotateFitScale(921, 614, 1265, 614, at(-90))).toBeCloseTo(
            614 / 921,
        );
        // Unrotated / 180°: laid-out fit already applies.
        expect(getRotateFitScale(921, 614, 1265, 614, at(0))).toBe(1);
        expect(getRotateFitScale(921, 614, 1265, 614, at(180))).toBe(1);
        // Rotation never upscales (tall image in a wide stage).
        expect(getRotateFitScale(300, 900, 1200, 900, at(90))).toBe(1);
        // Narrow stage constrains by width against the image height.
        expect(getRotateFitScale(400, 800, 400, 1000, at(90))).toBeCloseTo(
            400 / 800,
        );
        // Degenerate dimensions fall back to 1.
        expect(getRotateFitScale(0, 614, 1265, 614, at(90))).toBe(1);
        expect(getRotateFitScale(921, 614, 0, 614, at(90))).toBe(1);
    });

    it('folds the fit scale into the transform, preserving flips', () => {
        expect(
            getRotateTransform(
                { rotate: 90, flipHorizontal: -1, flipVertical: 1 },
                0.5,
            ),
        ).toBe('rotate(90deg) scale3d(-0.5, 0.5, 1)');
    });
});

describe('share links', () => {
    const url = 'https://example.com/page';

    it('builds facebook links with the item URL winning', () => {
        expect(getFacebookShareLink({}, url)).toContain(
            encodeURIComponent(url),
        );
        expect(
            getFacebookShareLink({ facebookShareUrl: 'https://a.b' }, url),
        ).toContain(encodeURIComponent('https://a.b'));
    });

    it('builds twitter links with text and URL', () => {
        const link = getTwitterShareLink({ tweetText: 'hello' }, url);
        expect(link).toContain('text=hello');
        expect(link).toContain(`url=${encodeURIComponent(url)}`);
    });

    it('builds pinterest links with media and description', () => {
        const link = getPinterestShareLink(
            { src: 'img/a.jpg', pinterestText: 'pin' },
            url,
        );
        expect(link).toContain(`media=${encodeURIComponent('img/a.jpg')}`);
        expect(link).toContain('description=pin');
    });
});
