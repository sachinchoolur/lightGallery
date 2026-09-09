import {
    getJustifiedLayout,
    getJustifiedRows,
    getRevealableItems,
    parseImageSize,
} from '@lightgallery/headless';
import { lGEvents } from '../../lg-events';
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { JustifiedSettings, justifiedSettings } from './lg-justified-settings';

/**
 * lightGallery justified layout: lays the gallery's trigger thumbnails
 * out in rows of equal height and varying widths that fill the
 * container edge to edge. The row math is shared headless code; this
 * plugin measures the container, sources the aspect ratios and writes
 * the geometry.
 *
 * Aspect-ratio sources, in order: the trigger's `data-lg-size`
 * attribute, the thumbnail's `width`/`height` attributes, and finally
 * the loaded image's natural size (one relayout when the last unknown
 * resolves).
 *
 * Triggers stay invisible (stylesheet) until they are positioned; each
 * box then shows as a placeholder and the thumbnails fade in as they
 * load, row by row in reading order or one by one (`justifiedReveal`),
 * so the grid is never seen unorganized. Ship `class="lg-justified"`
 * on the container markup to cover the time before the script runs.
 */
export default class Justified {
    core: LightGallery;
    settings: JustifiedSettings;
    private $LG!: LgQuery;
    private triggers: HTMLElement[] = [];
    private ratios: (number | null)[] = [];
    private resizeObserver?: ResizeObserver;
    private layoutWidth = 0;
    private pendingLoads: (() => void)[] = [];
    private rows: HTMLElement[][] = [];
    private loaded = new Set<HTMLElement>();
    private loadWatchers = new Map<HTMLElement, () => void>();
    private originalContainerStyle = '';
    private originalTriggerStyles = new Map<HTMLElement, string>();

    constructor(instance: LightGallery, $LG: LgQuery) {
        this.core = instance;
        this.$LG = $LG;
        this.settings = { ...justifiedSettings, ...this.core.settings };
        return this;
    }

