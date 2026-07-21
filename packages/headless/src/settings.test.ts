import { describe, expect, it } from 'vitest';

import {
    coreSettingsDefaults,
    resolveSettings,
    type UserSettings,
} from './settings';

describe('resolveSettings', () => {
    it('returns defaults for empty input', () => {
        const resolved = resolveSettings();
        expect(resolved.mode).toBe('lg-slide');
        expect(resolved.speed).toBe(400);
        expect(resolved.preload).toBe(2);
        expect(resolved.captionPosition).toBe('bar');
    });

    it('does not mutate any input object', () => {
        const user: UserSettings = {
            speed: 100,
            slideEndAnimation: true,
            hideControlOnEnd: true,
            strings: { closeGallery: 'Schließen' },
        };
        const userSnapshot = JSON.parse(JSON.stringify(user));
        const resolved = resolveSettings(user);

        expect(user).toEqual(userSnapshot);
        expect(resolved).not.toBe(user);
        expect(coreSettingsDefaults.speed).toBe(400);
        expect(coreSettingsDefaults.strings.closeGallery).toBe(
            'Close gallery',
        );
    });

    it('merges strings per-key', () => {
        const resolved = resolveSettings({
            strings: { closeGallery: 'Schließen' },
        });
        expect(resolved.strings.closeGallery).toBe('Schließen');
        expect(resolved.strings.nextSlide).toBe('Next slide');
    });

    it('ignores undefined user values (optional props do not shadow)', () => {
        const resolved = resolveSettings({ speed: undefined, loop: false });
        expect(resolved.speed).toBe(400);
        expect(resolved.loop).toBe(false);
    });

    it('applies mobile overrides only when isMobile', () => {
        const user: UserSettings = { controls: true };
        expect(resolveSettings(user).controls).toBe(true);
        const mobile = resolveSettings(user, { isMobile: true });
        expect(mobile.controls).toBe(false);
        expect(mobile.showCloseIcon).toBe(false);
        expect(mobile.download).toBe(false);
    });

    it('honors user mobileSettings on mobile', () => {
        const resolved = resolveSettings(
            { mobileSettings: { controls: true } },
            { isMobile: true },
        );
        expect(resolved.controls).toBe(true);
    });

    it('forces hideControlOnEnd off while slideEndAnimation is on', () => {
        const resolved = resolveSettings({
            slideEndAnimation: true,
            hideControlOnEnd: true,
        });
        expect(resolved.hideControlOnEnd).toBe(false);

        const explicit = resolveSettings({
            slideEndAnimation: false,
            hideControlOnEnd: true,
        });
        expect(explicit.hideControlOnEnd).toBe(true);
    });

    it('forces swipeToClose off when not closable', () => {
        const resolved = resolveSettings({ closable: false });
        expect(resolved.swipeToClose).toBe(false);
    });

    it('merges plugin defaults below user settings', () => {
        const resolved = resolveSettings(
            { speed: 250 },
            { pluginDefaults: [{ speed: 999, preload: 4 }] },
        );
        expect(resolved.speed).toBe(250);
        expect(resolved.preload).toBe(4);
    });
});
