import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, setLicenseKey, type GalleryItem } from './index';

const slides: GalleryItem[] = [{ src: 'a.jpg', alt: 'a' }];

function licenseMessages(spy: ReturnType<typeof vi.spyOn>): string[] {
    return spy.mock.calls
        .map((call: unknown[]) => String(call[0]))
        .filter((message: string) => message.includes('license'));
}

describe('setLicenseKey', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('logs the testing-key warning once for several galleries', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        render(
            <>
                <LightGallery slides={slides} />
                <LightGallery slides={slides} />
            </>,
        );
        expect(licenseMessages(warn)).toHaveLength(1);
    });

    it('covers galleries without their own key once set', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        setLicenseKey('LIG-1234');
        render(<LightGallery slides={slides} />);
        expect(licenseMessages(warn)).toEqual([]);
    });
});
