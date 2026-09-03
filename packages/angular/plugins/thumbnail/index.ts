import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    Injectable,
    signal,
    viewChild,
} from '@angular/core';
import {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getElasticThumbTranslate,
    getScrubThumbIndex,
    getThumbCorridorWindow,
    getThumbTotalWidth,
    getThumbWindow,
    getVideoInfo,
    getWindowedVelocity,
    project,
    pushVelocitySample,
    type ThumbPagerPosition,
    type VelocitySample,
    thumbnailDefaultIcons,
} from '@lightgallery/headless';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
    runSprings,
    LgCiComponent,
    resolveIconSlot,
} from '@lightgallery/angular';

/**
 * Thumbnail feature (2.x `lg-thumbnail`): footer strip + toggle button —
 * the slot+state template the other plugins copy. Logic
 * is a port of the React thumbnail plugin over the same headless math.
 */

export interface ThumbnailStrings {
    toggleThumbnails: string;
}

export interface ThumbnailSettings {
    /** Enable the thumbnail strip. */
    thumbnail: boolean;
    /** Animate the strip to keep the active thumb at the pager position. */
    animateThumb: boolean;
    /** Where the active thumbnail sits in the strip. */
    currentPagerPosition: ThumbPagerPosition;
    /** Strip alignment when the thumbs are narrower than the gallery. */
    alignThumbnails: 'left' | 'middle' | 'right';
    /** Width of each thumbnail (px). */
    thumbWidth: number;
    /** Height of each thumbnail (CSS length). */
    thumbHeight: string;
    /** Spacing between thumbnails (px). */
    thumbMargin: number;
    /** Show the toggle button (needs `allowMediaOverlap`, 2.x rule). */
    toggleThumb: boolean;
    /** Enable strip dragging (mouse and touch, via pointer events). */
    enableThumbDrag: boolean;
    /** Below this drag distance (px) a release still counts as a click. */
    thumbnailSwipeThreshold: number;
    /**
     * Scrub the gallery with the thumbnail strip: while the strip is
     * dragged (or gliding after a fling), the slide under the strip's
     * travel position becomes current immediately, without slide
     * transitions. The full strip travel spans the whole gallery, so
     * the first and last slides are always reachable. Requires
     * `animateThumb`; taps still navigate normally.
     */
    scrubThumbnails: boolean;
    /** Load YouTube thumbs from img.youtube.com. */
    loadYouTubeThumbnail: boolean;
    /** YouTube thumb size suffix (`<n>.jpg`). */
    youTubeThumbSize: number;
    /**
     * @deprecated Set these labels on the core `strings` object instead —
     * an explicitly set key here still wins (alias).
     */
    thumbnailPluginStrings?: Partial<ThumbnailStrings>;
}

export const thumbnailSettings: ThumbnailSettings = {
    thumbnail: true,
    animateThumb: true,
    currentPagerPosition: 'middle',
    alignThumbnails: 'middle',
    thumbWidth: 100,
    thumbHeight: '80px',
    thumbMargin: 5,
    toggleThumb: false,
    enableThumbDrag: true,
    thumbnailSwipeThreshold: 10,
    scrubThumbnails: false,
    loadYouTubeThumbnail: true,
    youTubeThumbSize: 1,
};

type ThumbnailResolved = ThumbnailSettings & {
    speed: number;
    allowMediaOverlap: boolean;
    virtualization?: { slides?: number; thumbs?: 'auto' | number };
};

