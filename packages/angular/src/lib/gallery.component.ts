import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    ElementRef,
    inject,
    input,
    model,
    OnDestroy,
    output,
    PLATFORM_ID,
    signal,
    TemplateRef,
    untracked,
    ViewContainerRef,
    viewChild,
    type OutputEmitterRef,
} from '@angular/core';
import {
    clampIndex,
    fitImageSize,
    getOriginTransform,
    getSlideIndexesInDom,
    getSlideType,
    parseImageSize,
    resolveSettings,
    type CaptionPosition,
    type CoreSettings,
    type GalleryCoreStrings,
    type GalleryMode,
    type MobileSettings,
    type RectLike,
    type SlideDirection,
    type UserSettings,
} from '@lightgallery/headless';

import { LgCaptionComponent } from './caption.component';
import { cx } from './cx';
import { LgGalleryRuntime } from './runtime';
import { LgSlideComponent, type OriginAnimation } from './slide.component';
import {
    LgCaptionDirective,
    LgCounterDirective,
    LgNextButtonDirective,
    LgPrevButtonDirective,
    type LgCounterContext,
} from './slots';
import { LightGalleryStore } from './store';
import { LgTimeouts } from './timeouts';
import type {
    HasVideoDetail,
    InitDetail,
    LgEventMap,
    LgGalleryHandle,
    LgGalleryItem,
    SlideEventDetail,
    SlideItemLoadDetail,
} from './types';

/**
 * Open/close lifecycle phases, mirroring the vanilla class timeline (and the
 * React outlet's `OpenPhase`):
 * `pre-open`  — overlay attached (`lg-show`), backdrop still transparent
 * `opening`   — `lg-show-in` + backdrop `in` (fading in)
 * `open`      — backdrop settled, outer `lg-visible`
 * `closing`   — reverse animation; overlay stays attached until it finishes
 */
type OpenPhase = 'closed' | 'pre-open' | 'opening' | 'open' | 'closing';

interface SlideTimeline {
    /** Which slide carries `lg-current` right now. */
    shownIndex: number;
    /** `lg-prev-slide` / `lg-next-slide` assignments. */
    positions: Record<number, 'prev' | 'next'>;
    /** Outer `lg-no-trans` while slides are re-positioned. */
    noTrans: boolean;
    /** Slide carrying `lg-slide-progress` (outgoing slide). */
    progressIndex: number | null;
}

function defaultIsMobile(): boolean {
    return (
        typeof navigator !== 'undefined' &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    );
}

function isSlideElement(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) {
        return false;
    }
    return ['lg-outer', 'lg-item', 'lg-img-wrap', 'lg-img-rotate'].some(
        (name) => target.classList.contains(name),
    );
}

const HIDE_BARS_ACTIVITY_EVENTS = ['mousemove', 'click', 'touchstart'] as const;

/**
 * The core gallery (ADR 0001 §3): an invisible host that projects the
 * uncontrolled triggers and opens the lightbox into a CDK overlay. Settings
 * are same-named signal inputs; events are outputs without the `on` prefix;
 * `[open]` + `(closed)` and `[(index)]` drive controlled mode; the
 * `#lg="lgGallery"` template ref exposes the imperative surface.
 */
