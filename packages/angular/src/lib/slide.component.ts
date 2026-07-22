import { NgComponentOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    signal,
    untracked,
    viewChild,
    type TemplateRef,
    type Type,
} from '@angular/core';
import { getPreloadIndexes, getSlideType } from '@lightgallery/headless';

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
                    (mediaLoad)="onLoad()"
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
        }
        @if (error()) {
            <span class="lg-error-msg">{{
                runtime.settings().strings.mediaLoadingFailed
            }}</span>
        }
        @if (captionInSlide()) {
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

    private readonly slideContentTplQuery = viewChild.required<
        TemplateRef<unknown>
    >('slideContent');
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
        if (!this.store.isOpen()) {
            return false;
        }
        const currentLoaded = this.store
            .loadedSlides()
            .has(this.store.currentIndex());
        return (
            this.sticky() ||
            this.isCurrent() ||
            (currentLoaded && this.inPreloadRange())
        );
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

    constructor() {
        // React counterpart: Slide's sticky `shouldLoad` ref — once content
        // mounts it stays for as long as the slide is in the DOM window.
        effect(() => {
            if (this.shouldLoad()) {
                this.sticky.set(true);
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
                    if (
                        this.runtime.settings().captionPosition === 'slide'
                    ) {
                        this.runtime.emit('afterAppendSubHtml', { index });
                    }
                });
            }
        });
    }

    protected onLoad(): void {
        const index = this.index();
        if (this.store.loadedSlides().has(index)) {
            return;
        }
        const isFirstSlide = !this.store.galleryOn();
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
