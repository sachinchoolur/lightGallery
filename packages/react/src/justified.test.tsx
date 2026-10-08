import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { JustifiedGrid } from './plugins/justified';

const CONTAINER_WIDTH = 1000;

function Triggers(): JSX.Element {
    return (
        <>
            <a href="a.png" data-lg-size="1600-1067">
                <img src="a-t.png" srcSet="a-t.png 240w, a.png 1600w" alt="a" />
            </a>
            <a href="b.png" data-lg-size="1067-1600">
                <img src="b-t.png" alt="b" />
            </a>
            <a href="c.png" data-lg-size="1600-1067">
                <img src="c-t.png" alt="c" />
            </a>
            <a href="d.png" data-lg-size="1600-1067">
                <img src="d-t.png" alt="d" />
            </a>
            <a href="e.png" data-lg-size="1600-1067">
                <img src="e-t.png" alt="e" />
            </a>
            <a href="f.png" data-lg-size="1600-1067">
                <img src="f-t.png" alt="f" />
            </a>
        </>
    );
}

// jsdom has no layout — the grid measures clientWidth on its container.
const originalClientWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientWidth',
);

beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get(this: HTMLElement) {
            return this.classList?.contains('lg-justified')
                ? CONTAINER_WIDTH
                : 0;
        },
    });
});

afterEach(() => {
    if (originalClientWidth) {
        Object.defineProperty(
            HTMLElement.prototype,
            'clientWidth',
            originalClientWidth,
        );
    }
});

/** Positioned triggers grouped by row (style.top), hidden ones skipped. */
function rowsOf(triggers: HTMLElement[]): HTMLElement[][] {
    const byTop = new Map<string, HTMLElement[]>();
    triggers.forEach((trigger) => {
        if (trigger.classList.contains('lg-justified-item-hidden')) {
            return;
        }
        const row = byTop.get(trigger.style.top) ?? [];
        row.push(trigger);
        byTop.set(trigger.style.top, row);
    });
    return Array.from(byTop.values());
}
const load = (trigger: HTMLElement): void => {
    trigger.querySelector('img')!.dispatchEvent(new Event('load'));
};
const visible = (trigger: HTMLElement): boolean =>
    trigger.classList.contains('lg-justified-item-visible');

describe('JustifiedGrid', () => {
    it('positions the triggers in exactly filled rows', () => {
        const { container } = render(
            <JustifiedGrid rowHeight={200} gap={10}>
                <Triggers />
            </JustifiedGrid>,
        );
        const grid = container.querySelector<HTMLElement>('.lg-justified')!;
        expect(grid.style.height).not.toBe('');

        const triggers = Array.from(grid.querySelectorAll<HTMLElement>('a'));
        const firstTop = triggers[0]!.style.top;
        const firstRow = triggers.filter(
            (trigger) => trigger.style.top === firstTop,
        );
        const total =
            firstRow.reduce(
                (sum, trigger) => sum + parseInt(trigger.style.width, 10),
                0,
            ) +
            10 * (firstRow.length - 1);
        expect(total).toBe(CONTAINER_WIDTH);
        expect(triggers[0]).toHaveClass('lg-justified-item');
    });

    it('marks the container so the reveal rules stay off other layouts', () => {
        // The stylesheet holds a thumbnail invisible until this grid
        // reveals it; the marker keeps those rules away from a grid
        // whose geometry is written by other code.
        const { container } = render(
            <JustifiedGrid rowHeight={200} gap={10}>
                <Triggers />
            </JustifiedGrid>,
        );
        expect(container.querySelector('.lg-justified')).toHaveClass(
            'lg-justified-reveal',
        );
    });

    it('writes a precise sizes hint for srcset thumbnails', () => {
        const { container } = render(
            <JustifiedGrid rowHeight={200} gap={10}>
                <Triggers />
            </JustifiedGrid>,
        );
        const first = container.querySelector<HTMLElement>('a')!;
        expect(first.querySelector('img')!.getAttribute('sizes')).toBe(
            `${first.style.width.replace('px', '')}px`,
        );
    });

    it('maps the start offset to the right edge in rtl', () => {
        const { container } = render(
            <JustifiedGrid rowHeight={200} gap={10} direction="rtl">
                <Triggers />
            </JustifiedGrid>,
        );
        const first = container.querySelector<HTMLElement>('a')!;
        expect(first.style.right).toBe('0px');
        expect(first.style.left).toBe('auto');
    });

    it('reveals each trigger once its thumbnail has loaded', () => {
        const { container } = render(
            <JustifiedGrid rowHeight={200} gap={10} reveal="image">
                <Triggers />
            </JustifiedGrid>,
        );
        const triggers = Array.from(
            container.querySelectorAll<HTMLElement>('a'),
        );
        // jsdom never loads images: positioned, still invisible.
        expect(triggers[0]!.style.width).not.toBe('');
        expect(triggers[0]).not.toHaveClass('lg-justified-item-visible');
        triggers[1]!.querySelector('img')!.dispatchEvent(new Event('load'));
        expect(triggers[1]).toHaveClass('lg-justified-item-visible');
        expect(triggers[0]).not.toHaveClass('lg-justified-item-visible');
        triggers[2]!.querySelector('img')!.dispatchEvent(new Event('error'));
        expect(triggers[2]).toHaveClass('lg-justified-item-visible');
    });

    it('reveals rows top to bottom, each once every thumbnail in it loaded', () => {
        const { container } = render(
            <JustifiedGrid rowHeight={200} gap={10}>
                <Triggers />
            </JustifiedGrid>,
        );
        const rows = rowsOf(
            Array.from(container.querySelectorAll<HTMLElement>('a')),
        );
        expect(rows.length).toBeGreaterThanOrEqual(2);
        // The whole second row loads first: it waits for the row above.
        rows[1]!.forEach(load);
        expect(rows[1]!.some(visible)).toBe(false);
        rows[0]!.slice(1).forEach(load);
        expect(rows[0]!.some(visible)).toBe(false);
        // The last one lands: row one shows, and row two right behind it.
        load(rows[0]![0]!);
        expect(rows[0]!.every(visible)).toBe(true);
        expect(rows[1]!.every(visible)).toBe(true);
        rows.slice(2).forEach((row) => expect(row.some(visible)).toBe(false));
    });

    it('renders unpositioned markup on the server', () => {
        const html = renderToString(
            <JustifiedGrid rowHeight={200} gap={10}>
                <a href="a.png" data-lg-size="1600-1067">
                    <img src="a-t.png" alt="a" />
                </a>
            </JustifiedGrid>,
        );
        expect(html).toContain('lg-justified');
        expect(html).not.toContain('position:absolute');
        expect(html).not.toContain('style=');
    });
});
