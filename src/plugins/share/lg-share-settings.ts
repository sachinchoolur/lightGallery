import { ShareOption } from './types';

export interface ShareStrings {
    share: string;
}

export interface ShareSettings {
    /**
     * Enable/Disable share options
     */
    share: boolean;

    /**
     * Prefer the OS share sheet (`navigator.share`) over the dropdown menu
     * when the browser supports it. The share button then opens the native
     * sheet with the slide's URL (per-item `shareUrl`, falling back to the
     * network share URLs, then the page URL); the dropdown remains as the
     * automatic fallback. URL-sharing only — the image file itself is never
     * attached.
     * @description Defaults to true on touch devices and false on desktop,
     * where the branded dropdown is kept for consistency.
     * See <a href="/docs/web-share/">Web Share</a>.
     * @version V3.0.0
     */
    preferNativeShare?: boolean;

    /**
     * Enable Facebook share.
     */
    facebook: boolean;

    /**
     * Facebook dropdown text.
     */
    facebookDropdownText: string;

    /**
     * Enable twitter share.
     */
    twitter: boolean;

    /**
     * Twitter dropdown text
     */
    twitterDropdownText: string;

    /**
     * Enable pinterest share.
     */
    pinterest: boolean;

    /**
     * Pinterest dropdown text

     */
    pinterestDropdownText: string;

    /**
     * Array of additional share options
     *
     * This can be used to build additional share options.
     * <a href="/demos/share/">Demo</a>
     */
    additionalShareOptions: ShareOption[];

    /**
     * Custom translation strings for aria-labels
     * @deprecated Set these labels on the core `strings` object instead —
     * every user-facing string lives in that one contract. An explicitly set
     * key here still wins (alias).
     */
    sharePluginStrings?: Partial<ShareStrings>;
}

export const shareSettings = {
    share: true,
    facebook: true,
    facebookDropdownText: 'Facebook',
    twitter: true,
    twitterDropdownText: 'X',
    pinterest: true,
    pinterestDropdownText: 'Pinterest',
    additionalShareOptions: [],
};
