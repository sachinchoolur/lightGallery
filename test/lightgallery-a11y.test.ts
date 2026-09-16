/**
 * Accessibility contract for the vanilla core — the same assertions the
 * React/Vue/Angular binding a11y suites make: dialog semantics with an
 * accessible name, focus-in/trap/restore, prefers-reduced-motion collapse,
 * aria-live slide announcements, and an axe WCAG A/AA pass.
 */
import '@testing-library/jest-dom';
import * as axe from 'axe-core';
import { waitFor } from '@testing-library/dom';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { LightGallerySettings } from '../src/lg-settings';
import Thumbnails from '../src/plugins/thumbnail/lg-thumbnail';
import Zoom from '../src/plugins/zoom/lg-zoom';
import Pager from '../src/plugins/pager/lg-pager';
import Rotate from '../src/plugins/rotate/lg-rotate';
import Share from '../src/plugins/share/lg-share';
import Autoplay from '../src/plugins/autoplay/lg-autoplay';
import Fullscreen from '../src/plugins/fullscreen/lg-fullscreen';

const ZERO_MOTION: LightGallerySettings = {
    speed: 0,
    backdropDuration: 0,
    startAnimationDuration: 0,
    zoomFromOrigin: false,
    getCaptionFromTitleOrAlt: false,
};

