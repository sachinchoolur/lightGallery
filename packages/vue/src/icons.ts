import {
    defineComponent,
    h,
    inject,
    type Component,
    type InjectionKey,
    type PropType,
    type Ref,
    type VNode,
} from 'vue';

/**
 * Custom icons (`:icons` prop): consumers supply an SVG component or raw
 * SVG string per icon name and the gallery renders it instead of the
 * font glyph. The `lg-icon-custom` class suppresses the glyph; the
 * shared vanilla CSS sizes the SVG and, for state-pair buttons, toggles
 * which of the two provided icons is visible (`lg-inline`,
 * `lg-show-autoplay`, `lg-fullscreen-on` — the same states that swapped
 * the glyphs).
 */

import type { LgIconName } from '@lightgallery/headless';

export type { LgIconName };

/** An SVG component, or raw SVG markup (vanilla parity). */
export type LgIcon = Component | string;

export type LgIcons = Partial<Record<LgIconName, LgIcon>>;

/** Provided by the root so plugin components resolve the same icons. */
export const LG_ICONS: InjectionKey<Ref<LgIcons | undefined>> =
    Symbol('lgIcons');

const toKebab = (name: string): string =>
    name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

export interface ResolvedCustomIcons {
    /** `'lg-icon-custom'` — goes on the button's class list. */
    cls: string;
    /** Wrapped icon nodes to render inside the button. */
    children: VNode[];
}

/**
 * Resolve a button's icon content: the consumer's `:icons` entries when
 * they answer every requested name, else the built-in SVG defaults the
 * call site passes (each entry imports its own group from headless, so
 * a plugin's icons ship in its bundle). State pairs pass both names in
 * [default-state, active-state] order — a half-answered pair falls back
 * whole so no state ends up with a mismatched pair.
 */
export function resolveCustomIcons(
    icons: LgIcons | undefined,
    names: LgIconName[],
    defaults?: Partial<Record<LgIconName, string>>,
): ResolvedCustomIcons | null {
    const source =
        icons && names.every((name) => icons[name])
            ? icons
            : defaults && names.every((name) => defaults[name])
              ? defaults
              : null;
    if (!source) {
        return null;
    }
    return {
        cls: 'lg-icon-custom',
        children: names.map((name) => {
            const icon = source[name]!;
            const attrs = {
                class: `lg-ci lg-ci-${toKebab(name)}`,
                'aria-hidden': 'true',
            };
            return typeof icon === 'string'
                ? h('span', { ...attrs, innerHTML: icon })
                : h('span', attrs, [h(icon)]);
        }),
    };
}

/** Template-friendly renderer for the root SFC's own buttons. */
export const LgCi = defineComponent({
    name: 'LgCi',
    props: {
        names: {
            type: Array as PropType<LgIconName[]>,
            required: true,
        },
        defaults: {
            type: Object as PropType<Partial<Record<LgIconName, string>>>,
            default: undefined,
        },
    },
    setup(props) {
        const icons = inject(LG_ICONS, undefined);
        return () =>
            resolveCustomIcons(icons?.value, props.names, props.defaults)
                ?.children ?? null;
    },
});
