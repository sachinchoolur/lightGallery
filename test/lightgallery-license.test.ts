/**
 * License notices: a key from v1 or v2 (no `LIG` prefix) asks for an
 * upgrade, a lightGallery 3 key logs nothing, the testing key warns.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';

function mount(licenseKey: string): void {
    document.body.innerHTML = `<div id="lightGallery"><a href="a.png"><img src="a-t.png" alt="a" /></a></div>`;
    lightGallery(document.getElementById('lightGallery') as HTMLElement, {
        licenseKey,
    }).destroy();
}

function licenseMessages(spy: jest.SpyInstance): string[] {
    return spy.mock.calls
        .map((call) => String(call[0]))
        .filter((message) => message.includes('license'));
}

describe('license notice', () => {
    let warn: jest.SpyInstance;
    let error: jest.SpyInstance;
    beforeEach(() => {
        warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        error = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
    });
    afterEach(() => {
        warn.mockRestore();
        error.mockRestore();
    });

    it('asks a v1 or v2 key to upgrade', () => {
        mount('1A2B3C4D-5E6F');
        expect(licenseMessages(warn)).toEqual([
            expect.stringContaining('upgrade to a v3 license'),
        ]);
    });

    it('logs nothing for a lightGallery 3 key', () => {
        mount('LIG-C20C35AE-0180-47D2-BEA7-33B98A2332B2');
        expect(licenseMessages(warn)).toEqual([]);
        expect(licenseMessages(error)).toEqual([]);
    });

    it('still warns for the testing key', () => {
        mount('0000-0000-000-0000');
        expect(licenseMessages(warn)).toEqual([
            expect.stringContaining('not valid for production use'),
        ]);
    });
});
