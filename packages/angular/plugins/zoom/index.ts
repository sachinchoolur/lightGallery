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
    clampPanToStage,
    clampScale,
    getActualSizeScale,
    getActualSizeWidth,
    getRotatedVisualSize,
    getPanBounds,
    SPRING_BOUNCE_DAMPING,
    getPinchPan,
    getPinchScale,
    getPointerDistance,
    getPointZoomPan,
    project,
    getWindowedVelocity,
    pushVelocitySample,
    getSlideType,
    initialZoomSlice,
    shouldCloseOnPinch,
    type CoreSettings,
    type VelocitySample,
    type ZoomPan,
    type ZoomSlice,
    zoomDefaultIcons,
} from '@lightgallery/headless';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
    runSprings,
    type SpringTrack,
    LgCiComponent,
    resolveIconSlot,
} from '@lightgallery/angular';

/**
 * Zoom feature (2.x `lg-zoom`): toolbar buttons, double-click/tap point
 * zoom, pinch, pan-when-zoomed — the gesture-consumer template wave 2
 * copies. Same performance contract as the core gestures:
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
    /**
     * @deprecated Set these labels on the core `strings` object instead —
     * an explicitly set key here still wins (alias).
     */
    zoomPluginStrings?: Partial<ZoomStrings>;
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
};

const ZOOM_IN_EVENT = 'lg-zoom-in';
const ZOOM_OUT_EVENT = 'lg-zoom-out';
const ACTUAL_SIZE_EVENT = 'lg-actual-size';
const ZOOM_TRANSITION = 'transform 0.3s cubic-bezier(0, 0, 0.25, 1)';
/** 2.x post-gesture settle ease (`lg-zoom-drag-transition`). */
const SETTLE_TRANSITION = 'transform 0.8s cubic-bezier(0, 0, 0.25, 1)';

function isImageTarget(target: unknown): boolean {
    return (
        target instanceof HTMLElement && target.classList.contains('lg-image')
    );
}

type ZoomResolved = ZoomSettings &
    Pick<CoreSettings, 'pinchToClose' | 'closable'> &
    Record<string, unknown>;

