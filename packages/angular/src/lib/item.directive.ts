import {
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
 * Uncontrolled-mode trigger (ADR 0001 §3): put it on the thumbnail anchors
 * projected into `<lg-gallery>`; clicking opens the gallery at the trigger's
 * slide. Registration (mount) order defines slide order — the same caveat as
 * the React `<LightGalleryItem>` registry. The host element doubles as the
 * zoom-from-origin measurement target (the first `<img>` inside it, falling
 * back to the element itself).
 */
@Directive({
    selector: '[lgGalleryItem]',
    exportAs: 'lgGalleryItem',
    host: {
        '(click)': 'onClick($event)',
    },
})
export class LgGalleryItemDirective implements OnInit, OnDestroy {
    /** The slide this trigger opens (also the item data in uncontrolled mode). */
    readonly lgGalleryItem = input.required<LgGalleryItem>();

    private readonly runtime = inject(LgGalleryRuntime);
    private readonly registration: LgItemRegistration = {
        item: () => this.lgGalleryItem(),
        element: inject(ElementRef).nativeElement as HTMLElement,
    };
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
