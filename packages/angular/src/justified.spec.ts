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

    it('writes a precise sizes hint for srcset thumbnails', async () => {
        await renderHost();
        const first = triggers()[0]!;
        expect(first.querySelector('img')!.getAttribute('sizes')).toBe(
            `${first.style.width.replace('px', '')}px`,
        );
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
