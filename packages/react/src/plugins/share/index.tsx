import { type ReactElement } from 'react';
import {
    getFacebookShareLink,
    getPinterestShareLink,
    getTwitterShareLink,
} from '@lightgallery/headless';

import {
    useGalleryInternal,
    useGalleryState,
} from '../../context';
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

function ShareButton(): ReactElement | null {
    const state = useGalleryState();
    const internal = useGalleryInternal();
    const settings = usePluginSettings<ShareSettings>();
    if (!settings.share) {
        return null;
    }
    const item = internal.items[state.currentIndex];
    const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';
    const active = internal.pluginOuterClassNames.includes(
        'lg-dropdown-active',
    );
    const toggle = () =>
        internal.layout.setOuterClass('lg-dropdown-active', !active);
    return (
        <button
            type="button"
            aria-label={settings.sharePluginStrings.share}
            aria-haspopup="true"
            aria-expanded={active}
            className="lg-share lg-icon"
            onClick={toggle}
        >
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
                                <span className="lg-icon" />
                                <span className="lg-dropdown-text">
                                    {option.text}
                                </span>
                            </a>
                        </li>
                    ))}
            </ul>
        </button>
    );
}

function ShareOverlay(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<ShareSettings>();
    if (!settings.share) {
        return null;
    }
    return (
        <div
            className="lg-dropdown-overlay"
            onClick={() =>
                internal.layout.setOuterClass('lg-dropdown-active', false)
            }
        />
    );
}

const Share: LgPlugin<ShareSettings> = {
    name: 'share',
    defaults: shareSettings,
    slots: {
        toolbar: ShareButton,
        outer: ShareOverlay,
    },
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        share: Partial<ShareSettings>;
    }
}

export default Share;
