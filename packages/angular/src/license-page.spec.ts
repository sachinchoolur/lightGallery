import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    setLicenseKey,
    type LgGalleryItem,
} from '@lightgallery/angular';

const ITEMS: LgGalleryItem[] = [{ src: 'a.jpg', alt: 'a' }];

@Component({
    imports: [LgGalleryComponent],
    template: `<lg-gallery [slides]="items" /><lg-gallery [slides]="items" />`,
})
class TwoGalleries {
    readonly items = ITEMS;
}

function licenseMessages(spy: ReturnType<typeof vi.spyOn>): string[] {
    return spy.mock.calls
        .map((call: unknown[]) => String(call[0]))
        .filter((message: string) => message.includes('license'));
}

async function render(): Promise<void> {
    const fixture = TestBed.createComponent(TwoGalleries);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

describe('setLicenseKey', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        TestBed.resetTestingModule();
    });

    it('logs the testing-key warning once for several galleries', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        await render();
        expect(licenseMessages(warn)).toHaveLength(1);
    });

    it('covers galleries without their own key once set', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        setLicenseKey('LIG-1234');
        await render();
        expect(licenseMessages(warn)).toEqual([]);
    });
});
