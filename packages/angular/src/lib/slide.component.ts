import { NgComponentOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    input,
    signal,
    untracked,
    viewChild,
    type TemplateRef,
    type Type,
} from '@angular/core';
import {
    awaitDecode,
    getPreloadIndexes,
    getSlideType,
    type ImageSize,
} from '@lightgallery/headless';

import { LgCaptionContentComponent } from './caption.component';
import { cx } from './cx';
import { LgIframeSlideComponent } from './iframe-slide.component';
import { LgImageSlideComponent } from './image-slide.component';
import { LgGalleryRuntime } from './runtime';
import { LgSlideWrappersComponent } from './slide-wrappers.component';
import { LightGalleryStore } from './store';
import type { LgGalleryItem } from './types';

/**
 * Zoom-from-origin animation state for the opening/closing slide, mirroring
 * the React outlet's `OriginAnimation`:
 * `init`  — slide parked on the trigger rect, no transition classes yet
 * `armed` — transition classes + duration applied, still on the rect
 * `run`   — animating to identity (or back to the rect when closing)
 */
export interface OriginAnimation {
    index: number;
    transform: string;
    /** Fitted image box the flight lands on (capped at the natural size). */
    imageSize: ImageSize;
    stage: 'init' | 'armed' | 'run';
    closing?: boolean;
}

/**
 * One `.lg-item` (the host element carries the class contract, per the ADR
 * §3 tree). Content mounts lazily (2.x parity): the current slide loads
 * immediately; neighbors within `preload` load once the current slide's
 * media completes; once loaded, a slide keeps its content for as long as it
 * stays in the DOM window. The vanilla CSS shows the loading spinner until
 * `lg-complete` lands.
 */
@Component({
    selector: 'lg-slide',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        LgCaptionContentComponent,
        LgIframeSlideComponent,
        LgImageSlideComponent,
        LgSlideWrappersComponent,
        NgComponentOutlet,
    ],
    host: {
        '[class]': 'hostClasses()',
        '[style.transform]': 'originTransform()',
        '[style.transition-duration]': 'originDuration()',
        '[style.transition-property]': 'originTransitionProperty()',
    },
    template: `
        <ng-template #slideContent>
            @if (renderer(); as rendererCmp) {
            <!-- Feature slide renderer wins (video); ADR §5. -->
            <ng-container
                *ngComponentOutlet="
                    rendererCmp;
                    inputs: rendererInputs();
                    injector: runtime.featureInjector() ?? undefined
                "
            />
            } @else if (slideType() === 'image') {
            <lg-image-slide
                [item]="item()!"
                [index]="index()"
                [dummySrc]="dummySrc()"
                [dummySize]="dummySize()"
                [deferSrc]="deferSrc()"
                (mediaLoad)="onLoad($event)"
                (mediaError)="onError()"
            />
            } @else if (slideType() === 'iframe') {
            <lg-iframe-slide
                [item]="item()!"
                [index]="index()"
                (mediaLoad)="onLoad()"
            />
            }
            <!-- Video items render nothing without the video feature. -->
        </ng-template>
        @if (renderContent()) {
        <lg-slide-wrappers
            [wrappers]="wrappers()"
            [item]="item()!"
            [index]="index()"
            [isCurrent]="isCurrent()"
            [content]="slideContentTpl()"
        />
        } @if (error()) {
        <span class="lg-error-msg">{{
            runtime.settings().strings.mediaLoadingFailed
        }}</span>
        } @if (captionInSlide()) {
        <div class="lg-sub-html">
            <lg-caption-content [item]="item()" [index]="index()" />
        </div>
        }
    `,
})
export class LgSlideComponent {
    readonly index = input.required<number>();
    readonly item = input<LgGalleryItem | undefined>(undefined);
    /** Which slide carries `lg-current` right now (transition timeline). */
    readonly isShown = input(false);
    /** `lg-prev-slide` / `lg-next-slide` assignment from the timeline. */
    readonly position = input<'prev' | 'next' | undefined>(undefined);
    /** Slide carrying `lg-slide-progress` (outgoing slide). */
    readonly inProgress = input(false);
    readonly originAnim = input<OriginAnimation | null>(null);

    private readonly store = inject(LightGalleryStore);
    protected readonly runtime = inject(LgGalleryRuntime);

