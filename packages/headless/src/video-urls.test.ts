import { describe, expect, it } from 'vitest';

import {
    getFacadePoster,
    getVideoInfo,
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
    getYouTubePosterUrl,
} from './video-urls';
import { getSlideType } from './items';

describe('getVideoInfo', () => {
    it('detects YouTube URLs in all common shapes', () => {
        const watch = getVideoInfo(
            '//www.youtube.com/watch?v=EIUJfXk3_3w',
            false,
        );
        expect(watch?.youtube?.[1]).toBe('EIUJfXk3_3w');
        expect(
            getVideoInfo('https://youtu.be/EIUJfXk3_3w', false)?.youtube?.[1],
        ).toBe('EIUJfXk3_3w');
        expect(
            getVideoInfo(
                'https://www.youtube-nocookie.com/embed/EIUJfXk3_3w',
                false,
            )?.youtube?.[1],
        ).toBe('EIUJfXk3_3w');
    });

    it('detects Vimeo and Wistia', () => {
        expect(
            getVideoInfo('https://vimeo.com/112836958', false)?.vimeo?.[1],
        ).toBe('112836958');
        expect(
            getVideoInfo(
                'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
                false,
            )?.wistia?.[4],
        ).toBe('6tbe0u5g8n');
    });

    it('falls back to html5 only when video sources exist', () => {
        expect(getVideoInfo(undefined, true)).toEqual({ html5: true });
        expect(getVideoInfo(undefined, false)).toBeUndefined();
        expect(getVideoInfo('img/photo.jpg', false)).toBeUndefined();
    });
});

describe('getSlideType with video URLs', () => {
    it('classifies provider URLs as video', () => {
        expect(getSlideType({ src: 'https://vimeo.com/112836958' })).toBe(
            'video',
        );
        expect(getSlideType({ src: 'a.jpg' })).toBe('image');
    });
});

describe('getYouTubeEmbedUrl', () => {
    const src = '//www.youtube.com/watch?v=abc123';
    const info = getVideoInfo(src, false)!;

    it('builds the embed URL with default params on the nocookie host', () => {
        const url = getYouTubeEmbedUrl(info, false, src);
        expect(url).toContain('//www.youtube-nocookie.com/embed/abc123?');
        expect(url).toContain('wmode=opaque');
        expect(url).toContain('autoplay=0');
        expect(url).toContain('mute=1');
        expect(url).toContain('enablejsapi=1');
    });

    it('reverts to youtube.com when preferNoCookie is false', () => {
        expect(getYouTubeEmbedUrl(info, false, src, false)).toContain(
            '//www.youtube.com/embed/abc123?',
        );
    });

    it('lets settings override defaults, but slide params win', () => {
        const withParams = getVideoInfo(
            '//www.youtube.com/watch?v=abc123&start=30',
            false,
        )!;
        const url = getYouTubeEmbedUrl(
            withParams,
            { mute: 0, controls: 0 },
            src,
        );
        expect(url).toContain('mute=0');
        expect(url).toContain('controls=0');
        expect(url).toContain('start=30');
    });

    it('keeps the nocookie host for nocookie slide URLs even when reverted', () => {
        const noCookieSrc = 'https://www.youtube-nocookie.com/embed/abc123';
        const noCookieInfo = getVideoInfo(noCookieSrc, false)!;
        expect(
            getYouTubeEmbedUrl(noCookieInfo, false, noCookieSrc, false),
        ).toContain('//www.youtube-nocookie.com/embed/abc123');
    });
});

