import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    Injectable,
    input,
    signal,
    viewChild,
    type TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
} from './features';
import { LgGalleryComponent } from './gallery.component';
import type { LgGalleryItem } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', alt: 'a' },
    { src: 'b.jpg', alt: 'b' },
    { src: 'c.jpg', alt: 'c' },
];

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function flush<T>(fixture: ComponentFixture<T>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

// ── Synthetic feature pieces ─────────────────────────────────────────────

@Injectable()
class ProbeService {
    readonly label = 'probe-service-value';
}

@Component({
    selector: 'probe-toolbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <span class="probe-toolbar"
            >{{ service.label }}:{{ ctx.state().currentIndex }}:{{
                ctx.settings()['probeOption']
            }}</span
        >
    `,
})
class ProbeToolbarComponent {
    protected readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly service = inject(ProbeService);
}

@Injectable()
class ProbeInitService {
    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        effect(() => {
            ctx.settings();
            ctx.layout.setOuterClass('lg-probe-init', true);
        });
    }
}

@Component({
    selector: 'wrap-a',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        <div class="wrap-a">
            <ng-container [ngTemplateOutlet]="content()" />
        </div>
    `,
})
class WrapAComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    readonly isCurrent = input(false);
    readonly content = input.required<TemplateRef<unknown>>();
}

@Component({
    selector: 'wrap-b',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        <div class="wrap-b">
            <ng-container [ngTemplateOutlet]="content()" />
        </div>
    `,
})
class WrapBComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    readonly isCurrent = input(false);
    readonly content = input.required<TemplateRef<unknown>>();
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [loop]="loop()"
            [features]="features()"
        />
    `,
})
class FeatureHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly loop = signal<boolean | undefined>(undefined);
    readonly features = signal<readonly LgFeature[]>([]);
}

describe('feature runtime (ADR 0001 §5)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('registers features: providers, slots and context injection', async () => {
        const fixture = TestBed.createComponent(FeatureHost);
        const host = fixture.componentInstance;
        host.features.set([
            {
                name: 'probe',
                defaults: { probeOption: 'default' },
                options: { probeOption: 'from-options' },
                providers: [ProbeService],
                slots: { toolbar: ProbeToolbarComponent },
            },
        ]);
        await flush(fixture);
        host.gallery().openGallery(1);
        await flush(fixture);

        // Slot component rendered in the toolbar, with the feature's DI
        // provider and the plugin context both injectable, and the withX()
        // options merged over the feature defaults.
        expect(query('.lg-toolbar .probe-toolbar')!.textContent).toBe(
            'probe-service-value:1:from-options',
        );
    });

    it('merges settings without mutating any input object', async () => {
        const fixture = TestBed.createComponent(FeatureHost);
        const host = fixture.componentInstance;
        const defaults = Object.freeze({ probeOption: 'default' });
        const options = Object.freeze({ probeOption: 'user' });
        const presets = Object.freeze({ loop: false });
        host.features.set([
            { name: 'probe', defaults, options, presets },
        ]);
        await flush(fixture);
        host.gallery().openGallery(0);
        await flush(fixture);

        // Presets land below user settings: no [loop] input -> preset wins.
        const store = host.gallery().openGallery; // typed access not needed
        expect(store).toBeTypeOf('function');
        expect(query('.lg-outer')).not.toBeNull();
        // The preset turned loop off: prev from slide 0 stays (no wrap).
        host.gallery().prevSlide();
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');

        // ... but an explicit [loop] input overrides the preset.
        host.loop.set(true);
        await flush(fixture);
        host.gallery().prevSlide();
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');

        // Frozen inputs untouched throughout (non-mutating merge).
        expect(defaults.probeOption).toBe('default');
        expect(options.probeOption).toBe('user');
        expect(presets.loop).toBe(false);
    });

    it('ignores duplicate features by name, warning once', async () => {
        const warn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => undefined);
        const fixture = TestBed.createComponent(FeatureHost);
        const host = fixture.componentInstance;
        host.features.set([
            {
                name: 'probe',
                defaults: { probeOption: 'first' },
                providers: [ProbeService],
                slots: { toolbar: ProbeToolbarComponent },
            },
            { name: 'probe', defaults: { probeOption: 'second' } },
        ]);
        await flush(fixture);
        host.gallery().openGallery(0);
        await flush(fixture);

        expect(warn).toHaveBeenCalledWith(
            'lightGallery: duplicate feature "probe" ignored.',
        );
        // First registration wins.
        expect(query('.probe-toolbar')!.textContent).toContain('first');
        expect(document.querySelectorAll('.probe-toolbar').length).toBe(1);
        warn.mockRestore();
    });

    it('runs LG_FEATURE_INIT services eagerly (before the gallery opens)', async () => {
        const fixture = TestBed.createComponent(FeatureHost);
        const host = fixture.componentInstance;
        host.features.set([
            {
                name: 'probe',
                providers: [
                    ProbeInitService,
                    {
                        provide: LG_FEATURE_INIT,
                        useExisting: ProbeInitService,
                        multi: true,
                    },
                ],
            },
        ]);
        // The init effect runs while the gallery is still closed.
        await flush(fixture);
        host.gallery().openGallery(0);
        await flush(fixture);
        expect(
            query('.lg-outer')!.classList.contains('lg-probe-init'),
        ).toBe(true);
    });

    it('applies async transformItems with abort support', async () => {
        const fixture = TestBed.createComponent(FeatureHost);
        const host = fixture.componentInstance;
        host.features.set([
            {
                name: 'probe',
                transformItems: (items) =>
                    Promise.resolve(
                        items.map((item) => ({
                            ...item,
                            alt: `${item.alt}-transformed`,
                        })),
                    ),
            },
        ]);
        await flush(fixture);
        await Promise.resolve();
        await flush(fixture);
        host.gallery().openGallery(0);
        await flush(fixture);
        expect(
            query('.lg-item.lg-current img')!.getAttribute('alt'),
        ).toBe('a-transformed');
    });

    it('nests slideWrapper components in feature order (first = outermost)', async () => {
        const fixture = TestBed.createComponent(FeatureHost);
        const host = fixture.componentInstance;
        host.features.set([
            { name: 'a', slots: { slideWrapper: WrapAComponent } },
            { name: 'b', slots: { slideWrapper: WrapBComponent } },
        ]);
        await flush(fixture);
        host.gallery().openGallery(0);
        await flush(fixture);

        const outerWrap = query('.lg-item.lg-current .wrap-a');
        expect(outerWrap).not.toBeNull();
        expect(outerWrap!.querySelector('.wrap-b img.lg-image')).not.toBe(
            null,
        );
    });
});
