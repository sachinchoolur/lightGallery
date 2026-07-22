import {
    Component,
    viewChild,
    type DoCheck,
    type TemplateRef,
} from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import {
    withComment,
    type CommentContext,
} from '@lightgallery/angular/plugins/comment';
import { withFullscreen } from '@lightgallery/angular/plugins/fullscreen';
import { withHash } from '@lightgallery/angular/plugins/hash';
import { withMediumZoom } from '@lightgallery/angular/plugins/mediumZoom';
import { withPager } from '@lightgallery/angular/plugins/pager';
import {
    withRelativeCaption,
} from '@lightgallery/angular/plugins/relativeCaption';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withShare } from '@lightgallery/angular/plugins/share';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withVimeoThumbnail } from '@lightgallery/angular/plugins/vimeoThumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b', caption: 'B' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c', caption: 'C' },
];

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function flush<T>(fixture: ComponentFixture<T>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

async function advance<T>(
    fixture: ComponentFixture<T>,
    ms: number,
): Promise<void> {
    vi.advanceTimersByTime(ms);
    await flush(fixture);
}

function firePointer(
    target: EventTarget,
    type: 'pointerdown' | 'pointermove' | 'pointerup',
    init: { x?: number; y?: number; pointerId?: number },
): void {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: init.x ?? 0,
        clientY: init.y ?? 0,
    });
    Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });
    target.dispatchEvent(event);
}

@Component({
    selector: 'cd-probe-13',
    template: '',
})
class CdProbe implements DoCheck {
    static checks = 0;

    ngDoCheck(): void {
        CdProbe.checks++;
    }
}

@Component({
    imports: [LgGalleryComponent, CdProbe],
    template: `
        <cd-probe-13 />
        <ng-template #comments let-item>{{ item?.caption }}</ng-template>
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
            [enableSwipe]="true"
            [enableDrag]="true"
        />
        <!-- enableSwipe/enableDrag override mediumZoom's presets (user
             settings win — merge-order proof doubling as storm enabler). -->
    `,
})
class LeakHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly comments =
        viewChild.required<TemplateRef<CommentContext>>('comments');
    readonly items = ITEMS;
    features = [
        withThumbnail(),
        withZoom(),
        withVideo(),
        withAutoplay(),
        withFullscreen(),
        withHash({ galleryId: 'leaks' }),
        withPager(),
        withShare(),
        withRotate(),
        withMediumZoom({ mediumZoom: false }),
        withRelativeCaption({ relativeCaption: false }),
        withVimeoThumbnail(),
        withComment({ commentBox: true }),
    ];
}

interface ListenerLedger {
    balance: Map<string, number>;
    restore(): void;
}

/** Track add/remove parity for every window/document listener type. */
function trackListeners(): ListenerLedger {
    const balance = new Map<string, number>();
    const targets: Array<Window | Document> = [window, document];
    const originals = targets.map((target) => ({
        target,
        add: target.addEventListener.bind(target),
        remove: target.removeEventListener.bind(target),
    }));
    targets.forEach((target) => {
        const add = target.addEventListener.bind(target);
        const remove = target.removeEventListener.bind(target);
        target.addEventListener = ((type: string, ...rest: unknown[]) => {
            balance.set(type, (balance.get(type) ?? 0) + 1);
            return (add as (...a: unknown[]) => unknown)(type, ...rest);
        }) as typeof target.addEventListener;
        target.removeEventListener = ((
            type: string,
            ...rest: unknown[]
        ) => {
            balance.set(type, (balance.get(type) ?? 0) - 1);
            return (remove as (...a: unknown[]) => unknown)(type, ...rest);
        }) as typeof target.removeEventListener;
    });
    return {
        balance,
        restore() {
            originals.forEach(({ target, add, remove }) => {
                target.addEventListener = add;
                target.removeEventListener = remove;
            });
        },
    };
}

