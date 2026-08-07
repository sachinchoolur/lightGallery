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
    },
    setup: () => ({ sizes: SIZES }),
    template: `
        <JustifiedGrid :row-height="200" :gap="10" :direction="direction">
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
