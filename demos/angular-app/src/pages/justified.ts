import { Component, computed } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { LgJustifiedGridComponent } from '@lightgallery/angular/plugins/justified';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { SIZE_ITEMS, manyItems } from '../../../shared/media';
import { pick, settingsStore } from '../settings';

const SOURCES = ['mixed ratios', 'size catalog'] as const;
const COUNTS = [12, 40, 100, 200];
const ROW_HEIGHTS = [80, 120, 180, 260];
const GAPS = [0, 4, 8, 16];
const LAST_ROWS = ['start', 'justify', 'hide'] as const;
const MAX_SCALES = [1, 1.5, 1.75, 2.5];
const REVEALS = ['row', 'image'] as const;
const DIRECTIONS = ['auto', 'ltr', 'rtl'] as const;

@Component({
    selector: 'page-justified',
    imports: [
        LgGalleryComponent,
        LgGalleryItemDirective,
        LgJustifiedGridComponent,
    ],
    template: `
        <section>
            <h2>Justified</h2>
            <p class="note">
                Row-justified trigger grid. Resize the window or rotate the
                device and the rows should re-flow. The size catalog feeds it
                extreme strips and tiny images; reload with a slow network to
                watch the placeholders and reveal order.
            </p>
            <details class="panel" open>
                <summary>Settings</summary>
                <div class="controls">
                    <div class="control-group">
                        <strong>Content</strong>
                        <label>
                            Images
                            <select
                                (change)="
                                    store.patch('source', pick(sources, $event))
                                "
                            >
                                @for (entry of sources; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().source"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            Count
                            <select
                                (change)="store.patch('count', pick(counts, $event))"
                            >
                                @for (entry of counts; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().count"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                    </div>
                    <div class="control-group">
                        <strong>Layout</strong>
                        <label>
                            rowHeight
                            <select
                                (change)="
                                    store.patch('rowHeight', pick(rowHeights, $event))
                                "
                            >
                                @for (entry of rowHeights; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().rowHeight"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            gap
                            <select (change)="store.patch('gap', pick(gaps, $event))">
                                @for (entry of gaps; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().gap"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            lastRow
                            <select
                                (change)="
                                    store.patch('lastRow', pick(lastRows, $event))
                                "
                            >
                                @for (entry of lastRows; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().lastRow"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            maxScale
                            <select
                                (change)="
                                    store.patch('maxScale', pick(maxScales, $event))
                                "
                            >
                                @for (entry of maxScales; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().maxScale"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            reveal
                            <select
                                (change)="store.patch('reveal', pick(reveals, $event))"
                            >
                                @for (entry of reveals; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().reveal"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            direction
                            <select
                                (change)="
                                    store.patch('direction', pick(directions, $event))
                                "
                            >
                                @for (entry of directions; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().direction"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                    </div>
                </div>
            </details>
            <p class="readout">{{ items().length }} images</p>
            @for (key of keys(); track key) {
                <lg-gallery [features]="features">
                    <lg-justified-grid
                        [rowHeight]="s().rowHeight"
                        [gap]="s().gap"
                        [lastRow]="s().lastRow"
                        [maxScale]="s().maxScale"
                        [reveal]="s().reveal"
                        [direction]="s().direction"
                    >
                        @for (item of items(); track item.alt) {
                            <a
                                [attr.href]="item.src ?? null"
                                [lgGalleryItem]="item"
                                [attr.data-lg-size]="item.lgSize"
                            >
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </lg-justified-grid>
                </lg-gallery>
            }
        </section>
    `,
})
export class JustifiedPage {
    readonly sources = SOURCES;
    readonly counts = COUNTS;
    readonly rowHeights = ROW_HEIGHTS;
    readonly gaps = GAPS;
    readonly lastRows = LAST_ROWS;
    readonly maxScales = MAX_SCALES;
    readonly reveals = REVEALS;
    readonly directions = DIRECTIONS;
    readonly pick = pick;
    readonly features = [withThumbnail(), withZoom()];

    readonly store = settingsStore({
        source: 'mixed ratios' as (typeof SOURCES)[number],
        count: 40,
        rowHeight: 180,
        gap: 8,
        lastRow: 'start' as (typeof LAST_ROWS)[number],
        maxScale: 1.75,
        reveal: 'row' as (typeof REVEALS)[number],
        direction: 'auto' as (typeof DIRECTIONS)[number],
    });
    readonly s = this.store.value;

    readonly keys = computed(() => [JSON.stringify(this.s())]);

    readonly items = computed(() => {
        const s = this.s();
        return s.source === 'size catalog' ? SIZE_ITEMS : manyItems(s.count);
    });
}
