/**
 * RTL direction seam (plan 011): the resolved direction lands on the
 * container as a `dir` attribute (the hook for the opt-in lg-rtl.css
 * layer) and mirrors the physical arrow keys. The gesture/thumbnail
 * mirroring is covered by the headless direction tests; this suite pins
 * the vanilla wiring.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { LightGallerySettings } from '../src/lg-settings';

const ZERO_MOTION: LightGallerySettings = {
    speed: 0,
    backdropDuration: 0,
    startAnimationDuration: 0,
    zoomFromOrigin: false,
};

function initGallery(settings: LightGallerySettings = {}): LightGallery {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png"><img src="a-t.png" alt="a" /></a>
            <a href="b.png"><img src="b-t.png" alt="b" /></a>
            <a href="c.png"><img src="c-t.png" alt="c" /></a>
        </div>`;
    return lightGallery(
        document.getElementById('lightGallery') as HTMLElement,
        { ...ZERO_MOTION, ...settings },
    );
}

function pressKey(keyCode: number): void {
    const event = new KeyboardEvent('keydown', { cancelable: true });
    Object.defineProperty(event, 'keyCode', { value: keyCode });
    window.dispatchEvent(event);
}

describe('rtl direction (vanilla core)', () => {
    let instance: LightGallery | undefined;

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

    it('defaults to ltr and stamps the container dir attribute', () => {
        instance = initGallery();
        expect(instance.settings.direction).toBe('ltr');
        expect(
            document.querySelector('.lg-container')!.getAttribute('dir'),
        ).toBe('ltr');
    });

    it('stamps dir="rtl" when direction is rtl', () => {
        instance = initGallery({ direction: 'rtl' });
        expect(
            document.querySelector('.lg-container')!.getAttribute('dir'),
        ).toBe('rtl');
    });

    it('mirrors the physical arrow keys in rtl', () => {
        instance = initGallery({ direction: 'rtl' });
        instance.openGallery(1);
        jest.advanceTimersByTime(200);

        // ArrowLeft advances in RTL (the strip flows right-to-left)…
        pressKey(37);
        jest.advanceTimersByTime(200);
        expect(instance.index).toBe(2);

        // …and ArrowRight goes back.
        pressKey(39);
        jest.advanceTimersByTime(200);
        expect(instance.index).toBe(1);
    });
});
