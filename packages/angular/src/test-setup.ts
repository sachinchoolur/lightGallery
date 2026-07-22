// Zoneless test environment: Analog's bundled `setup-vitest` imports
// zone.js unconditionally, and this package is zoneless by construction
// (signals drive change detection), so the TestBed is initialized manually.
import '@angular/compiler';

import { provideZonelessChangeDetection } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
    BrowserTestingModule,
    platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { beforeEach } from 'vitest';

// The SSR spec runs under `@vitest-environment node` (no DOM): it drives
// `renderApplication` itself and must not get a browser TestBed.
if (typeof document !== 'undefined') {
    getTestBed().initTestEnvironment(
        BrowserTestingModule,
        platformBrowserTesting(),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
    });
}