    protected readonly error = signal(false);
    private readonly sticky = signal(false);
    private appended = false;

    private readonly slideContentTplQuery =
        viewChild.required<TemplateRef<unknown>>('slideContent');
    protected readonly slideContentTpl = computed(() =>
        this.slideContentTplQuery(),
    );

    protected readonly isCurrent = computed(
        () => this.store.currentIndex() === this.index(),
    );

    /** First feature slide renderer that owns this item wins (ADR §5). */
    protected readonly renderer = computed<Type<unknown> | null>(() => {
        const item = this.item();
        if (!item) {
            return null;
        }
        for (const feature of this.runtime.features()) {
            if (feature.slideRenderer?.canRender(item)) {
                return feature.slideRenderer.component;
            }
        }
        return null;
    });
    protected readonly rendererInputs = computed<Record<string, unknown>>(
        () => ({ item: this.item(), index: this.index() }),
    );
    /** slideWrapper chain, features order = outermost-first (React parity). */
    protected readonly wrappers = computed(() =>
        this.runtime
            .features()
            .map((feature) => feature.slots?.slideWrapper)
            .filter((cmp): cmp is Type<unknown> => !!cmp),
    );
    private readonly completed = computed(
        () => this.store.loadedSlides().has(this.index()) || this.error(),
    );
    private readonly inPreloadRange = computed(
        () =>
            getPreloadIndexes(
                this.store.currentIndex(),
                this.runtime.settings().preload,
                this.store.slidesCount(),
            ).indexOf(this.index()) !== -1,
    );
    protected readonly shouldLoad = computed(() => {
        // Sticky content survives `isOpen` flipping false at close-START:
        // the close flight animates this slide back to the thumbnail,
        // and an open-gated unmount would fly an EMPTY item (invisible
        // close). Teardown belongs to the item's own unmount once the
        // close settles (the phase-gated @for) — the moment 2.x empties
        // `$inner`.
        if (this.sticky()) {
            return true;
        }
        if (!this.store.isOpen()) {
            return false;
        }
        const currentLoaded = this.store
            .loadedSlides()
            .has(this.store.currentIndex());
        return this.isCurrent() || (currentLoaded && this.inPreloadRange());
    });
    protected readonly renderContent = computed(
        () => this.shouldLoad() && !!this.item() && !this.error(),
    );
    protected readonly slideType = computed(() => {
        const item = this.item();
        return item ? getSlideType(item) : 'image';
    });
    protected readonly captionInSlide = computed(
        () =>
            this.runtime.settings().captionPosition === 'slide' &&
            this.shouldLoad() &&
            !!this.item(),
    );

    // 2.x first-slide dummy (`getDummyImageContent`): while the
    // zoom-from-origin flight runs, the trigger's already-decoded
    // thumbnail flies enlarged in place of the still-loading image; the
    // real image mounts only once the flight lands and the dummy drops
    // shortly after the load settles (`loadContentOnFirstSlideLoad`).
    protected readonly dummySrc = signal<string | null>(null);
    protected readonly dummySize = signal<ImageSize | null>(null);
    private dummyDone = false;
    private dummyDropTimer: ReturnType<typeof setTimeout> | null = null;
    private destroyed = false;
    /** v2 mounts the real image only once the flight lands. */
    protected readonly deferSrc = computed(() => {
        const anim = this.originAnim();
        return !!this.dummySrc() && !!anim && !anim.closing;
    });

