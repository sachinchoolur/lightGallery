import { Injectable, signal, type Signal } from '@angular/core';
import {
    createEmitter,
    type CoreSettings,
    type SlideDirection,
    type TypedEmitter,
} from '@lightgallery/headless';

import type {
    LgCaptionDirective,
    LgCounterDirective,
    LgNextButtonDirective,
    LgPrevButtonDirective,
} from './slots';
import type { LgEventMap, LgGalleryHandle, LgGalleryItem } from './types';

/** One `[lgGalleryItem]` trigger registration (uncontrolled mode). */
export interface LgItemRegistration {
    /** Reads the trigger's current item data (a signal-backed input). */
    readonly item: () => LgGalleryItem;
    readonly element: HTMLElement;
}

/** Actions consumed by inner components and trigger directives. */
export interface LgGalleryActions extends LgGalleryHandle {
    /**
     * Internal: navigate with an explicit direction (gesture releases at the
     * loop edges need it — plan 004); same gating as `goToSlide`.
     */
    navigate(index: number, direction?: SlideDirection): void;
}

/** Template slots discovered by the gallery via content queries (ADR §4). */
export interface LgGallerySlots {
    caption: Signal<LgCaptionDirective | undefined>;
    counter: Signal<LgCounterDirective | undefined>;
    prevButton: Signal<LgPrevButtonDirective | undefined>;
    nextButton: Signal<LgNextButtonDirective | undefined>;
}

/**
 * Per-gallery-instance plumbing shared between `<lg-gallery>` and its inner
 * components/directives — the Angular analog of the React track's split
 * contexts (ADR 0001 §2/§3). Provided alongside `LightGalleryStore` on the
 * gallery component; the component assigns the late-bound fields once in its
 * constructor (single writer).
 */
@Injectable()
export class LgGalleryRuntime {
    /**
     * The plugin/core event bus (ADR 0001 §5) — the shared headless emitter.
     * Outputs fan out from the same events via `emit`.
     */
    readonly events: TypedEmitter<LgEventMap> = createEmitter<LgEventMap>();

    /** Resolved settings (headless merge order). Assigned by the gallery. */
    settings!: Signal<CoreSettings>;

    /** The gallery data: `slides` input or trigger registrations, in order. */
    items!: Signal<readonly LgGalleryItem[]>;

    slots!: LgGallerySlots;

    /** Emits the matching output AND the bus event (ADR 0001 §5). */
    emit!: <K extends keyof LgEventMap>(
        name: K,
        detail: LgEventMap[K],
    ) => void;

    actions!: LgGalleryActions;

    // Uncontrolled trigger registry — registration (mount) order defines
    // slide order, same caveat as the React `<LightGalleryItem>` registry.
    private readonly registrationsSignal = signal<LgItemRegistration[]>([]);
    readonly registrations = this.registrationsSignal.asReadonly();

    registerItem(registration: LgItemRegistration): () => void {
        this.registrationsSignal.update((prev) => [...prev, registration]);
        return () => {
            this.registrationsSignal.update((prev) =>
                prev.filter((entry) => entry !== registration),
            );
        };
    }

    getItemIndex(registration: LgItemRegistration): number {
        return this.registrationsSignal().indexOf(registration);
    }
}