function buildGalleryDom(): void {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png" data-sub-html="<h4>Caption A</h4>">
                <img src="a-t.png" alt="a" />
            </a>
            <a href="b.png">
                <img src="b-t.png" alt="b" />
            </a>
            <a href="c.png">
                <img src="c-t.png" alt="c" />
            </a>
        </div>`;
}

function initGallery(settings: LightGallerySettings = {}): LightGallery {
    buildGalleryDom();
    return lightGallery(
        document.getElementById('lightGallery') as HTMLElement,
        { ...ZERO_MOTION, ...settings },
    );
}

function query(selector: string): HTMLElement | null {
    return document.querySelector<HTMLElement>(selector);
}

describe('accessibility (vanilla core)', () => {
    let instance: LightGallery | undefined;

    afterEach(async () => {
        if (instance) {
            // Real-timer teardown: destroy schedules the DOM removal —
            // let it finish before the body is wiped.
            instance.destroy();
            instance = undefined;
            await new Promise((resolve) => setTimeout(resolve, 250));
        }
        document.body.innerHTML = '';
    });

    describe('with fake timers', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            // Destroy while fake timers are still active so the scheduled
            // teardown flushes deterministically.
            instance?.destroy();
            instance = undefined;
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        function tick(ms: number): void {
            jest.advanceTimersByTime(ms);
        }

        it('has dialog semantics with a default accessible name', () => {
            instance = initGallery();
            const dialog = query('.lg-container')!;
            expect(dialog).toHaveAttribute('role', 'dialog');
            expect(dialog).toHaveAttribute('aria-modal', 'true');
            expect(dialog).toHaveAttribute('aria-label', 'Gallery');
            expect(dialog).not.toHaveAttribute('aria-labelledby');
        });

        it('prefers ariaLabelledby over the default label', () => {
            instance = initGallery({ ariaLabelledby: 'gallery-heading' });
            const dialog = query('.lg-container')!;
            expect(dialog).toHaveAttribute(
                'aria-labelledby',
                'gallery-heading',
            );
            expect(dialog).not.toHaveAttribute('aria-label');
        });

        it('moves focus into the gallery on open and back to the trigger on close', () => {
            instance = initGallery();
            const trigger =
                document.querySelector<HTMLElement>('#lightGallery a')!;
            trigger.focus();
            instance.openGallery(0);
            tick(200);
            expect(document.activeElement).toBe(query('.lg-container'));

            instance.closeGallery();
            tick(300);
            expect(document.activeElement).toBe(trigger);
        });

        it('traps Tab within the dialog in both directions', () => {
            // download off so <button> elements are the only focusables.
            instance = initGallery({ download: false });
            instance.openGallery(0);
            tick(200);

            const container = query('.lg-container')!;
            // Hidden buttons (the toolbar's More button until something
            // overflows) are not focusable, same rule as the trap.
            const buttons = [
                ...container.querySelectorAll<HTMLElement>('button'),
            ].filter(
                (button) => !button.closest('[hidden], [data-lg-overflow]'),
            );
            const first = buttons[0];
            const last = buttons[buttons.length - 1];

            last.focus();
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
            expect(document.activeElement).toBe(first);

            window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }),
            );
            expect(document.activeElement).toBe(last);
        });

        it('announces slide changes with position and caption', () => {
            instance = initGallery();
            instance.openGallery(0);
            tick(200);

            const announcer = query('.lg-announcer')!;
            expect(announcer).toHaveAttribute('role', 'status');
            expect(announcer).toHaveAttribute('aria-live', 'polite');
            expect(announcer.textContent).toBe('Image 1 of 3, Caption A');

            instance.slide(1);
            tick(200);
            expect(announcer.textContent).toBe('Image 2 of 3');
        });

        it('clears the announcer on close so reopening re-announces', () => {
            instance = initGallery();
            instance.openGallery(0);
            tick(200);
            instance.closeGallery();
            tick(300);
            expect(query('.lg-announcer')!.textContent).toBe('');
        });

        it('honors a localized announcement template', () => {
            // Partial override: strings merge per-key over the defaults
            // (plan 011 — the provide-everything requirement is gone).
            instance = initGallery({
                strings: {
                    galleryLabel: 'Galerie',
                    slideAnnouncement: 'Bild {index} von {total}',
                },
            });
            instance.openGallery(1);
            tick(200);
            expect(query('.lg-container')).toHaveAttribute(
                'aria-label',
                'Galerie',
            );
            expect(query('.lg-announcer')!.textContent).toBe('Bild 2 von 3');
        });

        it('resolves plugin labels from core strings, legacy aliases winning', () => {
            instance = initGallery({
                plugins: [Autoplay, Share],
                strings: { toggleAutoplay: 'Diaporama', share: 'Partager' },
                autoplayPluginStrings: { toggleAutoplay: 'Legacy autoplay' },
            });
            instance.openGallery(0);
            tick(200);
            // The deprecated per-plugin alias wins where explicitly set…
            expect(query('.lg-autoplay-button')).toHaveAttribute(
                'aria-label',
                'Legacy autoplay',
            );
            // …and the core strings drive every other plugin label.
            expect(query('.lg-share')).toHaveAttribute(
                'aria-label',
                'Partager',
            );
        });

        it('demotes the counter and caption bar while the announcer is active', () => {
            instance = initGallery();
            instance.openGallery(0);
            tick(200);

            const counter = query('.lg-counter')!;
            expect(counter).toHaveAttribute('aria-hidden', 'true');
            expect(counter).not.toHaveAttribute('role');
            expect(counter).not.toHaveAttribute('aria-live');

            const caption = query('.lg-sub-html')!;
            expect(caption).not.toHaveAttribute('role');
            expect(caption).not.toHaveAttribute('aria-live');
        });

        it('restores the 2.x live regions when announcements are disabled', () => {
            instance = initGallery({ ariaAnnouncements: false });
            instance.openGallery(0);
            tick(200);

            expect(query('.lg-announcer')).toBeNull();

            const counter = query('.lg-counter')!;
            expect(counter).toHaveAttribute('role', 'status');
            expect(counter).toHaveAttribute('aria-live', 'polite');
            expect(counter).not.toHaveAttribute('aria-hidden');

            const caption = query('.lg-sub-html')!;
            expect(caption).toHaveAttribute('role', 'status');
            expect(caption).toHaveAttribute('aria-live', 'polite');
        });

        it('collapses every animation under prefers-reduced-motion', () => {
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = ((mediaQuery: string) => ({
                matches: mediaQuery.includes('prefers-reduced-motion'),
                media: mediaQuery,
                addEventListener: () => undefined,
                removeEventListener: () => undefined,
                addListener: () => undefined,
                removeListener: () => undefined,
                onchange: null,
                dispatchEvent: () => false,
            })) as typeof window.matchMedia;
            try {
                buildGalleryDom();
                instance = lightGallery(
                    document.getElementById('lightGallery') as HTMLElement,
                );
                expect(instance.settings.speed).toBe(0);
                expect(instance.settings.backdropDuration).toBe(0);
                expect(instance.settings.startAnimationDuration).toBe(0);
                expect(instance.settings.zoomFromOrigin).toBe(false);
                expect(instance.settings.slideEndAnimation).toBe(false);
                const backdrop = query('.lg-backdrop')!;
                expect(backdrop.style.transitionDuration).toBe('0ms');
            } finally {
                window.matchMedia = originalMatchMedia;
            }
        });
    });

    describe('with real timers (axe)', () => {
        it('has zero detectable WCAG A/AA violations with plugins loaded', async () => {
            buildGalleryDom();
            instance = lightGallery(
                document.getElementById('lightGallery') as HTMLElement,
                {
                    ...ZERO_MOTION,
                    plugins: [
                        Thumbnails,
                        Zoom,
                        Pager,
                        Rotate,
                        Share,
                        Autoplay,
                        Fullscreen,
                    ],
                },
            );
            instance.openGallery(0);
            await waitFor(() =>
                expect(query('.lg-container.lg-show')).not.toBeNull(),
            );
            await new Promise((resolve) => setTimeout(resolve, 200));
            document
                .querySelector('img.lg-object')
                ?.dispatchEvent(new Event('load'));

            const results = await axe.run(query('.lg-container')!, {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
                },
                // jsdom has no canvas; contrast is a browser check.
                rules: { 'color-contrast': { enabled: false } },
            });
            expect(results.violations).toEqual([]);
        }, 20000);
    });
});
