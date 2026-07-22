import {
    Injectable,
    signal,
    type Injector,
    type Signal,
} from '@angular/core';
import {
    createEmitter,
    type CoreSettings,
    type GalleryAction,
    type PointerRecord,
    type SlideDirection,
    type TypedEmitter,
} from '@lightgallery/headless';

import type { LgFeature, LgPluginContext } from './features';

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
     * loop edges need it); same gating as `goToSlide`.
     */
    navigate(index: number, direction?: SlideDirection): void;
    /** Raw reducer dispatch (feature runtime; React `GalleryActions` parity). */
    dispatch(action: GalleryAction): void;
}

/**
 * The gesture seam plugins consume (ADR 0001 §5), mirroring the React
 * `GestureSeam` field-for-field: the zoom feature (005) claims the lock
 * while pinching/zoom-dragging — core swipe stands down — and reads the
 * live pointer records for its multi-pointer math. Mutable by design: it
 * changes per pointer event and must never trigger change detection.
 */
export interface LgGestureSeam {
    /** Current lock owner; `null` means core swipe/drag may act. */
    lockOwner: 'pinch' | 'zoomSwipe' | null;
    claim(owner: 'pinch' | 'zoomSwipe' | null): void;
    /** Live pointers inside the gallery (multi-pointer bookkeeping). */
    pointers: PointerRecord[];
}

/** Timeline hooks the gesture directive drives on the gallery. */
export interface LgGestureHooks {
    /** Assign prev/next position classes around the current slide (1 render). */
    prepareDrag(): void;
    /** Commit a swipe release to a slide change with fromTouch semantics. */
    commitTouchNavigation(target: number, direction: SlideDirection): void;
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

    /** Assigned by the gallery; consumed by the gesture directive. */
    gestureHooks!: LgGestureHooks;

    /** Registered features, deduped, in `[features]` order (ADR §5). */
    features!: Signal<readonly LgFeature[]>;

    /**
     * Per-gallery feature injector: `LG_FEATURE` multi-providers + every
     * feature's own `providers`, parented on the gallery's node injector.
     * Slot components and slide renderers are created with it.
     */
    readonly featureInjector = signal<Injector | null>(null);

    /** The `LG_PLUGIN_CONTEXT` value; assigned by the gallery constructor. */
    pluginContext!: LgPluginContext;

    readonly gestureSeam: LgGestureSeam = (() => {
        const seam: LgGestureSeam = {
            lockOwner: null,
            claim(owner) {
                seam.lockOwner = owner;
            },
            pointers: [],
        };
        return seam;
    })();

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
