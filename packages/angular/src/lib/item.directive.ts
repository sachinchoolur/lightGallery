import {
    computed,
    Directive,
    ElementRef,
    inject,
    input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { LgGalleryRuntime, type LgItemRegistration } from './runtime';
import type { LgGalleryItem } from './types';

/**
 * Uncontrolled-mode trigger: put it on the thumbnail anchors
 * projected into `<lg-gallery>`; clicking opens the gallery at the trigger's
 * slide. Registration (mount) order defines slide order — the same caveat as
 * the React `<LightGalleryItem>` registry. The host element doubles as the
 * zoom-from-origin measurement target (the first `<img>` inside it, falling
 * back to the element itself). On an anchor without an `href`, the directive
 * links it to `item.src` so it stays keyboard-focusable and still opens the
 * image with scripts off.
 */
@Directive({
    selector: '[lgGalleryItem]',
    exportAs: 'lgGalleryItem',
    host: {
        '(click)': 'onClick($event)',
        '[attr.href]': 'resolvedHref()',
    },
})
export class LgGalleryItemDirective implements OnInit, OnDestroy {
    /** The slide this trigger opens (also the item data in uncontrolled mode). */
    readonly lgGalleryItem = input.required<LgGalleryItem>();
    /** Link target; an anchor host falls back to the item's `src`. */
    readonly href = input<string | null | undefined>(undefined);

    private readonly runtime = inject(LgGalleryRuntime);
    private readonly registration: LgItemRegistration = {
        item: () => this.lgGalleryItem(),
        element: inject(ElementRef).nativeElement as HTMLElement,
    };
    private readonly isAnchor = this.registration.element.tagName === 'A';
    protected readonly resolvedHref = computed(
        () =>
            this.href() ??
            (this.isAnchor ? this.lgGalleryItem().src : undefined) ??
            null,
    );
    private unregister: (() => void) | null = null;

    ngOnInit(): void {
        this.unregister = this.runtime.registerItem(this.registration);
    }

    ngOnDestroy(): void {
        this.unregister?.();
        this.unregister = null;
    }

    protected onClick(event: Event): void {
        if (event.defaultPrevented) {
            return;
        }
        event.preventDefault();
        const index = this.runtime.getItemIndex(this.registration);
        if (index >= 0) {
            this.runtime.actions.openGallery(index);
        }
    }
}