@Component({
    selector: 'lg-thumbnail-strip',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().thumbnail) {
        <div
            #stripOuter
            class="lg-thumb-outer"
            [class]="outerClasses()"
            [style.touch-action]="animate() ? 'none' : null"
        >
            <!-- Static mode (2.x parity): no width/transform — the items
                 wrap into rows and every thumbnail stays visible. -->
            <div
                #track
                class="lg-thumb lg-group"
                [style.width.px]="animate() ? totalWidth() : null"
                [style.position]="animate() ? 'relative' : null"
                [style.transition-duration]="
                    animate()
                        ? dragging()
                            ? '0ms'
                            : settings().speed + 'ms'
                        : null
                "
                [style.transform]="animate() ? trackTransform() : null"
                (pointerdown)="onPointerDown($event)"
            >
                @if (thumbWindow(); as window) { @if (window.leadingPad > 0) {
                <div
                    class="lg-thumb-spacer"
                    aria-hidden="true"
                    [style.width.px]="window.leadingPad"
                    [style.height.px]="1"
                    [style.float]="isRtl() ? 'right' : 'left'"
                ></div>
                } } @for (entry of renderedThumbs(); track entry.index) {
                <div
                    class="lg-thumb-item"
                    [class.active]="entry.index === currentIndex()"
                    [style.width.px]="settings().thumbWidth"
                    [style.height]="settings().thumbHeight"
                    [style.margin-right.px]="
                        isRtl() ? null : settings().thumbMargin
                    "
                    [style.margin-left.px]="
                        isRtl() ? settings().thumbMargin : null
                    "
                    role="button"
                    tabindex="0"
                    [attr.data-lg-item-id]="entry.index"
                    [attr.aria-label]="
                        entry.item.alt ?? 'Go to slide ' + (entry.index + 1)
                    "
                    [attr.aria-current]="entry.index === currentIndex()"
                    (click)="onThumbClick(entry.index)"
                    (keydown)="onThumbKeydown($event, entry.index)"
                >
                    <img
                        [src]="thumbSrc(entry.item)"
                        [alt]="entry.item.alt ?? ''"
                        draggable="false"
                    />
                </div>
                } @if (thumbWindow(); as window) { @if (window.trailingPad > 0)
                {
                <div
                    class="lg-thumb-spacer"
                    aria-hidden="true"
                    [style.width.px]="window.trailingPad"
                    [style.height.px]="1"
                    [style.float]="isRtl() ? 'right' : 'left'"
                ></div>
                } }
            </div>
        </div>
        }
    `,
})
export class LgThumbnailStripComponent {
    protected readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ThumbnailResolved,
    );
    protected readonly currentIndex = computed(
        () => this.ctx.state().currentIndex,
    );

    private readonly stripOuter =
        viewChild<ElementRef<HTMLDivElement>>('stripOuter');
    private readonly track = viewChild<ElementRef<HTMLDivElement>>('track');

    private readonly stripWidth = signal(0);
    protected stripWidthValue(): number {
        return this.stripWidth();
    }
    protected readonly translate = signal(0);
    protected readonly dragging = signal(false);
    // Fling corridor (plan 010): set at release so the window covers the
    // whole flight path; cleared at settle.
    private readonly corridor = signal<{ from: number; to: number } | null>(
        null,
    );

    protected readonly totalWidth = computed(() =>
        getThumbTotalWidth(
            this.ctx.items().length,
            this.settings().thumbWidth,
            this.settings().thumbMargin,
        ),
    );
    // Plan-010 thumbnail windowing: with virtualization.thumbs set, only
    // the visible thumbs plus overscan render; spacers preserve the strip
    // geometry. Keys off the COMMITTED translate — advances at release/
    // slide-change/resize, never per pointermove.
    protected readonly animate = computed(
        () => this.settings().animateThumb,
    );

    protected readonly thumbWindow = computed(() => {
        const overscan = this.settings().virtualization?.thumbs;
        // Windowing is translate-space math — meaningless for the
        // wrapping static strip.
        if (overscan === undefined || !this.animate()) {
            return null;
        }
        const geometry = {
            stripWidth: this.stripWidthValue(),
            thumbWidth: this.settings().thumbWidth,
            thumbMargin: this.settings().thumbMargin,
            count: this.ctx.items().length,
            overscan,
        };
        const corridor = this.corridor();
        return corridor
            ? getThumbCorridorWindow({ ...geometry, ...corridor })
            : getThumbWindow({ ...geometry, translate: this.translate() });
    });
    protected readonly renderedThumbs = computed(() => {
        const entries = this.ctx
            .items()
            .map((item, index) => ({ item, index }));
        const window = this.thumbWindow();
        return window ? entries.slice(window.start, window.end + 1) : entries;
    });

    protected readonly outerClasses = computed(() => {
        const settings = this.settings();
        return [
            `lg-thumb-align-${settings.alignThumbnails}`,
            settings.enableThumbDrag ? 'lg-grab' : '',
            this.dragging() ? 'lg-dragging lg-grabbing' : '',
        ]
            .filter(Boolean)
            .join(' ');
    });

    private clickable = true;
    private drag: {
        pointerId: number;
        startX: number;
        startTranslate: number;
        moved: boolean;
    } | null = null;
    private samples: VelocitySample[] = [];
    private cancelSpring: (() => void) | null = null;
    private liveTranslate = 0;
    // Scrub session (scrubThumbnails): while the strip moves it drives
    // the gallery — each step navigates on the instant no-animation
    // timeline path (navigate + TRANSITION_END settle before the
    // timeline effect runs), and the pager-follow effect stands down.
    private scrubSession = false;
    private scrubIndex = -1;
    private detachWindow: (() => void) | null = null;
    private readonly resizeListener = (): void => this.measure();

    private measureTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        // 2.x measures the outer element on open and on resize.
        afterNextRender(() => {
            this.measure();
            window.addEventListener('resize', this.resizeListener);
        });
        // The strip mounts one commit before `lg-show` lands (persistent
        // container), so the mount measurement can read a hidden 0-width
        // outer — the stale width mis-clamps the pager translate and,
        // when windowed, shrinks the thumb window. Re-measure shortly
        // after the gallery opens, once the container is visible.
        effect(() => {
            const open = this.ctx.state().open;
            if (!open) {
                return;
            }
            if (this.measureTimer) {
                clearTimeout(this.measureTimer);
            }
            this.measureTimer = setTimeout(() => this.measure(), 50);
        });
        inject(DestroyRef).onDestroy(() => {
            window.removeEventListener('resize', this.resizeListener);
            if (this.measureTimer) {
                clearTimeout(this.measureTimer);
            }
            this.detachWindow?.();
            this.cancelSpring?.();
            // A strip destroyed mid-scrub must not strand the outer
            // class (the root outlives the strip).
            this.endScrub();
        });
        // Keep the active thumbnail at the pager position (React
        // counterpart: the translate-sync effect).
        effect(() => {
            // Read (and track) the index BEFORE any early return — a
            // skipped run must not drop it from the effect's dep set,
            // or the pager-follow dies after the first scrub session.
            const index = this.currentIndex();
            const settings = this.settings();
            if (!settings.animateThumb) {
                return;
            }
            // Mid-scrub the finger owns the strip; re-centering against
            // the scrub's own navigation would fight it.
            if (this.scrubSession) {
                return;
            }
            this.translate.set(
                getActiveThumbTranslate(
                    index,
                    settings.thumbWidth,
                    settings.thumbMargin,
                    this.stripWidth(),
                    this.totalWidth(),
                    settings.currentPagerPosition,
                    this.isRtl() ? 'rtl' : 'ltr',
                ),
            );
        });
    }

    // The translate scalar lives in logical strip space; in RTL the
    // strip flows right-to-left (lg-rtl.css floats the thumbs right), so
    // the applied sign and the finger mapping mirror together.
    protected readonly isRtl = computed(
        () => this.ctx.settings().direction === 'rtl',
    );
    private toTrackX(value: number): number {
        return this.isRtl() ? value : -value;
    }

    // Track transform for the template: the live (frame-written) value
    // while a gesture/glide owns the track, the committed signal
    // otherwise — a corridor re-render must not snap the track.
    protected trackTransform(): string {
        const value = this.dragging() ? this.liveTranslate : this.translate();
        return `translate3d(${this.toTrackX(value)}px, 0px, 0px)`;
    }

    // Strip physics (plan 010): frames write the DOM directly; the
    // translate signal commits once at settle (windowed strips re-render
    // there).
    private writeTrackTranslate(value: number): void {
        this.liveTranslate = value;
        const track = this.track()?.nativeElement;
        if (track) {
            track.style.transform = `translate3d(${this.toTrackX(
                value,
            )}px, 0px, 0px)`;
        }
    }

    private measure(): void {
        this.stripWidth.set(
            this.ctx.refs.getOuter()?.offsetWidth ??
                this.stripOuter()?.nativeElement.offsetWidth ??
                0,
        );
    }

    protected thumbSrc(item: LgGalleryItem): string | undefined {
        const settings = this.settings();
        const videoInfo = getVideoInfo(item.src, !!item.video);
        if (videoInfo?.youtube && settings.loadYouTubeThumbnail) {
            return `//img.youtube.com/vi/${videoInfo.youtube[1]}/${settings.youTubeThumbSize}.jpg`;
        }
        return item.thumb ?? item.src;
    }

    protected onThumbClick(index: number): void {
        if (this.clickable) {
            this.ctx.actions.goToSlide(index);
        }
        this.clickable = true;
    }

    protected onThumbKeydown(event: KeyboardEvent, index: number): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.ctx.actions.goToSlide(index);
        }
    }

    private beginScrub(): void {
        if (this.scrubSession) {
            return;
        }
        this.scrubSession = true;
        this.scrubIndex = this.currentIndex();
        this.ctx.layout.setOuterClass('lg-thumb-scrubbing', true);
    }

    private endScrub(): void {
        if (!this.scrubSession) {
            return;
        }
        this.scrubSession = false;
        this.scrubIndex = -1;
        this.ctx.layout.setOuterClass('lg-thumb-scrubbing', false);
    }

    /** Live translate → slide, on drag and glide frames alike. */
    private scrubTo(value: number): void {
        const index = getScrubThumbIndex(
            value,
            this.totalWidth(),
            this.stripWidth(),
            this.ctx.items().length,
        );
        if (index === this.scrubIndex) {
            return;
        }
        const direction = index > this.scrubIndex ? 'next' : 'prev';
        this.scrubIndex = index;
        this.ctx.actions.navigate(index, direction);
        this.ctx.actions.dispatch({ type: 'TRANSITION_END' });
    }

    /**
     * Strip drag: transforms are written straight to the track element per
     * move (the no-CD-per-move rule) and committed to the signal on release.
     */
    protected onPointerDown(event: PointerEvent): void {
        const settings = this.settings();
        if (
            !settings.enableThumbDrag ||
            !settings.animateThumb ||
            this.totalWidth() <= this.stripWidth() ||
            this.drag
        ) {
            return;
        }
        event.preventDefault();
        // A press mid-glide takes over from the current position.
        this.cancelSpring?.();
        this.cancelSpring = null;
        this.corridor.set(null);
        this.samples = pushVelocitySample([], {
            x: event.clientX,
            y: event.clientY,
            t: Date.now(),
        });
        this.liveTranslate = this.translate();
        this.drag = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startTranslate: this.liveTranslate,
            moved: false,
        };
        this.dragging.set(true);
        const onMove = (moveEvent: PointerEvent): void => {
            const drag = this.drag;
            if (!drag || moveEvent.pointerId !== drag.pointerId) {
                return;
            }
            const delta = moveEvent.clientX - drag.startX;
            if (Math.abs(delta) > 2) {
                drag.moved = true;
                this.clickable = false;
                const cfg = this.settings();
                if (cfg.scrubThumbnails && cfg.animateThumb) {
                    this.beginScrub();
                }
            }
            this.samples = pushVelocitySample(this.samples, {
                x: moveEvent.clientX,
                y: moveEvent.clientY,
                t: Date.now(),
            });
            // Elastic: overshoot past the edges compresses instead of
            // clamping dead.
            this.writeTrackTranslate(
                getElasticThumbTranslate(
                    drag.startTranslate + (this.isRtl() ? delta : -delta),
                    this.totalWidth(),
                    this.stripWidth(),
                ),
            );
            if (this.scrubSession) {
                this.scrubTo(this.liveTranslate);
            }
            // Windowed strips: a long finger drag can outrun the
            // rendered window — one commit recenters it (rare; routine
            // moves stay zero-CD).
            const rendered = this.thumbWindow();
            if (rendered) {
                const unit =
                    this.settings().thumbWidth + this.settings().thumbMargin;
                if (
                    this.liveTranslate < rendered.start * unit ||
                    this.liveTranslate + this.stripWidth() >
                        (rendered.end + 1) * unit
                ) {
                    this.translate.set(
                        clampThumbTranslate(
                            this.liveTranslate,
                            this.totalWidth(),
                            this.stripWidth(),
                        ),
                    );
                }
            }
        };
        const onUp = (upEvent: PointerEvent): void => {
            const drag = this.drag;
            if (!drag || upEvent.pointerId !== drag.pointerId) {
                return;
            }
            this.detachWindow?.();
            this.detachWindow = null;
            const moved = drag.moved;
            this.drag = null;
            this.clickable =
                Math.abs(upEvent.clientX - drag.startX) <
                this.settings().thumbnailSwipeThreshold;

            // Fling: project the release velocity, clamp into the strip
            // bounds, spring there (bounces off the edge; pulls back when
            // released inside the rubber band).
            const pointerVelocityX = getWindowedVelocity(
                this.samples,
                Date.now(),
            ).x;
            const translateVelocity = this.isRtl()
                ? pointerVelocityX
                : -pointerVelocityX;
            const target = clampThumbTranslate(
                this.liveTranslate + project(translateVelocity),
                this.totalWidth(),
                this.stripWidth(),
            );
            if (!moved) {
                // A press that took over a scrub glide and released
                // without moving ends the session — no spring runs.
                this.endScrub();
                this.dragging.set(false);
                this.translate.set(
                    clampThumbTranslate(
                        this.liveTranslate,
                        this.totalWidth(),
                        this.stripWidth(),
                    ),
                );
                return;
            }
            // Windowed strips: render the whole flight corridor before
            // the glide starts — the destination is known at release, so
            // the spring never crosses unrendered thumbs.
            if (this.thumbWindow()) {
                this.corridor.set({ from: this.liveTranslate, to: target });
            }
            this.cancelSpring = runSprings(
                [
                    {
                        from: this.liveTranslate,
                        velocity: translateVelocity,
                        target,
                    },
                ],
                ([value]) => {
                    this.writeTrackTranslate(value!);
                    // The glide keeps scrubbing — a flicked strip drives
                    // the gallery to where it decelerates.
                    if (this.scrubSession) {
                        this.scrubTo(value!);
                    }
                },
                () => {
                    this.cancelSpring = null;
                    this.endScrub();
                    this.dragging.set(false);
                    this.corridor.set(null);
                    this.translate.set(target);
                },
            );
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
}

