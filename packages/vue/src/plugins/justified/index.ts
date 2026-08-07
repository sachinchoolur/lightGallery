import {
    defineComponent,
    h,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    type PropType,
} from 'vue';
import { getJustifiedLayout, parseImageSize } from '@lightgallery/headless';

/**
 * lightGallery justified layout: lays the gallery's trigger thumbnails
 * out in rows of equal height and varying widths that fill the
 * container edge to edge. Wrap the trigger elements in the default
 * slot — the row math is shared headless code; this component measures
 * the container, sources the aspect ratios and writes the geometry.
 * SSR output stays unpositioned until the first client-side measure.
 */

/** Nearest ancestor `dir` attribute (manual walk — no selector engine). */
function resolveDirection(
    element: HTMLElement,
    direction: 'ltr' | 'rtl' | 'auto',
): 'ltr' | 'rtl' {
    if (direction !== 'auto') {
        return direction;
    }
    let node: HTMLElement | null = element;
    while (node) {
        const dir = node.getAttribute('dir');
        if (dir === 'rtl' || dir === 'ltr') {
            return dir;
        }
        node = node.parentElement;
    }
    return 'ltr';
}

/**
 * Best-known aspect ratio for a trigger: `data-lg-size` → the
 * thumbnail's width/height attributes → the loaded natural size.
 * `null` means unknown until the image loads.
 */
function getTriggerRatio(trigger: HTMLElement): number | null {
    const size = parseImageSize(
        trigger.getAttribute('data-lg-size') || undefined,
        window.innerWidth,
    );
    if (size) {
        return size.width / size.height;
    }
    const img = trigger.querySelector('img');
    if (!img) {
        return 1;
    }
    const width = parseInt(img.getAttribute('width') || '', 10);
    const height = parseInt(img.getAttribute('height') || '', 10);
    if (width > 0 && height > 0) {
        return width / height;
    }
    if (img.complete && img.naturalWidth > 0) {
        return img.naturalWidth / img.naturalHeight;
    }
    return null;
}

export const JustifiedGrid = defineComponent({
    name: 'LgJustifiedGrid',
    props: {
        /** Row height (px) the layout aims for. */
        rowHeight: { type: Number, default: 180 },
        /** Gap between thumbnails and between rows (px). */
        gap: { type: Number, default: 8 },
        /**
         * Last-row policy: 'justify' scales the leftover row to fill
         * the width, 'start' keeps the row height aligned to the
         * reading start, 'hide' hides the leftover thumbnails.
         */
        lastRow: {
            type: String as PropType<'justify' | 'start' | 'hide'>,
            default: 'start',
        },
        /** Row-height clamp as a multiple of `rowHeight`. */
        maxScale: { type: Number, default: 1.75 },
        /**
         * Reading direction of the grid; 'auto' inherits the nearest
         * ancestor `dir` attribute.
         */
        direction: {
            type: String as PropType<'ltr' | 'rtl' | 'auto'>,
            default: 'auto',
        },
    },
    setup(props, { slots }) {
        const container = ref<HTMLElement | null>(null);
        let cancels: (() => void)[] = [];
        let observer: ResizeObserver | undefined;
        let layoutWidth = 0;

        function detach(): void {
            observer?.disconnect();
            observer = undefined;
            cancels.forEach((cancel) => cancel());
            cancels = [];
        }

        function attach(): void {
            detach();
            const el = container.value;
            if (!el) {
                return;
            }
            const triggers = Array.from(el.children).filter(
                (child): child is HTMLElement => child instanceof HTMLElement,
            );
            const ratios = triggers.map(getTriggerRatio);

            const layout = (): void => {
                const containerWidth = el.clientWidth;
                if (!containerWidth) {
                    return;
                }
                layoutWidth = containerWidth;
                const { boxes, containerHeight } = getJustifiedLayout({
                    // Unknown ratios render square until they resolve.
                    ratios: ratios.map((ratio) => ratio ?? 1),
                    containerWidth,
                    targetRowHeight: props.rowHeight,
                    gap: props.gap,
                    lastRow: props.lastRow,
                    maxScale: props.maxScale,
                });
                const startSide =
                    resolveDirection(el, props.direction) === 'rtl'
                        ? 'right'
                        : 'left';
                const endSide = startSide === 'left' ? 'right' : 'left';
                el.style.height = `${containerHeight}px`;
                triggers.forEach((trigger, index) => {
                    const box = boxes[index]!;
                    const hidden = box.width === 0 && box.height === 0;
                    trigger.classList.add('lg-justified-item');
                    trigger.classList.toggle(
                        'lg-justified-item-hidden',
                        hidden,
                    );
                    if (hidden) {
                        return;
                    }
                    trigger.style.top = `${box.top}px`;
                    trigger.style[startSide] = `${box.start}px`;
                    trigger.style[endSide] = 'auto';
                    trigger.style.width = `${box.width}px`;
                    trigger.style.height = `${box.height}px`;
                    // With the rendered width known exactly, responsive
                    // thumbnails get a precise sizes hint.
                    const img = trigger.querySelector('img');
                    if (img && img.hasAttribute('srcset')) {
                        img.setAttribute('sizes', `${box.width}px`);
                    }
                });
            };

            // Unknown ratios relayout once, when the last one resolves.
            triggers.forEach((trigger, index) => {
                if (ratios[index] !== null) {
                    return;
                }
                const img = trigger.querySelector('img');
                if (!img) {
                    ratios[index] = 1;
                    return;
                }
                const onDone = (): void => {
                    img.removeEventListener('load', onDone);
                    img.removeEventListener('error', onDone);
                    ratios[index] =
                        img.naturalWidth > 0
                            ? img.naturalWidth / img.naturalHeight
                            : 1;
                    if (ratios.every((ratio) => ratio !== null)) {
                        layout();
                    }
                };
                img.addEventListener('load', onDone);
                img.addEventListener('error', onDone);
                cancels.push(() => {
                    img.removeEventListener('load', onDone);
                    img.removeEventListener('error', onDone);
                });
            });

            layout();
            if (typeof ResizeObserver !== 'undefined') {
                observer = new ResizeObserver(() => {
                    if (el.clientWidth !== layoutWidth) {
                        layout();
                    }
                });
                observer.observe(el);
            } else {
                // Row heights derive from the width alone — the window
                // is the only reflow source left without an observer.
                const onResize = (): void => layout();
                window.addEventListener('resize', onResize);
                cancels.push(() =>
                    window.removeEventListener('resize', onResize),
                );
            }
        }

        onMounted(attach);
        watch(
            () => [
                props.rowHeight,
                props.gap,
                props.lastRow,
                props.maxScale,
                props.direction,
            ],
            attach,
        );
        onBeforeUnmount(detach);

        return () =>
            h('div', { ref: container, class: 'lg-justified' }, [
                slots.default?.(),
            ]);
    },
});

export default JustifiedGrid;
