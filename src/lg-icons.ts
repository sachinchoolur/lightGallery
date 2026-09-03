/**
 * Icon injection: the gallery's icons are inline SVG strings — built-in
 * defaults (registered by the core and by each plugin, so a plugin's
 * icons ship in its own bundle) merged under the consumer's
 * `settings.icons` overrides. One generic pass over the built structure —
 * every icon button (core and plugins alike) is an empty classed element
 * by the end of `buildStructure`, so a name→selector table covers them
 * all without touching the individual templates.
 *
 * State-pair buttons (maximize/minimize, autoplay play/pause, fullscreen
 * enter/exit) render BOTH icons of the pair; state classes (`lg-inline`,
 * `lg-show-autoplay`, `lg-fullscreen-on`) toggle their visibility in
 * CSS. A consumer override applies only when it answers every name of a
 * pair — a half-provided pair keeps the defaults so no state ends up
 * iconless.
 */

import type { LgIconName } from '@lightgallery/headless';

export type { LgIconName };

/** SVG markup per icon; omitted names keep the built-in glyph. */
export type LgIcons = Partial<Record<LgIconName, string>>;

interface IconTarget {
    /** Selector within the gallery container. */
    selector: string;
    /** One name, or a state pair in [default-state, active-state] order. */
    names: LgIconName[];
}

// The dropdown lives INSIDE the share button, and future markup may nest
// too — injection always PREPENDS, never replaces the element's HTML.
const ICON_TARGETS: IconTarget[] = [
    { selector: '.lg-close', names: ['close'] },
    { selector: '.lg-prev', names: ['prev'] },
    { selector: '.lg-next', names: ['next'] },
    { selector: '.lg-download', names: ['download'] },
    // Shown while `.lg-inline` (prompting maximize) / after maximizing.
    { selector: '.lg-maximize', names: ['maximize', 'minimize'] },
    // The actual-size button's CLASS toggles between the two zoom
    // classes as the zoom state changes (2.x swapped the glyph that
    // way) — it carries BOTH zoom icons and the class picks one in
    // CSS. Listed before the class-based zoom targets so the id match
    // claims it first (the pass skips already-processed elements).
    { selector: '[id^="lg-actual-size-"]', names: ['zoomIn', 'zoomOut'] },
    { selector: '.lg-zoom-in', names: ['zoomIn'] },
    { selector: '.lg-zoom-out', names: ['zoomOut'] },
    // No '.lg-actual-size' target: vanilla's actual-size BUTTON never
    // carries that class (it rides the zoom classes above; the outer
    // gets `lg-actual-size` as a zoom-state class after build). The
    // `actualSize` name serves the framework ports' static button.
    { selector: '.lg-rotate-left', names: ['rotateLeft'] },
    { selector: '.lg-rotate-right', names: ['rotateRight'] },
    { selector: '.lg-flip-hor', names: ['flipHorizontal'] },
    { selector: '.lg-flip-ver', names: ['flipVertical'] },
    { selector: '.lg-share', names: ['share'] },
    { selector: '.lg-share-facebook .lg-icon', names: ['shareFacebook'] },
    { selector: '.lg-share-twitter .lg-icon', names: ['shareX'] },
    { selector: '.lg-share-pinterest .lg-icon', names: ['sharePinterest'] },
    // Shown while idle (prompting play) / while `.lg-show-autoplay`.
    {
        selector: '.lg-autoplay-button',
        names: ['autoplayPlay', 'autoplayPause'],
    },
    // Shown while windowed / while `.lg-fullscreen-on`.
    { selector: '.lg-fullscreen', names: ['fullscreen', 'fullscreenExit'] },
    { selector: '.lg-comment-toggle', names: ['comment'] },
    { selector: '.lg-comment-close', names: ['commentClose'] },
    { selector: '.lg-toggle-thumb', names: ['toggleThumbnails'] },
];

const toKebab = (name: string): string =>
    name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** `<span class="lg-ci lg-ci-<kebab-name>">svg</span>` wrapper markup. */
function getCustomIconMarkup(icons: LgIcons, names: LgIconName[]): string {
    if (!names.every((name) => icons[name])) {
        return '';
    }
    return names
        .map(
            (name) =>
                `<span class="lg-ci lg-ci-${toKebab(
                    name,
                )}" aria-hidden="true">${icons[name]}</span>`,
        )
        .join('');
}

/**
 * Inject the gallery's icons into the built structure: per target, the
 * consumer's overrides apply when they answer every name (pairs must be
 * complete), else the registered defaults render. Elements keep their
 * classes and listeners — the icons are prepended children.
 */
export function applyCustomIcons(
    container: HTMLElement,
    defaults: LgIcons,
    overrides: LgIcons | undefined,
): void {
    ICON_TARGETS.forEach(({ selector, names }) => {
        const source =
            overrides && names.every((name) => overrides[name])
                ? overrides
                : defaults;
        const markup = getCustomIconMarkup(source, names);
        if (!markup) {
            return;
        }
        container.querySelectorAll(selector).forEach((element) => {
            if (element.classList.contains('lg-icon-custom')) {
                return;
            }
            element.classList.add('lg-icon-custom');
            element.insertAdjacentHTML('afterbegin', markup);
        });
    });
}