@Component({
    selector: 'lg-thumbnail-toggle',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LgCiComponent],
    template: `
        @if (visible()) {
        <button
            type="button"
            class="lg-toggle-thumb lg-icon lg-icon-custom"
            [attr.aria-label]="
                settings().thumbnailPluginStrings?.toggleThumbnails ??
                coreStrings().toggleThumbnails
            "
            (click)="ctx.layout.toggleComponents()"
        >
            <lg-ci
                [slot]="ciToggle()"
                [names]="['toggleThumbnails']"
                [icons]="defaultIcons"
            />
        </button>
        }
    `,
})
export class LgThumbnailToggleComponent {
    protected readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly defaultIcons = thumbnailDefaultIcons;
    protected readonly ciToggle = computed(() =>
        resolveIconSlot(this.ctx.icons?.(), ['toggleThumbnails']),
    );
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ThumbnailResolved,
    );
    protected readonly coreStrings = computed(
        () => this.ctx.settings().strings,
    );
    // 2.x rule: the toggle only exists when media may overlap the strip.
    protected readonly visible = computed(() => {
        const settings = this.settings();
        return (
            settings.thumbnail &&
            settings.toggleThumb &&
            settings.allowMediaOverlap
        );
    });
}

/** Outer classes while the feature is registered (React `usePlugin` twin). */
@Injectable()
export class LgThumbnailInitService {
    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        effect((onCleanup) => {
            const settings = ctx.settings() as unknown as ThumbnailResolved;
            const enabled = settings.thumbnail;
            ctx.layout.setOuterClass('lg-has-thumb', enabled);
            ctx.layout.setOuterClass(
                'lg-animate-thumb',
                enabled && settings.animateThumb,
            );
            ctx.layout.setOuterClass(
                'lg-can-toggle',
                enabled && settings.toggleThumb && settings.allowMediaOverlap,
            );
            onCleanup(() => {
                ctx.layout.setOuterClass('lg-has-thumb', false);
                ctx.layout.setOuterClass('lg-animate-thumb', false);
                ctx.layout.setOuterClass('lg-can-toggle', false);
            });
        });
    }
}

export function withThumbnail(
    options: Partial<ThumbnailSettings> = {},
): LgFeature<ThumbnailSettings> {
    return {
        name: 'thumbnail',
        defaults: thumbnailSettings,
        options,
        slots: {
            components: LgThumbnailStripComponent,
            toolbar: LgThumbnailToggleComponent,
        },
        providers: [
            LgThumbnailInitService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgThumbnailInitService,
                multi: true,
            },
        ],
    };
}
