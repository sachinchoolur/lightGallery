/**
 * lightGallery.setLicenseKey: one key for every gallery on the page, and
 * each license notice logged once per page.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';

function mount(settings = {}): void {
    const host = document.createElement('div');
    host.innerHTML = '<a href="a.png"><img src="a-t.png" alt="a" /></a>';
    document.body.appendChild(host);
    lightGallery(host, settings).destroy();
}

function licenseMessages(spy: jest.SpyInstance): string[] {
    return spy.mock.calls
        .map((call) => String(call[0]))
        .filter((message) => message.includes('license'));
}

describe('page-wide license key', () => {
    let warn: jest.SpyInstance;
    beforeEach(() => {
        warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });
    afterEach(() => {
        warn.mockRestore();
    });

    it('logs the testing-key warning once for several galleries', () => {
        mount();
        mount();
        mount();
        expect(licenseMessages(warn)).toHaveLength(1);
    });

    it('covers galleries without their own key once set', () => {
        lightGallery.setLicenseKey('LIG-C20C35AE-0180-47D2-BEA7-33B98A2332B2');
        mount();
        mount();
        expect(licenseMessages(warn)).toEqual([]);
    });

    it("still lets a gallery's own key win", () => {
        mount({ licenseKey: 'OLD-V2-KEY' });
        expect(licenseMessages(warn)).toEqual([
            expect.stringContaining('upgrade to a v3 license'),
        ]);
    });
});
