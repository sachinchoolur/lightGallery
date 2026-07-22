import {
    shallowRef,
    type ComputedRef,
    type InjectionKey,
    type ShallowRef,
    type Slots,
} from 'vue';
import type {
    CoreSettings,
    RectLike,
    TypedEmitter,
} from '@lightgallery/headless';

import type { LgEventMap, LgGalleryItem } from './types';

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
