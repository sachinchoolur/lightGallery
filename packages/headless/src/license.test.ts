import { describe, expect, it, vi } from 'vitest';

import {
    checkLicenseKey,
    LICENSE_KEY_PREFIX,
    TESTING_LICENSE_KEY,
} from './license';

describe('checkLicenseKey', () => {
    it('accepts a lightGallery 3 key', () => {
        expect(
            checkLicenseKey('LIG-C20C35AE-0180-47D2-BEA7-33B98A2332B2'),
        ).toBeNull();
        expect(checkLicenseKey(`${LICENSE_KEY_PREFIX}-1234`)).toBeNull();
    });

    it('errors on a missing or blank key', () => {
        for (const key of [undefined, '', '   ']) {
            const notice = checkLicenseKey(key);
            expect(notice?.level).toBe('error');
            expect(notice?.message).toMatch(/docs\/license\/$/);
        }
    });

    it('warns on the testing key', () => {
        const notice = checkLicenseKey(TESTING_LICENSE_KEY);
        expect(notice?.level).toBe('warn');
        expect(notice?.message).toContain('not valid for production use');
    });

    it('asks v1 and v2 keys to upgrade', () => {
        const notice = checkLicenseKey('1A2B3C4D-5E6F-7A8B-9C0D-1E2F3A4B5C6D');
        expect(notice?.level).toBe('warn');
        expect(notice?.message).toContain('upgrade to a v3 license');
        expect(notice?.message).toMatch(/docs\/license\/$/);
    });

    it('is case sensitive and needs the prefix at the start', () => {
        expect(checkLicenseKey('lig-1234')?.level).toBe('warn');
        expect(checkLicenseKey('X-LIG-1234')?.level).toBe('warn');
    });
});

describe('page-wide license key', () => {
    // Module state: load a fresh copy per test.
    async function fresh() {
        vi.resetModules();
        return import('./license');
    }

    it('applies to galleries without their own key', async () => {
        const license = await fresh();
        license.setLicenseKey('LIG-PAGE');
        expect(license.resolveLicenseKey(undefined)).toBe('LIG-PAGE');
        expect(license.resolveLicenseKey('')).toBe('LIG-PAGE');
        expect(license.resolveLicenseKey(license.TESTING_LICENSE_KEY)).toBe(
            'LIG-PAGE',
        );
    });

    it("lets a gallery's own key win", async () => {
        const license = await fresh();
        license.setLicenseKey('LIG-PAGE');
        expect(license.resolveLicenseKey('LIG-OWN')).toBe('LIG-OWN');
    });

    it('falls back to the testing key when nothing is set', async () => {
        const license = await fresh();
        expect(license.resolveLicenseKey(undefined)).toBe(
            license.TESTING_LICENSE_KEY,
        );
    });

    it('logs each notice once per page', async () => {
        const license = await fresh();
        expect(license.takeLicenseNotice(undefined)?.level).toBe('warn');
        expect(license.takeLicenseNotice(undefined)).toBeNull();
        expect(license.takeLicenseNotice('OLD-KEY')?.level).toBe('warn');
        expect(license.takeLicenseNotice('OLD-KEY')).toBeNull();
    });

    it('is silent once a v3 page key is set', async () => {
        const license = await fresh();
        license.setLicenseKey('LIG-PAGE');
        expect(license.takeLicenseNotice(undefined)).toBeNull();
    });
});
