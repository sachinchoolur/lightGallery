import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, setLicenseKey } from './index';
import type { LgGalleryItem } from './types';

const ITEMS: LgGalleryItem[] = [{ src: 'a.jpg', alt: 'a' }];

enableAutoUnmount(afterEach);

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
        mount(LightGallery, {
            props: { slides: ITEMS },
            attachTo: document.body,
        });
        mount(LightGallery, {
            props: { slides: ITEMS },
            attachTo: document.body,
        });
        expect(licenseMessages(warn)).toHaveLength(1);
    });

    it('covers galleries without their own key once set', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        setLicenseKey('LIG-1234');
        mount(LightGallery, {
            props: { slides: ITEMS },
            attachTo: document.body,
        });
        expect(licenseMessages(warn)).toEqual([]);
    });
});