    public init(): void {
        // Dynamic galleries have no inline trigger grid to lay out.
        if (!this.settings.justified || this.core.settings.dynamic) {
            return;
        }
        this.collectTriggers();
        if (!this.triggers.length) {
            return;
        }
        this.originalContainerStyle = this.core.el.getAttribute('style') || '';
        // The reveal marker gates the stylesheet's placeholder + fade
        // rules: they hold a thumbnail invisible until this plugin
        // reveals it, so they must never apply to a grid positioned by
        // other code.
        this.core.el.classList.add('lg-justified', 'lg-justified-reveal');
        this.resolveRatios();
        this.layout();

        // refresh()/updateSlides() re-collect the core's items before
        // firing this event, the grid follows the new trigger set.
        this.core.LGel.on(`${lGEvents.updateSlides}.justified`, () => {
            this.pendingLoads.forEach((cancel) => cancel());
            this.pendingLoads = [];
            this.cancelLoadWatchers();
            this.collectTriggers();
            this.resolveRatios();
            this.layout();
        });

        // Row heights derive from the width alone, so one observer on
        // the container covers every reflow source (viewport, sidebar,
        // font swap...).
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.core.el.clientWidth !== this.layoutWidth) {
                    this.layout();
                }
            });
            this.resizeObserver.observe(this.core.el);
        }
    }

    /** Adopt the core's current trigger list into the layout. */
    private collectTriggers(): void {
        this.triggers = Array.prototype.slice.call(this.core.items);
        this.triggers.forEach((trigger) => {
            if (!this.originalTriggerStyles.has(trigger)) {
                this.originalTriggerStyles.set(
                    trigger,
                    trigger.getAttribute('style') || '',
                );
            }
            trigger.classList.add('lg-justified-item');
        });
    }

    /** Best-known aspect ratio per trigger; unknowns resolve on load. */
    private resolveRatios(): void {
        this.ratios = this.triggers.map((trigger, index) => {
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
            this.watchImageLoad(img, index);
            return null;
        });
    }

    /** Relayout once when the last unknown thumbnail resolves. */
    private watchImageLoad(img: HTMLImageElement, index: number): void {
        const cancel = (): void => {
            img.removeEventListener('load', onDone);
            img.removeEventListener('error', onDone);
        };
        const onDone = (): void => {
            cancel();
            this.pendingLoads = this.pendingLoads.filter((c) => c !== cancel);
            this.ratios[index] =
                img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 1;
            if (this.ratios.every((ratio) => ratio !== null)) {
                this.layout();
            }
        };
        img.addEventListener('load', onDone);
        img.addEventListener('error', onDone);
        this.pendingLoads.push(cancel);
    }

    private layout(): void {
        const containerWidth = this.core.el.clientWidth;
        if (!containerWidth) {
            return;
        }
        this.layoutWidth = containerWidth;
        const { boxes, containerHeight } = getJustifiedLayout({
            // Unknown ratios render square until their image resolves.
            ratios: this.ratios.map((ratio) => ratio ?? 1),
            containerWidth,
            targetRowHeight: this.settings.justifiedRowHeight,
            gap: this.settings.justifiedGap,
            lastRow: this.settings.justifiedLastRow,
            maxScale: this.settings.justifiedMaxScale,
        });
        // The box offsets are logical (from the reading-start edge).
        const startSide =
            this.core.settings.direction === 'rtl' ? 'right' : 'left';
        const endSide = startSide === 'left' ? 'right' : 'left';
        this.core.el.style.height = `${containerHeight}px`;
        this.triggers.forEach((trigger, index) => {
            const box = boxes[index]!;
            const hidden = box.width === 0 && box.height === 0;
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
            this.watchLoad(trigger, img);
        });
        this.rows = getJustifiedRows(boxes).map((row) =>
            row.map((index) => this.triggers[index]!),
        );
        this.reveal();
    }

    /** Track when the trigger's thumbnail has settled (loaded or failed). */
    private watchLoad(
        trigger: HTMLElement,
        img: HTMLImageElement | null,
    ): void {
        if (this.loaded.has(trigger) || this.loadWatchers.has(trigger)) {
            return;
        }
        if (!img || img.complete) {
            this.loaded.add(trigger);
            return;
        }
        const onDone = (): void => {
            cancel();
            this.loaded.add(trigger);
            this.reveal();
        };
        const cancel = (): void => {
            img.removeEventListener('load', onDone);
            img.removeEventListener('error', onDone);
            this.loadWatchers.delete(trigger);
        };
        img.addEventListener('load', onDone);
        img.addEventListener('error', onDone);
        this.loadWatchers.set(trigger, cancel);
    }

    /**
     * Fade in what may show now (see `justifiedReveal`). Never re-hides:
     * a relayout regroups the rows, already visible triggers stay.
     */
    private reveal(): void {
        getRevealableItems(
            this.rows,
            (trigger) => this.loaded.has(trigger),
            this.settings.justifiedReveal,
        ).forEach((trigger) => {
            trigger.classList.add('lg-justified-item-visible');
        });
    }

    private cancelLoadWatchers(): void {
        Array.from(this.loadWatchers.values()).forEach((cancel) => cancel());
    }

    public closeGallery(): void {
        // Nothing to do, the layout lives outside the lightbox.
    }

    public destroy(): void {
        this.resizeObserver?.disconnect();
        this.pendingLoads.forEach((cancel) => cancel());
        this.pendingLoads = [];
        this.cancelLoadWatchers();
        this.loaded.clear();
        this.rows = [];
        if (!this.triggers.length) {
            return;
        }
        this.core.LGel.off('.justified');
        this.core.el.classList.remove('lg-justified', 'lg-justified-reveal');
        if (this.originalContainerStyle) {
            this.core.el.setAttribute('style', this.originalContainerStyle);
        } else {
            this.core.el.removeAttribute('style');
        }
        this.triggers.forEach((trigger) => {
            trigger.classList.remove(
                'lg-justified-item',
                'lg-justified-item-hidden',
                'lg-justified-item-visible',
            );
            const original = this.originalTriggerStyles.get(trigger);
            if (original) {
                trigger.setAttribute('style', original);
            } else {
                trigger.removeAttribute('style');
            }
        });
    }
}
