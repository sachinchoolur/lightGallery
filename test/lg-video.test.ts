/**
 * Dummy test
 */
import lightGallery from '../src';

import '@testing-library/jest-dom';

// declare const MutationObserver: any;
// import MutationObserver from '@sheerun/mutationobserver-shim';

import {
    getVimeoURLParams,
    getYouTubeParams,
    isYouTubeNoCookie,
} from '../src/plugins/video/lg-video-utils';
import utils from '../src/lg-utils';
import { VideoInfo } from '../src/types';

describe('Vimeo Video', () => {
    it('should build vimeo url params', async () => {
        const url = '//vimeo.com/81400335?controls=0#t=1m2s';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&controls=0#t=1m2s');
    });
    it('should build vimeo url params when no value is passed via video url', async () => {
        const url = '//vimeo.com/81400335';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1');
    });
    it('should build vimeo url params without start time', async () => {
        const url = '//vimeo.com/81400335?controls=0';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&controls=0');
    });
    it('should build vimeo url params with default params in the last place', async () => {
        const url = '//vimeo.com/81400335?muted=0';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&muted=0');
    });
    it('should build vimeo url params only if start time found in the url', async () => {
        const url = '//vimeo.com/81400335#t=1m2s';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1#t=1m2s');
    });
    it('should build vimeo url params with default params', async () => {
        const url = '//vimeo.com/81400335#t=1m2s';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(
            {
                controls: 0,
            },
            videoInfo,
        );
        expect(params).toBe('?autoplay=0&muted=1&controls=0#t=1m2s');
    });
    it('should build vimeo url params when no value is passed via video url and playerParams passed via settings', async () => {
        const url = '//vimeo.com/81400335';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(
            {
                controls: 0,
            },
            videoInfo,
        );
        expect(params).toBe('?autoplay=0&muted=1&controls=0');
    });
    it('should be able to display private videos', async () => {
        const url = '//vimeo.com/674425314/a39356545b';
        const videoInfo = utils.isVideo(url, false, 0);
        console.log('vimeo videoInfo', videoInfo);
        const params = getVimeoURLParams({}, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&h=a39356545b');
    });

    it('should build private vimeo url params', async () => {
        const url = '//vimeo.com/674425314/a39356545b?controls=0#t=1m2s';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe(
            '?autoplay=0&muted=1&h=a39356545b&controls=0#t=1m2s',
        );
    });
    it('should build private vimeo url params when no value is passed via video url', async () => {
        const url = '//vimeo.com/674425314/a39356545b';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&h=a39356545b');
    });
    it('should build private vimeo url params without start time', async () => {
        const url = '//vimeo.com/674425314/a39356545b?controls=0';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&h=a39356545b&controls=0');
    });
    it('should build private vimeo url params with default params in the last place', async () => {
        const url = '//vimeo.com/674425314/a39356545b?muted=0';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&h=a39356545b&muted=0');
    });
    it('should build private vimeo url params only if start time found in the url', async () => {
        const url = '//vimeo.com/674425314/a39356545b#t=1m2s';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(false, videoInfo);
        expect(params).toBe('?autoplay=0&muted=1&h=a39356545b#t=1m2s');
    });
    it('should build private vimeo url params with default params', async () => {
        const url = '//vimeo.com/674425314/a39356545b#t=1m2s';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(
            {
                controls: 0,
            },
            videoInfo,
        );
        expect(params).toBe(
            '?autoplay=0&muted=1&h=a39356545b&controls=0#t=1m2s',
        );
    });
    it('should build private vimeo url params when no value is passed via video url and playerParams passed via settings', async () => {
        const url = '//vimeo.com/674425314/a39356545b';
        const videoInfo = utils.isVideo(url, false, 0);
        const params = getVimeoURLParams(
            {
                controls: 0,
            },
            videoInfo,
        );
        expect(params).toBe('?autoplay=0&muted=1&h=a39356545b&controls=0');
    });
});

describe('YouTube Video', () => {
    it('should build player params', async () => {
        const url = '//www.youtube.com/watch?v=EIUJfXk3_3w';
        const videoInfo = utils.isVideo(url, false, 0);
        const settingParam = {
            color: 'red',
            start: 60,
        };
        const params = getYouTubeParams(videoInfo as VideoInfo, settingParam);
        expect(params).toBe(
            '?wmode=opaque&autoplay=0&mute=1&enablejsapi=1&color=red&start=60',
        );
    });
    it('should override default params with src parmas', async () => {
        const url = '//www.youtube.com/watch?v=EIUJfXk3_3w&mute=0';
        const videoInfo = utils.isVideo(url, false, 0);
        const settingParam = {
            color: 'red',
            start: 60,
        };
        const params = getYouTubeParams(videoInfo as VideoInfo, settingParam);
        expect(params).toBe(
            '?wmode=opaque&autoplay=0&mute=0&enablejsapi=1&color=red&start=60',
        );
    });
    it('should work if settingsParams not provided', async () => {
        const url = '//www.youtube.com/watch?v=EIUJfXk3_3w&mute=0';
        const videoInfo = utils.isVideo(url, false, 0);
        const settingParam = false;
        const params = getYouTubeParams(videoInfo as VideoInfo, settingParam);
        expect(params).toBe('?wmode=opaque&autoplay=0&mute=0&enablejsapi=1');
    });
    it('should work if settingsParams and src params not provided', async () => {
        const url = '//www.youtube.com/watch?v=EIUJfXk3_3w';
        const videoInfo = utils.isVideo(url, false, 0);
        const settingParam = false;
        const params = getYouTubeParams(videoInfo as VideoInfo, settingParam);
        expect(params).toBe('?wmode=opaque&autoplay=0&mute=1&enablejsapi=1');
    });
    it('should override default params with settings params', async () => {
        const url = '//www.youtube.com/watch?v=EIUJfXk3_3w';
        const videoInfo = utils.isVideo(url, false, 0);
        const settingParam = {
            autoplay: 1,
            mute: 0,
        };
        const params = getYouTubeParams(videoInfo as VideoInfo, settingParam);
        expect(params).toBe('?wmode=opaque&autoplay=1&mute=0&enablejsapi=1');
    });
    it('should override settings params with src params', async () => {
        const url = '//www.youtube.com/watch?v=EIUJfXk3_3w&mute=0&color=red';
        const videoInfo = utils.isVideo(url, false, 0);
        const settingParam = {
            autoplay: 1,
            mute: 1,
        };
        const params = getYouTubeParams(videoInfo as VideoInfo, settingParam);
        expect(params).toBe(
            '?wmode=opaque&autoplay=1&mute=0&enablejsapi=1&color=red',
        );
    });

    it('should detect as no-cookie url', async () => {
        const url = 'https://www.youtube-nocookie.com/embed/r87A-Ql2czg';
        const isYouTubeNoCookieURL = isYouTubeNoCookie(url);
        expect(isYouTubeNoCookieURL).toBeTruthy();
    });

    it('should detect as normal youtube url', async () => {
        const url = '//www.youtube.com/watch?v=EIUJfXk3_3w&mute=0&color=red';
        const isYouTubeNoCookieURL = isYouTubeNoCookie(url);
        expect(isYouTubeNoCookieURL).toBeFalsy();
    });
});
