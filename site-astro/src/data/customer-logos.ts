/**
 * Customer logos, in order of global recognition. The files live in /images/customer-logos and render as CSS
 * masks, so they take the strip's colour.
 *
 * - `wide` puts a long wordmark in the flatter box.
 * - `ratio` is the ink's width over its height. Every file's viewBox is
 *   cropped to the ink, so this is also the file's aspect ratio; the
 *   trusted-by strip sizes and groups logos by it.
 * - `zoom` evens out optical weight: square marks shrink, long wordmarks
 *   less so.
 * - `img` renders the file directly when it is a filled shape with
 *   knocked-out detail, which a mask would turn into a solid block.
 */
export type LogoGroup = 'tech' | 'auto' | 'finance' | 'media' | 'health';

export interface CustomerLogo {
    file: string;
    name: string;
    group: LogoGroup;
    wide: boolean;
    ratio: number;
    zoom: number;
    img: boolean;
}

export const LOGO_GROUPS: { key: LogoGroup; name: string }[] = [
    { key: 'tech', name: 'Technology' },
    { key: 'auto', name: 'Automotive' },
    { key: 'finance', name: 'Finance & consulting' },
    { key: 'media', name: 'Media & retail' },
    { key: 'health', name: 'Health & education' },
];

export const LOGOS: CustomerLogo[] = [
    { file: 'apple.svg', name: 'Apple', group: 'tech', wide: false, ratio: 0.81, zoom: 0.8, img: false },
    { file: 'sony.svg', name: 'Sony', group: 'tech', wide: true, ratio: 5.69, zoom: 0.73, img: false },
    { file: 'toyota.svg', name: 'Toyota', group: 'auto', wide: false, ratio: 1.47, zoom: 0.57, img: false },
    { file: 'bankofamerica.svg', name: 'Bank of America', group: 'finance', wide: false, ratio: 1.84, zoom: 0.52, img: false },
    { file: 'uber.svg', name: 'Uber', group: 'tech', wide: false, ratio: 2.98, zoom: 0.57, img: false },
    { file: 'nbc.svg', name: 'NBCUniversal', group: 'media', wide: false, ratio: 1.62, zoom: 0.54, img: false },
    { file: 'sap-mono.svg', name: 'SAP', group: 'tech', wide: false, ratio: 2.02, zoom: 0.62, img: false },
    { file: 'accenture-logo.svg', name: 'Accenture', group: 'finance', wide: false, ratio: 3.79, zoom: 1.0, img: false },
    { file: 'deloitte.svg', name: 'Deloitte', group: 'finance', wide: true, ratio: 5.35, zoom: 0.71, img: false },
    { file: 'ey.svg', name: 'EY', group: 'finance', wide: false, ratio: 0.99, zoom: 0.66, img: false },
    { file: 'pwc.svg', name: 'PwC', group: 'finance', wide: false, ratio: 3.05, zoom: 0.76, img: false },
    { file: 'Hyundai-Logo.svg', name: 'Hyundai', group: 'auto', wide: true, ratio: 7.27, zoom: 0.8, img: false },
    { file: 'volvo.svg', name: 'Volvo', group: 'auto', wide: true, ratio: 7.56, zoom: 0.8, img: false },
    { file: 'johndeere.svg', name: 'John Deere', group: 'auto', wide: false, ratio: 1.11, zoom: 0.6, img: false },
    { file: 'hilton.svg', name: 'Hilton', group: 'media', wide: false, ratio: 2.69, zoom: 0.6, img: false },
    { file: 'decathlon.svg', name: 'Decathlon', group: 'media', wide: true, ratio: 6.66, zoom: 0.8, img: false },
    { file: 'Vogue-logo.svg', name: 'Vogue', group: 'media', wide: false, ratio: 3.6, zoom: 0.77, img: false },
    { file: 'sega.svg', name: 'SEGA', group: 'tech', wide: false, ratio: 0.77, zoom: 0.62, img: false },
    { file: 'ericsson.svg', name: 'Ericsson', group: 'tech', wide: false, ratio: 0.74, zoom: 0.61, img: false },
    { file: 'zurich.svg', name: 'Zurich Insurance', group: 'finance', wide: true, ratio: 4.33, zoom: 0.74, img: false },
    { file: 'medtronic.svg', name: 'Medtronic', group: 'health', wide: true, ratio: 6.09, zoom: 0.76, img: false },
    { file: 'abbvie.svg', name: 'AbbVie', group: 'health', wide: false, ratio: 1.47, zoom: 0.57, img: false },
    { file: 'mozilla.svg', name: 'Mozilla', group: 'tech', wide: false, ratio: 0.85, zoom: 0.63, img: false },
    { file: 'oxford.svg', name: 'University of Oxford', group: 'health', wide: true, ratio: 3.35, zoom: 0.72, img: false },
];
