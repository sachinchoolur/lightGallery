import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LgJustifiedGridComponent } from '@lightgallery/angular/plugins/justified';

const CONTAINER_WIDTH = 1000;

const SIZES = [
    '1600-1067',
    '1067-1600',
    '1600-1067',
    '1600-1067',
    '1600-1067',
    '1600-1067',
];

@Component({
    imports: [LgJustifiedGridComponent],
    template: `
        <lg-justified-grid
            [rowHeight]="200"
            [gap]="10"
            [direction]="direction()"
            [reveal]="reveal()"
        >
            @for (size of sizes; track $index) {
            <a [href]="$index + '.png'" [attr.data-lg-size]="size">
                <img
                    [src]="$index + '-t.png'"
                    [attr.srcset]="
                        $index === 0 ? '0-t.png 240w, 0.png 1600w' : null
                    "
                    [alt]="String($index)"
                />
            </a>
            }
        </lg-justified-grid>
    `,
})
class JustifiedHost {
    readonly sizes = SIZES;
    readonly direction = signal<'ltr' | 'rtl' | 'auto'>('auto');
    readonly reveal = signal<'row' | 'image'>('row');
    protected readonly String = String;
}

async function renderHost(): Promise<ComponentFixture<JustifiedHost>> {
    const fixture = TestBed.createComponent(JustifiedHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
}

function grid(): HTMLElement {
    return document.querySelector<HTMLElement>('lg-justified-grid')!;
}

function triggers(): HTMLElement[] {
    return Array.from(grid().querySelectorAll<HTMLElement>('a'));
}

/** Positioned triggers grouped by row (style.top), hidden ones skipped. */
function rowsOf(items: HTMLElement[]): HTMLElement[][] {
    const byTop = new Map<string, HTMLElement[]>();
    items.forEach((trigger) => {
        if (trigger.classList.contains('lg-justified-item-hidden')) {
            return;
        }
        const row = byTop.get(trigger.style.top) ?? [];
        row.push(trigger);
        byTop.set(trigger.style.top, row);
    });
    return Array.from(byTop.values());
}
const load = (trigger: HTMLElement): void => {
    trigger.querySelector('img')!.dispatchEvent(new Event('load'));
};
const visible = (trigger: HTMLElement): boolean =>
    trigger.classList.contains('lg-justified-item-visible');

// jsdom has no layout — the grid measures clientWidth on its host.
const originalClientWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientWidth',
);

beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get(this: HTMLElement) {
            return this.classList?.contains('lg-justified')
                ? CONTAINER_WIDTH
                : 0;
        },
    });
});

afterEach(() => {
    if (originalClientWidth) {
        Object.defineProperty(
            HTMLElement.prototype,
            'clientWidth',
            originalClientWidth,
        );
    }
});

describe('LgJustifiedGridComponent', () => {
    it('positions the triggers in exactly filled rows', async () => {
        await renderHost();
        expect(grid().classList.contains('lg-justified')).toBe(true);
        expect(grid().style.height).not.toBe('');

        const items = triggers();
        const firstTop = items[0]!.style.top;
        const firstRow = items.filter(
            (trigger) => trigger.style.top === firstTop,
        );
        const total =
            firstRow.reduce(
                (sum, trigger) => sum + parseInt(trigger.style.width, 10),
                0,
            ) +
            10 * (firstRow.length - 1);
        expect(total).toBe(CONTAINER_WIDTH);
        expect(items[0]!.classList.contains('lg-justified-item')).toBe(true);
    });

    it('marks the container so the reveal rules stay off other layouts', async () => {
        // The stylesheet holds a thumbnail invisible until this grid
        // reveals it; the marker keeps those rules away from a grid
        // whose geometry is written by other code.
        await renderHost();
        expect(grid().classList.contains('lg-justified-reveal')).toBe(true);
    });

    it('writes a precise sizes hint for srcset thumbnails', async () => {
        await renderHost();
        const first = triggers()[0]!;
        expect(first.querySelector('img')!.getAttribute('sizes')).toBe(
            `${first.style.width.replace('px', '')}px`,
        );
    });

    it('reveals each trigger once its thumbnail has loaded', async () => {
        const fixture = await renderHost();
        fixture.componentInstance.reveal.set('image');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const items = triggers();
        // jsdom never loads images: positioned, still invisible.
        expect(items[0]!.style.width).not.toBe('');
        expect(items[0]!.classList.contains('lg-justified-item-visible')).toBe(
            false,
        );
        items[1]!.querySelector('img')!.dispatchEvent(new Event('load'));
        expect(items[1]!.classList.contains('lg-justified-item-visible')).toBe(
            true,
        );
        expect(items[0]!.classList.contains('lg-justified-item-visible')).toBe(
            false,
        );
        items[2]!.querySelector('img')!.dispatchEvent(new Event('error'));
        expect(items[2]!.classList.contains('lg-justified-item-visible')).toBe(
            true,
        );
    });

    it('reveals rows top to bottom, each once every thumbnail in it loaded', async () => {
        await renderHost();
        const rows = rowsOf(triggers());
        expect(rows.length).toBeGreaterThanOrEqual(2);
        // The whole second row loads first: it waits for the row above.
        rows[1]!.forEach(load);
        expect(rows[1]!.some(visible)).toBe(false);
        rows[0]!.slice(1).forEach(load);
        expect(rows[0]!.some(visible)).toBe(false);
        // The last one lands: row one shows, and row two right behind it.
        load(rows[0]![0]!);
        expect(rows[0]!.every(visible)).toBe(true);
        expect(rows[1]!.every(visible)).toBe(true);
        rows.slice(2).forEach((row) => expect(row.some(visible)).toBe(false));
    });

    it('maps the start offset to the right edge in rtl', async () => {
        const fixture = await renderHost();
        fixture.componentInstance.direction.set('rtl');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const first = triggers()[0]!;
        expect(first.style.right).toBe('0px');
        expect(first.style.left).toBe('auto');
    });
});
