export interface ShareSettings {
    /**
     * Enable/Disable share options
     */
    share: boolean;

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
}

export const shareSettings = {
    share: true,
    facebook: true,
    facebookDropdownText: 'Facebook',
    twitter: true,
    twitterDropdownText: 'Twitter',
    pinterest: true,
    pinterestDropdownText: 'Pinterest',
};