@Component({
    selector: 'lg-gallery',
    exportAs: 'lgGallery',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LightGalleryStore, LgGalleryRuntime],
    imports: [LgCaptionComponent, LgSlideComponent, NgTemplateOutlet],
    template: `
        <ng-content />
        <ng-template #galleryTpl>
            <div
                #containerEl
                [class]="containerClasses()"
                tabindex="-1"
                role="dialog"
                aria-modal="true"
                [attr.aria-label]="
                    settings().ariaLabelledby ? null : 'Gallery'
                "
                [attr.aria-labelledby]="settings().ariaLabelledby || null"
                [attr.aria-describedby]="settings().ariaDescribedby || null"
            >
                <div
                    class="lg-backdrop"
                    [class.in]="showIn()"
                    [style.transition-duration]="
                        settings().backdropDuration + 'ms'
                    "
                ></div>
                <div
                    #outerEl
                    [class]="outerClasses()"
                    [attr.data-lg-slide-type]="currentSlideType()"
                    (mousedown)="onOuterMouseDown($event)"
                    (mousemove)="onOuterMouseMove()"
                    (mouseup)="onOuterMouseUp($event)"
                >
                    <div
                        class="lg-content"
                        [style.top]="contentTopStyle()"
                        [style.bottom]="contentBottomStyle()"
                    >
                        <div
                            class="lg-inner"
                            style="touch-action: none"
                            [style.transition-timing-function]="
                                settings().easing
                            "
                            [style.transition-duration]="
                                settings().speed + 'ms'
                            "
                        >
                            @for (idx of slideIndexes(); track idx) {
                                <lg-slide
                                    [index]="idx"
                                    [item]="items()[idx]"
                                    [isShown]="timeline().shownIndex === idx"
                                    [position]="timeline().positions[idx]"
                                    [inProgress]="
                                        timeline().progressIndex === idx
                                    "
                                    [originAnim]="
                                        originAnim()?.index === idx
                                            ? originAnim()
                                            : null
                                    "
                                />
                            }
                        </div>
                        @if (settings().controls) {
                            <button
                                type="button"
                                [class]="
                                    disablePrev()
                                        ? 'lg-prev lg-icon disabled'
                                        : 'lg-prev lg-icon'
                                "
                                [disabled]="disablePrev()"
                                [attr.aria-label]="
                                    settings().strings.previousSlide
                                "
                                (click)="prevSlide()"
                            >
                                @if (prevButtonSlot(); as slot) {
                                    <ng-container
                                        *ngTemplateOutlet="slot.templateRef"
                                    />
                                }
                            </button>
                            <button
                                type="button"
                                [class]="
                                    disableNext()
                                        ? 'lg-next lg-icon disabled'
                                        : 'lg-next lg-icon'
                                "
                                [disabled]="disableNext()"
                                [attr.aria-label]="
                                    settings().strings.nextSlide
                                "
                                (click)="nextSlide()"
                            >
                                @if (nextButtonSlot(); as slot) {
                                    <ng-container
                                        *ngTemplateOutlet="slot.templateRef"
                                    />
                                }
                            </button>
                        }
                    </div>
                    <div #toolbarEl class="lg-toolbar lg-group">
                        @if (settings().showMaximizeIcon) {
                            <button
                                type="button"
                                class="lg-maximize lg-icon"
                                [attr.aria-label]="
                                    settings().strings.toggleMaximize
                                "
                                (click)="toggleMaximize()"
                            ></button>
                        }
                        @if (settings().closable && settings().showCloseIcon) {
                            <button
                                type="button"
                                class="lg-close lg-icon"
                                [attr.aria-label]="
                                    settings().strings.closeGallery
                                "
                                (click)="closeGallery()"
                            ></button>
                        }
                        @if (showDownload()) {
                            <a
                                target="_blank"
                                rel="noopener"
                                class="lg-download lg-icon"
                                [attr.aria-label]="settings().strings.download"
                                [attr.href]="downloadHref()"
                                [attr.download]="downloadName()"
                            ></a>
                        }
                        @if (settings().counter) {
                            <div
                                class="lg-counter"
                                role="status"
                                aria-live="polite"
                            >
                                @if (counterSlot(); as slot) {
                                    <ng-container
                                        *ngTemplateOutlet="
                                            slot.templateRef;
                                            context: counterContext()
                                        "
                                    />
                                } @else {
                                    <span class="lg-counter-current">{{
                                        store.currentIndex() + 1
                                    }}</span
                                    >{{ ' / '
                                    }}<span class="lg-counter-all">{{
                                        store.slidesCount()
                                    }}</span>
                                }
                            </div>
                        }
                    </div>
                    @if (settings().captionPosition === 'outer') {
                        <lg-caption
                            [item]="currentItem()"
                            [index]="store.currentIndex()"
                        />
                    }
                    <div class="lg-components">
                        @if (settings().captionPosition === 'bar') {
                            <lg-caption
                                [item]="currentItem()"
                                [index]="store.currentIndex()"
                            />
                        }
                    </div>
                </div>
            </div>
        </ng-template>
    `,
})
export class LgGalleryComponent implements LgGalleryHandle, OnDestroy {
    // ── Data / mode inputs ────────────────────────────────────────────────

    /**
     * The gallery data. When omitted, items come from `[lgGalleryItem]`
     * trigger directives in the projected content (uncontrolled mode).
     */
    readonly slides = input<LgGalleryItem[] | undefined>(undefined);

    /**
     * Controlled: whether the lightbox is open. Leave unbound for
     * uncontrolled mode where `[lgGalleryItem]` clicks open the gallery.
     */
    readonly open = input<boolean | undefined>(undefined);

    /** Emitted when the gallery requests to close (ESC / button / tap). */
    readonly closed = output<void>();

    /**
     * Two-way slide index (`[(index)]`). Deviation from React documented in
     * the ADR: `model()` replaces the controlled/uncontrolled index split —
     * internal navigation writes the model, external writes navigate.
     */
    readonly index = model<number>(0);

    /** Extra class for the `lg-container` element (2.x `addClass`). */
    readonly className = input<string | undefined>(undefined);

    /**
     * Zoom-from-origin rect (viewport coordinates) for controlled mode,
     * where there is no trigger element to measure.
     */
    readonly originRect = input<RectLike | null | undefined>(undefined);

    // ── Settings inputs (same-named, typed from headless — ADR §6) ────────

