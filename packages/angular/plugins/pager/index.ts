import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    signal,
} from '@angular/core';
import { LG_PLUGIN_CONTEXT, type LgFeature } from '@lightgallery/angular';

/** Pager feature (2.x `lg-pager`): dot navigation with thumb popovers. */

export interface PagerSettings {
    /** Enable the pager. */
    pager: boolean;
}

export const pagerSettings: PagerSettings = {
    pager: true,
};

@Component({
    selector: 'lg-pager-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().pager) {
            <div
                class="lg-pager-outer"
                [class.lg-pager-hover]="hover()"
                (mouseover)="onMouseOver()"
                (mouseout)="onMouseOut()"
            >
                @for (item of ctx.items(); track $index) {
                    <span
                        class="lg-pager-cont"
                        [class.lg-pager-active]="$index === currentIndex()"
                        role="button"
                        tabindex="0"
                        [attr.data-lg-item-id]="$index"
                        [attr.aria-label]="'Go to slide ' + ($index + 1)"
                        [attr.aria-current]="$index === currentIndex()"
                        (click)="ctx.actions.goToSlide($index)"
                        (keydown)="onKeydown($event, $index)"
                    >
                        <span class="lg-pager"></span>
                        <div class="lg-pager-thumb-cont">
                            <span class="lg-caret"></span>
                            <img
                                [attr.src]="item.thumb ?? null"
                                [alt]="item.alt ?? ''"
                            />
                        </div>
                    </span>
                }
            </div>
        }
    `,
})
export class LgPagerListComponent {
    protected readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as PagerSettings,
    );
    protected readonly currentIndex = computed(
        () => this.ctx.state().currentIndex,
    );
    protected readonly hover = signal(false);
    private hoverTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        inject(DestroyRef).onDestroy(() => {
            if (this.hoverTimer !== null) {
                clearTimeout(this.hoverTimer);
            }
        });
    }

    protected onMouseOver(): void {
        if (this.hoverTimer !== null) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
        this.hover.set(true);
    }

    protected onMouseOut(): void {
        this.hoverTimer = setTimeout(() => this.hover.set(false), 0);
    }

    protected onKeydown(event: KeyboardEvent, index: number): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.ctx.actions.goToSlide(index);
        }
    }
}

export function withPager(
    options: Partial<PagerSettings> = {},
): LgFeature<PagerSettings> {
    return {
        name: 'pager',
        defaults: pagerSettings,
        options,
        slots: {
            components: LgPagerListComponent,
        },
    };
}
