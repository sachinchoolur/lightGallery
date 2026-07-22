import { enableAutoUnmount, mount } from '@vue/test-utils';
import {
    defineComponent,
    h,
    inject,
    nextTick,
    onUpdated,
    watch,
} from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import { LG_RUNTIME, type LgGalleryRuntime } from './runtime';
import { LG_STORE } from './store';
import type { LgGalleryItem } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', alt: 'a' },
    { src: 'b.jpg', alt: 'b' },
    { src: 'c.jpg', alt: 'c' },
    { src: 'd.jpg', alt: 'd' },
    { src: 'e.jpg', alt: 'e' },
];

const SPEED = 400;

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

/**
 * jsdom has no PointerEvent constructor; a MouseEvent with the pointer
 * fields defined on it walks and quacks enough for the native listeners.
 */
function firePointer(
    target: EventTarget,
    type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
    init: {
        x?: number;
        y?: number;
        pointerId?: number;
        pointerType?: string;
    },
): void {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: init.x ?? 0,
        clientY: init.y ?? 0,
    });
    Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
    Object.defineProperty(event, 'pointerType', {
        value: init.pointerType ?? 'touch',
    });
    target.dispatchEvent(event);
}

/**
 * Reactivity probe: injected into the gallery's
 * store — any reactive write during a pointer storm would bump one of
 * these counters (a state write triggers the watcher; a re-render of a
 * store-tracking component triggers onUpdated).
 */
