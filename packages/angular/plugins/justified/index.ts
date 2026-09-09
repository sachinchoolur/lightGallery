import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    afterNextRender,
    effect,
    inject,
    input,
    untracked,
} from '@angular/core';
import {
    getJustifiedLayout,
    getJustifiedRows,
    getRevealableItems,
    parseImageSize,
    type JustifiedReveal,
} from '@lightgallery/headless';

/**
 * lightGallery justified layout: lays the gallery's trigger thumbnails
 * out in rows of equal height and varying widths that fill the
 * container edge to edge. Project the trigger elements — the row math
 * is shared headless code; this component measures the host, sources
 * the aspect ratios and writes the geometry. SSR output stays
 * unpositioned until the first client-side measure.
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

/**
 * Track when the trigger's thumbnail has settled (loaded or failed) and
 * report it, so the grid can reveal what may show: the stylesheet keeps
 * thumbnails invisible until then, so the grid is never seen
 * unorganized.
 */
function watchThumbnailLoad(
    trigger: HTMLElement,
    loaded: Set<HTMLElement>,
    pending: Set<HTMLElement>,
    cancels: (() => void)[],
    onLoaded: () => void,
): void {
    if (loaded.has(trigger) || pending.has(trigger)) {
        return;
    }
    const img = trigger.querySelector('img');
    if (!img || img.complete) {
        loaded.add(trigger);
        return;
    }
    const onDone = (): void => {
        cancel();
        loaded.add(trigger);
        onLoaded();
    };
    const cancel = (): void => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
        pending.delete(trigger);
    };
    img.addEventListener('load', onDone);
    img.addEventListener('error', onDone);
    pending.add(trigger);
    cancels.push(cancel);
}

@Component({
    selector: 'lg-justified-grid',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'lg-justified lg-justified-reveal' },
    template: `<ng-content />`,
})
export class LgJustifiedGridComponent {
    /** Row height (px) the layout aims for. */
    readonly rowHeight = input(180);
    /** Gap between thumbnails and between rows (px). */
    readonly gap = input(8);
    /**
     * Last-row policy: 'justify' scales the leftover row to fill the
     * width, 'start' keeps the row height aligned to the reading
     * start, 'hide' hides the leftover thumbnails.
     */
    readonly lastRow = input<'justify' | 'start' | 'hide'>('start');
    /** Row-height clamp as a multiple of `rowHeight`. */
    readonly maxScale = input(1.75);
    /**
     * How thumbnails appear as they load: 'row' reveals whole rows top
     * to bottom, each once every thumbnail in it has loaded; 'image'
     * reveals each thumbnail on its own.
     */
    readonly reveal = input<JustifiedReveal>('row');
    /**
     * Reading direction of the grid; 'auto' inherits the nearest
     * ancestor `dir` attribute.
     */
    readonly direction = input<'ltr' | 'rtl' | 'auto'>('auto');

    private readonly host =
        inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    private observer?: ResizeObserver;
    private cancels: (() => void)[] = [];
    private layoutWidth = 0;
    private rendered = false;

    constructor() {
        afterNextRender(() => {
            this.rendered = true;
            this.attach();
        });
        // Re-run the whole pass when any layout input changes.
        effect(() => {
            this.rowHeight();
            this.gap();
            this.lastRow();
            this.maxScale();
            this.reveal();
            this.direction();
            if (this.rendered) {
                untracked(() => this.attach());
            }
        });
    }

    ngOnDestroy(): void {
        this.detach();
    }

    private detach(): void {
        this.observer?.disconnect();
        this.observer = undefined;
        this.cancels.forEach((cancel) => cancel());
        this.cancels = [];
    }

    private attach(): void {
        this.detach();
        const el = this.host;
        const triggers = Array.from(el.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement,
        );
        if (!triggers.length) {
            return;
        }
        const ratios = triggers.map(getTriggerRatio);
        const revealPending = new Set<HTMLElement>();
        const loadedTriggers = new Set<HTMLElement>();
        let rows: HTMLElement[][] = [];
        const revealLoaded = (): void => {
            getRevealableItems(
                rows,
                (trigger) => loadedTriggers.has(trigger),
                this.reveal(),
            ).forEach((trigger) => {
                trigger.classList.add('lg-justified-item-visible');
            });
        };

        const layout = (): void => {
            const containerWidth = el.clientWidth;
            if (!containerWidth) {
                return;
            }
            this.layoutWidth = containerWidth;
            const { boxes, containerHeight } = getJustifiedLayout({
                // Unknown ratios render square until their image resolves.
                ratios: ratios.map((ratio) => ratio ?? 1),
                containerWidth,
                targetRowHeight: this.rowHeight(),
                gap: this.gap(),
                lastRow: this.lastRow(),
                maxScale: this.maxScale(),
            });
            const startSide =
                resolveDirection(el, this.direction()) === 'rtl'
                    ? 'right'
                    : 'left';
            const endSide = startSide === 'left' ? 'right' : 'left';
            el.style.height = `${containerHeight}px`;
            triggers.forEach((trigger, index) => {
                const box = boxes[index]!;
                const hidden = box.width === 0 && box.height === 0;
                trigger.classList.add('lg-justified-item');
                trigger.classList.toggle('lg-justified-item-hidden', hidden);
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
                watchThumbnailLoad(
                    trigger,
                    loadedTriggers,
                    revealPending,
                    this.cancels,
                    revealLoaded,
                );
            });
            rows = getJustifiedRows(boxes).map((row) =>
                row.map((index) => triggers[index]!),
            );
            revealLoaded();
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
            this.cancels.push(() => {
                img.removeEventListener('load', onDone);
                img.removeEventListener('error', onDone);
            });
        });

        layout();
        if (typeof ResizeObserver !== 'undefined') {
            this.observer = new ResizeObserver(() => {
                if (el.clientWidth !== this.layoutWidth) {
                    layout();
                }
            });
            this.observer.observe(el);
        } else {
            // Row heights derive from the width alone — the window is
            // the only reflow source left without an observer.
            const onResize = (): void => layout();
            window.addEventListener('resize', onResize);
            this.cancels.push(() =>
                window.removeEventListener('resize', onResize),
            );
        }
    }
}
