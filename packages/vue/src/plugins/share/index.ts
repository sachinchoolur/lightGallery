import {
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    ref,
    watch,
    type Ref,
} from 'vue';
import {
    canNativeShare,
    consumeBackdropPress,
    getFacebookShareLink,
    getPinterestShareLink,
    getSharePayload,
    getXShareLink,
    shareDefaultIcons,
} from '@lightgallery/headless';

import {
    LG_PLUGIN_CONTEXT,
    type LgPluginContext,
    type LgVuePlugin,
} from '../types';
import { LG_ICONS, resolveCustomIcons } from '../../icons';
import type { LgGalleryItem } from '../../types';

/**
 * Share plugin (2.x `lg-share`): toolbar dropdown with per-slide share
 * links. Migration difference vs 2.x (documented): `additionalShareOptions`
 * takes typed `{ text, className, generateLink }` objects instead of raw
 * `dropdownHTML` strings.
 */

export interface ShareOption {
    /** Dropdown label. */
    text: string;
    /** Class for the icon `<span>` (e.g. `lg-share-facebook`). */
    className?: string;
    generateLink: (item: LgGalleryItem, currentUrl: string) => string;
}

export interface ShareSettings {
    /** Enable the share button. */
    share: boolean;
    /**
     * Prefer the OS share sheet (`navigator.share`) over the dropdown menu
     * when the browser supports it (URL-sharing only — the image file is
     * never attached; the dropdown remains the automatic fallback).
     * Defaults to true on touch devices, false on desktop.
     */
    preferNativeShare?: boolean;
    facebook: boolean;
    facebookDropdownText: string;
    twitter: boolean;
    twitterDropdownText: string;
    pinterest: boolean;
    pinterestDropdownText: string;
    /** Extra share options appended after the built-ins. */
    additionalShareOptions: ShareOption[];
    /**
     * @deprecated Set these labels on the core `strings` object instead —
     * an explicitly set key here still wins (alias).
     */
    sharePluginStrings?: { share?: string };
}

export const shareSettings: ShareSettings = {
    share: true,
    facebook: true,
    facebookDropdownText: 'Facebook',
    twitter: true,
    twitterDropdownText: 'X',
    pinterest: true,
    pinterestDropdownText: 'Pinterest',
    additionalShareOptions: [],
};

/** Web Share default: the OS sheet is where sharing shines on touch devices. */
function isTouchDevice(): boolean {
    return (
        typeof window !== 'undefined' &&
        (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)
    );
}

function getShareOptions(settings: ShareSettings): ShareOption[] {
    return [
        ...(settings.facebook
            ? [
                  {
                      text: settings.facebookDropdownText,
                      className: 'lg-share-facebook',
                      generateLink: getFacebookShareLink,
                  },
              ]
            : []),
        ...(settings.twitter
            ? [
                  {
                      text: settings.twitterDropdownText,
                      className: 'lg-share-twitter',
                      generateLink: getXShareLink,
                  },
              ]
            : []),
        ...(settings.pinterest
            ? [
                  {
                      text: settings.pinterestDropdownText,
                      className: 'lg-share-pinterest',
                      generateLink: getPinterestShareLink,
                  },
              ]
            : []),
        ...settings.additionalShareOptions,
    ];
}

/**
 * Dropdown open state, keyed per gallery instance (the Vue analog of
 * React reading its outer-class string / the Angular per-gallery
 * service). The creator also mirrors the state to the
 * `lg-dropdown-active` outer class.
 */
const shareStates = new WeakMap<LgPluginContext, Ref<boolean>>();
function useShareState(ctx: LgPluginContext): Ref<boolean> {
    let state = shareStates.get(ctx);
    if (!state) {
        state = ref(false);
        shareStates.set(ctx, state);
        const open = state;
        watch(state, (active) =>
            ctx.layout.setOuterClass('lg-dropdown-active', active),
        );
        // The state outlives a close, so an open dropdown would still be
        // open on the next open.
        watch(
            () => ctx.store.isOpen.value,
            (isOpen) => {
                if (!isOpen) {
                    open.value = false;
                }
            },
        );
    }
    return state;
}