describe('facade poster chain', () => {
    const yt = getVideoInfo('//www.youtube.com/watch?v=abc123', false)!;
    const vimeo = getVideoInfo('https://vimeo.com/112836958', false)!;

    it('builds the YouTube thumbnail endpoint', () => {
        expect(getYouTubePosterUrl(yt)).toBe(
            '//img.youtube.com/vi/abc123/maxresdefault.jpg',
        );
        expect(getYouTubePosterUrl(vimeo)).toBeUndefined();
        expect(getYouTubePosterUrl(undefined)).toBeUndefined();
    });

    it('prefers the explicit item poster', () => {
        expect(
            getFacadePoster({ poster: 'p.jpg', thumb: 't.jpg' }, yt, true),
        ).toBe('p.jpg');
    });

    it('falls back to the YouTube endpoint, then the thumb', () => {
        expect(getFacadePoster({ thumb: 't.jpg' }, yt, true)).toBe(
            '//img.youtube.com/vi/abc123/maxresdefault.jpg',
        );
        expect(getFacadePoster({ thumb: 't.jpg' }, yt, false)).toBe('t.jpg');
        expect(getFacadePoster({ thumb: 't.jpg' }, vimeo, true)).toBe('t.jpg');
        expect(getFacadePoster({}, vimeo, true)).toBeUndefined();
    });

    it('never synthesizes a poster for html5 slides', () => {
        expect(
            getFacadePoster({ thumb: 't.jpg' }, { html5: true }, true),
        ).toBeUndefined();
        expect(
            getFacadePoster(
                { poster: 'p.jpg', thumb: 't.jpg' },
                { html5: true },
                true,
            ),
        ).toBe('p.jpg');
    });
});

describe('getVimeoEmbedUrl', () => {
    it('builds the embed URL with defaults', () => {
        const info = getVideoInfo('https://vimeo.com/112836958', false)!;
        const url = getVimeoEmbedUrl(info, false);
        expect(url).toContain('//player.vimeo.com/video/112836958?');
        expect(url).toContain('autoplay=0');
        expect(url).toContain('muted=1');
    });

    it('carries the private-video hash as the h param', () => {
        const info = getVideoInfo(
            'https://vimeo.com/112836958/e675e9a5c1',
            false,
        )!;
        const url = getVimeoEmbedUrl(info, false)!;
        expect(url).toContain('h=e675e9a5c1');
        expect(url).toContain('/video/112836958?');
    });

    it('keeps slide URL params (and fragments) after the defaults', () => {
        // The 2.x root-suite edge cases, verbatim: URL params append after
        // the defaults (duplicate keys included — the player resolves
        // precedence), and #t fragments ride along untouched.
        const at = (src: string) => getVideoInfo(src, false)!;
        const base = '//player.vimeo.com/video/81400335';
        expect(
            getVimeoEmbedUrl(
                at('//vimeo.com/81400335?controls=0#t=1m2s'),
                false,
            ),
        ).toBe(`${base}?autoplay=0&muted=1&controls=0#t=1m2s`);
        expect(
            getVimeoEmbedUrl(at('//vimeo.com/81400335?muted=0'), false),
        ).toBe(`${base}?autoplay=0&muted=1&muted=0`);
        expect(getVimeoEmbedUrl(at('//vimeo.com/81400335#t=1m2s'), false)).toBe(
            `${base}?autoplay=0&muted=1#t=1m2s`,
        );
        expect(
            getVimeoEmbedUrl(at('//vimeo.com/81400335#t=1m2s'), {
                controls: 0,
            }),
        ).toBe(`${base}?autoplay=0&muted=1&controls=0#t=1m2s`);
        const priv = '//player.vimeo.com/video/674425314';
        expect(
            getVimeoEmbedUrl(
                at('//vimeo.com/674425314/a39356545b?controls=0#t=1m2s'),
                false,
            ),
        ).toBe(`${priv}?h=a39356545b&autoplay=0&muted=1&controls=0#t=1m2s`);
        expect(
            getVimeoEmbedUrl(
                at('//vimeo.com/674425314/a39356545b?muted=0'),
                false,
            ),
        ).toBe(`${priv}?h=a39356545b&autoplay=0&muted=1&muted=0`);
    });
});

describe('getWistiaEmbedUrl', () => {
    it('builds the iframe URL', () => {
        const info = getVideoInfo(
            'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
            false,
        )!;
        expect(getWistiaEmbedUrl(info, false)).toBe(
            '//fast.wistia.net/embed/iframe/6tbe0u5g8n',
        );
        expect(getWistiaEmbedUrl(info, { playerColor: 'ff0000' })).toContain(
            '?playerColor=ff0000',
        );
    });
});
