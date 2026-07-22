import { Directive, inject, TemplateRef } from '@angular/core';

import type { LgGalleryItem } from './types';

/** Template context for `*lgCaption` / `<ng-template lgCaption>`. */
export interface LgCaptionContext {
    $implicit: LgGalleryItem | undefined;
    index: number;
}

/**
 * Caption slot (ADR 0001 §4): the Angular expression of the React
 * `render.caption` render prop — a typed template the gallery renders in
 * the caption bar with the current item as context.
 */
@Directive({
    selector: 'ng-template[lgCaption]',
})
export class LgCaptionDirective {
    readonly templateRef = inject(TemplateRef<LgCaptionContext>);

    static ngTemplateContextGuard(
        _dir: LgCaptionDirective,
        _ctx: unknown,
    ): _ctx is LgCaptionContext {
        return true;
    }
}

/** Template context for `<ng-template lgCounter>`. */
export interface LgCounterContext {
    /** One-based current slide number. */
    $implicit: number;
    total: number;
}

/** Counter slot (ADR 0001 §4): replaces the default `1 / 10` markup. */
@Directive({
    selector: 'ng-template[lgCounter]',
})
export class LgCounterDirective {
    readonly templateRef = inject(TemplateRef<LgCounterContext>);

    static ngTemplateContextGuard(
        _dir: LgCounterDirective,
        _ctx: unknown,
    ): _ctx is LgCounterContext {
        return true;
    }
}

/** Prev-button content slot (ADR 0001 §4); empty template context. */
@Directive({
    selector: 'ng-template[lgPrevButton]',
})
export class LgPrevButtonDirective {
    readonly templateRef = inject(TemplateRef<unknown>);
}

/** Next-button content slot (ADR 0001 §4); empty template context. */
@Directive({
    selector: 'ng-template[lgNextButton]',
})
export class LgNextButtonDirective {
    readonly templateRef = inject(TemplateRef<unknown>);
}
