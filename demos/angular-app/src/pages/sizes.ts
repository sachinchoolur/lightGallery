import { Component, computed } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import {
    SHAPES,
    SIZE_CLASSES,
    SIZE_ITEMS,
    type Shape,
    type SizeClass,
} from '../../../shared/media';
import { checked, flip, pick, settingsStore } from '../settings';

const SCALES = [0.5, 1, 2];

@Component({
    selector: 'page-sizes',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <section>
            <h2>Image sizes</h2>
            <p class="note">
                Every size class, from 60&nbsp;px up to 5000&nbsp;px, in every
                shape. Tiny and small images are below the stage, so actual-size
                zoom should leave them at their natural size; huge ones test
                fitting, pan bounds and decode time.
            </p>
            <details class="panel" open>
                <summary>Settings</summary>
                <div class="controls">
                    <div class="control-group">
                        <strong>Size</strong>
                        @for (entry of sizeClasses; track entry) {
                            <label>
                                <input
                                    type="checkbox"
                                    [checked]="s().sizes.includes(entry)"
                                    (change)="
                                        store.patch('sizes', flip(s().sizes, entry))
                                    "
                                />
                                {{ entry }}
                            </label>
                        }
                    </div>
                    <div class="control-group">
                        <strong>Shape</strong>
                        @for (entry of shapes; track entry) {
                            <label>
                                <input
                                    type="checkbox"
                                    [checked]="s().shapes.includes(entry)"
                                    (change)="
                                        store.patch(
                                            'shapes',
                                            flip(s().shapes, entry)
                                        )
                                    "
                                />
                                {{ entry }}
                            </label>
                        }
                    </div>
                    <div class="control-group">
                        <strong>Plugins</strong>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().thumbnail"
                                (change)="store.patch('thumbnail', checked($event))"
                            />
                            Thumbnail
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().zoom"
                                (change)="store.patch('zoom', checked($event))"
                            />
                            Zoom
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().rotate"
                                (change)="store.patch('rotate', checked($event))"
                            />
                            Rotate
                        </label>
                    </div>
                    <div class="control-group">
                        <strong>Zoom</strong>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().actualSize"
                                (change)="store.patch('actualSize', checked($event))"
                            />
                            actualSize
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().infiniteZoom"
                                (change)="
                                    store.patch('infiniteZoom', checked($event))
                                "
                            />
                            infiniteZoom
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().showZoomInOutIcons"
                                (change)="
                                    store.patch(
                                        'showZoomInOutIcons',
                                        checked($event)
                                    )
                                "
                            />
                            showZoomInOutIcons
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().zoomFromOrigin"
                                (change)="
                                    store.patch('zoomFromOrigin', checked($event))
                                "
                            />
                            zoomFromOrigin
                        </label>
                        <label>
                            scale
                            <select
                                (change)="store.patch('scale', pick(scales, $event))"
                            >
                                @for (entry of scales; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().scale"
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
                <lg-gallery
                    [features]="features()"
                    [zoomFromOrigin]="s().zoomFromOrigin"
                >
                    <div class="grid">
                        @for (item of items(); track item.alt) {
                            <figure class="tile">
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
                                <figcaption>{{ item.caption }}</figcaption>
                            </figure>
                        }
                    </div>
                </lg-gallery>
            }
        </section>
    `,
})
export class SizesPage {
    readonly sizeClasses = SIZE_CLASSES;
    readonly shapes = SHAPES;
    readonly scales = SCALES;
    readonly flip = flip;
    readonly pick = pick;
    readonly checked = checked;

    readonly store = settingsStore({
        sizes: [...SIZE_CLASSES] as SizeClass[],
        shapes: [...SHAPES] as Shape[],
        thumbnail: true,
        zoom: true,
        rotate: false,
        actualSize: true,
        infiniteZoom: true,
        showZoomInOutIcons: true,
        zoomFromOrigin: true,
        scale: 1,
    });
    readonly s = this.store.value;

    readonly keys = computed(() => [JSON.stringify(this.s())]);

    readonly items = computed(() => {
        const s = this.s();
        return SIZE_ITEMS.filter(
            (item) =>
                s.sizes.some((tag) => item.tags.includes(tag)) &&
                s.shapes.some((tag) => item.tags.includes(tag)),
        );
    });

    /** Zoom before Rotate keeps zoom as the outermost slide wrapper. */
    readonly features = computed(() => {
        const s = this.s();
        const list = [];
        if (s.thumbnail) list.push(withThumbnail());
        if (s.zoom)
            list.push(
                withZoom({
                    actualSize: s.actualSize,
                    infiniteZoom: s.infiniteZoom,
                    showZoomInOutIcons: s.showZoomInOutIcons,
                    scale: s.scale,
                }),
            );
        if (s.rotate) list.push(withRotate());
        return list;
    });
}