    readonly mode = input<GalleryMode | undefined>(undefined);
    readonly easing = input<string | undefined>(undefined);
    readonly speed = input<number | undefined>(undefined);
    readonly licenseKey = input<string | undefined>(undefined);
    readonly height = input<string | undefined>(undefined);
    readonly width = input<string | undefined>(undefined);
    readonly startClass = input<string | undefined>(undefined);
    readonly zoomFromOrigin = input<boolean | undefined>(undefined);
    readonly startAnimationDuration = input<number | undefined>(undefined);
    readonly backdropDuration = input<number | undefined>(undefined);
    readonly hideBarsDelay = input<number | undefined>(undefined);
    readonly showBarsAfter = input<number | undefined>(undefined);
    readonly slideDelay = input<number | undefined>(undefined);
    readonly allowMediaOverlap = input<boolean | undefined>(undefined);
    readonly videoMaxSize = input<string | undefined>(undefined);
    readonly loadYouTubePoster = input<boolean | undefined>(undefined);
    readonly defaultCaptionHeight = input<number | undefined>(undefined);
    readonly ariaLabelledby = input<string | undefined>(undefined);
    readonly ariaDescribedby = input<string | undefined>(undefined);
    readonly hideScrollbar = input<boolean | undefined>(undefined);
    readonly resetScrollPosition = input<boolean | undefined>(undefined);
    readonly closable = input<boolean | undefined>(undefined);
    readonly swipeToClose = input<boolean | undefined>(undefined);
    readonly closeOnTap = input<boolean | undefined>(undefined);
    readonly showCloseIcon = input<boolean | undefined>(undefined);
    readonly showMaximizeIcon = input<boolean | undefined>(undefined);
    readonly loop = input<boolean | undefined>(undefined);
    readonly escKey = input<boolean | undefined>(undefined);
    readonly keyPress = input<boolean | undefined>(undefined);
    readonly trapFocus = input<boolean | undefined>(undefined);
    readonly controls = input<boolean | undefined>(undefined);
    readonly slideEndAnimation = input<boolean | undefined>(undefined);
    readonly hideControlOnEnd = input<boolean | undefined>(undefined);
    readonly mousewheel = input<boolean | undefined>(undefined);
    readonly captionPosition = input<CaptionPosition | undefined>(undefined);
    readonly preload = input<number | undefined>(undefined);
    readonly numberOfSlideItemsInDom = input<number | undefined>(undefined);
    readonly iframeWidth = input<string | undefined>(undefined);
    readonly iframeHeight = input<string | undefined>(undefined);
    readonly iframeMaxWidth = input<string | undefined>(undefined);
    readonly iframeMaxHeight = input<string | undefined>(undefined);
    readonly download = input<boolean | undefined>(undefined);
    readonly counter = input<boolean | undefined>(undefined);
    readonly swipeThreshold = input<number | undefined>(undefined);
    readonly enableSwipe = input<boolean | undefined>(undefined);
    readonly enableDrag = input<boolean | undefined>(undefined);
    readonly strings = input<Partial<GalleryCoreStrings> | undefined>(
        undefined,
    );
    readonly isMobile = input<(() => boolean) | undefined>(undefined);
    readonly mobileSettings = input<MobileSettings | undefined>(undefined);

    // ── Outputs (ADR §6 naming table: all 25, `on` prefix dropped) ────────

    readonly init = output<InitDetail>();
    readonly beforeOpen = output<void>();
    readonly afterOpen = output<void>();
    readonly slideItemLoad = output<SlideItemLoadDetail>();
    readonly beforeSlide = output<SlideEventDetail>();
    readonly afterSlide = output<SlideEventDetail>();
    readonly beforeNextSlide = output<{ index: number }>();
    readonly beforePrevSlide = output<{ index: number; fromTouch: boolean }>();
    readonly afterAppendSlide = output<{ index: number }>();
    readonly afterAppendSubHtml = output<{ index: number }>();
    readonly containerResize = output<{ index: number }>();
    readonly beforeClose = output<void>();
    readonly afterClose = output<void>();
    readonly dragStart = output<void>();
    readonly dragMove = output<void>();
    readonly dragEnd = output<void>();
    readonly posterClick = output<void>();
    readonly hasVideo = output<HasVideoDetail>();
    readonly autoplayStart = output<{ index: number }>();
    readonly autoplay = output<{ index: number }>();
    readonly autoplayStop = output<{ index: number }>();
    readonly rotateLeft = output<{ rotate: number }>();
    readonly rotateRight = output<{ rotate: number }>();
    readonly flipHorizontal = output<{ flipHorizontal: number }>();
    readonly flipVertical = output<{ flipVertical: number }>();

    private readonly outputRefs: {
        [K in keyof LgEventMap]: OutputEmitterRef<LgEventMap[K]>;
    } = {
        init: this.init,
        beforeOpen: this.beforeOpen,
        afterOpen: this.afterOpen,
        slideItemLoad: this.slideItemLoad,
        beforeSlide: this.beforeSlide,
        afterSlide: this.afterSlide,
        beforeNextSlide: this.beforeNextSlide,
        beforePrevSlide: this.beforePrevSlide,
        afterAppendSlide: this.afterAppendSlide,
        afterAppendSubHtml: this.afterAppendSubHtml,
        containerResize: this.containerResize,
        beforeClose: this.beforeClose,
        afterClose: this.afterClose,
        dragStart: this.dragStart,
        dragMove: this.dragMove,
        dragEnd: this.dragEnd,
        posterClick: this.posterClick,
        hasVideo: this.hasVideo,
        autoplayStart: this.autoplayStart,
        autoplay: this.autoplay,
        autoplayStop: this.autoplayStop,
        rotateLeft: this.rotateLeft,
        rotateRight: this.rotateRight,
        flipHorizontal: this.flipHorizontal,
        flipVertical: this.flipVertical,
    };

    // ── Wiring ────────────────────────────────────────────────────────────

    protected readonly store = inject(LightGalleryStore);
    private readonly runtime = inject(LgGalleryRuntime);
    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly galleryTpl =
        viewChild.required<TemplateRef<unknown>>('galleryTpl');
    private readonly containerEl =
        viewChild<ElementRef<HTMLDivElement>>('containerEl');
    private readonly outerEl =
        viewChild<ElementRef<HTMLDivElement>>('outerEl');
    private readonly toolbarEl =
        viewChild<ElementRef<HTMLDivElement>>('toolbarEl');

    protected readonly captionSlot = contentChild(LgCaptionDirective);
    protected readonly counterSlot = contentChild(LgCounterDirective);
    protected readonly prevButtonSlot = contentChild(LgPrevButtonDirective);
    protected readonly nextButtonSlot = contentChild(LgNextButtonDirective);

