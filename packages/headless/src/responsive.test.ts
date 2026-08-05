import { describe, expect, it, vi } from 'vitest';

import {
    awaitDecode,
    getActualSizeWidth,
    matchesMedia,
    parseSrcset,
    resolveImageSource,
    resolveSizes,
} from './responsive';

describe('srcset parsing', () => {
    it('parses width, density and bare candidates', () => {
        expect(
            parseSrcset('a-640.jpg 640w, a-1280.jpg 1280w, a-2560.jpg 2560w'),
        ).toEqual([
            { url: 'a-640.jpg', width: 640 },
            { url: 'a-1280.jpg', width: 1280 },
            { url: 'a-2560.jpg', width: 2560 },
        ]);
        expect(parseSrcset('a.jpg 1x, a@2x.jpg 2x')).toEqual([
            { url: 'a.jpg', density: 1 },
            { url: 'a@2x.jpg', density: 2 },
        ]);
        expect(parseSrcset('a.jpg')).toEqual([{ url: 'a.jpg', density: 1 }]);
    });

    it('skips malformed entries instead of throwing', () => {
        expect(parseSrcset('a.jpg 640w, , b.jpg NaNw, c.jpg -2x')).toEqual([
            { url: 'a.jpg', width: 640 },
        ]);
    });
});

describe('sizes resolution', () => {
    it('defaults to the viewport width (100vw)', () => {
        expect(resolveSizes(undefined, 1200)).toBe(1200);
        expect(resolveSizes('100vw', 1200)).toBe(1200);
        expect(resolveSizes('unparseable', 1200)).toBe(1200);
    });

    it('evaluates min/max-width clauses in author order', () => {
        const sizes =
            '(min-width: 1024px) 50vw, (min-width: 640px) 75vw, 100vw';
        expect(resolveSizes(sizes, 1280)).toBe(640);
        expect(resolveSizes(sizes, 800)).toBe(600);
        expect(resolveSizes(sizes, 400)).toBe(400);
    });

    it('supports px lengths and max-width conditions', () => {
        expect(resolveSizes('(max-width: 600px) 320px, 800px', 500)).toBe(320);
        expect(resolveSizes('(max-width: 600px) 320px, 800px', 900)).toBe(800);
    });
});

describe('media matching', () => {
    it('matches min/max-width and treats absent media as matching', () => {
        const viewport = { width: 800, height: 600 };
        expect(matchesMedia(undefined, viewport)).toBe(true);
        expect(matchesMedia('(min-width: 640px)', viewport)).toBe(true);
        expect(matchesMedia('(min-width: 1024px)', viewport)).toBe(false);
        expect(matchesMedia('(max-width: 1024px)', viewport)).toBe(true);
        // Unsupported conditions read as not matching (fall through to
        // the next source rather than guessing).
        expect(matchesMedia('(orientation: landscape)', viewport)).toBe(false);
    });
});

