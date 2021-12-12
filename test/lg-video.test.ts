/**
 * Dummy test
 */
import lightGallery from '../src';

import '@testing-library/jest-dom';

// declare const MutationObserver: any;
// import MutationObserver from '@sheerun/mutationobserver-shim';

import { getVimeoURLParams } from '../src/plugins/video/lg-video-utils';
import utils from '../src/lg-utils';

describe('Video plugin', () => {
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
});