    private overlayRef: OverlayRef | null = null;
    private readonly timers = new LgTimeouts();

    // ── Settings resolution (headless merge order; ADR §2) ────────────────

    // prefers-reduced-motion collapses every animation to 0ms and disables
    // the zoom-from-origin/bounce effects (a11y; checked once per instance).
    private readonly reducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    private isMobileCache: boolean | null = null;

    private readonly userSettings = computed<UserSettings>(() => ({
        mode: this.mode(),
        easing: this.easing(),
        speed: this.speed(),
        licenseKey: this.licenseKey(),
        height: this.height(),
        width: this.width(),
        startClass: this.startClass(),
        zoomFromOrigin: this.zoomFromOrigin(),
        startAnimationDuration: this.startAnimationDuration(),
        backdropDuration: this.backdropDuration(),
        hideBarsDelay: this.hideBarsDelay(),
        showBarsAfter: this.showBarsAfter(),
        slideDelay: this.slideDelay(),
        allowMediaOverlap: this.allowMediaOverlap(),
        videoMaxSize: this.videoMaxSize(),
        loadYouTubePoster: this.loadYouTubePoster(),
        defaultCaptionHeight: this.defaultCaptionHeight(),
        ariaLabelledby: this.ariaLabelledby(),
        ariaDescribedby: this.ariaDescribedby(),
        hideScrollbar: this.hideScrollbar(),
        resetScrollPosition: this.resetScrollPosition(),
        closable: this.closable(),
        swipeToClose: this.swipeToClose(),
        closeOnTap: this.closeOnTap(),
        showCloseIcon: this.showCloseIcon(),
        showMaximizeIcon: this.showMaximizeIcon(),
        loop: this.loop(),
        escKey: this.escKey(),
        keyPress: this.keyPress(),
        trapFocus: this.trapFocus(),
        controls: this.controls(),
        slideEndAnimation: this.slideEndAnimation(),
        hideControlOnEnd: this.hideControlOnEnd(),
        mousewheel: this.mousewheel(),
        captionPosition: this.captionPosition(),
        preload: this.preload(),
        numberOfSlideItemsInDom: this.numberOfSlideItemsInDom(),
        iframeWidth: this.iframeWidth(),
        iframeHeight: this.iframeHeight(),
        iframeMaxWidth: this.iframeMaxWidth(),
        iframeMaxHeight: this.iframeMaxHeight(),
        download: this.download(),
        counter: this.counter(),
        swipeThreshold: this.swipeThreshold(),
        enableSwipe: this.enableSwipe(),
        enableDrag: this.enableDrag(),
        strings: this.strings(),
        isMobile: this.isMobile(),
        mobileSettings: this.mobileSettings(),
    }));

    protected readonly settings = computed<CoreSettings>(() => {
        const user = this.userSettings();
        if (this.isMobileCache === null) {
            this.isMobileCache = user.isMobile
                ? user.isMobile()
                : defaultIsMobile();
        }
        const resolved = resolveSettings(user, {
            isMobile: this.isMobileCache,
        });
        if (!this.reducedMotion) {
            return resolved;
        }
        return {
            ...resolved,
            speed: 0,
            backdropDuration: 0,
            startAnimationDuration: 0,
            zoomFromOrigin: false,
            slideEndAnimation: false,
        };
    });

    protected readonly items = computed<readonly LgGalleryItem[]>(
        () =>
            this.slides() ??
            this.runtime.registrations().map((entry) => entry.item()),
    );

    // ── Open/close + transition presentation state ────────────────────────

    private readonly phase = signal<OpenPhase>('closed');
    private readonly visible = signal(false);
    private readonly componentsOpen = signal(false);
    private readonly useStartClass = signal(false);
    private readonly zoomFromImage = signal(false);
    private readonly maximized = signal(false);
    private readonly barsHidden = signal(false);
    private readonly edgeBounce = signal<'left' | 'right' | null>(null);
    protected readonly originAnim = signal<OriginAnimation | null>(null);
    private readonly contentOffsets = signal<{
        top: number;
        bottom: number;
    } | null>(null);
    protected readonly timeline = signal<SlideTimeline>({
        shownIndex: 0,
        positions: {},
        noTrans: false,
        progressIndex: null,
    });

    private usedZoom = false;
    private prevShown: number | null = null;
    private returnFocus: HTMLElement | null = null;
    private prevOpenControlled: boolean | null = null;
    private mouseDownOnSlide = false;

    private keydownListener: ((event: KeyboardEvent) => void) | null = null;
    private resizeListener: (() => void) | null = null;
    private activityListener: (() => void) | null = null;
    private activityTarget: HTMLElement | null = null;
    private hideBarsArmTimer: ReturnType<typeof setTimeout> | null = null;
    private hideBarsTimer: ReturnType<typeof setTimeout> | null = null;

    // ── Derived template state ────────────────────────────────────────────

    protected readonly showIn = computed(
        () => this.phase() === 'opening' || this.phase() === 'open',
    );
    private readonly zoomClosing = computed(
        () =>
            this.phase() === 'closing' &&
            this.originAnim()?.closing === true,
    );

    protected readonly containerClasses = computed(() =>
        cx(
            'lg-container',
            'lg-show',
            this.className(),
            this.showIn() && 'lg-show-in',
        ),
    );

