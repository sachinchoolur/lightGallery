import { Component, computed } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { THUMB_COUNTS, manyItems } from '../../../shared/media';
import { checked, pick, settingsStore } from '../settings';

const POSITIONS = ['left', 'middle', 'right'] as const;
type Position = (typeof POSITIONS)[number];
const WIDTHS = [60, 100, 150];
const HEIGHTS = ['60px', '80px', '120px'];
const MARGINS = [0, 5, 15];

@Component({
    selector: 'page-thumbnails',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <section>
            <h2>Thumbnails</h2>
            <p class="note">
                Up to 500 slides with mixed aspect ratios. Drag and fling the
                strip, scrub it, jump far through it, and check the active
                thumbnail stays in view. Compare with virtualization on.
            </p>
            <details class="panel" open>
                <summary>Settings</summary>
                <div class="controls">
                    <div class="control-group">
                        <strong>Slides</strong>
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
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().virtualization"
                                (change)="
                                    store.patch('virtualization', checked($event))
                                "
                            />
                            virtualization
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().zoom"
                                (change)="store.patch('zoom', checked($event))"
                            />
                            Zoom plugin
                        </label>
                    </div>
                    <div class="control-group">
                        <strong>Strip behaviour</strong>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().animateThumb"
                                (change)="
                                    store.patch('animateThumb', checked($event))
                                "
                            />
                            animateThumb
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().toggleThumb"
                                (change)="store.patch('toggleThumb', checked($event))"
                            />
                            toggleThumb
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().enableThumbDrag"
                                (change)="
                                    store.patch('enableThumbDrag', checked($event))
                                "
                            />
                            enableThumbDrag
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().scrubThumbnails"
                                (change)="
                                    store.patch('scrubThumbnails', checked($event))
                                "
                            />
                            scrubThumbnails
                        </label>
                    </div>
                    <div class="control-group">
                        <strong>Strip layout</strong>
                        <label>
                            thumbWidth
                            <select
                                (change)="
                                    store.patch('thumbWidth', pick(widths, $event))
                                "
                            >
                                @for (entry of widths; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().thumbWidth"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            thumbHeight
                            <select
                                (change)="
                                    store.patch('thumbHeight', pick(heights, $event))
                                "
                            >
                                @for (entry of heights; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().thumbHeight"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            thumbMargin
                            <select
                                (change)="
                                    store.patch('thumbMargin', pick(margins, $event))
                                "
                            >
                                @for (entry of margins; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().thumbMargin"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            alignThumbnails
                            <select
                                (change)="
                                    store.patch(
                                        'alignThumbnails',
                                        pick(positions, $event)
                                    )
                                "
                            >
                                @for (entry of positions; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().alignThumbnails"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                        <label>
                            currentPagerPosition
                            <select
                                (change)="
                                    store.patch(
                                        'currentPagerPosition',
                                        pick(positions, $event)
                                    )
                                "
                            >
                                @for (entry of positions; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="
                                            entry === s().currentPagerPosition
                                        "
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                    </div>
                </div>
            </details>
            <p class="readout">
                {{ items().length }} slides · thumbnails {{ s().thumbWidth }}px ×
                {{ s().thumbHeight }}
            </p>
            @for (key of keys(); track key) {
                <lg-gallery
                    [features]="features()"
                    [virtualization]="virtualization()"
                >
                    <div class="grid grid-dense">
                        @for (item of items(); track item.alt) {
                            <a
                                [attr.href]="item.src ?? null"
                                [lgGalleryItem]="item"
                                [attr.data-lg-size]="item.lgSize"
                            >
                                <img
                                    [src]="item.thumb"
                                    [alt]="item.alt"
                                    [width]="item.thumbWidth"
                                    [height]="item.thumbHeight"
                                    loading="lazy"
                                />
                            </a>
                        }
                    </div>
                </lg-gallery>
            }
        </section>
    `,
})
export class ThumbnailsPage {
    readonly counts = THUMB_COUNTS;
    readonly positions = POSITIONS;
    readonly widths = WIDTHS;
    readonly heights = HEIGHTS;
    readonly margins = MARGINS;
    readonly pick = pick;
    readonly checked = checked;

    readonly store = settingsStore({
        count: 100,
        zoom: true,
        virtualization: false,
        animateThumb: true,
        toggleThumb: false,
        enableThumbDrag: true,
        scrubThumbnails: false,
        thumbWidth: 100,
        thumbHeight: '80px',
        thumbMargin: 5,
        alignThumbnails: 'middle' as Position,
        currentPagerPosition: 'middle' as Position,
    });
    readonly s = this.store.value;

    readonly keys = computed(() => [JSON.stringify(this.s())]);
    readonly items = computed(() => manyItems(this.s().count));

    readonly virtualization = computed(() =>
        this.s().virtualization
            ? { slides: 5, thumbs: 'auto' as const }
            : undefined,
    );

    readonly features = computed(() => {
        const s = this.s();
        const list = [];
        list.push(
            withThumbnail({
                animateThumb: s.animateThumb,
                toggleThumb: s.toggleThumb,
                enableThumbDrag: s.enableThumbDrag,
                scrubThumbnails: s.scrubThumbnails,
                thumbWidth: s.thumbWidth,
                thumbHeight: s.thumbHeight,
                thumbMargin: s.thumbMargin,
                alignThumbnails: s.alignThumbnails,
                currentPagerPosition: s.currentPagerPosition,
            }),
        );
        if (s.zoom) list.push(withZoom());
        return list;
    });
}
