import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    TemplateRef,
    viewChild,
    type Type,
} from '@angular/core';

import type { LgSlideWrapperInputs } from './features';
import { LgGalleryRuntime } from './runtime';
import type { LgGalleryItem } from './types';

/**
 * Renders a slide's content through the feature `slideWrapper` chain (ADR
 * §5), first feature = outermost — the recursive Angular expression of the
 * React runtime's `wrapSlideContent` reduceRight. Each wrapper component
 * receives {@link LgSlideWrapperInputs}; the tail of the chain arrives as
 * the `content` template of the head wrapper.
 */
@Component({
    selector: 'lg-slide-wrappers',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgComponentOutlet, NgTemplateOutlet],
    template: `
        @if (head(); as head) {
            <ng-container
                *ngComponentOutlet="
                    head;
                    inputs: headInputs();
                    injector: runtime.featureInjector() ?? undefined
                "
            />
            <ng-template #restTpl>
                <lg-slide-wrappers
                    [wrappers]="rest()"
                    [item]="item()"
                    [index]="index()"
                    [isCurrent]="isCurrent()"
                    [content]="content()"
                />
            </ng-template>
        } @else {
            <ng-container [ngTemplateOutlet]="content()" />
        }
    `,
})
export class LgSlideWrappersComponent {
    readonly wrappers = input.required<readonly Type<unknown>[]>();
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    readonly isCurrent = input(false);
    /** The innermost slide content (image/video/iframe renderer). */
    readonly content = input.required<TemplateRef<unknown>>();

    protected readonly runtime = inject(LgGalleryRuntime);

    private readonly restTpl =
        viewChild<TemplateRef<unknown>>('restTpl');

    protected readonly head = computed(() => this.wrappers()[0] ?? null);
    protected readonly rest = computed(() => this.wrappers().slice(1));

    protected readonly headInputs = computed<Record<string, unknown>>(() => {
        const inputs: LgSlideWrapperInputs = {
            item: this.item(),
            index: this.index(),
            isCurrent: this.isCurrent(),
            // The rest of the chain renders inside this wrapper.
            content: (this.restTpl() ?? this.content()) as TemplateRef<unknown>,
        };
        return inputs as unknown as Record<string, unknown>;
    });
}