    protected readonly outerClasses = computed(() =>
        cx(
            'lg-outer',
            'lg-use-css3',
            'lg-css3',
            this.settings().mode,
            this.settings().enableDrag && 'lg-grab',
            this.items().length < 2 && 'lg-single-item',
            this.settings().allowMediaOverlap && 'lg-media-overlap',
            this.useStartClass() && this.settings().startClass,
            this.zoomFromImage() && 'lg-zoom-from-image',
            this.visible() && 'lg-visible',
            this.componentsOpen() && 'lg-components-open',
            (this.barsHidden() ||
                (this.phase() === 'closing' && !this.zoomClosing())) &&
                'lg-hide-items',
            this.zoomClosing() && 'lg-closing',
            this.timeline().noTrans && 'lg-no-trans',
            this.edgeBounce() === 'right' && 'lg-right-end',
            this.edgeBounce() === 'left' && 'lg-left-end',
            this.settings().download &&
                this.currentItem()?.downloadUrl === false &&
                'lg-hide-download',
        ),
    );

    protected readonly currentItem = computed(
        () => this.items()[this.store.currentIndex()],
    );
    protected readonly currentSlideType = computed(() => {
        const item = this.currentItem();
        return item ? getSlideType(item) : null;
    });

    protected readonly slideIndexes = computed(() =>
        getSlideIndexesInDom(
            this.store.currentIndex(),
            this.store.previousIndex(),
            this.store.slidesCount(),
            this.settings().numberOfSlideItemsInDom,
            this.store.loop(),
        ).sort((a, b) => a - b),
    );

    protected readonly disablePrev = computed(
        () =>
            !this.store.loop() &&
            this.settings().hideControlOnEnd &&
            this.store.currentIndex() === 0,
    );
    protected readonly disableNext = computed(
        () =>
            !this.store.loop() &&
            this.settings().hideControlOnEnd &&
            this.store.currentIndex() === this.store.slidesCount() - 1,
    );

    protected readonly showDownload = computed(() => {
        const item = this.currentItem();
        return this.settings().download && !!item && item.downloadUrl !== false;
    });
    protected readonly downloadHref = computed(() => {
        const item = this.currentItem();
        if (!item) {
            return null;
        }
        return typeof item.downloadUrl === 'string'
            ? item.downloadUrl
            : (item.src ?? null);
    });
    protected readonly downloadName = computed(() => {
        const item = this.currentItem();
        return typeof item?.download === 'string' ? item.download : '';
    });

    protected readonly counterContext = computed<LgCounterContext>(() => ({
        $implicit: this.store.currentIndex() + 1,
        total: this.store.slidesCount(),
    }));

    protected readonly contentTopStyle = computed(() => {
        const offsets = this.contentOffsets();
        return !this.settings().allowMediaOverlap && offsets
            ? `${offsets.top}px`
            : null;
    });
    protected readonly contentBottomStyle = computed(() => {
        const offsets = this.contentOffsets();
        return !this.settings().allowMediaOverlap && offsets
            ? `${offsets.bottom}px`
            : null;
    });

    constructor() {
        this.runtime.settings = this.settings;
        this.runtime.items = this.items;
        this.runtime.slots = {
            caption: this.captionSlot,
            counter: this.counterSlot,
            prevButton: this.prevButtonSlot,
            nextButton: this.nextButtonSlot,
        };
        this.runtime.emit = (name, detail) => this.emitEvent(name, detail);
        this.runtime.actions = {
            openGallery: (index) => this.openGallery(index),
            closeGallery: () => this.closeGallery(),
            goToSlide: (index) => this.goToSlide(index),
            nextSlide: () => this.nextSlide(),
            prevSlide: () => this.prevSlide(),
            refresh: () => this.refresh(),
            navigate: (index, direction) => this.navigate(index, direction),
        };

        // React counterpart: the SET_SLIDES_COUNT sync effect in the
        // provider — mirrors the items into the reducer.
        effect(() => {
            this.store.setSlidesCount(this.items().length);
        });
        // React counterpart: the SET_LOOP sync effect in the provider.
        effect(() => {
            this.store.setLoop(this.settings().loop);
        });
        // React counterpart: the controlled `open` → reducer effect.
        effect(() => {
            const controlledOpen = this.open();
            const stateOpen = this.store.isOpen();
            untracked(() => {
                if (controlledOpen === undefined) {
                    return;
                }
                if (controlledOpen && !stateOpen) {
                    this.doOpen(this.index());
                } else if (!controlledOpen && stateOpen) {
                    this.store.close();
                }
            });
        });
        // React counterpart: the controlled/uncontrolled mode-switch warning.
        effect(() => {
            const controlled = this.open() !== undefined;
            if (
                this.prevOpenControlled !== null &&
                this.prevOpenControlled !== controlled
            ) {
                console.error(
                    'lightGallery: <lg-gallery> is changing between ' +
                        'controlled and uncontrolled `open`. Decide between ' +
                        'controlled and uncontrolled for the lifetime of ' +
                        'the component.',
                );
            }
            this.prevOpenControlled = controlled;
        });
        // React counterpart: the controlled `index` → reducer effect (waits
        // out a running transition; `model()` write-back keeps both in sync).
        effect(() => {
            const index = this.index();
            const open = this.store.isOpen();
            const transitioning = this.store.transitioning();
            untracked(() => {
                if (!open || transitioning) {
                    return;
                }
                if (index !== this.store.currentIndex()) {
                    this.store.goTo(index);
                    this.index.set(this.store.currentIndex());
                }
            });
        });
        // React counterpart: `state.open` → phase machine (GalleryOutlet).
        effect(() => {
            const open = this.store.isOpen();
            untracked(() => {
                if (open) {
                    if (
                        this.phase() === 'closed' ||
                        this.phase() === 'closing'
                    ) {
                        this.timers.clearAll();
                        this.originAnim.set(null);
                        this.openOverlay();
                    }
                } else if (
                    this.phase() !== 'closed' &&
                    this.phase() !== 'closing'
                ) {
                    this.beginClose();
                }
            });
        });
        // React counterpart: the slide-timeline effect (GalleryOutlet's
        // `[state.open, state.currentIndex]` commit watcher).
        effect(() => {
            const open = this.store.isOpen();
            const current = this.store.currentIndex();
            untracked(() => this.onIndexCommit(open, current));
        });

        // React counterpart: the mount-time onInit emit.
        afterNextRender(() => {
            this.emitEvent('init', { instance: this });
        });
    }