describe('resolveImageSource', () => {
    const item = {
        src: 'fallback.jpg',
        srcset: 'a-640.jpg 640w, a-1280.jpg 1280w, a-2560.jpg 2560w',
        sizes: '100vw',
    };

    it('picks the smallest width candidate covering viewport × dpr', () => {
        expect(resolveImageSource(item, { width: 600, height: 800 })).toEqual({
            src: 'a-640.jpg',
            width: 640,
        });
        expect(
            resolveImageSource(item, { width: 600, height: 800, dpr: 2 }),
        ).toEqual({ src: 'a-1280.jpg', width: 1280 });
        // Nothing covers 1400×2 → largest available.
        expect(
            resolveImageSource(item, { width: 1400, height: 900, dpr: 2 }),
        ).toEqual({ src: 'a-2560.jpg', width: 2560 });
    });

    it('respects sizes when computing the target width', () => {
        expect(
            resolveImageSource(
                { ...item, sizes: '(min-width: 1024px) 50vw, 100vw' },
                { width: 1280, height: 800 },
            ),
        ).toEqual({ src: 'a-640.jpg', width: 640 });
    });

    it('picks density candidates by dpr', () => {
        const densityItem = { src: 'a.jpg', srcset: 'a.jpg 1x, a@2x.jpg 2x' };
        expect(
            resolveImageSource(densityItem, { width: 800, height: 600 }),
        ).toEqual({ src: 'a.jpg', width: undefined });
        expect(
            resolveImageSource(densityItem, {
                width: 800,
                height: 600,
                dpr: 2,
            }),
        ).toEqual({ src: 'a@2x.jpg', width: undefined });
        expect(
            resolveImageSource(densityItem, {
                width: 800,
                height: 600,
                dpr: 3,
            }),
        ).toEqual({ src: 'a@2x.jpg', width: undefined });
    });

    it('lets the first matching picture source win (spec order)', () => {
        const sources = [
            {
                media: '(max-width: 600px)',
                srcset: 'small.avif 600w',
                type: 'image/avif',
            },
            { media: '(min-width: 601px)', srcset: 'large.avif 2000w' },
        ];
        expect(
            resolveImageSource(
                { ...item, sources },
                { width: 500, height: 800 },
            ),
        ).toEqual({ src: 'small.avif', width: 600, source: sources[0] });
        expect(
            resolveImageSource(
                { ...item, sources },
                { width: 900, height: 800 },
            ),
        ).toEqual({ src: 'large.avif', width: 2000, source: sources[1] });
    });

    it('falls back through srcset to plain src, then null', () => {
        expect(
            resolveImageSource(
                { src: 'plain.jpg' },
                { width: 800, height: 600 },
            ),
        ).toEqual({ src: 'plain.jpg' });
        expect(resolveImageSource({}, { width: 800, height: 600 })).toBeNull();
    });
});

describe('actual-size reference width', () => {
    const viewport = { width: 390, height: 844, dpr: 3 };

    it('prefers the largest srcset width candidate over naturalWidth', () => {
        // The phone-killer: under srcset+sizes the browser density-
        // corrects naturalWidth to ~the slot width (390 here) — the
        // ladder ceiling is the true actual-size reference.
        expect(
            getActualSizeWidth(
                { srcset: 'a-640.jpg 640w, a-1600.jpg 1600w' },
                viewport,
                390,
            ),
        ).toBe(1600);
    });

    it('uses the first matching picture source (spec order)', () => {
        expect(
            getActualSizeWidth(
                {
                    srcset: 'fallback.jpg 800w',
                    sources: [
                        {
                            media: '(max-width: 600px)',
                            srcset: 'small.avif 600w, small@2x.avif 1200w',
                        },
                        {
                            media: '(min-width: 601px)',
                            srcset: 'big.avif 3000w',
                        },
                    ],
                },
                viewport,
                390,
            ),
        ).toBe(1200);
    });

    it('falls back to naturalWidth without width descriptors', () => {
        expect(getActualSizeWidth({}, viewport, 1600)).toBe(1600);
        // Density descriptors already report a corrected natural size.
        expect(
            getActualSizeWidth(
                { srcset: 'a.jpg 1x, a@2x.jpg 2x' },
                viewport,
                800,
            ),
        ).toBe(800);
    });
});

describe('decode gate', () => {
    it('resolves immediately without decode support', async () => {
        await expect(awaitDecode({})).resolves.toBeUndefined();
    });

    it('resolves when decode settles — success or rejection', async () => {
        await expect(
            awaitDecode({ decode: () => Promise.resolve() }),
        ).resolves.toBeUndefined();
        await expect(
            awaitDecode({ decode: () => Promise.reject(new Error('nope')) }),
        ).resolves.toBeUndefined();
    });

    it('falls back to the timeout when decode never settles', async () => {
        vi.useFakeTimers();
        const pending = awaitDecode(
            { decode: () => new Promise(() => {}) },
            50,
        );
        let resolved = false;
        void pending.then(() => {
            resolved = true;
        });
        await vi.advanceTimersByTimeAsync(49);
        expect(resolved).toBe(false);
        await vi.advanceTimersByTimeAsync(2);
        expect(resolved).toBe(true);
        vi.useRealTimers();
    });
});