export const ShareButton = defineComponent({
    name: 'LgShareButton',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const lgIcons = inject(LG_ICONS, undefined);
        const active = useShareState(ctx);
        const outerEl = ref<HTMLElement | null>(null);
        const buttonEl = ref<HTMLElement | null>(null);
        const close = (returnFocus: boolean) => {
            active.value = false;
            if (returnFocus) {
                buttonEl.value?.focus();
            }
        };
        const onPointerDown = (event: Event) => {
            const target = event.target as Node | null;
            if (target && outerEl.value?.contains(target)) {
                return;
            }
            consumeBackdropPress(event);
            close(false);
        };
        const onKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                // The dropdown is the topmost layer: Escape closes it,
                // not the gallery behind it.
                event.preventDefault();
                event.stopPropagation();
                close(true);
                return;
            }
            if (event.key !== 'Tab') {
                return;
            }
            // Tabbing between the button and its links keeps the
            // dropdown; tabbing out of it closes it.
            const focusable = outerEl.value
                ? Array.from(
                      outerEl.value.querySelectorAll<HTMLElement>(
                          'button, a[href]',
                      ),
                  )
                : [];
            const index = focusable.indexOf(
                document.activeElement as HTMLElement,
            );
            if (
                index !== -1 &&
                (event.shiftKey ? index === 0 : index === focusable.length - 1)
            ) {
                close(false);
            }
        };
        // While open, the dropdown dismisses like the More options menu:
        // on a press anywhere outside it, on Escape (the gallery stays
        // open) and when focus tabs out of it.
        let listening = false;
        const listenOutside = (on: boolean) => {
            if (on === listening) {
                return;
            }
            listening = on;
            if (on) {
                document.addEventListener('pointerdown', onPointerDown, true);
                document.addEventListener('keydown', onKeydown, true);
            } else {
                document.removeEventListener(
                    'pointerdown',
                    onPointerDown,
                    true,
                );
                document.removeEventListener('keydown', onKeydown, true);
            }
        };
        watch(active, listenOutside, { immediate: true });
        onBeforeUnmount(() => listenOutside(false));
        return () => {
            const cfg = ctx.settings.value as unknown as ShareSettings;
            if (!cfg.share) {
                return null;
            }
            const item = ctx.items.value[ctx.store.currentIndex.value];
            const currentUrl =
                typeof window !== 'undefined' ? window.location.href : '';
            // Web Share hybrid: try the OS sheet first where preferred and
            // available; the dropdown stays rendered as the fallback.
            const nativeFirst =
                (cfg.preferNativeShare ?? isTouchDevice()) &&
                typeof navigator !== 'undefined' &&
                typeof navigator.share === 'function';
            const onClick = () => {
                if (nativeFirst && item) {
                    const payload = getSharePayload(item, currentUrl);
                    if (canNativeShare(navigator, payload)) {
                        // Rejection = user dismissed the sheet (AbortError).
                        navigator.share(payload).catch(() => undefined);
                        return;
                    }
                }
                active.value = !active.value;
            };
            const socialIcons: Record<
                string,
                ReturnType<typeof resolveCustomIcons>
            > = {
                'lg-share-facebook': resolveCustomIcons(
                    lgIcons?.value,
                    ['shareFacebook'],
                    shareDefaultIcons,
                ),
                'lg-share-twitter': resolveCustomIcons(
                    lgIcons?.value,
                    ['shareX'],
                    shareDefaultIcons,
                ),
                'lg-share-pinterest': resolveCustomIcons(
                    lgIcons?.value,
                    ['sharePinterest'],
                    shareDefaultIcons,
                ),
            };
            // Button and dropdown share a wrapper: it is the dropdown's
            // positioning context, so the menu hangs under the control
            // that opened it (nesting the list inside the button would be
            // invalid).
            return h('div', { class: 'lg-share-outer', ref: outerEl }, [
                h(
                    'button',
                    {
                        ref: buttonEl,
                        type: 'button',
                        class: [
                            'lg-share lg-icon',
                            resolveCustomIcons(
                                lgIcons?.value,
                                ['share'],
                                shareDefaultIcons,
                            )?.cls,
                        ],
                        'aria-label':
                            cfg.sharePluginStrings?.share ??
                            ctx.settings.value.strings.share,
                        'aria-haspopup': nativeFirst ? undefined : 'true',
                        'aria-expanded': nativeFirst ? undefined : active.value,
                        onClick,
                    },
                    resolveCustomIcons(
                        lgIcons?.value,
                        ['share'],
                        shareDefaultIcons,
                    )?.children,
                ),
                h(
                    'ul',
                    {
                        class: 'lg-dropdown',
                        style: { position: 'absolute' },
                    },
                    item
                        ? getShareOptions(cfg).map((option, index) =>
                              h('li', { key: index }, [
                                  h(
                                      'a',
                                      {
                                          class: option.className,
                                          rel: 'noopener',
                                          target: '_blank',
                                          href: option.generateLink(
                                              item,
                                              currentUrl,
                                          ),
                                      },
                                      [
                                          h(
                                              'span',
                                              {
                                                  class: [
                                                      'lg-icon',
                                                      socialIcons[
                                                          option.className ?? ''
                                                      ]?.cls,
                                                  ],
                                              },
                                              socialIcons[
                                                  option.className ?? ''
                                              ]?.children,
                                          ),
                                          h(
                                              'span',
                                              {
                                                  class: 'lg-dropdown-text',
                                              },
                                              option.text,
                                          ),
                                      ],
                                  ),
                              ]),
                          )
                        : [],
                ),
            ]);
        };
    },
});

const Share: LgVuePlugin<ShareSettings> = {
    name: 'share',
    defaults: shareSettings,
    slots: {
        toolbar: ShareButton,
    },
};

export default Share;
