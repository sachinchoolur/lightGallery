import {
    defineComponent,
    h,
    inject,
    ref,
    watch,
    type Ref,
} from 'vue';
import {
    getFacebookShareLink,
    getPinterestShareLink,
    getTwitterShareLink,
} from '@lightgallery/headless';

import {
    LG_PLUGIN_CONTEXT,
    type LgPluginContext,
    type LgVuePlugin,
} from '../types';
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
    facebook: boolean;
    facebookDropdownText: string;
    twitter: boolean;
    twitterDropdownText: string;
    pinterest: boolean;
    pinterestDropdownText: string;
    /** Extra share options appended after the built-ins. */
    additionalShareOptions: ShareOption[];
    sharePluginStrings: { share: string };
}

export const shareSettings: ShareSettings = {
    share: true,
    facebook: true,
    facebookDropdownText: 'Facebook',
    twitter: true,
    twitterDropdownText: 'Twitter',
    pinterest: true,
    pinterestDropdownText: 'Pinterest',
    additionalShareOptions: [],
    sharePluginStrings: { share: 'Share' },
};

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
                      generateLink: getTwitterShareLink,
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
 * Dropdown open-state shared between the button and the overlay, keyed
 * per gallery instance (the Vue analog of React reading its outer-class
 * string / the Angular per-gallery service). The creator also mirrors the
 * state to the `lg-dropdown-active` outer class.
 */
const shareStates = new WeakMap<LgPluginContext, Ref<boolean>>();
function useShareState(ctx: LgPluginContext): Ref<boolean> {
    let state = shareStates.get(ctx);
    if (!state) {
        state = ref(false);
        shareStates.set(ctx, state);
        watch(state, (active) =>
            ctx.layout.setOuterClass('lg-dropdown-active', active),
        );
    }
    return state;
}

export const ShareButton = defineComponent({
    name: 'LgShareButton',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const active = useShareState(ctx);
        return () => {
            const cfg = ctx.settings.value as unknown as ShareSettings;
            if (!cfg.share) {
                return null;
            }
            const item =
                ctx.items.value[ctx.store.currentIndex.value];
            const currentUrl =
                typeof window !== 'undefined'
                    ? window.location.href
                    : '';
            return [
                h('button', {
                    type: 'button',
                    class: 'lg-share lg-icon',
                    'aria-label': cfg.sharePluginStrings.share,
                    'aria-haspopup': 'true',
                    'aria-expanded': active.value,
                    onClick: () => (active.value = !active.value),
                }),
                // Sibling of the button (vanilla nested it inside, which
                // is invalid interactive nesting); the CSS does not depend
                // on the nesting.
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
                                          h('span', {
                                              class: 'lg-icon',
                                          }),
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
            ];
        };
    },
});

export const ShareOverlay = defineComponent({
    name: 'LgShareOverlay',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const active = useShareState(ctx);
        return () => {
            const cfg = ctx.settings.value as unknown as ShareSettings;
            if (!cfg.share) {
                return null;
            }
            return h('div', {
                class: 'lg-dropdown-overlay',
                onClick: () => (active.value = false),
            });
        };
    },
});

const Share: LgVuePlugin<ShareSettings> = {
    name: 'share',
    defaults: shareSettings,
    slots: {
        toolbar: ShareButton,
        outer: ShareOverlay,
    },
};

export default Share;
