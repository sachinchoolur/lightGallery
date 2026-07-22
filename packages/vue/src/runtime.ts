import {
    shallowRef,
    type ComputedRef,
    type InjectionKey,
    type ShallowRef,
    type Slots,
} from 'vue';
import type {
    CoreSettings,
    PointerRecord,
    RectLike,
    TypedEmitter,
} from '@lightgallery/headless';

import type { LgEventMap, LgGalleryItem } from './types';
import type { LgPluginContext, LgVuePlugin } from './plugins/types';

/**
 * The gesture seam plugins consume (ADR 0001 §5), mirroring the sibling
 * tracks' field-for-field: the zoom plugin (005) claims the lock while
 * pinching/zoom-dragging — core swipe stands down — and reads the live
 * pointer records for its multi-pointer math. Mutable by design: it
 * changes per pointer event and must never touch reactivity.
 */
export interface LgGestureSeam {
    /** Current lock owner; `null` means core swipe/drag may act. */
    lockOwner: 'pinch' | 'zoomSwipe' | null;
    claim(owner: 'pinch' | 'zoomSwipe' | null): void;
    /** Live pointers inside the gallery (multi-pointer bookkeeping). */
    pointers: PointerRecord[];
}

export function createGestureSeam(): LgGestureSeam {
    const seam: LgGestureSeam = {
        lockOwner: null,
        claim(owner) {
            seam.lockOwner = owner;
        },
        pointers: [],
    };
    return seam;
}

/** One `<LgItem>` trigger registration (uncontrolled mode). */
export interface LgItemRegistration {
    /** Reads the trigger's current item data. */
    readonly item: () => LgGalleryItem;
    element: HTMLElement | null;
}

/**
 * Per-gallery-instance plumbing shared between `<LightGallery>` and its
 * inner components (ADR 0001 §2/§5) — the Vue expression of the sibling
 * tracks' split contexts. Assembled by `<LightGallery>`'s setup and
 * provided under `LG_RUNTIME`.
 */
export interface LgGalleryRuntime {
    readonly items: ComputedRef<readonly LgGalleryItem[]>;
    readonly settings: ComputedRef<CoreSettings>;
    /** The plugin/core event bus (shared headless emitter, ADR §5). */
    readonly events: TypedEmitter<LgEventMap>;
    /** Emits the matching kebab-case component event AND the bus event. */
    emit<K extends keyof LgEventMap>(name: K, detail: LgEventMap[K]): void;
    /** Uncontrolled trigger registry (mount order = slide order). */
    readonly registrations: ShallowRef<readonly LgItemRegistration[]>;
    registerItem(registration: LgItemRegistration): () => void;
    getItemIndex(registration: LgItemRegistration): number;
    /** Zoom-from-origin rect: `originRect` prop or the trigger element. */
    getOriginRect(index: number): RectLike | null;
    /** Multi-pointer seam (consumed by the zoom plugin). */
    readonly gestureSeam: LgGestureSeam;
    /** Registered plugins, deduped, in `:plugins` order (ADR §5). */
    readonly plugins: ComputedRef<readonly LgVuePlugin[]>;
    /** The context plugin `setup(ctx)` receives; also injectable. */
    readonly pluginContext: LgPluginContext;
}

export const LG_RUNTIME: InjectionKey<LgGalleryRuntime> =
    Symbol('lgRuntime');

/**
 * The gallery's own slots, provided so nested components (caption bar,
 * slide-position captions) can render the `#caption` scoped slot without
 * prop-drilling vnode arrays.
 */
export const LG_SLOTS: InjectionKey<Slots> = Symbol('lgSlots');

/** Registration-list helper shared by the runtime implementation. */
export function createRegistrationList(): {
    registrations: ShallowRef<readonly LgItemRegistration[]>;
    register(registration: LgItemRegistration): () => void;
    indexOf(registration: LgItemRegistration): number;
} {
    const registrations = shallowRef<readonly LgItemRegistration[]>([]);
    return {
        registrations,
        register(registration) {
            registrations.value = [...registrations.value, registration];
            return () => {
                registrations.value = registrations.value.filter(
                    (entry) => entry !== registration,
                );
            };
        },
        indexOf(registration) {
            return registrations.value.indexOf(registration);
        },
    };
}
