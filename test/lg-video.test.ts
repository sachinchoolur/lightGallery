/**
 * v2 video wiring around the shared @lightgallery/headless URL builders.
 * The builders themselves are canonically tested in
 * packages/headless/src/video-urls.test.ts — these cover the v2-side
 * `utils.isVideo` adapter and the adapter → builder chain the plugin uses.
 */
import {
    VIMEO_PLAYER_SCRIPT_URL,
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
} from '@lightgallery/headless';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { lGEvents } from '../src/lg-events';
import { LightGallerySettings } from '../src/lg-settings';
import Video from '../src/plugins/video/lg-video';
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
        // nocookie is the plugin default (youTubeNoCookie: true).
        expect(
            getYouTubeEmbedUrl(
                yt,
                false,
                '//www.youtube.com/watch?v=EIUJfXk3_3w',
                true,
            ),
        ).toBe(
            '//www.youtube-nocookie.com/embed/EIUJfXk3_3w?wmode=opaque&autoplay=0&mute=1&enablejsapi=1',
        );
        // youTubeNoCookie: false reverts to youtube.com.
        expect(
            getYouTubeEmbedUrl(
                yt,
                false,
                '//www.youtube.com/watch?v=EIUJfXk3_3w',
                false,
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

describe('video facades (lite embed)', () => {
    let instance: LightGallery | undefined;

    function initGallery(settings: LightGallerySettings = {}): LightGallery {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="//www.youtube.com/watch?v=EIUJfXk3_3w">
                    <img src="yt-thumb.png" alt="yt" />
                </a>
                <a href="https://vimeo.com/112836958">
                    <img src="vimeo-thumb.png" alt="vimeo" />
                </a>
            </div>`;
        return lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                plugins: [Video],
                autoplayFirstVideo: false,
                speed: 0,
                backdropDuration: 0,
                startAnimationDuration: 0,
                zoomFromOrigin: false,
                ...settings,
            },
        );
    }

    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        instance?.destroy();
        instance = undefined;
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    function currentSlide(): HTMLElement {
        return document.querySelector<HTMLElement>('.lg-item.lg-current')!;
    }

    it('synthesizes the facade poster chain per provider', () => {
        instance = initGallery();
        // YouTube: thumbnail endpoint (loadYouTubePoster default).
        expect(instance.galleryItems[0].poster).toBe(
            '//img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        );
        // Vimeo: no endpoint — falls back to the item thumb.
        expect(instance.galleryItems[1].poster).toBe('vimeo-thumb.png');
    });

    it('renders a facade and materializes the iframe only on play', () => {
        instance = initGallery();
        instance.openGallery(1);
        jest.advanceTimersByTime(300);

        const slide = currentSlide();
        expect(slide.querySelector('.lg-video-play-button')).not.toBeNull();
        expect(slide.querySelector('.lg-video-poster')).not.toBeNull();
        expect(slide.querySelector('iframe')).toBeNull();

        instance.LGel.trigger(lGEvents.posterClick);
        expect(slide.querySelector('iframe.lg-vimeo')).not.toBeNull();
    });

    it('embeds YouTube through nocookie by default, youtube.com on revert', () => {
        instance = initGallery();
        instance.openGallery(0);
        jest.advanceTimersByTime(300);
        instance.LGel.trigger(lGEvents.posterClick);
        expect(
            currentSlide()
                .querySelector('iframe.lg-youtube')!
                .getAttribute('src'),
        ).toContain('//www.youtube-nocookie.com/embed/');

        instance.destroy();
        jest.runOnlyPendingTimers();

        instance = initGallery({ youTubeNoCookie: false });
        instance.openGallery(0);
        jest.advanceTimersByTime(300);
        instance.LGel.trigger(lGEvents.posterClick);
        expect(
            currentSlide()
                .querySelector('iframe.lg-youtube')!
                .getAttribute('src'),
        ).toContain('//www.youtube.com/embed/');
    });

    it('videoFacade:false restores the eager iframe for posterless slides', () => {
        instance = initGallery({ videoFacade: false });
        // 2.x poster synthesis: YouTube endpoint only, no thumb fallback.
        expect(instance.galleryItems[0].poster).toBe(
            '//img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        );
        expect(instance.galleryItems[1].poster).toBeUndefined();

        instance.openGallery(1);
        jest.advanceTimersByTime(300);
        const slide = currentSlide();
        expect(slide.querySelector('iframe.lg-vimeo')).not.toBeNull();
        expect(slide.querySelector('.lg-video-play-button')).toBeNull();
    });

    it('loads the Vimeo player API on demand at materialize time', () => {
        instance = initGallery();
        instance.openGallery(1);
        jest.advanceTimersByTime(300);
        instance.LGel.trigger(lGEvents.posterClick);
        // gotoNextSlideOnVideoEnd wiring runs at materialize and needs the
        // player API — the script loads on demand, not via a documented
        // integrator include.
        expect(
            document.head.querySelector(
                `script[src="${VIMEO_PLAYER_SCRIPT_URL}"]`,
            ),
        ).not.toBeNull();
    });
});
