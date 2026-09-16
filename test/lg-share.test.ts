/**
 * Share plugin: Web Share hybrid (native sheet vs dropdown menu) and the
 * X target refresh — the vanilla half of the plan-005 parity matrix the
 * binding wave2 suites assert.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { LightGallerySettings } from '../src/lg-settings';
import Share from '../src/plugins/share/lg-share';

const ZERO_MOTION: LightGallerySettings = {
    speed: 0,
    backdropDuration: 0,
    startAnimationDuration: 0,
    zoomFromOrigin: false,
    plugins: [Share],
};

function initGallery(settings: LightGallerySettings = {}): LightGallery {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png" data-share-url="https://share.example/one" data-tweet-text="Tweet one">
                <img src="a-t.png" alt="a" />
            </a>
            <a href="b.png">
                <img src="b-t.png" alt="b" />
            </a>
        </div>`;
    return lightGallery(
        document.getElementById('lightGallery') as HTMLElement,
        { ...ZERO_MOTION, ...settings },
    );
}

function stubNavigatorShare(
    share: jest.Mock,
    canShare?: (data: unknown) => boolean,
): () => void {
    Object.defineProperty(window.navigator, 'share', {
        value: share,
        configurable: true,
    });
    if (canShare) {
        Object.defineProperty(window.navigator, 'canShare', {
            value: canShare,
            configurable: true,
        });
    }
    return () => {
        delete (window.navigator as { share?: unknown }).share;
        delete (window.navigator as { canShare?: unknown }).canShare;
    };
}

describe('share plugin (vanilla)', () => {
    let instance: LightGallery | undefined;

    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        instance?.destroy();
        instance = undefined;
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    it('builds the X intent link for the twitter dropdown entry', () => {
        instance = initGallery({ preferNativeShare: false });
        instance.openGallery(0);
        jest.advanceTimersByTime(500);

        const xLink = document.querySelector('.lg-share-twitter')!;
        expect(xLink.getAttribute('href')).toContain('x.com/intent/post');
        expect(xLink.getAttribute('href')).toContain(
            encodeURIComponent('Tweet one'),
        );
        expect(
            document.querySelector('.lg-share-facebook')!.getAttribute('href'),
        ).toContain('facebook.com/sharer');
        // Default label refresh: X, not Twitter.
        expect(xLink.textContent).toContain('X');
    });

    it('closes the dropdown when the gallery closes', () => {
        instance = initGallery({ preferNativeShare: false });
        instance.openGallery(0);
        jest.advanceTimersByTime(500);

        const button = document.querySelector<HTMLElement>('.lg-share')!;
        button.click();
        const outer = document.querySelector('.lg-outer')!;
        expect(outer).toHaveClass('lg-dropdown-active');
        expect(button).toHaveAttribute('aria-expanded', 'true');

        // Closing with the dropdown open must not leave it open for the
        // next open.
        instance.closeGallery(true);
        jest.advanceTimersByTime(500);
        expect(outer).not.toHaveClass('lg-dropdown-active');
        expect(button).toHaveAttribute('aria-expanded', 'false');

        instance.openGallery(0);
        jest.advanceTimersByTime(500);
        expect(document.querySelector('.lg-outer')).not.toHaveClass(
            'lg-dropdown-active',
        );
    });

    it('prefers the native share sheet when enabled and available', () => {
        const share = jest.fn().mockResolvedValue(undefined);
        const restore = stubNavigatorShare(share);
        try {
            instance = initGallery({ preferNativeShare: true });
            instance.openGallery(0);
            jest.advanceTimersByTime(500);

            const button =
                document.querySelector<HTMLButtonElement>('.lg-share')!;
            // Native-first buttons do not advertise a popup.
            expect(button).not.toHaveAttribute('aria-haspopup');
            button.click();
            expect(share).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: 'https://share.example/one',
                    text: 'Tweet one',
                }),
            );
            expect(
                document.querySelector('.lg-outer')!.classList,
            ).not.toContain('lg-dropdown-active');
        } finally {
            restore();
        }
    });

    it('keeps the dropdown when preferNativeShare is false', () => {
        const share = jest.fn().mockResolvedValue(undefined);
        const restore = stubNavigatorShare(share);
        try {
            instance = initGallery({ preferNativeShare: false });
            instance.openGallery(0);
            jest.advanceTimersByTime(500);

            document.querySelector<HTMLButtonElement>('.lg-share')!.click();
            expect(share).not.toHaveBeenCalled();
            expect(document.querySelector('.lg-outer')!.classList).toContain(
                'lg-dropdown-active',
            );
        } finally {
            restore();
        }
    });

    it('falls back to the dropdown when canShare vetoes the payload', () => {
        const share = jest.fn().mockResolvedValue(undefined);
        const restore = stubNavigatorShare(share, () => false);
        try {
            instance = initGallery({ preferNativeShare: true });
            instance.openGallery(0);
            jest.advanceTimersByTime(500);

            document.querySelector<HTMLButtonElement>('.lg-share')!.click();
            expect(share).not.toHaveBeenCalled();
            expect(document.querySelector('.lg-outer')!.classList).toContain(
                'lg-dropdown-active',
            );
        } finally {
            restore();
        }
    });
});
