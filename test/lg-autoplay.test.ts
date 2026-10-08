/**
 * Autoplay: the slideshow counts down only from a loaded slide. On a slow
 * connection the show must hold on the image that is still downloading
 * instead of advancing past it, and a failed load must not stall it.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallerySettings } from '../src/lg-settings';
import { LightGallery } from '../src/lightgallery';
import Autoplay from '../src/plugins/autoplay/lg-autoplay';

function buildGallery(): void {
    document.body.innerHTML = `<div id="lightGallery">${[0, 1, 2]
        .map(
            (i) => `
        <a href="img-${i}.jpg">
            <img src="thumb-${i}.jpg" alt="Slide ${i}" />
        </a>`,
        )
        .join('')}</div>`;
}

describe('autoplay (vanilla)', () => {
    let instance: LightGallery | undefined;

    const create = (settings: LightGallerySettings = {}): LightGallery => {
        buildGallery();
        instance = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                plugins: [Autoplay],
                speed: 0,
                backdropDuration: 0,
                startAnimationDuration: 0,
                zoomFromOrigin: false,
                download: false,
                slideShowAutoplay: true,
                slideShowInterval: 100,
                ...settings,
            },
        );
        instance.openGallery(0);
        jest.advanceTimersByTime(50);
        return instance;
    };

    const settle = (index: number, type: 'load' | 'error') =>
        instance!
            .getSlideItem(index)
            .get()
            .querySelector('img.lg-object')!
            .dispatchEvent(new Event(type));

    const currentDomIndex = () =>
        Number(
            document.querySelector('.lg-item.lg-current')!.id.split('-').pop(),
        );

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

    it('holds the countdown until the slide on screen has loaded', () => {
        const lg = create();
        const outer = document.querySelector('.lg-outer')!;
        expect(outer).not.toHaveClass('lg-show-autoplay');
        settle(0, 'load');
        jest.advanceTimersByTime(1);
        expect(outer).toHaveClass('lg-show-autoplay');

        jest.advanceTimersByTime(100);
        expect(lg.index).toBe(1);

        // Slide 1 is still downloading: the show holds and the progress
        // bar sits at zero, however long that takes.
        jest.advanceTimersByTime(5000);
        expect(lg.index).toBe(1);
        expect(document.querySelector('.lg-progress-bar')).not.toHaveClass(
            'lg-start',
        );

        // Once it lands the full interval counts from there.
        settle(1, 'load');
        jest.advanceTimersByTime(25);
        expect(document.querySelector('.lg-progress-bar')).toHaveClass(
            'lg-start',
        );
        jest.advanceTimersByTime(50);
        expect(lg.index).toBe(1);
        jest.advanceTimersByTime(50);
        expect(lg.index).toBe(2);
    });

    it('moves on from a slide that failed to load', () => {
        const lg = create();
        settle(0, 'load');
        jest.advanceTimersByTime(101);
        expect(lg.index).toBe(1);
        settle(1, 'error');
        jest.advanceTimersByTime(101);
        expect(lg.index).toBe(2);
    });

    it('stops holding when the show is switched off', () => {
        const lg = create();
        settle(0, 'load');
        jest.advanceTimersByTime(101);
        expect(lg.index).toBe(1);
        document
            .querySelector<HTMLButtonElement>('.lg-autoplay-button')!
            .click();
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-show-autoplay',
        );
        // The awaited load arrives after the stop: nothing restarts.
        settle(1, 'load');
        jest.advanceTimersByTime(1000);
        expect(lg.index).toBe(1);
    });

    it('does not skip slides when a cycle lands mid-transition', () => {
        // Busy for speed + 100 + slideDelay = 600ms after each slide (500ms
        // for the open); the 150ms cycle lands inside that window several
        // times and must retry, never move the index without the slide.
        const lg = create({
            speed: 100,
            slideDelay: 400,
            slideShowInterval: 50,
        });
        settle(0, 'load');
        jest.advanceTimersByTime(601);
        expect(lg.index).toBe(1);
        settle(1, 'load');

        // Still busy: the index must not run ahead of the slide on screen
        // (lg-current moves after slideDelay).
        jest.advanceTimersByTime(500);
        expect(lg.index).toBe(1);
        expect(currentDomIndex()).toBe(1);

        jest.advanceTimersByTime(250);
        expect(lg.index).toBe(2);
        jest.advanceTimersByTime(500);
        expect(currentDomIndex()).toBe(2);
    });
});