@Component({
    selector: 'lg-zoom-toolbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LgCiComponent],
    template: `
        @if (settings().zoom) { @if (settings().showGestureButtons !== false &&
        settings().showZoomInOutIcons) {
        <button
            type="button"
            [attr.aria-label]="
                settings().zoomPluginStrings?.zoomIn ?? coreStrings().zoomIn
            "
            [class]="
                settings().actualSizeIcons.zoomIn + ' lg-icon lg-icon-custom'
            "
            (click)="emit(ZOOM_IN)"
        >
            <lg-ci
                [slot]="ciZoomIn()"
                [names]="['zoomIn']"
                [icons]="defaultIcons"
            />
        </button>
        <button
            type="button"
            [attr.aria-label]="
                settings().zoomPluginStrings?.zoomOut ?? coreStrings().zoomOut
            "
            [class]="
                settings().actualSizeIcons.zoomOut + ' lg-icon lg-icon-custom'
            "
            (click)="emit(ZOOM_OUT)"
        >
            <lg-ci
                [slot]="ciZoomOut()"
                [names]="['zoomOut']"
                [icons]="defaultIcons"
            />
        </button>
        } @if (settings().showGestureButtons !== false && settings().actualSize)
        {
        <button
            type="button"
            [attr.aria-label]="
                settings().zoomPluginStrings?.viewActualSize ??
                coreStrings().viewActualSize
            "
            class="lg-actual-size lg-icon lg-icon-custom"
            (click)="emit(ACTUAL)"
        >
            <lg-ci
                [slot]="ciActual()"
                [names]="['actualSize']"
                [icons]="defaultIcons"
            />
        </button>
        } }
    `,
})
export class LgZoomToolbarComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly defaultIcons = zoomDefaultIcons;
    protected readonly ciZoomIn = computed(() =>
        resolveIconSlot(this.ctx.icons?.(), ['zoomIn']),
    );
    protected readonly ciZoomOut = computed(() =>
        resolveIconSlot(this.ctx.icons?.(), ['zoomOut']),
    );
    protected readonly ciActual = computed(() =>
        resolveIconSlot(this.ctx.icons?.(), ['actualSize']),
    );
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ZoomResolved,
    );
    protected readonly coreStrings = computed(
        () => this.ctx.settings().strings,
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
            [style.transition]="transition()"
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
                [style.transition]="transition()"
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
        () => this.settings().zoom && getSlideType(this.item()) === 'image',
    );

    private readonly panEl = viewChild<ElementRef<HTMLDivElement>>('panEl');
    private readonly scaleEl = viewChild<ElementRef<HTMLDivElement>>('scaleEl');

    private readonly transitionMode = signal<'default' | 'settle'>('default');
    protected readonly transition = computed(() =>
        this.transitionMode() === 'settle'
            ? SETTLE_TRANSITION
            : ZOOM_TRANSITION,
    );

    /** Committed zoom slice; live pinch/pan bypasses it (direct writes). */
    private readonly zoom = signal<ZoomSlice>(initialZoomSlice);
    protected readonly panTransform = computed(
        () => `translate3d(${this.zoom().pan.x}px, ${this.zoom().pan.y}px, 0)`,
    );
    protected readonly scaleTransform = computed(
        () => `scale3d(${this.zoom().scale}, ${this.zoom().scale}, 1)`,
    );

    private readonly interactive = signal(false);
    private live: ZoomSlice = initialZoomSlice;
    private readonly pointers = new Map<number, ZoomPan>();
    private pinch: {
        /** The two pointer ids the pinch is made of — extra resting
         * fingers must never silently re-pair the gesture. */
        ids: [number, number];
        startDistance: number;
        startScale: number;
        startPan: ZoomPan;
        startMid: ZoomPan;
        /** Largest scale the gesture reached — pinch-to-close guard. */
        maxGestureScale: number;
        /** Midpoint's live position — its travel pans the image 1:1. */
        lastMid: ZoomPan;
        /** Midpoint velocity samples — seed the release springs. */
        midSamples: VelocitySample[];
    } | null = null;
    private panDrag: {
        pointerId: number;
        startX: number;
        startY: number;
        samples: VelocitySample[];
        startPan: ZoomPan;
    } | null = null;
    private detachWindow: (() => void) | null = null;
    private cancelSpring: (() => void) | null = null;
    private lastTap = 0;
    private lastTouchToggle = 0;
    private armTimer: ReturnType<typeof setTimeout> | null = null;

    /** Narrow: re-run the arm effect only when THIS slide's flag flips. */
    private readonly loaded = computed(() =>
        this.ctx.state().loadedSlides.has(this.index()),
    );

    constructor() {
        // Zoom interactions arm `enableZoomAfter` ms after the slide loads.
        effect((onCleanup) => {
            const loaded = this.loaded();
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
        // v2 parity: a release spring finishing at the OLD geometry's
        // clamp target rests out of bounds after a resize/orientation
        // change — stop it and re-clamp into the fresh bounds.
        const onWindowResize = (): void => {
            const hadSpring = this.cancelSpring !== null;
            if (!this.isCurrent() || (!hadSpring && !this.live.zoomed)) {
                return;
            }
            this.stopSpring();
            const cfg = this.ctx.settings() as unknown as {
                infiniteZoom: boolean;
            };
            const target = clampScale(
                this.live.scale,
                this.maxScale(),
                cfg.infiniteZoom,
            );
            const {
                imageWidth,
                imageHeight,
                containerWidth,
                containerHeight,
                stageBottomExtra,
            } = this.measure();
            const pan = clampPanToStage(
                this.live.pan,
                getPanBounds(
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    target,
                ),
                stageBottomExtra,
            );
            this.commit(target, pan);
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', onWindowResize);
        }
        inject(DestroyRef).onDestroy(() => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', onWindowResize);
            }
            this.stopSpring();
            this.detachWindow?.();
            // The lock is claimed at pinch FORMATION — before `zoomed`
            // is true. Destroying mid-gesture (close with fingers down)
            // must release it, or core swipe stays stood down after
            // reopen. Guarded to this wrapper's own gesture so an
            // off-window slide unmounting cannot free another slide's
            // live claim.
            if (this.live.zoomed || this.pinch || this.panDrag) {
                this.ctx.layout.setOuterClass('lg-zoomed', false);
                this.ctx.gestureLock.claim(null);
            }
        });
    }

    private measure(): {
        imageWidth: number;
        imageHeight: number;
        layoutImageWidth: number;
        naturalWidth: number;
        containerWidth: number;
        containerHeight: number;
        stageBottomExtra: number;
    } {
        const img = this.scaleEl()?.nativeElement.querySelector('img');
        const slide =
            this.panEl()?.nativeElement.closest<HTMLElement>('.lg-item');
        // The components strip (thumbnails+caption) below the content
        // box vacates when zoomed — the stage-aware clamps let the
        // image ride up until its bottom edge meets the SCREEN bottom.
        const stage =
            this.panEl()?.nativeElement.closest<HTMLElement>('.lg-inner');
        const outer = stage?.closest<HTMLElement>('.lg-outer');
        const stageBottomExtra =
            outer && stage
                ? Math.max(
                      0,
                      outer.getBoundingClientRect().bottom -
                          stage.getBoundingClientRect().bottom,
                  )
                : 0;
        // Bounds math runs on the image's VISUAL box: the rotate
        // plugin's wrapper transform swaps the axes at 90°/270° (and
        // shrinks by its fit scale), which layout offsets don't see.
        const rotateWrap = img?.closest<HTMLElement>('.lg-img-rotate');
        const visual = getRotatedVisualSize(
            img?.offsetWidth ?? 0,
            img?.offsetHeight ?? 0,
            rotateWrap?.style.transform,
        );
        return {
            imageWidth: visual.width,
            imageHeight: visual.height,
            // Unrotated layout width — actual-size scale relates
            // natural pixels to the image's own axis.
            layoutImageWidth: img?.offsetWidth ?? 0,
            naturalWidth: img?.naturalWidth ?? 0,
            containerWidth: slide?.offsetWidth ?? 0,
            containerHeight: slide?.offsetHeight ?? 0,
            stageBottomExtra,
        };
    }

    private maxScale(): number {
        const { naturalWidth, layoutImageWidth } = this.measure();
        // `naturalWidth` lies under srcset/sizes (density-corrected to
        // roughly the slot width — actual-size zoom collapses to ~1 on
        // phones); the ladder's largest candidate is the true reference.
        return getActualSizeScale(
            getActualSizeWidth(
                this.item(),
                {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    dpr: window.devicePixelRatio,
                },
                naturalWidth,
            ),
            layoutImageWidth,
        );
    }

    private setLiveTransition(value: string): void {
        const pan = this.panEl()?.nativeElement;
        if (pan) {
            pan.style.transition = value;
        }
        const scaleEl = this.scaleEl()?.nativeElement;
        if (scaleEl) {
            scaleEl.style.transition = value;
        }
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

    private stopSpring(): void {
        this.cancelSpring?.();
        this.cancelSpring = null;
    }

    // Release settle: the spring drives every frame (transitions stand
    // down); the commit at completion is visually a no-op that restores
    // the button-zoom transition and the committed state.
    private startSpring(
        tracks: SpringTrack[],
        onFrame: (values: number[]) => void,
        onDone: () => void,
    ): void {
        this.stopSpring();
        this.setLiveTransition('none');
        this.cancelSpring = runSprings(tracks, onFrame, () => {
            this.cancelSpring = null;
            onDone();
        });
    }

    private commit(
        scale: number,
        pan: ZoomPan,
        mode: 'default' | 'settle' = 'default',
    ): void {
        this.transitionMode.set(mode);
        this.setLiveTransition(
            mode === 'settle' ? SETTLE_TRANSITION : ZOOM_TRANSITION,
        );
        const cfg = untracked(this.settings);
        const max = this.maxScale();
        const clamped = clampScale(scale, max, cfg.infiniteZoom);
        const {
            imageWidth,
            imageHeight,
            containerWidth,
            containerHeight,
            stageBottomExtra,
        } = this.measure();
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
            clampPanToStage(pan, bounds, stageBottomExtra),
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
        this.stopSpring();
        this.transitionMode.set('default');
        this.setLiveTransition(ZOOM_TRANSITION);
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
        // The double-tap zoom takes over from any settling spring.
        this.stopSpring();
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

    private eventPoint(event: { clientX: number; clientY: number }): ZoomPan {
        // Anchor to the gesture-STABLE inner box, not the slide: the
        // slide's rect equals it at rest, but the slide itself
        // transforms during core drags/nav springs — measuring against
        // it would leak the drag displacement 1:1 into the fused pinch
        // pan when a pinch starts mid-drag.
        const stage =
            this.panEl()?.nativeElement.closest<HTMLElement>('.lg-inner');
        const rect = stage?.getBoundingClientRect();
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
                // Only the tracked pair drives the pinch; a member that
                // just lifted is handled by onUp's re-baseline.
                const a = this.pointers.get(pinch.ids[0]);
                const b = this.pointers.get(pinch.ids[1]);
                if (!a || !b) {
                    return;
                }
                const cfg = untracked(this.settings);
                // With pinch-to-close armed (setting on, closable, gesture
                // never over fit) the under-fit squeeze is free — the
                // shrink is the close affordance; otherwise it resists
                // with friction.
                const closeArmed =
                    cfg.pinchToClose &&
                    cfg.closable &&
                    pinch.maxGestureScale <= 1;
                const scale = getPinchScale(
                    pinch.startDistance,
                    getPointerDistance(a!, b!),
                    pinch.startScale,
                    this.maxScale(),
                    cfg.infiniteZoom,
                    closeArmed,
                );
                pinch.maxGestureScale = Math.max(pinch.maxGestureScale, scale);
                // Anchor the zoom to the pinch's focal point and follow
                // the fingers: the midpoint's travel pans the image 1:1
                // (fused zoom-and-pan).
                const currentMid = this.eventPoint({
                    clientX: (a!.x + b!.x) / 2,
                    clientY: (a!.y + b!.y) / 2,
                });
                pinch.lastMid = currentMid;
                pinch.midSamples = pushVelocitySample(pinch.midSamples, {
                    x: currentMid.x,
                    y: currentMid.y,
                    t: Date.now(),
                });
                const pan = getPinchPan(
                    currentMid,
                    pinch.startMid,
                    pinch.startPan,
                    pinch.startScale,
                    scale,
                );
                this.applyLive({
                    ...this.live,
                    scale,
                    pan,
                    zoomed: scale > 1,
                });
                return;
            }
            const drag = this.panDrag;
            if (drag && event.pointerId === drag.pointerId) {
                drag.samples = pushVelocitySample(drag.samples, {
                    x: event.clientX,
                    y: event.clientY,
                    t: Date.now(),
                });
                const {
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    stageBottomExtra,
                } = this.measure();
                const bounds = getPanBounds(
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    this.live.scale,
                );
                const pan = clampPanToStage(
                    {
                        x: drag.startPan.x + (event.clientX - drag.startX),
                        y: drag.startPan.y + (event.clientY - drag.startY),
                    },
                    bounds,
                    stageBottomExtra,
                );
                this.applyLive({ ...this.live, pan });
            }
        };
        const onUp = (event: PointerEvent): void => {
            if (!this.pointers.has(event.pointerId)) {
                return;
            }
            this.pointers.delete(event.pointerId);
            const endedPinch = this.pinch;
            if (
                endedPinch &&
                endedPinch.ids.includes(event.pointerId) &&
                this.pointers.size >= 2
            ) {
                // A pair finger lifted while another finger rests:
                // re-baseline onto the surviving pair — silently
                // re-pairing to map order would leap the midpoint 1:1
                // and poison the release velocity.
                const survivor =
                    endedPinch.ids[0] === event.pointerId
                        ? endedPinch.ids[1]
                        : endedPinch.ids[0];
                const otherId = [...this.pointers.keys()].find(
                    (id) => id !== survivor,
                )!;
                const a = this.pointers.get(survivor)!;
                const b = this.pointers.get(otherId)!;
                const mid = this.eventPoint({
                    clientX: (a.x + b.x) / 2,
                    clientY: (a.y + b.y) / 2,
                });
                endedPinch.ids = [survivor, otherId];
                endedPinch.startDistance = getPointerDistance(a, b);
                endedPinch.startScale = this.live.scale;
                endedPinch.startPan = this.live.pan;
                endedPinch.startMid = mid;
                endedPinch.lastMid = mid;
                endedPinch.midSamples = [{ x: mid.x, y: mid.y, t: Date.now() }];
                return;
            }
            if (endedPinch && !endedPinch.ids.includes(event.pointerId)) {
                // A resting extra finger lifted — the pinch continues.
                return;
            }
            if (endedPinch && this.pointers.size < 2) {
                this.pinch = null;
                const cfg = untracked(this.settings);
                if (
                    shouldCloseOnPinch({
                        scale: this.live.scale,
                        maxGestureScale: endedPinch.maxGestureScale,
                        pinchToClose: cfg.pinchToClose,
                        closable: cfg.closable,
                    })
                ) {
                    // Hand off from fit: the zoom slice resets so a
                    // reopen starts clean; the close animation owns the
                    // rest.
                    this.commit(1, { x: 0, y: 0 });
                    this.ctx.actions.closeGallery();
                    return;
                }
                // Pinch release snaps into [1, actual size] regardless of
                // infiniteZoom (2.x pinch touchend rule — the setting
                // governs button zoom only). The pan is recomputed through
                // the same focal anchor — carried to the midpoint's last
                // position and projected along its momentum — clamped
                // into the landed scale's bounds. Velocity-seeded springs
                // animate the snap (bounce only where the clamp cut the
                // glide).
                const target = clampScale(
                    this.live.scale,
                    this.maxScale(),
                    false,
                );
                const {
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    stageBottomExtra,
                } = this.measure();
                const midVelocity = getWindowedVelocity(
                    endedPinch.midSamples,
                    Date.now(),
                );
                const basePan = getPinchPan(
                    endedPinch.lastMid,
                    endedPinch.startMid,
                    endedPinch.startPan,
                    endedPinch.startScale,
                    target,
                );
                const glide = {
                    x: basePan.x + project(midVelocity.x),
                    y: basePan.y + project(midVelocity.y),
                };
                const pan = clampPanToStage(
                    glide,
                    getPanBounds(
                        imageWidth,
                        imageHeight,
                        containerWidth,
                        containerHeight,
                        target,
                    ),
                    stageBottomExtra,
                );
                this.startSpring(
                    [
                        { from: this.live.scale, velocity: 0, target },
                        {
                            from: this.live.pan.x,
                            velocity: midVelocity.x,
                            target: pan.x,
                            dampingRatio:
                                pan.x !== glide.x ? SPRING_BOUNCE_DAMPING : 1,
                        },
                        {
                            from: this.live.pan.y,
                            velocity: midVelocity.y,
                            target: pan.y,
                            dampingRatio:
                                pan.y !== glide.y ? SPRING_BOUNCE_DAMPING : 1,
                        },
                    ],
                    ([scale, x, y]) =>
                        this.applyLive({
                            ...this.live,
                            scale: scale!,
                            pan: { x: x!, y: y! },
                            zoomed: scale! > 1,
                        }),
                    () => this.commit(target, pan),
                );
            }
            const drag = this.panDrag;
            if (drag && event.pointerId === drag.pointerId) {
                this.panDrag = null;
                if (event.type !== 'pointerup') {
                    // A canceled pointer settles where it is.
                    this.commit(this.live.scale, this.live.pan);
                } else {
                    // Project the release momentum, clamp into the pan
                    // bounds, then spring there seeded with the live
                    // velocity — bouncing only against a clamped bound.
                    // The scale settles too (2.x settleIntoBounds): a
                    // plain tap lands here after killing a release
                    // spring mid-glide, and the stranded scale — above
                    // the cap unless infiniteZoom lifts it — would
                    // otherwise survive the commit.
                    const velocity = getWindowedVelocity(
                        drag.samples,
                        Date.now(),
                    );
                    const current = this.live.pan;
                    const targetScale = clampScale(
                        this.live.scale,
                        this.maxScale(),
                        untracked(this.settings).infiniteZoom,
                    );
                    const {
                        imageWidth,
                        imageHeight,
                        containerWidth,
                        containerHeight,
                        stageBottomExtra,
                    } = this.measure();
                    const projected = {
                        x: current.x + project(velocity.x),
                        y: current.y + project(velocity.y),
                    };
                    const target = clampPanToStage(
                        projected,
                        getPanBounds(
                            imageWidth,
                            imageHeight,
                            containerWidth,
                            containerHeight,
                            targetScale,
                        ),
                        stageBottomExtra,
                    );
                    this.startSpring(
                        [
                            {
                                from: this.live.scale,
                                velocity: 0,
                                target: targetScale,
                            },
                            {
                                from: current.x,
                                velocity: velocity.x,
                                target: target.x,
                                dampingRatio:
                                    target.x !== projected.x
                                        ? SPRING_BOUNCE_DAMPING
                                        : 1,
                            },
                            {
                                from: current.y,
                                velocity: velocity.y,
                                target: target.y,
                                dampingRatio:
                                    target.y !== projected.y
                                        ? SPRING_BOUNCE_DAMPING
                                        : 1,
                            },
                        ],
                        ([scale, x, y]) =>
                            this.applyLive({
                                ...this.live,
                                scale: scale!,
                                pan: { x: x!, y: y! },
                                zoomed: scale! > 1,
                            }),
                        () => this.commit(targetScale, target),
                    );
                }
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
        // Grab-in-flight: only a gesture that can take over (a pan on
        // a zoomed image; a forming pinch, below) stops a running
        // settle. A tap on an un-zoomed image must not kill the
        // under-fit reset spring — nothing would restore it.
        if (this.live.zoomed) {
            this.stopSpring();
        }
        this.pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });
        // Every insert gets its removal path: onUp/onCancel must be live
        // for this pointer or the ledger leaks a phantom that corrupts
        // the next gesture.
        this.attachWindowListeners();

        if (this.pointers.size === 2 && event.pointerType === 'touch') {
            // The forming pinch takes over whatever was settling.
            this.stopSpring();
            const ids = [...this.pointers.keys()] as [number, number];
            const [a, b] = [...this.pointers.values()];
            const startMid = this.eventPoint({
                clientX: (a!.x + b!.x) / 2,
                clientY: (a!.y + b!.y) / 2,
            });
            this.pinch = {
                ids,
                startDistance: getPointerDistance(a!, b!),
                startScale: this.live.scale,
                startPan: this.live.pan,
                startMid,
                maxGestureScale: this.live.scale,
                lastMid: startMid,
                midSamples: [{ x: startMid.x, y: startMid.y, t: Date.now() }],
            };
            this.panDrag = null;
            this.ctx.gestureLock.claim('pinch');
            this.setLiveTransition('none');
            return;
        }

        // Double-tap detection for touch (mouse uses dblclick), gated to
        // the image itself (2.x `hasClass('lg-image')`).
        if (
            event.pointerType === 'touch' &&
            this.pointers.size === 1 &&
            isImageTarget(event.target)
        ) {
            const now = Date.now();
            if (now - this.lastTap < 300) {
                this.lastTap = 0;
                // 2.x prevents the second touchstart's default: without
                // this the browser synthesizes click + dblclick after
                // the double tap, and onDoubleClick toggles straight
                // back to fit.
                event.preventDefault();
                this.lastTouchToggle = now;
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
                samples: [
                    { x: event.clientX, y: event.clientY, t: Date.now() },
                ],
                startPan: this.live.pan,
            };
            this.setLiveTransition('none');
        }
    }

    protected onDoubleClick(event: MouseEvent): void {
        if (!this.enabled() || !this.interactive() || !this.isCurrent()) {
            return;
        }
        if (!isImageTarget(event.target)) {
            return;
        }
        // Synthesized dblclick trailing a touch double-tap (belt for
        // browsers that fire it despite the canceled pointerdown).
        if (Date.now() - this.lastTouchToggle < 700) {
            return;
        }
        this.toggleActualSize(this.eventPoint(event));
    }
}

/**
 * `lg-use-transition-for-zoom` while registered (React `usePlugin`
 * twin). Decorative in v3 (transitions are inline on the zoom wrappers;
 * 2.x CSS targeted .lg-img-wrap/.lg-image) — kept as a public CSS hook
 * so consumer stylesheets can target zoom-enabled galleries.
 */
@Injectable()
export class LgZoomInitService {
    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        effect((onCleanup) => {
            const enabled = !!(ctx.settings() as { zoom?: boolean }).zoom;
            ctx.layout.setOuterClass('lg-use-transition-for-zoom', enabled);
            onCleanup(() =>
                ctx.layout.setOuterClass('lg-use-transition-for-zoom', false),
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