    // ── Imperative surface (ADR §3; `#lg="lgGallery"`) ────────────────────

    openGallery(index?: number): void {
        if (this.store.isOpen() || this.open() !== undefined) {
            return;
        }
        this.doOpen(index ?? this.index());
    }

    closeGallery(): void {
        if (!this.settings().closable || !this.store.isOpen()) {
            return;
        }
        this.closed.emit();
        if (this.open() === undefined) {
            this.store.close();
        }
    }

    goToSlide(index: number): void {
        this.navigate(index);
    }

    nextSlide(): void {
        const state = this.store.state();
        if (!state.open || state.transitioning) {
            return;
        }
        const target =
            state.currentIndex + 1 < state.slidesCount
                ? state.currentIndex + 1
                : state.loop
                  ? 0
                  : null;
        if (target !== null) {
            this.emitEvent('beforeNextSlide', { index: target });
            this.navigate(target, 'next');
        } else if (this.settings().slideEndAnimation) {
            this.bounce('right');
        }
    }

    prevSlide(): void {
        const state = this.store.state();
        if (!state.open || state.transitioning) {
            return;
        }
        const target =
            state.currentIndex > 0
                ? state.currentIndex - 1
                : state.loop
                  ? state.slidesCount - 1
                  : null;
        if (target !== null) {
            this.emitEvent('beforePrevSlide', {
                index: target,
                fromTouch: false,
            });
            this.navigate(target, 'prev');
        } else if (this.settings().slideEndAnimation) {
            this.bounce('left');
        }
    }

    /** Parity with vanilla's public API; updates are input-driven. */
    refresh(): void {}

    ngOnDestroy(): void {
        this.timers.clearAll();
        this.unbindOpenListeners();
        if (isPlatformBrowser(this.platformId)) {
            this.removeBodyState();
        }
        this.detachOverlay();
    }

    // ── Actions plumbing ──────────────────────────────────────────────────

    private doOpen(index?: number): void {
        this.emitEvent('beforeOpen', undefined);
        this.store.open(index);
        this.index.set(this.store.currentIndex());
    }

    private navigate(rawIndex: number, direction?: SlideDirection): void {
        const state = this.store.state();
        if (!state.open || state.transitioning) {
            return;
        }
        const target = clampIndex(rawIndex, state.slidesCount, state.loop);
        if (target === state.currentIndex) {
            return;
        }
        this.store.goTo(rawIndex, direction);
        this.index.set(this.store.currentIndex());
    }

    // Slide-end bounce (lg-left-end / lg-right-end) — 400ms, 2.x parity.
    private bounce(side: 'left' | 'right'): void {
        this.edgeBounce.set(side);
        this.timers.set(() => this.edgeBounce.set(null), 400);
    }

    private emitEvent<K extends keyof LgEventMap>(
        name: K,
        detail: LgEventMap[K],
    ): void {
        this.outputRefs[name].emit(detail);
        this.runtime.events.emit(name, detail);
    }

    protected toggleMaximize(): void {
        // Meaningful for inline containers (007); kept for DOM/API parity.
        this.maximized.update((value) => !value);
    }

    // ── Close-on-tap (2.x closeOnTap) ─────────────────────────────────────

    protected onOuterMouseDown(event: MouseEvent): void {
        this.mouseDownOnSlide = isSlideElement(event.target);
    }

    protected onOuterMouseMove(): void {
        this.mouseDownOnSlide = false;
    }

    protected onOuterMouseUp(event: MouseEvent): void {
        if (
            this.settings().closeOnTap &&
            this.mouseDownOnSlide &&
            isSlideElement(event.target)
        ) {
            this.closeGallery();
        }
    }

    // ── Open/close machinery ──────────────────────────────────────────────

    private openOverlay(): void {
        if (!isPlatformBrowser(this.platformId)) {
            // SSR: the closed gallery renders only its triggers (ADR §8).
            return;
        }
        this.phase.set('pre-open');
        this.attachOverlay();
        this.runEntrance();
    }

    private attachOverlay(): void {
        if (this.overlayRef) {
            return;
        }
        // CDK adopted per ADR §3: global position + scroll blocking replace
        // the hand-rolled portal/body-lock pair from the React outlet.
        this.overlayRef = this.overlay.create({
            positionStrategy: this.overlay.position().global(),
            scrollStrategy: this.overlay.scrollStrategies.block(),
        });
        this.overlayRef.attach(
            new TemplatePortal(this.galleryTpl(), this.viewContainerRef),
        );
    }

