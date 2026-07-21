import { describe, expect, it } from 'vitest';

import {
    flipHorizontal,
    flipVertical,
    getRotateTransform,
    initialRotateSlice,
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