describe('leak + CD audit, all 13 features', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        CdProbe.checks = 0;
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        window.location.hash = '';
    });

    it('mount → interact → destroy leaves no listeners, timers or DOM', async () => {
        const ledger = trackListeners();
        try {
            const fixture = TestBed.createComponent(LeakHost);
            const host = fixture.componentInstance;
            host.features = [
                ...host.features.slice(0, -1),
                withComment({
                    commentBox: true,
                    commentsTemplate: host.comments(),
                }),
            ];
            await flush(fixture);

            // Open, load, and touch every interaction surface once.
            host.gallery().openGallery(0);
            await flush(fixture);
            await advance(fixture, 450);
            document
                .querySelector<HTMLImageElement>('img.lg-image')
                ?.dispatchEvent(new Event('load'));
            await flush(fixture);

            // Thumbnail navigation.
            (
                document.querySelectorAll<HTMLElement>('.lg-thumb-item')[1]!
            ).click();
            await flush(fixture);
            await advance(fixture, 500);
            // Keyboard navigation.
            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
            );
            await flush(fixture);
            await advance(fixture, 500);
            // A swipe (window listeners attach and detach).
            const item = query('.lg-item.lg-current')!;
            firePointer(item, 'pointerdown', { x: 200, y: 100 });
            await flush(fixture);
            firePointer(window, 'pointermove', { x: 120, y: 100 });
            firePointer(window, 'pointerup', { x: 120, y: 100 });
            await flush(fixture);
            await advance(fixture, 600);
            // Zoom via the toolbar, then share dropdown, then autoplay.
            (query('.lg-actual-size') as HTMLButtonElement).click();
            await flush(fixture);
            (query('.lg-share') as HTMLButtonElement).click();
            await flush(fixture);
            (query('.lg-autoplay-button') as HTMLButtonElement).click();
            await flush(fixture);

            fixture.destroy();

            expect(query('.lg-container')).toBeNull();
            expect(query('.lg-outer')).toBeNull();
            expect(
                document.documentElement.classList.contains('lg-on'),
            ).toBe(false);
            // Add/remove parity for every gallery-owned listener type. The
            // exact residue below is app-level singletons that outlive any
            // gallery instance (verified by stack trace):
            // - jsdom/nwsapi selector engine: document mouseover/mouseout
            // - CDK ViewportRuler: window resize + orientationchange
            // - Angular Location (injected by CDK Overlay): popstate +
            //   hashchange
            // A gallery leak would push a type past its singleton budget.
            const imbalanced = Object.fromEntries(
                [...ledger.balance.entries()].filter(
                    ([, count]) => count !== 0,
                ),
            );
            expect(imbalanced).toEqual({
                mouseover: 1,
                mouseout: 1,
                resize: 1,
                orientationchange: 1,
                popstate: 1,
                hashchange: 1,
            });
            // Every gallery-owned timer cleared; what remains are Angular's
            // one-shot scheduler ticks.
            vi.runOnlyPendingTimers();
            expect(vi.getTimerCount()).toBe(0);
        } finally {
            ledger.restore();
        }
    });

    it('zero change detection during a pointermove storm with all 13 mounted', async () => {
        const fixture = TestBed.createComponent(LeakHost);
        const host = fixture.componentInstance;
        await flush(fixture);
        host.gallery().openGallery(0);
        await flush(fixture);
        await advance(fixture, 450);
        document
            .querySelector<HTMLImageElement>('img.lg-image')
            ?.dispatchEvent(new Event('load'));
        await flush(fixture);

        const item = query('.lg-item.lg-current')!;
        firePointer(item, 'pointerdown', { x: 300, y: 100 });
        await flush(fixture);

        const checksBefore = CdProbe.checks;
        for (let x = 299; x >= 200; x--) {
            firePointer(window, 'pointermove', { x, y: 100 });
        }
        expect(item.style.transform).not.toBe('');
        await fixture.whenStable();
        expect(CdProbe.checks).toBe(checksBefore);

        firePointer(window, 'pointerup', { x: 200, y: 100 });
        await flush(fixture);
        await advance(fixture, 600);
        fixture.destroy();
    });
});
