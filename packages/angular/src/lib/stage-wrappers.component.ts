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

import type { LgSlidesWrapperInputs } from './features';
import { LgGalleryRuntime } from './runtime';
import type { OriginAnimation } from './slide.component';

/**
 * Renders the slide list (`.lg-inner`) through the feature `slidesWrapper`
 * chain (ADR §5), first feature = outermost — the React runtime's
 * `wrapSlides` reduceRight. Each wrapper receives
 * {@link LgSlidesWrapperInputs}: the opening or closing slide's
 * `originAnim`, and the rest of the chain as its `content` template.
 */
@Component({
    selector: 'lg-stage-wrappers',
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
            <lg-stage-wrappers
                [wrappers]="rest()"
                [originAnim]="originAnim()"
                [content]="content()"
            />
        </ng-template>
        } @else {
        <ng-container [ngTemplateOutlet]="content()" />
        }
    `,
})
export class LgStageWrappersComponent {
    readonly wrappers = input.required<readonly Type<unknown>[]>();
    readonly originAnim = input<OriginAnimation | null>(null);
    /** The slide list itself. */
    readonly content = input.required<TemplateRef<unknown>>();

    protected readonly runtime = inject(LgGalleryRuntime);

    private readonly restTpl = viewChild<TemplateRef<unknown>>('restTpl');

    protected readonly head = computed(() => this.wrappers()[0] ?? null);
    protected readonly rest = computed(() => this.wrappers().slice(1));

    protected readonly headInputs = computed<Record<string, unknown>>(() => {
        const inputs: LgSlidesWrapperInputs = {
            originAnim: this.originAnim(),
            // The rest of the chain renders inside this wrapper.
            content: (this.restTpl() ?? this.content()) as TemplateRef<unknown>,
        };
        return inputs as unknown as Record<string, unknown>;
    });
}
