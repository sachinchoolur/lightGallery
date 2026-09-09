import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { JustifiedGrid } from './plugins/justified';

const CONTAINER_WIDTH = 1000;

const SIZES = [
    '1600-1067',
    '1067-1600',
    '1600-1067',
    '1600-1067',
    '1600-1067',
    '1600-1067',
];

const Host = defineComponent({
    components: { JustifiedGrid },
    props: {
        direction: { type: String, default: 'auto' },
        reveal: { type: String, default: 'row' },
    },
    setup: () => ({ sizes: SIZES }),
    template: `
        <JustifiedGrid
            :row-height="200"
            :gap="10"
            :direction="direction"
            :reveal="reveal"
        >
            <a
                v-for="(size, index) of sizes"
                :key="index"
                :href="index + '.png'"
                :data-lg-size="size"
            >
                <img
                    :src="index + '-t.png'"
                    :srcset="index === 0 ? '0-t.png 240w, 0.png 1600w' : undefined"
                    :alt="String(index)"
                />
            </a>
        </JustifiedGrid>
    `,
});

enableAutoUnmount(afterEach);

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
    document.body.innerHTML = '';
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

describe('JustifiedGrid (vue)', () => {
    it('positions the triggers in exactly filled rows', () => {
        const wrapper = mount(Host, { attachTo: document.body });
        const grid = wrapper.element as HTMLElement;
        expect(grid.classList.contains('lg-justified')).toBe(true);
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
        expect(triggers[0]!.classList.contains('lg-justified-item')).toBe(true);
    });

    it('marks the container so the reveal rules stay off other layouts', () => {
        // The stylesheet holds a thumbnail invisible until this grid
        // reveals it; the marker keeps those rules away from a grid
        // whose geometry is written by other code.
        const wrapper = mount(Host, { attachTo: document.body });
        expect(
            (wrapper.element as HTMLElement).classList.contains(
                'lg-justified-reveal',
            ),
        ).toBe(true);
    });

    it('writes a precise sizes hint for srcset thumbnails', () => {
        const wrapper = mount(Host, { attachTo: document.body });
        const first = (
            wrapper.element as HTMLElement
        ).querySelector<HTMLElement>('a')!;
        expect(first.querySelector('img')!.getAttribute('sizes')).toBe(
            `${first.style.width.replace('px', '')}px`,
        );
    });

    it('maps the start offset to the right edge in rtl', () => {
        const wrapper = mount(Host, {
            props: { direction: 'rtl' },
            attachTo: document.body,
        });
        const first = (
            wrapper.element as HTMLElement
        ).querySelector<HTMLElement>('a')!;
        expect(first.style.right).toBe('0px');
        expect(first.style.left).toBe('auto');
    });

    it('reveals each trigger once its thumbnail has loaded', () => {
        const wrapper = mount(Host, {
            attachTo: document.body,
            props: { reveal: 'image' },
        });
        const triggers = Array.from(
            (wrapper.element as HTMLElement).querySelectorAll<HTMLElement>('a'),
        );
        // jsdom never loads images: positioned, still invisible.
        expect(triggers[0]!.style.width).not.toBe('');
        expect(
            triggers[0]!.classList.contains('lg-justified-item-visible'),
        ).toBe(false);
        triggers[1]!.querySelector('img')!.dispatchEvent(new Event('load'));
        expect(
            triggers[1]!.classList.contains('lg-justified-item-visible'),
        ).toBe(true);
        expect(
            triggers[0]!.classList.contains('lg-justified-item-visible'),
        ).toBe(false);
        triggers[2]!.querySelector('img')!.dispatchEvent(new Event('error'));
        expect(
            triggers[2]!.classList.contains('lg-justified-item-visible'),
        ).toBe(true);
    });

    it('reveals rows top to bottom, each once every thumbnail in it loaded', () => {
        const wrapper = mount(Host, { attachTo: document.body });
        const rows = rowsOf(
            Array.from(
                (wrapper.element as HTMLElement).querySelectorAll<HTMLElement>(
                    'a',
                ),
            ),
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

    it('renders unpositioned markup before mounting (SSR shape)', () => {
        // Render function output only — no mount, no client measure.
        const vnode = h(
            JustifiedGrid,
            { rowHeight: 200 },
            { default: () => [h('a', { href: 'a.png' })] },
        );
        expect(vnode.props?.style).toBeUndefined();
    });
});
