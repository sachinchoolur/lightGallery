/**
 * v2 video wiring around the shared @lightgallery/headless URL builders.
 * The builders themselves are canonically tested in
 * packages/headless/src/video-urls.test.ts — these cover the v2-side
 * `utils.isVideo` adapter and the adapter → builder chain the plugin uses.
 */
import {
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
} from '@lightgallery/headless';

import utils from '../src/lg-utils';

import '@testing-library/jest-dom';

describe('utils.isVideo adapter', () => {
    it('detects the three providers via the shared matcher', () => {
        expect(
            utils.isVideo('//www.youtube.com/watch?v=EIUJfXk3_3w', false, 0)
                ?.youtube?.[1],
        ).toBe('EIUJfXk3_3w');
        expect(
            utils.isVideo('//vimeo.com/81400335', false, 0)?.vimeo?.[1],
        ).toBe('81400335');
        expect(
            utils.isVideo(
                'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
                false,
                0,
            )?.wistia?.[4],
        ).toBe('6tbe0u5g8n');
    });

    it('returns html5 only for src-less slides with video payload', () => {
        expect(utils.isVideo('', true, 0)).toEqual({ html5: true });
        // Documented deviation from the shared helper: a present src that
        // matches no provider is not a video, payload or not.
        expect(
            utils.isVideo('https://example.com/a.jpg', true, 0),
        ).toBeUndefined();
    });

    it('errors (and returns undefined) for src-less slides without payload', () => {
        const error = jest.spyOn(console, 'error').mockImplementation();
        expect(utils.isVideo('', false, 3)).toBeUndefined();
        expect(error).toHaveBeenCalledWith(
            expect.stringContaining('slide item 4'),
        );
        error.mockRestore();
    });
});

describe('adapter → embed builder chain (what the plugin renders)', () => {
    it('produces the full embed URL per provider', () => {
        const yt = utils.isVideo(
            '//www.youtube.com/watch?v=EIUJfXk3_3w',
            false,
            0,
        )!;
        expect(
            getYouTubeEmbedUrl(
                yt,
                false,
                '//www.youtube.com/watch?v=EIUJfXk3_3w',
            ),
        ).toBe(
            '//www.youtube.com/embed/EIUJfXk3_3w?wmode=opaque&autoplay=0&mute=1&enablejsapi=1',
        );

        const vimeo = utils.isVideo('//vimeo.com/81400335', false, 0)!;
        expect(getVimeoEmbedUrl(vimeo, false)).toBe(
            '//player.vimeo.com/video/81400335?autoplay=0&muted=1',
        );

        const wistia = utils.isVideo(
            'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
            false,
            0,
        )!;
        expect(getWistiaEmbedUrl(wistia, false)).toBe(
            '//fast.wistia.net/embed/iframe/6tbe0u5g8n',
        );
    });
});
