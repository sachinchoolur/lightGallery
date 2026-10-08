import {
    canNativeShare,
    consumeBackdropPress,
    getSharePayload,
    shareDefaultIcons,
} from '@lightgallery/headless';

import { ShareSettings, shareSettings } from './lg-share-settings';

import { getFacebookShareLink } from './lg-fb-share-utils';
import { getTwitterShareLink } from './lg-twitter-share-utils';
import { getPinterestShareLink } from './lg-pinterest-share-utils';
import { LightGallery } from '../../lightgallery';
import { lGEvents } from '../../lg-events';
import { ShareOption } from './types';

/** Web Share default: the OS sheet is where sharing shines on touch devices. */
function isTouchDevice(): boolean {
    return (
        typeof window !== 'undefined' &&
        (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)
    );
}

interface DefaultShareOptions extends ShareOption {
    type: string;
}
export default class Share {
    core: LightGallery;
    settings: ShareSettings;
    private shareOptions: ShareOption[] = [];
    private listening = false;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin instance
        this.core = instance;

        // extend module default settings with lightGallery core settings
        this.settings = { ...shareSettings, ...this.core.settings };
        return this;
    }

    public init(): void {
        this.core.registerDefaultIcons(shareDefaultIcons);
        if (!this.settings.share) {
            return;
        }
        this.shareOptions = [
            ...this.getDefaultShareOptions(),
            ...this.settings.additionalShareOptions,
        ];
        this.setLgShareMarkup();
        this.core.outer
            .find('.lg-share-outer .lg-dropdown')
            .append(this.getShareListHtml());

        this.core.LGel.on(
            `${lGEvents.afterSlide}.share`,
            this.onAfterSlide.bind(this),
        );
        this.core.LGel.on(`${lGEvents.beforeClose}.share`, () => {
            this.setDropdownOpen(false);
        });
    }

    private getShareListHtml() {
        let shareHtml = '';
        this.shareOptions.forEach((shareOption) => {
            shareHtml += shareOption.dropdownHTML;
        });

        return shareHtml;
    }

    /**
     * True when the button should try the OS share sheet first. The
     * dropdown stays rendered as the automatic fallback (a `canShare`
     * veto or share failure at click time falls back to the menu).
     */
    private prefersNativeShare(): boolean {
        const preferNative = this.settings.preferNativeShare ?? isTouchDevice();
        return (
            preferNative &&
            typeof navigator !== 'undefined' &&
            typeof navigator.share === 'function'
        );
    }

    setLgShareMarkup(): void {
        const popupAttrs = this.prefersNativeShare()
            ? ''
            : 'aria-haspopup="true" aria-expanded="false"';
        this.core.$toolbar.append(
            `<div class="lg-share-outer"><button type="button" aria-label="${
                this.settings.sharePluginStrings?.share ??
                this.core.settings.strings.share
            }" ${popupAttrs} class="lg-share lg-icon"></button>
                <ul class="lg-dropdown" style="position: absolute;"></ul></div>`,
        );

        const $shareButton = this.core.outer.find('.lg-share');
        $shareButton.first().on('click.lg', () => {
            if (this.prefersNativeShare()) {
                const payload = getSharePayload(
                    this.core.galleryItems[this.core.index],
                    window.location.href,
                );
                if (canNativeShare(navigator, payload)) {
                    // Rejection = the user dismissed the sheet (AbortError)
                    // or the OS refused, nothing to clean up either way.
                    navigator.share(payload).catch(() => undefined);
                    return;
                }
            }
            this.setDropdownOpen(
                !this.core.outer.hasClass('lg-dropdown-active'),
            );
        });
    }

    /**
     * Open state lives on the outer element, which outlives a close, so an
     * open dropdown would still be open on the next open. While open, the
     * dropdown dismisses like the More options menu: on a press anywhere
     * outside it, on Escape (the gallery stays open) and when focus tabs
     * out of it.
     */
    private setDropdownOpen(open: boolean): void {
        if (open) {
            this.core.outer.addClass('lg-dropdown-active');
        } else {
            this.core.outer.removeClass('lg-dropdown-active');
        }
        this.core.outer
            .find('.lg-share')
            .first()
            .attr('aria-expanded', open ? 'true' : 'false');
        this.listenOutside(open);
    }

    private listenOutside(on: boolean): void {
        if (on === this.listening) {
            return;
        }
        this.listening = on;
        if (on) {
            document.addEventListener(
                'pointerdown',
                this.onDocumentPointerDown,
                true,
            );
            document.addEventListener('keydown', this.onDocumentKeydown, true);
        } else {
            document.removeEventListener(
                'pointerdown',
                this.onDocumentPointerDown,
                true,
            );
            document.removeEventListener(
                'keydown',
                this.onDocumentKeydown,
                true,
            );
        }
    }

    private readonly onDocumentPointerDown = (event: Event): void => {
        const target = event.target as Node | null;
        const shareOuter = this.core.outer.find('.lg-share-outer').get();
        if (target && shareOuter && shareOuter.contains(target)) {
            return;
        }
        consumeBackdropPress(event);
        this.setDropdownOpen(false);
    };

    private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            // The dropdown is the topmost layer: Escape closes it, not
            // the gallery behind it.
            event.preventDefault();
            event.stopPropagation();
            this.setDropdownOpen(false);
            this.core.outer.find('.lg-share').get()?.focus();
            return;
        }
        if (event.key !== 'Tab') {
            return;
        }
        // Tabbing between the button and its links keeps the dropdown;
        // tabbing out of it closes it.
        const shareOuter = this.core.outer.find('.lg-share-outer').get();
        const focusable = shareOuter
            ? Array.from(
                  shareOuter.querySelectorAll<HTMLElement>('button, a[href]'),
              )
            : [];
        const index = focusable.indexOf(document.activeElement as HTMLElement);
        if (
            index !== -1 &&
            (event.shiftKey ? index === 0 : index === focusable.length - 1)
        ) {
            this.setDropdownOpen(false);
        }
    };

    private onAfterSlide(event: CustomEvent) {
        const { index } = event.detail;
        const currentItem = this.core.galleryItems[index];
        setTimeout(() => {
            this.shareOptions.forEach((shareOption) => {
                const selector = shareOption.selector;
                this.core.outer
                    .find(selector)
                    .attr('href', shareOption.generateLink(currentItem));
            });
        }, 100);
    }

    private getShareListItemHTML(type: string, text: string): string {
        return `<li><a class="lg-share-${type}" rel="noopener" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">${text}</span></a></li>`;
    }

    private getDefaultShareOptions(): DefaultShareOptions[] {
        return [
            ...(this.settings.facebook
                ? [
                      {
                          type: 'facebook',
                          generateLink: getFacebookShareLink,
                          dropdownHTML: this.getShareListItemHTML(
                              'facebook',
                              this.settings.facebookDropdownText,
                          ),
                          selector: '.lg-share-facebook',
                      },
                  ]
                : []),
            ...(this.settings.twitter
                ? [
                      {
                          type: 'twitter',
                          generateLink: getTwitterShareLink,
                          dropdownHTML: this.getShareListItemHTML(
                              'twitter',
                              this.settings.twitterDropdownText,
                          ),
                          selector: '.lg-share-twitter',
                      },
                  ]
                : []),
            ...(this.settings.pinterest
                ? [
                      {
                          type: 'pinterest',
                          generateLink: getPinterestShareLink,
                          dropdownHTML: this.getShareListItemHTML(
                              'pinterest',
                              this.settings.pinterestDropdownText,
                          ),
                          selector: '.lg-share-pinterest',
                      },
                  ]
                : []),
        ];
    }

    public destroy(): void {
        this.listenOutside(false);
        this.core.outer.find('.lg-share-outer').remove();
        this.core.LGel.off('.lg.share');
        this.core.LGel.off('.share');
    }
}
