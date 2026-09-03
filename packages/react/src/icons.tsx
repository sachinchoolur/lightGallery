import type { ReactNode } from 'react';

import { useGallerySlots } from './context';

/**
 * Custom icon slot (`render.icon`): consumers return SVG nodes per icon
 * name and the gallery renders them instead of the font glyphs. The
 * `lg-icon-custom` class suppresses the glyph; the shared vanilla CSS
 * sizes the SVG and, for state-pair buttons, toggles which of the two
 * provided icons is visible (`lg-inline`, `lg-show-autoplay`,
 * `lg-fullscreen-on` — the same states that swapped the glyphs).
 */

import type { LgIconName } from '@lightgallery/headless';

export type { LgIconName };

const toKebab = (name: string): string =>
    name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

export interface CustomIconResult {
    /** `'lg-icon-custom'` when the icon(s) apply, else `false` (for cx). */
    className: string | false;
    /** Wrapped icon nodes to render inside the button, else `null`. */
    content: ReactNode;
}

/**
 * Resolve a button's icon content: the `render.icon` slot when it
 * answers every requested name, else the built-in SVG defaults the call
 * site passes (each entry imports its own group from headless, so a
 * plugin's icons ship in its bundle). State pairs pass both names in
 * [default-state, active-state] order — a half-answered pair falls back
 * whole so no state ends up with a mismatched pair.
 */
export function useCustomIcons(
    names: LgIconName[],
    defaults?: Partial<Record<LgIconName, string>>,
): CustomIconResult {
    const slots = useGallerySlots();
    const icon = slots.icon;
    const nodes = icon ? names.map((name) => icon(name)) : [];
    if (
        icon &&
        nodes.every((node) => node !== undefined && node !== null)
    ) {
        return {
            className: 'lg-icon-custom',
            content: names.map((name, index) => (
                <span
                    key={name}
                    className={`lg-ci lg-ci-${toKebab(name)}`}
                    aria-hidden="true"
                >
                    {nodes[index]}
                </span>
            )),
        };
    }
    if (defaults && names.every((name) => defaults[name])) {
        return {
            className: 'lg-icon-custom',
            content: names.map((name) => (
                <span
                    key={name}
                    className={`lg-ci lg-ci-${toKebab(name)}`}
                    aria-hidden="true"
                    // Vendored static asset strings, not user input.
                    dangerouslySetInnerHTML={{ __html: defaults[name]! }}
                />
            )),
        };
    }
    return { className: false, content: null };
}
