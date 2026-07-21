import { describe, expect, it } from 'vitest';

import {
    getVideoInfo,
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
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

    it('builds the embed URL with default params', () => {
        const url = getYouTubeEmbedUrl(info, false, src);
        expect(url).toContain('//www.youtube.com/embed/abc123?');
        expect(url).toContain('wmode=opaque');
        expect(url).toContain('autoplay=0');
        expect(url).toContain('mute=1');
        expect(url).toContain('enablejsapi=1');
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

    it('respects youtube-nocookie hosts', () => {
        const noCookieSrc = 'https://www.youtube-nocookie.com/embed/abc123';
        const noCookieInfo = getVideoInfo(noCookieSrc, false)!;
        expect(
            getYouTubeEmbedUrl(noCookieInfo, false, noCookieSrc),
        ).toContain('//www.youtube-nocookie.com/embed/abc123');
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
