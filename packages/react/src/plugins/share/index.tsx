import { useEffect, useRef, type ReactElement } from 'react';
import {
    canNativeShare,
    consumeBackdropPress,
    getFacebookShareLink,
    getPinterestShareLink,
    getSharePayload,
    getXShareLink,
    shareDefaultIcons,
} from '@lightgallery/headless';

import { useGalleryInternal, useGalleryState } from '../../context';
import { cx } from '../../cx';
import { useCustomIcons, type CustomIconResult } from '../../icons';
import { usePluginSettings } from '../runtime';
import type { GalleryItem } from '../../types';
import type { LgPlugin } from '../types';

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
    generateLink: (item: GalleryItem, currentUrl: string) => string;
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

function ShareButton(): ReactElement | null {
    const shareIcon = useCustomIcons(['share'], shareDefaultIcons);
    const socialIcons: Record<string, CustomIconResult> = {
        'lg-share-facebook': useCustomIcons(
            ['shareFacebook'],
            shareDefaultIcons,
        ),
        'lg-share-twitter': useCustomIcons(['shareX'], shareDefaultIcons),
        'lg-share-pinterest': useCustomIcons(
            ['sharePinterest'],
            shareDefaultIcons,
        ),
    };
    const state = useGalleryState();
    const internal = useGalleryInternal();
    const settings = usePluginSettings<ShareSettings>();
    const outerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    // The open state lives on the outer element, which outlives a close:
    // without this an open dropdown would still be open on the next open.
    const { layout } = internal;
    useEffect(() => {
        if (!state.open) {
            layout.setOuterClass('lg-dropdown-active', false);
        }
    }, [state.open, layout]);
    const active =
        internal.pluginOuterClassNames.includes('lg-dropdown-active');
    // While open, the dropdown dismisses like the More options menu: on a
    // press anywhere outside it, on Escape (the gallery stays open) and
    // when focus tabs out of it.
    useEffect(() => {
        const outer = outerRef.current;
        if (!active || !outer) {
            return;
        }
        const close = (returnFocus: boolean) => {
            layout.setOuterClass('lg-dropdown-active', false);
            if (returnFocus) {
                buttonRef.current?.focus();
            }
        };
        const onPointerDown = (event: Event) => {
            const target = event.target as Node | null;
            if (target && outer.contains(target)) {
                return;
            }
            consumeBackdropPress(event);
            close(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
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
            const focusable = Array.from(
                outer.querySelectorAll<HTMLElement>('button, a[href]'),
            );
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
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true);
            document.removeEventListener('keydown', onKeyDown, true);
        };
    }, [active, layout]);
    if (!settings.share) {
        return null;
    }
    const item = internal.items[state.currentIndex];
    const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';
    const toggle = () => layout.setOuterClass('lg-dropdown-active', !active);
    // Web Share hybrid: try the OS sheet first where preferred and
    // available; the dropdown stays rendered as the automatic fallback.
    const nativeFirst =
        (settings.preferNativeShare ?? isTouchDevice()) &&
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
        toggle();
    };
    // Button and dropdown share a wrapper: it is the dropdown's
    // positioning context, so the menu hangs under the control that opened
    // it (nesting the list inside the button would be invalid).
    return (
        <div ref={outerRef} className="lg-share-outer">
            <button
                ref={buttonRef}
                type="button"
                aria-label={
                    settings.sharePluginStrings?.share ?? settings.strings.share
                }
                aria-haspopup={nativeFirst ? undefined : 'true'}
                aria-expanded={nativeFirst ? undefined : active}
                className={cx('lg-share lg-icon', shareIcon.className)}
                onClick={onClick}
            >
                {shareIcon.content}
            </button>
            <ul className="lg-dropdown" style={{ position: 'absolute' }}>
                {item &&
                    getShareOptions(settings).map((option, index) => (
                        <li key={index}>
                            <a
                                className={option.className}
                                rel="noopener"
                                target="_blank"
                                href={option.generateLink(item, currentUrl)}
                            >
                                <span
                                    className={cx(
                                        'lg-icon',
                                        socialIcons[option.className ?? '']
                                            ?.className,
                                    )}
                                >
                                    {
                                        socialIcons[option.className ?? '']
                                            ?.content
                                    }
                                </span>
                                <span className="lg-dropdown-text">
                                    {option.text}
                                </span>
                            </a>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

const Share: LgPlugin<ShareSettings> = {
    name: 'share',
    defaults: shareSettings,
    slots: {
        toolbar: ShareButton,
    },
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        share: Partial<ShareSettings>;
    }
}

export default Share;
