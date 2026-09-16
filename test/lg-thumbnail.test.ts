import '@testing-library/jest-dom';

import lightGallery from '../src';
import type { LightGallery } from '../src/lightgallery';
import Thumbnails from '../src/plugins/thumbnail/lg-thumbnail';

const SPEED = 400;

function initGallery(): LightGallery {
    document.body.innerHTML = `<div id="lightGallery">${Array.from(
        { length: 12 },
        (_, index) => `<a href="${index}.png"><img src="${index}-t.png" /></a>`,
    ).join('')}</div>`;
    return lightGallery(
        document.getElementById('lightGallery') as HTMLElement,
        {
            plugins: [Thumbnails],
            speed: SPEED,
            thumbWidth: 100,
            thumbMargin: 5,
        },
    );
}

const strip = () => document.querySelector<HTMLElement>('.lg-thumb');

describe('thumbnail strip', () => {
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

    it('positions the strip without animating while the gallery opens', () => {
        instance = initGallery();
        // Opening from the end of the strip would otherwise slide it across
        // while the image is still flying in.
        instance.openGallery(9);
        jest.advanceTimersByTime(100);
        expect(strip()!.style.transform).toContain('translate3d');
        expect(strip()!.style.transitionDuration).toBe('0ms');
    });

    it('animates the strip once the gallery has opened', () => {
        instance = initGallery();
        instance.openGallery(9);
        jest.advanceTimersByTime(1000);
        instance.slide(4, false, false, 'next');
        jest.advanceTimersByTime(100);
        expect(strip()!.style.transitionDuration).toBe(`${SPEED}ms`);
    });
});
