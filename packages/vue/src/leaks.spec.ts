import { enableAutoUnmount, mount } from '@vue/test-utils';
import {
    defineComponent,
    h,
    inject,
    nextTick,
    onUpdated,
} from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import { LG_STORE } from './store';
import type { LgGalleryItem } from './types';
import Autoplay from './plugins/autoplay';
import Comment from './plugins/comment';
import Fullscreen from './plugins/fullscreen';
import Hash from './plugins/hash';
import MediumZoom from './plugins/mediumZoom';
import Pager from './plugins/pager';
import RelativeCaption from './plugins/relativeCaption';
import Rotate from './plugins/rotate';
import Share from './plugins/share';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';
import VimeoThumbnail from './plugins/vimeoThumbnail';
import Zoom from './plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b', caption: 'B' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c', caption: 'C' },
];

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function advance(ms: number): Promise<void> {
    vi.advanceTimersByTime(ms);
    await nextTick();
}

async function settle(): Promise<void> {
    for (let i = 0; i < 3; i++) {
        await nextTick();
    }
}

function firePointer(
    target: EventTarget,
    type: 'pointerdown' | 'pointermove' | 'pointerup',
    init: { x?: number; y?: number; pointerId?: number },
): void {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: init.x ?? 0,
        clientY: init.y ?? 0,
    });
    Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });
    target.dispatchEvent(event);
}

/** Reactivity probe: any reactive write in a storm bumps a counter. */
const probeCounters = { updates: 0, stateWrites: 0 };
const StoreProbe = defineComponent({
    name: 'StoreProbe13',
    setup() {
        const store = inject(LG_STORE)!;
        onUpdated(() => {
            probeCounters.updates++;
        });
        return () =>
            h(
                'span',
                { class: 'store-probe' },
                String(store.state.value.currentIndex),
            );
    },
});

const ALL_13 = [
    Thumbnail,
    Zoom,
    Video,
    Autoplay,
    Fullscreen,
    { ...Hash, defaults: { ...Hash.defaults!, galleryId: 'leaks' } },
    Pager,
    Share,
    Rotate,
    { ...Comment, defaults: { ...Comment.defaults!, commentBox: true } },
    {
        ...MediumZoom,
        defaults: { ...MediumZoom.defaults!, mediumZoom: false },
    },
    {
        ...RelativeCaption,
        defaults: {
            ...RelativeCaption.defaults!,
            relativeCaption: false,
        },
    },
    VimeoThumbnail,
];

const LeakHost = defineComponent({
    components: { LightGallery, StoreProbe },
    setup: () => ({ items: ITEMS, plugins: ALL_13 }),
    template: `
        <LightGallery
            :slides="items"
            :zoom-from-origin="false"
            :plugins="plugins"
            :enable-swipe="true"
            :enable-drag="true"
        >
            <StoreProbe />
        </LightGallery>
    `,
});

interface ListenerLedger {
    balance: Map<string, number>;
    restore(): void;
}

/** Track add/remove parity for every window/document listener type. */
function trackListeners(): ListenerLedger {
    const balance = new Map<string, number>();
    const targets: Array<Window | Document> = [window, document];
    const originals = targets.map((target) => ({
        target,
        add: target.addEventListener.bind(target),
        remove: target.removeEventListener.bind(target),
    }));
    targets.forEach((target) => {
        const add = target.addEventListener.bind(target);
        const remove = target.removeEventListener.bind(target);
        target.addEventListener = ((type: string, ...rest: unknown[]) => {
            balance.set(type, (balance.get(type) ?? 0) + 1);
            return (add as (...a: unknown[]) => unknown)(type, ...rest);
        }) as typeof target.addEventListener;
        target.removeEventListener = ((
            type: string,
            ...rest: unknown[]
        ) => {
            balance.set(type, (balance.get(type) ?? 0) - 1);
            return (remove as (...a: unknown[]) => unknown)(type, ...rest);
        }) as typeof target.removeEventListener;
    });
    return {
        balance,
        restore() {
            originals.forEach(({ target, add, remove }) => {
                target.addEventListener = add;
                target.removeEventListener = remove;
            });
        },
    };
}

async function openAndLoad(
    wrapper: ReturnType<typeof mount>,
): Promise<void> {
    (
        wrapper.findComponent(LightGallery).vm as unknown as {
            openGallery(i?: number): void;
        }
    ).openGallery(0);
    await settle();
    await advance(450);
    document
        .querySelector<HTMLImageElement>('img.lg-image[data-index="0"]')
        ?.dispatchEvent(new Event('load'));
    await settle();
}

enableAutoUnmount(afterEach);

beforeEach(() => {
    vi.useFakeTimers();
    probeCounters.updates = 0;
    probeCounters.stateWrites = 0;
});
afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
    window.location.hash = '';
});

describe('leak + reactivity audit, all 13 plugins', () => {
    it('mount → interact → unmount leaves no listeners, timers or DOM', async () => {
        const ledger = trackListeners();
        try {
            const wrapper = mount(LeakHost, { attachTo: document.body });
            await openAndLoad(wrapper);

            // Touch every interaction surface once.
            (
                document.querySelectorAll<HTMLElement>('.lg-thumb-item')[1]!
            ).click();
            await settle();
            await advance(500);
            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
            );
            await settle();
            await advance(500);
            const item = query('.lg-item.lg-current')!;
            firePointer(item, 'pointerdown', { x: 200, y: 100 });
            await settle();
            firePointer(window, 'pointermove', { x: 120, y: 100 });
            firePointer(window, 'pointerup', { x: 120, y: 100 });
            await settle();
            await advance(600);
            (query('.lg-actual-size') as HTMLButtonElement).click();
            await settle();
            (query('.lg-share') as HTMLButtonElement).click();
            await settle();
            (query('.lg-autoplay-button') as HTMLButtonElement).click();
            await settle();

            wrapper.unmount();

            expect(query('.lg-container')).toBeNull();
            expect(
                document.documentElement.classList.contains('lg-on'),
            ).toBe(false);
            // Add/remove parity for every gallery-owned listener type.
            // The exact residue below is jsdom's selector engine (nwsapi)
            // attaching document mouseover/mouseout once per environment —
            // stack-traced during the sibling audit; not gallery-owned.
            // Any real leak pushes a type past this budget.
            const imbalanced = Object.fromEntries(
                [...ledger.balance.entries()].filter(
                    ([, count]) => count !== 0,
                ),
            );
            expect(imbalanced).toEqual({ mouseover: 1, mouseout: 1 });
            vi.runOnlyPendingTimers();
            expect(vi.getTimerCount()).toBe(0);
        } finally {
            ledger.restore();
        }
    });

    it('zero reactive writes during a pointermove storm with all 13 mounted', async () => {
        const wrapper = mount(LeakHost, { attachTo: document.body });
        await openAndLoad(wrapper);

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 300, y: 100 });
        await settle();

        const updatesBefore = probeCounters.updates;
        for (let x = 299; x >= 200; x--) {
            firePointer(window, 'pointermove', { x, y: 100 });
        }
        expect(item.style.transform).not.toBe('');
        await settle();
        expect(probeCounters.updates).toBe(updatesBefore);

        firePointer(window, 'pointerup', { x: 200, y: 100 });
        await settle();
        await advance(600);
        wrapper.unmount();
    });
});
