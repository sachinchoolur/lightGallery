import { HashDriverPreference } from '@lightgallery/headless';

export interface HashSettings {
    /**
     * Enable/Disable hash option
     */
    hash: boolean;

    /**
     * URL engine behind the hash syncing.
     * @description 'auto' uses the Navigation API where the browser
     * supports it and falls back to the History API everywhere else;
     * 'history' and 'navigation' force an engine (an unsupported
     * 'navigation' quietly falls back — the enhancement is never
     * load-bearing). The deep-link URL format is identical either way.
     * See <a href="/docs/v3/hash-drivers/">Hash drivers</a>.
     * @version V3.0.0
     */
    hashDriver: HashDriverPreference;

    /**
     * Unique id for each gallery.
     * @description It is mandatory when you use hash plugin for multiple galleries on the same page.
     */
    galleryId: string;

    /**
     * Custom slide name to use in the url when hash plugin is enabled
     */
    customSlideName: boolean;
}

export const hashSettings: HashSettings = {
    hash: true,
    hashDriver: 'auto',
    galleryId: '1',
    customSlideName: false,
};