    constructor() {
        // React counterpart: Slide's sticky `shouldLoad` ref — once content
        // mounts it stays for as long as the slide is in the DOM window.
        effect(() => {
            if (this.shouldLoad()) {
                this.sticky.set(true);
            }
        });
        effect(() => {
            const anim = this.originAnim();
            if (
                this.dummyDone ||
                this.dummySrc() ||
                !anim ||
                anim.closing ||
                this.completed() ||
                this.slideType() !== 'image'
            ) {
                return;
            }
            untracked(() => {
                const src = this.runtime.getDummySrc(this.index());
                if (src) {
                    this.dummySrc.set(src);
                    this.dummySize.set(anim.imageSize);
                    this.runtime.firstSlideLoading.set(true);
                } else {
                    this.dummyDone = true;
                }
            });
        });
        effect(() => {
            if (!this.dummySrc() || !this.completed()) {
                return;
            }
            untracked(() => {
                this.dummyDropTimer = setTimeout(() => {
                    this.dummyDone = true;
                    this.dummySrc.set(null);
                    this.runtime.firstSlideLoading.set(false);
                }, 300);
            });
        });
        inject(DestroyRef).onDestroy(() => {
            this.destroyed = true;
            if (this.dummyDropTimer !== null) {
                clearTimeout(this.dummyDropTimer);
            }
            if (this.dummySrc()) {
                this.runtime.firstSlideLoading.set(false);
            }
        });
        // React counterpart: Slide's afterAppendSlide mount effect (2.x
        // afterAppendSlide fired once when the slide's content mounts).
        effect(() => {
            if (this.shouldLoad() && !this.appended) {
                this.appended = true;
                untracked(() => {
                    const index = this.index();
                    this.runtime.emit('afterAppendSlide', { index });
                    if (this.runtime.settings().captionPosition === 'slide') {
                        this.runtime.emit('afterAppendSubHtml', { index });
                    }
                });
            }
        });
    }

    protected onLoad(event?: Event): void {
        const index = this.index();
        if (this.store.loadedSlides().has(index)) {
            return;
        }
        const isFirstSlide = !this.store.galleryOn();
        const complete = (): void => {
            this.store.dispatch({ type: 'SLIDE_LOADED', index });
            const settings = this.runtime.settings();
            this.runtime.emit('slideItemLoad', {
                index,
                delay: isFirstSlide
                    ? (settings.zoomFromOrigin
                          ? settings.startAnimationDuration
                          : settings.backdropDuration) + 10
                    : 0,
                isFirstSlide,
            });
        };
        // Decode gate: `lg-complete` flips only once the browser can
        // paint the FULL image — a loaded-but-undecoded flip paints
        // partially on slow devices. Synchronous when `decode()` is
        // unavailable (the load event already fired); the timeout
        // fallback keeps a stalling decode from stranding the spinner.
        const target = event?.currentTarget ?? event?.target;
        if (
            target instanceof HTMLImageElement &&
            typeof target.decode === 'function'
        ) {
            void awaitDecode(target).then(() => {
                if (!this.destroyed) {
                    complete();
                }
            });
            return;
        }
        complete();
    }

    protected onError(): void {
        this.error.set(true);
        this.store.dispatch({ type: 'SLIDE_ERROR', index: this.index() });
    }

    protected readonly hostClasses = computed(() =>
        cx(
            'lg-item',
            this.isShown() && 'lg-current',
            this.position() === 'prev' && 'lg-prev-slide',
            this.position() === 'next' && 'lg-next-slide',
            this.inProgress() && 'lg-slide-progress',
            this.shouldLoad() && 'lg-loaded',
            this.completed() && 'lg-complete lg-complete_',
            !!this.dummySrc() && 'lg-first-slide',
            this.originClasses(),
        ),
    );

    protected readonly originTransform = computed(() => {
        const anim = this.originAnim();
        if (!anim) {
            return null;
        }
        if (anim.stage === 'init') {
            return anim.transform;
        }
        return anim.stage === 'run' && !anim.closing
            ? 'translate3d(0, 0, 0)'
            : anim.transform;
    });

    protected readonly originDuration = computed(() => {
        const anim = this.originAnim();
        return anim && anim.stage !== 'init'
            ? `${this.runtime.settings().startAnimationDuration}ms`
            : null;
    });

    // The origin transform must LAND, never animate: measuring
    // (computeOrigin) forces a recalc that baselines the item at
    // identity, and the `:not(.lg-start-end-progress)` inherit rule
    // would transition identity → origin — a visible
    // fullscreen→thumbnail shrink before the flight.
    protected readonly originTransitionProperty = computed(() => {
        const anim = this.originAnim();
        return anim && anim.stage === 'init' ? 'none' : null;
    });

    private readonly originClasses = computed(() => {
        const anim = this.originAnim();
        if (!anim || anim.stage === 'init') {
            return false as const;
        }
        return anim.closing
            ? 'lg-start-end-progress'
            : 'lg-start-progress lg-start-end-progress';
    });
}
