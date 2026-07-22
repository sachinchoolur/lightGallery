import { Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    inject,
    input,
    OnDestroy,
    TemplateRef,
    ViewContainerRef,
    viewChild,
} from '@angular/core';
import type { GalleryItem } from '@lightgallery/headless';

import { LgCaptionDirective } from './slots';
import { LightGalleryStore } from './store';

/**
 * ADR 0001 spike (plans-angular 002): the minimal `<lg-gallery>` proving
 * the architecture — per-instance signals store over the shared headless
 * reducer, CDK Overlay hosting the `lg-*` class contract, an `exportAs`
 * imperative surface, and one typed template slot (`lgCaption`).
 *
 * The full gallery (transitions, windowing, gestures, plugins) grows from
 * this shape in plans 003+ after the ADR sign-off.
 */
@Component({
    selector: 'lg-gallery',
    exportAs: 'lgGallery',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LightGalleryStore],
    imports: [NgTemplateOutlet],
    template: `
        <ng-content />
        <ng-template #galleryTpl>
            <div
                class="lg-container lg-show lg-show-in"
                role="dialog"
                aria-modal="true"
                aria-label="Gallery"
            >
                <div class="lg-backdrop in"></div>
                <div class="lg-outer lg-use-css3 lg-css3 lg-slide lg-visible">
                    <div class="lg-content">
                        <div class="lg-inner">
                            @if (currentItem(); as item) {
                                <div class="lg-item lg-current lg-loaded">
                                    <picture class="lg-img-wrap">
                                        <img
                                            class="lg-object lg-image"
                                            [src]="item.src"
                                            [alt]="item.alt ?? ''"
                                        />
                                    </picture>
                                </div>
                            }
                        </div>
                        <button
                            type="button"
                            class="lg-prev lg-icon"
                            aria-label="Previous slide"
                            (click)="prevSlide()"
                        ></button>
                        <button
                            type="button"
                            class="lg-next lg-icon"
                            aria-label="Next slide"
                            (click)="nextSlide()"
                        ></button>
                    </div>
                    <div class="lg-toolbar lg-group">
                        <button
                            type="button"
                            class="lg-close lg-icon"
                            aria-label="Close gallery"
                            (click)="closeGallery()"
                        ></button>
                        <div class="lg-counter" role="status">
                            <span class="lg-counter-current">
                                {{ store.currentIndex() + 1 }}
                            </span>
                            /
                            <span class="lg-counter-all">
                                {{ store.slidesCount() }}
                            </span>
                        </div>
                    </div>
                    <div class="lg-components">
                        <div class="lg-sub-html" role="status">
                            @if (captionSlot(); as slot) {
                                <ng-container
                                    *ngTemplateOutlet="
                                        slot.templateRef;
                                        context: captionContext()
                                    "
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </ng-template>
    `,
})
export class LgGalleryComponent implements OnDestroy {
    /** The gallery data, typed by the shared headless model. */
    readonly slides = input<GalleryItem<unknown>[]>([]);

    protected readonly store = inject(LightGalleryStore);
    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly galleryTpl =
        viewChild.required<TemplateRef<unknown>>('galleryTpl');
    protected readonly captionSlot = contentChild(LgCaptionDirective);

    private overlayRef: OverlayRef | null = null;

    protected readonly currentItem = computed(
        () => this.slides()[this.store.currentIndex()],
    );
    protected readonly captionContext = computed(() => ({
        $implicit: this.currentItem(),
        index: this.store.currentIndex(),
    }));

    constructor() {
        // React counterpart: the SET_SLIDES_COUNT sync effect in the
        // provider — mirrors the slides input into the reducer.
        effect(() => {
            this.store.setSlidesCount(this.slides().length);
        });
    }

    /** Imperative surface (ADR 0001 §3), mirroring the React ref handle. */
    openGallery(index = 0): void {
        if (this.store.isOpen()) {
            return;
        }
        this.store.open(index);
        this.attachOverlay();
    }

    closeGallery(): void {
        this.store.close();
        this.detachOverlay();
    }

    goToSlide(index: number): void {
        this.store.goTo(index);
    }

    nextSlide(): void {
        this.store.next();
    }

    prevSlide(): void {
        this.store.prev();
    }

    /** Parity with vanilla's public API; updates are input-driven. */
    refresh(): void {}

    ngOnDestroy(): void {
        this.detachOverlay();
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
}
