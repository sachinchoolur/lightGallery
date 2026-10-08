/**
 * License key check shared by every package. The key never limits a
 * feature; it only decides which console message, if any, the gallery
 * logs. `checkLicenseKey` is pure; the page-wide key and the once-per-page
 * bookkeeping are module state, and the runtime does the logging.
 */

/** The temporary key; also the default `licenseKey`. */
export const TESTING_LICENSE_KEY = '0000-0000-000-0000';

/** Every lightGallery 3 key starts with this; v1 and v2 keys don't. */
export const LICENSE_KEY_PREFIX = 'LIG';

const LICENSE_DOCS = 'https://www.lightgalleryjs.com/docs/license/';

export interface LicenseNotice {
    level: 'error' | 'warn';
    message: string;
}

/**
 * The console notice for a license key, or `null` for a lightGallery 3
 * key. An empty key is an error; the testing key and keys from v1 or v2
 * (no `LIG` prefix) are warnings.
 */
export function checkLicenseKey(
    licenseKey: string | undefined,
): LicenseNotice | null {
    const key = (licenseKey ?? '').trim();
    if (!key) {
        return {
            level: 'error',
            message: `lightGallery: please provide a valid license key. See ${LICENSE_DOCS}`,
        };
    }
    if (key === TESTING_LICENSE_KEY) {
        return {
            level: 'warn',
            message: `lightGallery: ${key} license key is not valid for production use. See ${LICENSE_DOCS}`,
        };
    }
    if (!key.startsWith(LICENSE_KEY_PREFIX)) {
        return {
            level: 'warn',
            message: `lightGallery: this license key is for v1 or v2 and is not valid for v3. Please upgrade to a v3 license. See ${LICENSE_DOCS}`,
        };
    }
    return null;
}

let pageLicenseKey: string | undefined;
const loggedNotices = new Set<string>();

/**
 * Set the license key once for every gallery on the page. Call it before
 * creating galleries; a gallery's own `licenseKey` still wins.
 */
export function setLicenseKey(licenseKey: string): void {
    pageLicenseKey = licenseKey;
}

/**
 * The key a gallery runs with: its own `licenseKey`, or the page-wide key
 * when it has none (or only the testing default).
 */
export function resolveLicenseKey(instanceKey: string | undefined): string {
    const own = (instanceKey ?? '').trim();
    if (pageLicenseKey !== undefined && (!own || own === TESTING_LICENSE_KEY)) {
        return pageLicenseKey;
    }
    return instanceKey ?? TESTING_LICENSE_KEY;
}

/**
 * The notice a new gallery should log, or `null`. Each message is logged
 * once per page, however many galleries share the key.
 */
export function takeLicenseNotice(
    instanceKey: string | undefined,
): LicenseNotice | null {
    const notice = checkLicenseKey(resolveLicenseKey(instanceKey));
    if (!notice || loggedNotices.has(notice.message)) return null;
    loggedNotices.add(notice.message);
    return notice;
}
