import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    untracked,
} from '@angular/core';

import { LgGalleryRuntime } from './runtime';
import type { LgCaptionContext } from './slots';
import type { LgGalleryItem } from './types';

/**
 * Caption content resolution (ADR 0001 §4): the `*lgCaption` slot template
 * wins, then the item's `caption` string; raw HTML only via the explicit
 * `captionHtml` opt-in — rendered with `[innerHTML]`, subject to Angular's
 * sanitizer (documented deviation vs React's `dangerouslySetInnerHTML`).
 */
@Component({
    selector: 'lg-caption-content',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        @if (slot(); as slot) {
            <ng-container
                *ngTemplateOutlet="slot.templateRef; context: context()"
            />
        } @else if (item()?.caption != null) {
            {{ item()?.caption }}
        } @else if (item()?.captionHtml) {
            <div [innerHTML]="item()?.captionHtml"></div>
        }
    `,
})
export class LgCaptionContentComponent {
    readonly item = input<LgGalleryItem | undefined>(undefined);
    readonly index = input.required<number>();

    private readonly runtime = inject(LgGalleryRuntime);
    protected readonly slot = computed(() => this.runtime.slots.caption());
    protected readonly context = computed<LgCaptionContext>(() => ({
        $implicit: this.item(),
        index: this.index(),
    }));
}

function hasCaption(item: LgGalleryItem | undefined): boolean {
    return !!item && (item.caption != null || !!item.captionHtml);
}

/** The caption bar (`.lg-sub-html`) for 'bar' and 'outer' positions. */
@Component({
    selector: 'lg-caption',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LgCaptionContentComponent],
    host: {
        '[class.lg-sub-html]': 'true',
        '[class.lg-empty-html]': 'empty()',
        role: 'status',
        'aria-live': 'polite',
    },
    template: `
        @if (item() && !empty()) {
            <lg-caption-content [item]="item()" [index]="index()" />
        }
    `,
})
export class LgCaptionComponent {
    readonly item = input<LgGalleryItem | undefined>(undefined);
    readonly index = input.required<number>();

    private readonly runtime = inject(LgGalleryRuntime);
    protected readonly empty = computed(
        () => !this.runtime.slots.caption() && !hasCaption(this.item()),
    );

    constructor() {
        // React counterpart: Caption's afterAppendSubHtml effect — fired
        // whenever the caption bar is (re)written for a new index.
        effect(() => {
            const index = this.index();
            untracked(() =>
                this.runtime.emit('afterAppendSubHtml', { index }),
            );
        });
    }
}
