import { describe, expect, it, vi } from 'vitest';

import {
    canNativeShare,
    getFacebookShareLink,
    getPinterestShareLink,
    getSharePayload,
    getTwitterShareLink,
    getXShareLink,
} from './share-urls';

const PAGE = 'https://example.com/gallery?a=1';

describe('share link builders', () => {
    it('builds the Facebook sharer URL from the page URL', () => {
        expect(getFacebookShareLink({ src: 'a.jpg' }, PAGE)).toBe(
            '//www.facebook.com/sharer/sharer.php?u=' +
                encodeURIComponent(PAGE),
        );
    });

    it('prefers the per-item facebookShareUrl', () => {
        expect(
            getFacebookShareLink(
                { src: 'a.jpg', facebookShareUrl: 'https://fb.example/x' },
                PAGE,
            ),
        ).toBe(
            '//www.facebook.com/sharer/sharer.php?u=' +
                encodeURIComponent('https://fb.example/x'),
        );
    });

    it('builds the X intent URL with encoded text', () => {
        expect(
            getXShareLink(
                { src: 'a.jpg', tweetText: 'two words & more' },
                PAGE,
            ),
        ).toBe(
            `//x.com/intent/post?text=${encodeURIComponent(
                'two words & more',
            )}&url=${encodeURIComponent(PAGE)}`,
        );
    });

    it('keeps the 2.x twitterShareUrl override on the X target', () => {
        expect(
            getXShareLink(
                { src: 'a.jpg', twitterShareUrl: 'https://t.example/y' },
                PAGE,
            ),
        ).toContain(`url=${encodeURIComponent('https://t.example/y')}`);
    });

    it('keeps getTwitterShareLink as a deprecated alias of the X builder', () => {
        expect(getTwitterShareLink).toBe(getXShareLink);
    });

    it('builds the Pinterest URL with media, url and description', () => {
        expect(
            getPinterestShareLink(
                { src: 'https://img.example/a.jpg', pinterestText: 'pin' },
                PAGE,
            ),
        ).toBe(
            `//www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
                PAGE,
            )}&media=${encodeURIComponent(
                'https://img.example/a.jpg',
            )}&description=pin`,
        );
    });
});

describe('getSharePayload', () => {
    it('falls back to the page URL with no per-item URLs', () => {
        expect(getSharePayload({ src: 'a.jpg' }, PAGE)).toEqual({
            url: PAGE,
        });
    });

    it('prefers shareUrl over the network-specific URLs', () => {
        expect(
            getSharePayload(
                {
                    src: 'a.jpg',
                    shareUrl: 'https://c.example/canonical',
                    twitterShareUrl: 'https://t.example/y',
                    facebookShareUrl: 'https://fb.example/x',
                },
                PAGE,
            ).url,
        ).toBe('https://c.example/canonical');
    });

    it('falls back through the network URLs in order', () => {
        expect(
            getSharePayload(
                {
                    src: 'a.jpg',
                    twitterShareUrl: 'https://t.example/y',
                    facebookShareUrl: 'https://fb.example/x',
                },
                PAGE,
            ).url,
        ).toBe('https://t.example/y');
    });

    it('carries title (title, then alt) and text (tweet, then pinterest)', () => {
        expect(
            getSharePayload(
                {
                    src: 'a.jpg',
                    alt: 'Alt text',
                    pinterestText: 'Pin description',
                },
                PAGE,
            ),
        ).toEqual({
            url: PAGE,
            title: 'Alt text',
            text: 'Pin description',
        });
        expect(
            getSharePayload(
                {
                    src: 'a.jpg',
                    title: 'Title',
                    alt: 'Alt text',
                    tweetText: 'Tweet',
                    pinterestText: 'Pin description',
                },
                PAGE,
            ),
        ).toEqual({ url: PAGE, title: 'Title', text: 'Tweet' });
    });
});

describe('canNativeShare', () => {
    const payload = { url: PAGE };

    it('is false without a navigator or share function', () => {
        expect(canNativeShare(undefined, payload)).toBe(false);
        expect(canNativeShare(null, payload)).toBe(false);
        expect(canNativeShare({}, payload)).toBe(false);
    });

    it('is true with share and no canShare', () => {
        expect(
            canNativeShare({ share: () => Promise.resolve() }, payload),
        ).toBe(true);
    });

    it('defers to canShare when present', () => {
        const canShare = vi.fn().mockReturnValue(false);
        expect(
            canNativeShare(
                { share: () => Promise.resolve(), canShare },
                payload,
            ),
        ).toBe(false);
        expect(canShare).toHaveBeenCalledWith(payload);
        expect(
            canNativeShare(
                { share: () => Promise.resolve(), canShare: () => true },
                payload,
            ),
        ).toBe(true);
    });
});
