import { ShareOption } from './types';
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
    /**
     * Array of additional share options
     *
     * This can be used to build additional share options.
     * <a href="/demos/share/">Demo</a>
     */
    additionalShareOptions: ShareOption[];
}
export declare const shareSettings: {
    share: boolean;
    facebook: boolean;
    facebookDropdownText: string;
    twitter: boolean;
    twitterDropdownText: string;
    pinterest: boolean;
    pinterestDropdownText: string;
    additionalShareOptions: never[];
};
