import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    Injectable,
    input,
    signal,
    untracked,
    viewChild,
    type TemplateRef,
} from '@angular/core';
import {
    applyZoom,
    clampPan,
    clampScale,
    getActualSizeScale,
    getPanBounds,
    getPinchScale,
    getPointerDistance,
    getPointZoomPan,
    getSlideType,
    initialZoomSlice,
    type ZoomPan,
    type ZoomSlice,
} from '@lightgallery/headless';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';

/**
 * Zoom feature (2.x `lg-zoom`): toolbar buttons, double-click/tap point
 * zoom, pinch, pan-when-zoomed — the gesture-consumer template wave 2
 * copies. Same performance contract as the core gestures (plan 004):
 * pinch/pan write transforms straight to the DOM; signals change only on
 * discrete commits (button step, gesture end).
 *
 * DOM deviation vs 2.x (noted for the 007 parity matrix, same as React):
 * transforms live on two plugin-owned wrapper divs with inline transitions
 * instead of `.lg-img-wrap`/`.lg-image` + `lg-zoomable` CSS.
 */

export interface ZoomStrings {
    zoomIn: string;
    zoomOut: string;
    viewActualSize: string;
}

export interface ZoomSettings {
    /** Zoom increment per zoom-in/out step. */
    scale: number;
    /** Enable/disable the feature. */
    zoom: boolean;
    /** Allow zooming beyond the image's actual size. */
    infiniteZoom: boolean;
    /** Show the actual-size button. */
    actualSize: boolean;
    /** Show zoom in/out buttons. */
    showZoomInOutIcons: boolean;
    /** Icon classes for the zoom in/out buttons. */
    actualSizeIcons: {
        zoomIn: 'lg-zoom-in' | 'lg-actual-size';
        zoomOut: 'lg-zoom-out' | 'lg-actual-size';
    };
    /** Delay (ms) after a slide loads before zoom interactions arm. */
    enableZoomAfter: number;
    zoomPluginStrings: ZoomStrings;
}

export const zoomSettings: ZoomSettings = {
    scale: 1,
    zoom: true,
    infiniteZoom: true,
    actualSize: true,
    showZoomInOutIcons: false,
    actualSizeIcons: {
        zoomIn: 'lg-zoom-in',
        zoomOut: 'lg-zoom-out',
    },
    enableZoomAfter: 300,
    zoomPluginStrings: {
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        viewActualSize: 'View actual size',
    },
};

const ZOOM_IN_EVENT = 'lg-zoom-in';
const ZOOM_OUT_EVENT = 'lg-zoom-out';
const ACTUAL_SIZE_EVENT = 'lg-actual-size';
const ZOOM_TRANSITION = 'transform 0.3s cubic-bezier(0, 0, 0.25, 1)';

type ZoomResolved = ZoomSettings & Record<string, unknown>;

