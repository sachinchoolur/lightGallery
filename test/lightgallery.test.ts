/**
 * Dummy test
 */
// declare const MutationObserver: any;
// import MutationObserver from '@sheerun/mutationobserver-shim';
//window.MutationObserver = MutationObserver;
import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import lightGallery from '../src';
import Autoplay from '../src/plugins/autoplay/lg-autoplay';
import Fullscreen from '../src/plugins/fullscreen/lg-fullscreen';
import Pager from '../src/plugins/pager/lg-pager';
import Rotate from '../src/plugins/rotate/lg-rotate';
import Share from '../src/plugins/share/lg-share';
import Thumbnails from '../src/plugins/thumbnail/lg-thumbnail';
import Zoom from '../src/plugins/zoom/lg-zoom';

describe('Initialize', () => {
    it('Should be able to initialize lightGallery', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        expect(document.querySelector('.lg-container')).toBeInTheDocument();
    });
    it('Should be able to display close button', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        expect(
            document.querySelector('button[aria-label="Close gallery"]'),
        ).toBeInTheDocument();
    });
    it('Should not display close icon', () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            closable: false,
        });
        expect(
            document.querySelector('button[aria-label="closeGallery"]'),
        ).not.toBeInTheDocument();
    });
});
describe('Controls', () => {
    it('Should be able to display controls', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        await waitFor(() => {
            expect(document.querySelector('.lg-next')).toBeInTheDocument();
            expect(document.querySelector('.lg-prev')).toBeInTheDocument();
        });
    });
    it('Should not show controls if there is only one item in the slide', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement);
        await waitFor(() => {
            expect(
                document.querySelector('.lg-single-item'),
            ).toBeInTheDocument();
        });
    });
});
describe('Plugins', () => {
    it('Should be able to initialize autoplay plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Autoplay],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-autoplay-button')).toBeTruthy(),
        );
    });
    it('Should be able to initialize Fullscreen plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        (document as any).fullscreenEnabled = true;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Fullscreen],
            fullScreen: true,
        });
        await waitFor(() => {
            console.log(document.querySelector('.lg-fullscreen'));
            expect(document.querySelector('.lg-fullscreen')).toBeTruthy();
        });
    });
    it('Should be able to initialize Pager plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Pager],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-pager-cont')).toBeTruthy(),
        );
    });
    it('Should be able to initialize Rotate plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Rotate],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-rotate-left')).toBeTruthy(),
        );
    });
    it('Should be able to initialize share plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Share],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-share')).toBeTruthy(),
        );
    });
    it('Should be able to initialize thumbnails plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Thumbnails],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-thumb-outer')).toBeTruthy(),
        );
    });
    it('Should be able to initialize zoom plugin', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        lightGallery(document.getElementById('lightGallery') as HTMLElement, {
            plugins: [Zoom],
            download: false,
        });
        await waitFor(() =>
            expect(document.querySelector('.lg-zoom-in')).toBeTruthy(),
        );
    });
    it('Should disable the previous arrow', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                loop: false,
                slideEndAnimation: false,
                hideControlOnEnd: true,
            },
        );
        LG.openGallery();
        await waitFor(() => {
            expect(document.querySelector('.lg-prev')).toBeDisabled();
            expect(document.querySelector('.lg-next')).not.toBeDisabled();
        });
    });
    it('Should disable the next arrow', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                loop: false,
                slideEndAnimation: false,
                hideControlOnEnd: true,
            },
        );
        LG.openGallery(1);
        await waitFor(() => {
            expect(document.querySelector('.lg-next')).toBeDisabled();
            expect(document.querySelector('.lg-prev')).not.toBeDisabled();
        });
    });
    it('Should fetch poster from youtube videos', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="//www.youtube.com/watch?v=egyIeygdS_E">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        LG.openGallery(0);
        expect(LG.galleryItems[0].poster).toBe(
            '//img.youtube.com/vi/egyIeygdS_E/maxresdefault.jpg',
        );
    });
    it('Should not fetch poster from youtube videos when turned off via settings', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="//www.youtube.com/watch?v=egyIeygdS_E">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                loadYouTubePoster: false,
            },
        );
        LG.openGallery(0);
        expect(LG.galleryItems[0].poster).toBeUndefined();
    });
    it('Should not fetch poster from youtube videos for image slide', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="a.png">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        LG.openGallery(0);
        expect(LG.galleryItems[0].poster).toBeUndefined();
    });
    it('Should not fetch poster from youtube videos for other video slides', async () => {
        document.body.innerHTML = `<div id="lightGallery">
                <a href="//vimeo.com/112836958">
                    <img src="b.png" />
                </a>
            </div>`;
        const LG = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
        );
        LG.openGallery(0);
        expect(LG.galleryItems[0].poster).toBeUndefined();
    });
});
