/**
 * Customer logos, in order of global recognition. The files live in /images/customer-logos and render as CSS
 * masks, so they take the strip's colour.
 *
 * - `wide` puts a long wordmark in the flatter box.
 * - `zoom` evens out optical weight: square marks shrink, long wordmarks
 *   less so. Files with a tight viewBox scale from their aspect ratio;
 *   the older, padded canvases carry hand-tuned values.
 * - `img` renders the file directly when it is a filled shape with
 *   knocked-out detail, which a mask would turn into a solid block.
 */
export type LogoGroup = 'tech' | 'auto' | 'finance' | 'media' | 'health';

export interface CustomerLogo {
    file: string;
    name: string;
    group: LogoGroup;
    wide: boolean;
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
    { file: 'apple.svg', name: 'Apple', group: 'tech', wide: false, zoom: 0.8, img: false },
    { file: 'sony.svg', name: 'Sony', group: 'tech', wide: true, zoom: 0.73, img: false },
    { file: 'toyota.svg', name: 'Toyota', group: 'auto', wide: false, zoom: 0.57, img: false },
    { file: 'bankofamerica.svg', name: 'Bank of America', group: 'finance', wide: false, zoom: 0.52, img: false },
    { file: 'uber.svg', name: 'Uber', group: 'tech', wide: false, zoom: 0.57, img: false },
    { file: 'nbc.svg', name: 'NBCUniversal', group: 'media', wide: false, zoom: 0.54, img: false },
    { file: 'sap-mono.svg', name: 'SAP', group: 'tech', wide: false, zoom: 0.62, img: false },
    { file: 'accenture-logo.svg', name: 'Accenture', group: 'finance', wide: false, zoom: 1.3, img: false },
    { file: 'deloitte.svg', name: 'Deloitte', group: 'finance', wide: true, zoom: 0.71, img: false },
    { file: 'ey.svg', name: 'EY', group: 'finance', wide: false, zoom: 0.66, img: false },
    { file: 'pwc.svg', name: 'PwC', group: 'finance', wide: false, zoom: 1.0, img: false },
    { file: 'Hyundai-Logo.svg', name: 'Hyundai', group: 'auto', wide: true, zoom: 0.8, img: false },
    { file: 'volvo.svg', name: 'Volvo', group: 'auto', wide: true, zoom: 0.82, img: false },
    { file: 'kia.svg', name: 'Kia', group: 'auto', wide: true, zoom: 0.62, img: false },
    { file: 'johndeere.svg', name: 'John Deere', group: 'auto', wide: false, zoom: 0.6, img: false },
    { file: 'hilton.svg', name: 'Hilton', group: 'media', wide: false, zoom: 0.6, img: false },
    { file: 'decathlon.svg', name: 'Decathlon', group: 'media', wide: true, zoom: 0.8, img: false },
    { file: 'chickfila.svg', name: 'Chick-fil-A', group: 'media', wide: false, zoom: 0.64, img: false },
    { file: 'Vogue-logo.svg', name: 'Vogue', group: 'media', wide: false, zoom: 1.1, img: false },
    { file: 'sega.svg', name: 'SEGA', group: 'tech', wide: false, zoom: 0.62, img: false },
    { file: 'ericsson.svg', name: 'Ericsson', group: 'tech', wide: false, zoom: 0.61, img: false },
    { file: 'airtel-logo.svg', name: 'Airtel', group: 'tech', wide: true, zoom: 0.72, img: false },
    { file: 'zurich.svg', name: 'Zurich Insurance', group: 'finance', wide: true, zoom: 0.74, img: false },
    { file: 'medtronic.svg', name: 'Medtronic', group: 'health', wide: true, zoom: 0.76, img: false },
    { file: 'abbvie.svg', name: 'AbbVie', group: 'health', wide: false, zoom: 0.57, img: false },
    { file: 'aflac.svg', name: 'Aflac', group: 'finance', wide: false, zoom: 0.66, img: false },
    { file: 'generali.svg', name: 'Generali', group: 'finance', wide: true, zoom: 0.72, img: false },
    { file: 'staples.svg', name: 'Staples', group: 'media', wide: true, zoom: 0.8, img: false },
    { file: 'mozilla.svg', name: 'Mozilla', group: 'tech', wide: false, zoom: 0.63, img: false },
    { file: 'oxford.svg', name: 'University of Oxford', group: 'health', wide: true, zoom: 0.72, img: false },
];