const probeCounters = { updates: 0, stateWrites: 0 };
const StoreProbe = defineComponent({
    name: 'StoreProbe',
    setup() {
        const store = inject(LG_STORE)!;
        watch(store.state, () => {
            probeCounters.stateWrites++;
        });
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

const Host = defineComponent({
    components: { LightGallery, StoreProbe },
    props: {
        mode: { type: String, default: 'lg-slide' },
        mousewheel: { type: Boolean, default: true },
        log: { type: Array, required: true },
    },
    setup: () => ({ items: ITEMS }),
    template: `
        <LightGallery
            :slides="items"
            :zoom-from-origin="false"
            :mode="mode"
            :mousewheel="mousewheel"
            @after-slide="log.push('afterSlide:' + $event.index + ':' + $event.fromTouch)"
        >
            <StoreProbe />
        </LightGallery>
    `,
});

async function openAndLoad(log: string[] = []) {
    const wrapper = mount(Host, {
        props: { log },
        attachTo: document.body,
    });
    wrapper.findComponent(LightGallery).vm.openGallery(0);
    await settle();
    await advance(450);
    document
        .querySelector<HTMLImageElement>('img.lg-image[data-index="0"]')
        ?.dispatchEvent(new Event('load'));
    await settle();
    return wrapper;
}

function runtimeOf(wrapper: ReturnType<typeof mount>): LgGalleryRuntime {
    return (
        wrapper.findComponent(StoreProbe).vm.$ as unknown as {
            provides: Record<symbol, unknown>;
        }
    ).provides[LG_RUNTIME as symbol] as LgGalleryRuntime;
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
});

describe('useGalleryGestures', () => {
    it('follows the finger with direct DOM writes — zero reactive writes — and commits past the threshold', async () => {
        const log: string[] = [];
        const wrapper = await openAndLoad(log);

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await settle();
        // Drag start assigned neighbor position classes (the one render).
        expect(query('.lg-item.lg-next-slide')).not.toBeNull();

        const updatesBefore = probeCounters.updates;
        const writesBefore = probeCounters.stateWrites;
        firePointer(window, 'pointermove', { x: 180, y: 100 });
        expect(item.style.transform).toBe('translate3d(-20px, 0px, 0px)');
        expect(query('.lg-outer')!.classList.contains('lg-dragging')).toBe(
            true,
        );
        // Pointermove storm: transforms written directly to the DOM; no
        // ref/reactive writes, no component updates.
        for (let x = 179; x >= 120; x--) {
            firePointer(window, 'pointermove', { x, y: 100 });
        }
        expect(item.style.transform).toBe('translate3d(-80px, 0px, 0px)');
        await settle();
        expect(probeCounters.updates).toBe(updatesBefore);
        expect(probeCounters.stateWrites).toBe(writesBefore);

        firePointer(window, 'pointerup', { x: 120, y: 100 });
        await settle();
        // Inline transforms and drag classes handed back to Vue.
        expect(item.style.transform).toBe('');
        expect(query('.lg-outer')!.classList.contains('lg-dragging')).toBe(
            false,
        );
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(SPEED + 100);
        expect(log).toContain('afterSlide:1:true');
        wrapper.unmount();
    });

    it('snaps back below the swipe threshold', async () => {
        const wrapper = await openAndLoad();

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await settle();
        firePointer(window, 'pointermove', { x: 182, y: 100 });
        expect(item.style.transform).toBe('translate3d(-18px, 0px, 0px)');
        firePointer(window, 'pointerup', { x: 182, y: 100 });
        await settle();

        expect(item.style.transform).toBe('');
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
        wrapper.unmount();
    });

    it('stands down for a second pointer (pinch seam) or a claimed lock', async () => {
        const wrapper = await openAndLoad();
        const runtime = runtimeOf(wrapper);

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 200, y: 100, pointerId: 1 });
        firePointer(item, 'pointerdown', { x: 300, y: 100, pointerId: 2 });
        expect(runtime.gestureSeam.pointers.length).toBe(2);
        firePointer(window, 'pointermove', { x: 100, y: 100, pointerId: 1 });
        expect(item.style.transform).toBe('');
        // Browser release order for a pinch: second finger, then the
        // session pointer (sibling-parity behavior).
        firePointer(window, 'pointerup', { x: 300, y: 100, pointerId: 2 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 1 });
        await settle();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
        expect(runtime.gestureSeam.pointers.length).toBe(0);

        // A claimed lock (zoom pinch) blocks new sessions.
        runtime.gestureSeam.claim('pinch');
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        expect(item.style.transform).toBe('');
        runtime.gestureSeam.claim(null);
        wrapper.unmount();
    });

    it('fades the backdrop on vertical drag and closes past the threshold', async () => {
        const wrapper = await openAndLoad();

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await settle();
        firePointer(window, 'pointermove', { x: 200, y: 120 });
        firePointer(window, 'pointermove', { x: 200, y: 220 });
        const backdrop = query('.lg-backdrop')!;
        expect(backdrop.style.opacity).not.toBe('');
        expect(Number(backdrop.style.opacity)).toBeLessThan(1);
        expect(item.style.transform).toContain('scale3d');
        expect(query('.lg-outer')!.classList.contains('lg-hide-items')).toBe(
            true,
        );

        firePointer(window, 'pointerup', { x: 200, y: 220 });
        await settle();
        expect(backdrop.style.opacity).toBe('');
        await advance(450);
        expect(query('.lg-container')).toBeNull();
        wrapper.unmount();
    });

    it('restores a sub-threshold vertical drag without closing', async () => {
        const wrapper = await openAndLoad();

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await settle();
        firePointer(window, 'pointermove', { x: 200, y: 120 });
        firePointer(window, 'pointermove', { x: 200, y: 160 });
        firePointer(window, 'pointerup', { x: 200, y: 160 });
        await settle();

        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-backdrop')!.style.opacity).toBe('');
        expect(item.style.transform).toBe('');
        wrapper.unmount();
    });

    it('adds lg-slide for the release animation in non-slide modes', async () => {
        const log: string[] = [];
        const wrapper = mount(Host, {
            props: { log, mode: 'lg-fade' },
            attachTo: document.body,
        });
        wrapper.findComponent(LightGallery).vm.openGallery(0);
        await settle();
        await advance(450);
        document
            .querySelector<HTMLImageElement>('img.lg-image[data-index="0"]')
            ?.dispatchEvent(new Event('load'));
        await settle();

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await settle();
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointerup', { x: 100, y: 100 });
        await settle();

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-fade')).toBe(true);
        expect(outer.classList.contains('lg-slide')).toBe(true);
        await advance(SPEED + 100);
        expect(outer.classList.contains('lg-slide')).toBe(false);
        wrapper.unmount();
    });

    it('navigates on mousewheel (throttled) and arrow keys', async () => {
        const wrapper = await openAndLoad();
        const outer = query('.lg-outer')!;

        outer.dispatchEvent(
            new WheelEvent('wheel', { deltaY: 100, cancelable: true }),
        );
        await settle();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        // Within the 1000ms throttle window: ignored.
        outer.dispatchEvent(
            new WheelEvent('wheel', { deltaY: 100, cancelable: true }),
        );
        await settle();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(1100);
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
        await settle();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
        wrapper.unmount();
    });

    it('unmount mid-drag removes the window listeners', async () => {
        const wrapper = await openAndLoad();

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await settle();
        firePointer(window, 'pointermove', { x: 150, y: 100 });
        expect(item.style.transform).not.toBe('');

        const removeSpy = vi.spyOn(window, 'removeEventListener');
        wrapper.unmount();
        const removed = removeSpy.mock.calls.map((call) => call[0]);
        expect(removed).toContain('pointermove');
        expect(removed).toContain('pointerup');
        expect(removed).toContain('pointercancel');
        removeSpy.mockRestore();
        // A stray move after unmount must be a no-op, not an error.
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        expect(query('.lg-container')).toBeNull();
    });
});
