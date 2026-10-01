import { setLicenseKey } from '@lightgallery/headless';

import { LightGallerySettings } from './lg-settings';
import { LightGallery } from './lightgallery';

function lightGallery(
    el: HTMLElement,
    options?: LightGallerySettings,
): LightGallery {
    return new LightGallery(el, options);
}
/**
 * Set the license key once for every gallery on the page, before creating
 * them. A gallery's own `licenseKey` still wins.
 * See <a href="/docs/license/">License</a>.
 */
lightGallery.setLicenseKey = setLicenseKey;
export default lightGallery;
export type { LightGallery };
export type { LgIconName, LgIcons } from './lg-icons';
