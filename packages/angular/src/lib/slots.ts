import { Directive, inject, TemplateRef } from '@angular/core';
import type { GalleryItem } from '@lightgallery/headless';

/** Template context for `*lgCaption` / `<ng-template lgCaption>`. */
export interface LgCaptionContext {
    $implicit: GalleryItem<unknown> | undefined;
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
