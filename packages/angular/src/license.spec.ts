import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';

const ITEMS: LgGalleryItem[] = [{ src: 'a.jpg', alt: 'a' }];

@Component({
    imports: [LgGalleryComponent],
    template: `<lg-gallery [slides]="items" [licenseKey]="key" />`,
})
class LicenseHost {
    readonly items = ITEMS;
    key = '';
}

function licenseMessages(spy: ReturnType<typeof vi.spyOn>): string[] {
    return spy.mock.calls
        .map((call: unknown[]) => String(call[0]))
        .filter((message: string) => message.includes('license'));
}

async function mountWithKey(key: string): Promise<void> {
    const fixture = TestBed.createComponent(LicenseHost);
    fixture.componentInstance.key = key;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

describe('license notice', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        TestBed.resetTestingModule();
    });

    it('asks a v1 or v2 key to upgrade', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        await mountWithKey('1A2B3C4D-5E6F');
        expect(licenseMessages(warn)).toEqual([
            expect.stringContaining('upgrade to a v3 license'),
        ]);
    });

    it('logs nothing for a lightGallery 3 key', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        await mountWithKey('LIG-1234');
        expect(licenseMessages(warn)).toEqual([]);
        expect(licenseMessages(error)).toEqual([]);
    });
});
