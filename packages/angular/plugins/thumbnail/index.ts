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
    getThumbTotalWidth,
    getVideoInfo,
    type ThumbPagerPosition,
} from '@lightgallery/headless';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';

/**
 * Thumbnail feature (2.x `lg-thumbnail`): footer strip + toggle button —
 * the slot+state template wave 2 copies (plan 005 maintenance note). Logic
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
    /** Load YouTube thumbs from img.youtube.com. */
    loadYouTubeThumbnail: boolean;
    /** YouTube thumb size suffix (`<n>.jpg`). */
    youTubeThumbSize: number;
    thumbnailPluginStrings: ThumbnailStrings;
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
    loadYouTubeThumbnail: true,
    youTubeThumbSize: 1,
    thumbnailPluginStrings: {
        toggleThumbnails: 'Toggle thumbnails',
    },
};

type ThumbnailResolved = ThumbnailSettings & {
    speed: number;
    allowMediaOverlap: boolean;
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
            >
                <div
                    #track
                    class="lg-thumb lg-group"
                    [style.width.px]="totalWidth()"
                    [style.position]="'relative'"
                    [style.transition-duration]="
                        dragging() ? '0ms' : settings().speed + 'ms'
                    "
                    [style.transform]="
                        'translate3d(-' + translate() + 'px, 0px, 0px)'
                    "
                    (pointerdown)="onPointerDown($event)"
                >
                    @for (item of ctx.items(); track $index) {
                        <div
                            class="lg-thumb-item"
                            [class.active]="$index === currentIndex()"
                            [style.width.px]="settings().thumbWidth"
                            [style.height]="settings().thumbHeight"
                            [style.margin-right.px]="settings().thumbMargin"
                            role="button"
                            tabindex="0"
                            [attr.data-lg-item-id]="$index"
                            [attr.aria-label]="
                                item.alt ?? 'Go to slide ' + ($index + 1)
                            "
                            [attr.aria-current]="$index === currentIndex()"
                            (click)="onThumbClick($index)"
                            (keydown)="onThumbKeydown($event, $index)"
                        >
                            <img
                                [src]="thumbSrc(item)"
                                [alt]="item.alt ?? ''"
                                draggable="false"
                            />
                        </div>
                    }
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
    protected readonly translate = signal(0);
    protected readonly dragging = signal(false);

    protected readonly totalWidth = computed(() =>
        getThumbTotalWidth(
            this.ctx.items().length,
            this.settings().thumbWidth,
            this.settings().thumbMargin,
        ),
    );
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
    } | null = null;
    private detachWindow: (() => void) | null = null;
    private readonly resizeListener = (): void => this.measure();

    constructor() {
        // 2.x measures the outer element on open and on resize.
        afterNextRender(() => {
            this.measure();
            window.addEventListener('resize', this.resizeListener);
        });
        inject(DestroyRef).onDestroy(() => {
            window.removeEventListener('resize', this.resizeListener);
            this.detachWindow?.();
        });
        // Keep the active thumbnail at the pager position (React
        // counterpart: the translate-sync effect).
        effect(() => {
            const settings = this.settings();
            if (!settings.animateThumb) {
                return;
            }
            this.translate.set(
                getActiveThumbTranslate(
                    this.currentIndex(),
                    settings.thumbWidth,
                    settings.thumbMargin,
                    this.stripWidth(),
                    this.totalWidth(),
                    settings.currentPagerPosition,
                ),
            );
        });
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

    /**
     * Strip drag: transforms are written straight to the track element per
     * move (plan 004's no-CD rule) and committed to the signal on release.
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
        this.drag = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startTranslate: this.translate(),
        };
        this.dragging.set(true);
        let live = this.translate();
        const onMove = (moveEvent: PointerEvent): void => {
            const drag = this.drag;
            if (!drag || moveEvent.pointerId !== drag.pointerId) {
                return;
            }
            const delta = moveEvent.clientX - drag.startX;
            if (Math.abs(delta) > 2) {
                this.clickable = false;
            }
            live = clampThumbTranslate(
                drag.startTranslate - delta,
                this.totalWidth(),
                this.stripWidth(),
            );
            const track = this.track()?.nativeElement;
            if (track) {
                track.style.transform = `translate3d(-${live}px, 0px, 0px)`;
            }
        };
        const onUp = (upEvent: PointerEvent): void => {
            const drag = this.drag;
            if (!drag || upEvent.pointerId !== drag.pointerId) {
                return;
            }
            this.detachWindow?.();
            this.detachWindow = null;
            this.drag = null;
            this.dragging.set(false);
            this.translate.set(live);
            this.clickable =
                Math.abs(upEvent.clientX - drag.startX) <
                this.settings().thumbnailSwipeThreshold;
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
    template: `
        @if (visible()) {
            <button
                type="button"
                class="lg-toggle-thumb lg-icon"
                [attr.aria-label]="
                    settings().thumbnailPluginStrings.toggleThumbnails
                "
                (click)="ctx.layout.toggleComponents()"
            ></button>
        }
    `,
})
export class LgThumbnailToggleComponent {
    protected readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ThumbnailResolved,
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
            const settings =
                ctx.settings() as unknown as ThumbnailResolved;
            const enabled = settings.thumbnail;
            ctx.layout.setOuterClass('lg-has-thumb', enabled);
            ctx.layout.setOuterClass(
                'lg-animate-thumb',
                enabled && settings.animateThumb,
            );
            ctx.layout.setOuterClass(
                'lg-can-toggle',
                enabled &&
                    settings.toggleThumb &&
                    settings.allowMediaOverlap,
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