    private detachOverlay(): void {
        this.overlayRef?.dispose();
        this.overlayRef = null;
    }

    /** Entrance timeline, once the overlay is in the DOM (2.x class order). */
    private runEntrance(): void {
        const settings = this.settings();
        this.contentOffsets.set(this.measureOffsets());

        const currentIndex = this.store.currentIndex();
        const transform = this.computeOrigin(currentIndex);
        this.usedZoom = transform !== null;
        this.useStartClass.set(transform === null);
        if (transform !== null) {
            this.originAnim.set({
                index: currentIndex,
                transform,
                stage: 'init',
            });
            this.timers.set(() => {
                this.zoomFromImage.set(true);
                this.originAnim.update(
                    (anim) => anim && { ...anim, stage: 'armed' },
                );
            }, 10);
            this.timers.set(() => {
                this.originAnim.update(
                    (anim) => anim && { ...anim, stage: 'run' },
                );
            }, 110);
            this.timers.set(
                () => this.originAnim.set(null),
                settings.startAnimationDuration + 110,
            );
        }

        this.timers.set(() => this.phase.set('opening'), 10);
        this.timers.set(() => {
            this.phase.set('open');
            if (!this.usedZoom) {
                this.visible.set(true);
            }
        }, 10 + settings.backdropDuration);
        this.timers.set(
            () => this.componentsOpen.set(true),
            settings.zoomFromOrigin ? 100 : settings.backdropDuration,
        );

        this.applyBodyState(settings);
        this.bindOpenListeners(settings);

        if (settings.trapFocus) {
            // Remember where focus came from; restored when the overlay
            // detaches (dialog pattern). CDK FocusTrap hardening lands in 007.
            this.returnFocus =
                document.activeElement instanceof HTMLElement
                    ? document.activeElement
                    : null;
            this.containerEl()?.nativeElement.focus({ preventScroll: true });
        }
        this.emitEvent('afterOpen', undefined);
    }

    private beginClose(): void {
        const settings = this.settings();
        this.emitEvent('beforeClose', undefined);
        this.unbindOpenListeners();
        this.removeBodyState();
        this.phase.set('closing');
        this.visible.set(false);
        this.componentsOpen.set(false);
        this.barsHidden.set(false);

        let closeDuration = settings.backdropDuration;
        const transform = this.usedZoom
            ? this.computeOrigin(this.store.currentIndex())
            : null;
        if (transform) {
            this.originAnim.set({
                index: this.store.currentIndex(),
                transform,
                stage: 'run',
                closing: true,
            });
            closeDuration = Math.max(
                settings.startAnimationDuration,
                settings.backdropDuration,
            );
        } else {
            this.originAnim.set(null);
            this.zoomFromImage.set(false);
        }

        this.timers.set(() => this.finishClose(), closeDuration + 100);
    }

    private finishClose(): void {
        this.phase.set('closed');
        this.originAnim.set(null);
        this.zoomFromImage.set(false);
        this.useStartClass.set(false);
        this.contentOffsets.set(null);
        this.usedZoom = false;
        if (this.returnFocus?.isConnected) {
            this.returnFocus.focus({ preventScroll: true });
        }
        this.returnFocus = null;
        this.detachOverlay();
        this.emitEvent('afterClose', undefined);
    }

    // ── Body/document state (CSS parity classes; CDK owns scroll lock) ────

    private applyBodyState(settings: CoreSettings): void {
        document.documentElement.classList.add('lg-on');
        if (settings.hideScrollbar) {
            document.body.classList.add('lg-overlay-open');
        }
    }

    private removeBodyState(): void {
        document.documentElement.classList.remove('lg-on');
        document.body.classList.remove('lg-overlay-open');
    }

    // ── Document/window listeners while open ──────────────────────────────

    private bindOpenListeners(settings: CoreSettings): void {
        // ESC close (2.x escKey). Arrow-key navigation and mousewheel land
        // with the keyboard/gesture bindings (plan 004).
        this.keydownListener = (event: KeyboardEvent) => {
            if (this.settings().escKey && event.key === 'Escape') {
                event.preventDefault();
                this.closeGallery();
            }
        };
        document.addEventListener('keydown', this.keydownListener);

        // 2.x containerResize: re-measure the media position and notify.
        this.resizeListener = () => {
            this.contentOffsets.set(this.measureOffsets());
            this.emitEvent('containerResize', {
                index: this.store.currentIndex(),
            });
        };
        window.addEventListener('resize', this.resizeListener);

        this.armHideBars(settings);
    }

    private unbindOpenListeners(): void {
        if (this.keydownListener) {
            document.removeEventListener('keydown', this.keydownListener);
            this.keydownListener = null;
        }
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
        this.clearHideBars();
    }

    /**
     * `hideBarsDelay` idle behavior (2.x `hideBars`): `showBarsAfter` ms
     * after opening, hide the toolbar/controls after `hideBarsDelay` ms of
     * inactivity; any mouse/touch activity on the gallery shows them again.
     */
    private armHideBars(settings: CoreSettings): void {
        if (settings.hideBarsDelay <= 0) {
            return;
        }
        this.hideBarsArmTimer = setTimeout(() => {
            this.hideBarsArmTimer = null;
            const outer = this.outerEl()?.nativeElement;
            if (!outer) {
                return;
            }
            const onActivity = (): void => {
                this.barsHidden.set(false);
                if (this.hideBarsTimer !== null) {
                    clearTimeout(this.hideBarsTimer);
                }
                this.hideBarsTimer = setTimeout(
                    () => this.barsHidden.set(true),
                    this.settings().hideBarsDelay,
                );
            };
            this.activityTarget = outer;
            this.activityListener = onActivity;
            HIDE_BARS_ACTIVITY_EVENTS.forEach((eventName) =>
                outer.addEventListener(eventName, onActivity),
            );
            onActivity();
        }, settings.showBarsAfter);
    }

