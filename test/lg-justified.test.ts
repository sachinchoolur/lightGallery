/**
 * Justified trigger-grid layout: geometry from the shared headless row
 * math applied to the inline triggers — exact row fill, sizes
 * write-back for responsive thumbs, RTL start-edge mapping and a clean
 * destroy restore.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { LightGallerySettings } from '../src/lg-settings';
import Justified from '../src/plugins/justified/lg-justified';

const CONTAINER_WIDTH = 1000;

function buildDom(): HTMLElement {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png" data-lg-size="1600-1067">
                <img src="a-t.png" srcset="a-t.png 240w, a.png 1600w" alt="a" />
            </a>
            <a href="b.png" data-lg-size="1067-1600">
                <img src="b-t.png" alt="b" />
            </a>
            <a href="c.png" data-lg-size="1600-1067">
                <img src="c-t.png" alt="c" />
            </a>
            <a href="d.png">
                <img src="d-t.png" width="800" height="800" alt="d" />
            </a>
            <a href="e.png" data-lg-size="1600-1067">
                <img src="e-t.png" alt="e" />
            </a>
            <a href="f.png" data-lg-size="1600-1067">
                <img src="f-t.png" alt="f" />
            </a>
        </div>`;
    const el = document.getElementById('lightGallery') as HTMLElement;
    // jsdom has no layout — the plugin reads clientWidth once per pass.
    Object.defineProperty(el, 'clientWidth', {
        configurable: true,
        value: CONTAINER_WIDTH,
    });
    return el;
}

function initGallery(settings: LightGallerySettings = {}): LightGallery {
    return lightGallery(buildDom(), {
        plugins: [Justified],
        justifiedRowHeight: 200,
        justifiedGap: 10,
        ...settings,
    });
}

function triggers(): HTMLElement[] {
    return Array.from(
        document.querySelectorAll<HTMLElement>('#lightGallery a'),
    );
}

describe('justified layout (vanilla)', () => {
    let instance: LightGallery | undefined;

    afterEach(() => {
        instance?.destroy();
        instance = undefined;
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    beforeEach(() => {
        jest.useFakeTimers();
    });

    it('positions the triggers in exactly filled rows', () => {
        instance = initGallery();
        const el = document.getElementById('lightGallery')!;
        expect(el).toHaveClass('lg-justified');
        expect(el.style.height).not.toBe('');

        const items = triggers();
        for (const item of items) {
            expect(item).toHaveClass('lg-justified-item');
            expect(item.style.width).not.toBe('');
            expect(item.style.height).not.toBe('');
        }

        // Every trigger sharing the first row top fills the width.
        const firstTop = items[0]!.style.top;
        const firstRow = items.filter((item) => item.style.top === firstTop);
        const total =
            firstRow.reduce(
                (sum, item) => sum + parseInt(item.style.width, 10),
                0,
            ) +
            10 * (firstRow.length - 1);
        expect(total).toBe(CONTAINER_WIDTH);
    });

    it('writes a precise sizes hint for srcset thumbnails', () => {
        instance = initGallery();
        const img = triggers()[0]!.querySelector('img')!;
        expect(img.getAttribute('sizes')).toBe(
            `${triggers()[0]!.style.width.replace('px', '')}px`,
        );
        // No srcset — no sizes.
        expect(
            triggers()[1]!.querySelector('img')!.getAttribute('sizes'),
        ).toBeNull();
    });

    it('maps the start offset to the right edge in rtl', () => {
        instance = initGallery({ direction: 'rtl' });
        const first = triggers()[0]!;
        expect(first.style.right).toBe('0px');
        expect(first.style.left).toBe('auto');
    });

    it('marks the container so the reveal rules stay off other layouts', () => {
        instance = initGallery();
        const el = document.getElementById('lightGallery')!;
        // The stylesheet holds a thumbnail invisible until this plugin
        // reveals it. The marker keeps those rules away from a grid
        // whose geometry is written by other code: such code adds the
        // positioning classes but never the per-item reveal class.
        expect(el).toHaveClass('lg-justified');
        expect(el).toHaveClass('lg-justified-reveal');

        instance.destroy();
        jest.runOnlyPendingTimers();
        instance = undefined;
        expect(el).not.toHaveClass('lg-justified-reveal');
    });

    it('restores the original markup on destroy', () => {
        instance = initGallery();
        instance.destroy();
        jest.runOnlyPendingTimers();
        instance = undefined;

        const el = document.getElementById('lightGallery')!;
        expect(el).not.toHaveClass('lg-justified');
        expect(el.getAttribute('style')).toBeNull();
        for (const item of triggers()) {
            expect(item).not.toHaveClass('lg-justified-item');
            expect(item.getAttribute('style')).toBeNull();
        }
    });

    it('adopts refreshed triggers into the layout', () => {
        instance = initGallery();
        const el = document.getElementById('lightGallery')!;
        el.insertAdjacentHTML(
            'beforeend',
            `<a href="g.png" data-lg-size="1600-1067">
                <img src="g-t.png" alt="g" />
            </a>`,
        );
        instance.refresh();

        const added = triggers()[6]!;
        expect(added).toHaveClass('lg-justified-item');
        expect(added.style.width).not.toBe('');
        expect(added.style.height).not.toBe('');

        // The refreshed grid still fills its rows exactly.
        const items = triggers();
        const firstTop = items[0]!.style.top;
        const firstRow = items.filter((item) => item.style.top === firstTop);
        const total =
            firstRow.reduce(
                (sum, item) => sum + parseInt(item.style.width, 10),
                0,
            ) +
            10 * (firstRow.length - 1);
        expect(total).toBe(CONTAINER_WIDTH);

        // Destroy restores the adopted trigger like any original one.
        instance.destroy();
        jest.runOnlyPendingTimers();
        instance = undefined;
        expect(added).not.toHaveClass('lg-justified-item');
        expect(added.getAttribute('style')).toBeNull();
    });

    it('reveals each trigger once positioned and its thumbnail loaded', () => {
        instance = initGallery({ justifiedReveal: 'image' });
        const items = triggers();
        // jsdom never loads images: every thumbnail is still pending, so
        // the positioned triggers stay invisible (stylesheet opacity 0).
        for (const item of items) {
            expect(item.style.width).not.toBe('');
            expect(item).not.toHaveClass('lg-justified-item-visible');
        }
        // Each thumbnail reveals its own trigger as it arrives.
        items[1]!.querySelector('img')!.dispatchEvent(new Event('load'));
        expect(items[1]).toHaveClass('lg-justified-item-visible');
        expect(items[0]).not.toHaveClass('lg-justified-item-visible');
        // A broken thumbnail still reveals (alt text instead of a hole).
        items[2]!.querySelector('img')!.dispatchEvent(new Event('error'));
        expect(items[2]).toHaveClass('lg-justified-item-visible');
        // A relayout never re-hides, and never double-arms a pending one.
        Object.defineProperty(
            document.getElementById('lightGallery')!,
            'clientWidth',
            {
                configurable: true,
                value: CONTAINER_WIDTH - 100,
            },
        );
        (instance as unknown as { plugins: { layout: () => void }[] }).plugins
            .filter((plugin) => 'layout' in plugin)
            .forEach((plugin) => plugin.layout());
        expect(items[1]).toHaveClass('lg-justified-item-visible');
        expect(items[0]).not.toHaveClass('lg-justified-item-visible');

        instance.destroy();
        jest.runOnlyPendingTimers();
        instance = undefined;
        expect(items[1]).not.toHaveClass('lg-justified-item-visible');
        // Cancelled on destroy: a late load changes nothing.
        items[0]!.querySelector('img')!.dispatchEvent(new Event('load'));
        expect(items[0]).not.toHaveClass('lg-justified-item-visible');
    });

    it('reveals rows top to bottom, each once every thumbnail in it loaded', () => {
        instance = initGallery();
        const rowsByTop = new Map<string, HTMLElement[]>();
        triggers().forEach((item) => {
            if (item.classList.contains('lg-justified-item-hidden')) {
                return;
            }
            const row = rowsByTop.get(item.style.top) ?? [];
            row.push(item);
            rowsByTop.set(item.style.top, row);
        });
        const rows = Array.from(rowsByTop.values());
        expect(rows.length).toBeGreaterThanOrEqual(2);
        const load = (item: HTMLElement): void => {
            item.querySelector('img')!.dispatchEvent(new Event('load'));
        };
        const visible = (item: HTMLElement): boolean =>
            item.classList.contains('lg-justified-item-visible');

        // The whole second row loads first: it waits for the row above.
        rows[1]!.forEach(load);
        expect(rows[1]!.some(visible)).toBe(false);
        // The first row minus one thumbnail: still nothing.
        rows[0]!.slice(1).forEach(load);
        expect(rows[0]!.some(visible)).toBe(false);
        // The last one lands: row one shows, and row two right behind it.
        load(rows[0]![0]!);
        expect(rows[0]!.every(visible)).toBe(true);
        expect(rows[1]!.every(visible)).toBe(true);
        rows.slice(2).forEach((row) => {
            expect(row.some(visible)).toBe(false);
        });
    });

    it('reveals an already-loaded thumbnail immediately', () => {
        const el = buildDom();
        const img = el.querySelector('img')!;
        Object.defineProperty(img, 'complete', { value: true });
        instance = lightGallery(el, {
            plugins: [Justified],
            justifiedRowHeight: 200,
            justifiedReveal: 'image',
        });
        expect(triggers()[0]).toHaveClass('lg-justified-item-visible');
        expect(triggers()[1]).not.toHaveClass('lg-justified-item-visible');
    });

    it('stays inert in dynamic mode', () => {
        document.body.innerHTML = '<div id="dynamic"></div>';
        instance = lightGallery(
            document.getElementById('dynamic') as HTMLElement,
            {
                dynamic: true,
                dynamicEl: [{ src: 'a.png', thumb: 'a-t.png' }],
                plugins: [Justified],
            },
        );
        expect(
            document
                .getElementById('dynamic')!
                .classList.contains('lg-justified'),
        ).toBe(false);
    });
});
