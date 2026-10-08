/**
 * The public types come from the package entry, the only import path
 * the `exports` map allows. ts-jest type-checks this file, so a type that
 * stops being exported, or changes shape, fails here.
 */
import '@testing-library/jest-dom';
import lightGallery, {
    type BeforeSlideDetail,
    type GalleryItem,
    type InitDetail,
    type LightGallery,
    type LightGallerySettings,
} from '../src';

describe('public types from the package entry', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    it('types the settings, dynamic items and event details', () => {
        const items: GalleryItem[] = [
            { src: 'a.png', thumb: 'a-t.png', subHtml: 'A' },
            { src: 'b.png', thumb: 'b-t.png', subHtml: 'B' },
        ];
        const settings: LightGallerySettings = {
            dynamic: true,
            dynamicEl: items,
            speed: 0,
            zoomFromOrigin: false,
            strings: { closeGallery: 'Close' },
        };
        const host = document.createElement('div');
        document.body.appendChild(host);

        let initInstance: LightGallery | null = null;
        const slides: BeforeSlideDetail[] = [];
        host.addEventListener('lgInit', (event) => {
            initInstance = (event as CustomEvent<InitDetail>).detail.instance;
        });
        host.addEventListener('lgBeforeSlide', (event) => {
            slides.push((event as CustomEvent<BeforeSlideDetail>).detail);
        });

        const gallery = lightGallery(host, settings);
        expect(initInstance).toBe(gallery);

        gallery.openGallery(0);
        jest.advanceTimersByTime(500);
        gallery.goToNextSlide();
        jest.advanceTimersByTime(500);
        expect(slides[slides.length - 1]).toMatchObject({
            index: 1,
            prevIndex: 0,
        });
        gallery.destroy();
    });
});
