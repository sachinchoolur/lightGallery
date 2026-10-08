import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';

const slides: GalleryItem[] = [{ src: 'a.jpg', alt: 'a' }];

function licenseMessages(spy: ReturnType<typeof vi.spyOn>): string[] {
    return spy.mock.calls
        .map((call: unknown[]) => String(call[0]))
        .filter((message: string) => message.includes('license'));
}

describe('license notice', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('asks a v1 or v2 key to upgrade', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        render(<LightGallery slides={slides} licenseKey="1A2B3C4D-5E6F" />);
        expect(licenseMessages(warn)).toEqual([
            expect.stringContaining('upgrade to a v3 license'),
        ]);
    });

    it('logs nothing for a lightGallery 3 key', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<LightGallery slides={slides} licenseKey="LIG-1234" />);
        expect(licenseMessages(warn)).toEqual([]);
        expect(licenseMessages(error)).toEqual([]);
    });
});