@Component({
    selector: 'lg-zoom-toolbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().zoom) {
            @if (settings().showZoomInOutIcons) {
                <button
                    type="button"
                    [attr.aria-label]="settings().zoomPluginStrings.zoomIn"
                    [class]="settings().actualSizeIcons.zoomIn + ' lg-icon'"
                    (click)="emit(ZOOM_IN)"
                ></button>
                <button
                    type="button"
                    [attr.aria-label]="settings().zoomPluginStrings.zoomOut"
                    [class]="settings().actualSizeIcons.zoomOut + ' lg-icon'"
                    (click)="emit(ZOOM_OUT)"
                ></button>
            }
            @if (settings().actualSize) {
                <button
                    type="button"
                    [attr.aria-label]="
                        settings().zoomPluginStrings.viewActualSize
                    "
                    class="lg-actual-size lg-icon"
                    (click)="emit(ACTUAL)"
                ></button>
            }
        }
    `,
})
export class LgZoomToolbarComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ZoomResolved,
    );
    protected readonly ZOOM_IN = ZOOM_IN_EVENT;
    protected readonly ZOOM_OUT = ZOOM_OUT_EVENT;
    protected readonly ACTUAL = ACTUAL_SIZE_EVENT;

    protected emit(name: string): void {
        this.ctx.events.emit(name, undefined);
    }
}

@Component({
    selector: 'lg-zoom-wrapper',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        @if (enabled()) {
            <div
                #panEl
                class="lg-zoom-pan"
                [style.position]="'absolute'"
                [style.inset]="'0'"
                [style.transform]="panTransform()"
                [style.transition]="transition"
                (pointerdown)="onPointerDown($event)"
                (dblclick)="onDoubleClick($event)"
            >
                <div
                    #scaleEl
                    class="lg-zoom-scale"
                    [style.position]="'absolute'"
                    [style.inset]="'0'"
                    [style.transform]="scaleTransform()"
                    [style.transform-origin]="'center center'"
                    [style.transition]="transition"
                >
                    <ng-container [ngTemplateOutlet]="content()" />
                </div>
            </div>
        } @else {
            <ng-container [ngTemplateOutlet]="content()" />
        }
    `,
})
export class LgZoomWrapperComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    readonly isCurrent = input(false);
    readonly content = input.required<TemplateRef<unknown>>();

    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ZoomResolved,
    );
    protected readonly enabled = computed(
        () =>
            this.settings().zoom && getSlideType(this.item()) === 'image',
    );

    private readonly panEl = viewChild<ElementRef<HTMLDivElement>>('panEl');
    private readonly scaleEl =
        viewChild<ElementRef<HTMLDivElement>>('scaleEl');

    protected readonly transition = ZOOM_TRANSITION;

    /** Committed zoom slice; live pinch/pan bypasses it (direct writes). */
    private readonly zoom = signal<ZoomSlice>(initialZoomSlice);
    protected readonly panTransform = computed(
        () =>
            `translate3d(${this.zoom().pan.x}px, ${this.zoom().pan.y}px, 0)`,
    );
    protected readonly scaleTransform = computed(
        () => `scale3d(${this.zoom().scale}, ${this.zoom().scale}, 1)`,
    );

    private readonly interactive = signal(false);
    private live: ZoomSlice = initialZoomSlice;
    private readonly pointers = new Map<number, ZoomPan>();
    private pinch: { startDistance: number; startScale: number } | null =
        null;
    private panDrag: {
        pointerId: number;
        startX: number;
        startY: number;
        startPan: ZoomPan;
    } | null = null;
    private detachWindow: (() => void) | null = null;
    private lastTap = 0;
    private armTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        // Zoom interactions arm `enableZoomAfter` ms after the slide loads.
        effect((onCleanup) => {
            const loaded = this.ctx
                .state()
                .loadedSlides.has(this.index());
            const enabled = this.enabled();
            if (!loaded || !enabled) {
                this.interactive.set(false);
                return;
            }
            this.armTimer = setTimeout(
                () => this.interactive.set(true),
                untracked(this.settings).enableZoomAfter,
            );
            onCleanup(() => {
                if (this.armTimer !== null) {
                    clearTimeout(this.armTimer);
                    this.armTimer = null;
                }
            });
        });
        // Toolbar buttons drive the current slide's wrapper via the bus.
        effect((onCleanup) => {
            if (!this.isCurrent() || !this.enabled()) {
                return;
            }
            const offs = [
                this.ctx.events.on(ZOOM_IN_EVENT, () =>
                    this.stepZoom(untracked(this.settings).scale),
                ),
                this.ctx.events.on(ZOOM_OUT_EVENT, () =>
                    this.stepZoom(-untracked(this.settings).scale),
                ),
                this.ctx.events.on(ACTUAL_SIZE_EVENT, () =>
                    this.toggleActualSize({ x: 0, y: 0 }),
                ),
            ];
            onCleanup(() => offs.forEach((off) => off()));
        });
        // Reset when the slide stops being current (2.x parity).
        effect(() => {
            if (!this.isCurrent()) {
                untracked(() => this.reset());
            }
        });
        inject(DestroyRef).onDestroy(() => {
            this.detachWindow?.();
            if (this.live.zoomed) {
                this.ctx.layout.setOuterClass('lg-zoomed', false);
                this.ctx.gestureLock.claim(null);
            }
        });
    }

    private measure(): {
        imageWidth: number;
        imageHeight: number;
        naturalWidth: number;
        containerWidth: number;
        containerHeight: number;
    } {
        const img = this.scaleEl()?.nativeElement.querySelector('img');
        const slide =
            this.panEl()?.nativeElement.closest<HTMLElement>('.lg-item');
        return {
            imageWidth: img?.offsetWidth ?? 0,
            imageHeight: img?.offsetHeight ?? 0,
            naturalWidth: img?.naturalWidth ?? 0,
            containerWidth: slide?.offsetWidth ?? 0,
            containerHeight: slide?.offsetHeight ?? 0,
        };
    }

    private maxScale(): number {
        const { naturalWidth, imageWidth } = this.measure();
        return getActualSizeScale(naturalWidth, imageWidth);
    }

    /** Live transforms during pinch/pan — direct DOM writes, zero CD. */
    private applyLive(slice: ZoomSlice): void {
        this.live = slice;
        const pan = this.panEl()?.nativeElement;
        if (pan) {
            pan.style.transform = `translate3d(${slice.pan.x}px, ${slice.pan.y}px, 0)`;
        }
        const scaleEl = this.scaleEl()?.nativeElement;
        if (scaleEl) {
            scaleEl.style.transform = `scale3d(${slice.scale}, ${slice.scale}, 1)`;
        }
    }

    private commit(scale: number, pan: ZoomPan): void {
        const cfg = untracked(this.settings);
        const max = this.maxScale();
        const clamped = clampScale(scale, max, cfg.infiniteZoom);
        const { imageWidth, imageHeight, containerWidth, containerHeight } =
            this.measure();
        const bounds = getPanBounds(
            imageWidth,
            imageHeight,
            containerWidth,
            containerHeight,
            clamped,
        );
        const next = applyZoom(
            this.live,
            clamped,
            clampPan(pan, bounds),
            max,
            cfg.infiniteZoom,
        );
        // Write the committed transforms inline immediately (no flash while
        // CD is pending); the signal keeps the bindings in agreement so any
        // later binding write lands on the same values.
        this.applyLive(next);
        this.zoom.set(next);
        this.ctx.layout.setOuterClass('lg-zoomed', next.zoomed);
        // Core swipe stands down while zoomed (2.x `touchAction`).
        this.ctx.gestureLock.claim(next.zoomed ? 'zoomSwipe' : null);
    }

    private reset(): void {
        this.pointers.clear();
        this.pinch = null;
        this.panDrag = null;
        this.detachWindow?.();
        this.detachWindow = null;
        this.live = initialZoomSlice;
        this.zoom.set(initialZoomSlice);
        this.ctx.layout.setOuterClass('lg-zoomed', false);
        this.ctx.gestureLock.claim(null);
    }

    private stepZoom(delta: number): void {
        const previous = this.live;
        const target = clampScale(
            previous.scale + delta,
            this.maxScale(),
            untracked(this.settings).infiniteZoom,
        );
        // Zoom about the center: the pan scales with the ratio.
        const pan = getPointZoomPan(
            { x: 0, y: 0 },
            previous.pan,
            previous.scale,
            target,
        );
        this.commit(target, pan);
    }

    private toggleActualSize(point: ZoomPan): void {
        const previous = this.live;
        if (previous.zoomed) {
            this.commit(1, { x: 0, y: 0 });
            return;
        }
        const target = clampScale(this.maxScale(), this.maxScale(), true);
        this.commit(
            target,
            getPointZoomPan(point, previous.pan, previous.scale, target),
        );
    }

    private eventPoint(event: {
        clientX: number;
        clientY: number;
    }): ZoomPan {
        const slide =
            this.panEl()?.nativeElement.closest<HTMLElement>('.lg-item');
        const rect = slide?.getBoundingClientRect();
        if (!rect) {
            return { x: 0, y: 0 };
        }
        return {
            x: event.clientX - (rect.left + rect.width / 2),
            y: event.clientY - (rect.top + rect.height / 2),
        };
    }

    private attachWindowListeners(): void {
        if (this.detachWindow) {
            return;
        }
        const onMove = (event: PointerEvent): void => {
            if (!this.pointers.has(event.pointerId)) {
                return;
            }
            this.pointers.set(event.pointerId, {
                x: event.clientX,
                y: event.clientY,
            });
            const pinch = this.pinch;
            if (pinch && this.pointers.size >= 2) {
                const [a, b] = [...this.pointers.values()];
                const scale = getPinchScale(
                    pinch.startDistance,
                    getPointerDistance(a!, b!),
                    pinch.startScale,
                    this.maxScale(),
                    untracked(this.settings).infiniteZoom,
                );
                this.applyLive({ ...this.live, scale, zoomed: scale > 1 });
                return;
            }
            const drag = this.panDrag;
            if (drag && event.pointerId === drag.pointerId) {
                const {
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                } = this.measure();
                const bounds = getPanBounds(
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    this.live.scale,
                );
                const pan = clampPan(
                    {
                        x: drag.startPan.x + (event.clientX - drag.startX),
                        y: drag.startPan.y + (event.clientY - drag.startY),
                    },
                    bounds,
                );
                this.applyLive({ ...this.live, pan });
            }
        };
        const onUp = (event: PointerEvent): void => {
            if (!this.pointers.has(event.pointerId)) {
                return;
            }
            this.pointers.delete(event.pointerId);
            if (this.pinch && this.pointers.size < 2) {
                this.pinch = null;
                // Snap the pinch result into the committed range.
                this.commit(this.live.scale, this.live.pan);
            }
            const drag = this.panDrag;
            if (drag && event.pointerId === drag.pointerId) {
                this.panDrag = null;
                this.commit(this.live.scale, this.live.pan);
            }
            if (this.pointers.size === 0) {
                this.detachWindow?.();
                this.detachWindow = null;
            }
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        this.detachWindow = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
    }

    protected onPointerDown(event: PointerEvent): void {
        if (!this.enabled() || !this.interactive() || !this.isCurrent()) {
            return;
        }
        this.pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });

        if (this.pointers.size === 2 && event.pointerType === 'touch') {
            const [a, b] = [...this.pointers.values()];
            this.pinch = {
                startDistance: getPointerDistance(a!, b!),
                startScale: this.live.scale,
            };
            this.panDrag = null;
            this.ctx.gestureLock.claim('pinch');
            this.attachWindowListeners();
            return;
        }

        // Double-tap detection for touch (mouse uses dblclick).
        if (event.pointerType === 'touch' && this.pointers.size === 1) {
            const now = Date.now();
            if (now - this.lastTap < 300) {
                this.lastTap = 0;
                this.toggleActualSize(this.eventPoint(event));
                return;
            }
            this.lastTap = now;
        }

        if (this.live.zoomed && this.pointers.size === 1) {
            event.stopPropagation();
            this.panDrag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                startPan: this.live.pan,
            };
            this.attachWindowListeners();
        }
    }

    protected onDoubleClick(event: MouseEvent): void {
        if (!this.enabled() || !this.interactive() || !this.isCurrent()) {
            return;
        }
        this.toggleActualSize(this.eventPoint(event));
    }
}

/** `lg-use-transition-for-zoom` while registered (React `usePlugin` twin). */
@Injectable()
export class LgZoomInitService {
    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        effect((onCleanup) => {
            const enabled = !!(ctx.settings() as { zoom?: boolean }).zoom;
            ctx.layout.setOuterClass('lg-use-transition-for-zoom', enabled);
            onCleanup(() =>
                ctx.layout.setOuterClass(
                    'lg-use-transition-for-zoom',
                    false,
                ),
            );
        });
    }
}

export function withZoom(
    options: Partial<ZoomSettings> = {},
): LgFeature<ZoomSettings> {
    return {
        name: 'zoom',
        defaults: zoomSettings,
        options,
        slots: {
            toolbar: LgZoomToolbarComponent,
            slideWrapper: LgZoomWrapperComponent,
        },
        providers: [
            LgZoomInitService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgZoomInitService,
                multi: true,
            },
        ],
    };
}