    private clearHideBars(): void {
        if (this.hideBarsArmTimer !== null) {
            clearTimeout(this.hideBarsArmTimer);
            this.hideBarsArmTimer = null;
        }
        if (this.hideBarsTimer !== null) {
            clearTimeout(this.hideBarsTimer);
            this.hideBarsTimer = null;
        }
        if (this.activityTarget && this.activityListener) {
            const target = this.activityTarget;
            const listener = this.activityListener;
            HIDE_BARS_ACTIVITY_EVENTS.forEach((eventName) =>
                target.removeEventListener(eventName, listener),
            );
        }
        this.activityTarget = null;
        this.activityListener = null;
    }

    // ── Measurements (zoom-from-origin + media position) ──────────────────

    /** Toolbar/caption offsets for media positioning (2.x parity). */
    private measureOffsets(): { top: number; bottom: number } {
        // mediumZoom's override hook arrives with the feature runtime (006).
        if (this.settings().allowMediaOverlap) {
            return { top: 0, bottom: 0 };
        }
        const top = this.toolbarEl()?.nativeElement.clientHeight ?? 0;
        const caption = this.outerEl()?.nativeElement.querySelector<
            HTMLElement
        >('.lg-components .lg-sub-html');
        const bottom =
            this.settings().defaultCaptionHeight ||
            caption?.clientHeight ||
            0;
        return { top, bottom };
    }

    /** Zoom-from-origin rect: `originRect` input or the trigger element. */
    private getOriginRect(index: number): RectLike | null {
        const explicit = this.originRect();
        if (explicit) {
            return explicit;
        }
        const registration = this.runtime.registrations()[index];
        const element = registration?.element;
        if (!element) {
            return null;
        }
        const target = element.querySelector('img') ?? element;
        const rect = target.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
        };
    }

    private computeOrigin(index: number): string | null {
        const settings = this.settings();
        if (!settings.zoomFromOrigin) {
            return null;
        }
        const item = this.items()[index];
        const outer = this.outerEl()?.nativeElement;
        if (!item?.lgSize || !outer) {
            return null;
        }
        const triggerRect = this.getOriginRect(index);
        if (!triggerRect) {
            return null;
        }
        const natural = parseImageSize(item.lgSize, window.innerWidth);
        if (!natural) {
            return null;
        }
        const rect = outer.getBoundingClientRect();
        const containerRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
        };
        const { top, bottom } = this.measureOffsets();
        const imageSize = fitImageSize(
            natural,
            containerRect.width,
            containerRect.height - (top + bottom),
        );
        return getOriginTransform({
            triggerRect,
            containerRect,
            top,
            bottom,
            imageSize,
        });
    }

    // ── Slide transition timeline (2.x makeSlideAnimation) ────────────────

    private onIndexCommit(open: boolean, current: number): void {
        if (!open) {
            this.prevShown = null;
            this.timeline.set({
                shownIndex: current,
                positions: {},
                noTrans: false,
                progressIndex: null,
            });
            return;
        }
        const previous = this.prevShown;
        this.prevShown = current;
        if (previous === null || previous === current) {
            this.timeline.update((tl) => ({ ...tl, shownIndex: current }));
            return;
        }
        if (!this.store.transitioning()) {
            // Index changed without animation (e.g. slides input shrank).
            this.timeline.set({
                shownIndex: current,
                positions: {},
                noTrans: false,
                progressIndex: null,
            });
            return;
        }
        const direction =
            this.store.slideDirection() ??
            (current > previous ? 'next' : 'prev');
        // The fromTouch commit path arrives with the gesture bindings (004).
        this.runTransition(previous, current, direction);
    }

    private runTransition(
        from: number,
        to: number,
        direction: SlideDirection,
    ): void {
        const settings = this.settings();
        const start = (): void => {
            this.timeline.set({
                shownIndex: from,
                positions: {
                    [to]: direction === 'next' ? 'next' : 'prev',
                    [from]: direction === 'next' ? 'prev' : 'next',
                },
                noTrans: true,
                progressIndex: from,
            });
            this.timers.set(() => {
                this.timeline.update((tl) => ({
                    ...tl,
                    shownIndex: to,
                    noTrans: false,
                }));
            }, 50);
            this.timers.set(() => {
                this.timeline.update((tl) => ({
                    ...tl,
                    progressIndex: null,
                }));
                this.store.dispatch({ type: 'TRANSITION_END' });
                this.emitEvent('afterSlide', {
                    index: to,
                    prevIndex: from,
                    fromTouch: false,
                    fromThumb: false,
                });
            }, settings.speed + 100 + settings.slideDelay);
        };
        this.emitEvent('beforeSlide', {
            index: to,
            prevIndex: from,
            fromTouch: false,
            fromThumb: false,
        });
        if (settings.slideDelay > 0) {
            this.timeline.update((tl) => ({ ...tl, progressIndex: from }));
            this.timers.set(start, settings.slideDelay);
        } else {
            start();
        }
    }
}
