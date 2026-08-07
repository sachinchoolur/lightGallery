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
