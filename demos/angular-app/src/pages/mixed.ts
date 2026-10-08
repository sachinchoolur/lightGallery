import { Component, computed } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import { withFullscreen } from '@lightgallery/angular/plugins/fullscreen';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { MIXED_ITEMS, MODES, type Mode } from '../../../shared/media';
import { checked, pick, settingsStore } from '../settings';

type PluginToggle =
    | 'thumbnail'
    | 'zoom'
    | 'rotate'
    | 'video'
    | 'fullscreen'
    | 'autoplay';

const PLUGIN_TOGGLES: { key: PluginToggle; label: string }[] = [
    { key: 'thumbnail', label: 'Thumbnail' },
    { key: 'zoom', label: 'Zoom' },
    { key: 'rotate', label: 'Rotate' },
    { key: 'video', label: 'Video' },
    { key: 'fullscreen', label: 'Fullscreen' },
    { key: 'autoplay', label: 'Autoplay' },
];

@Component({
    selector: 'page-mixed',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <section>
            <h2>Mixed media</h2>
            <p class="note">
                Videos interleaved with images of every size and shape, so the
                slide type changes on almost every step. Zoom an image, then
                swipe to a video and back; play a video, then swipe away. Turn
                the Video plugin off to see how video slides degrade.
            </p>
            <details class="panel" open>
                <summary>Settings</summary>
                <div class="controls">
                    <div class="control-group">
                        <strong>Plugins</strong>
                        @for (entry of pluginToggles; track entry.key) {
                            <label>
                                <input
                                    type="checkbox"
                                    [checked]="s()[entry.key]"
                                    (change)="store.patch(entry.key, checked($event))"
                                />
                                {{ entry.label }}
                            </label>
                        }
                    </div>
                    <div class="control-group">
                        <strong>Transition</strong>
                        <label>
                            Mode
                            <select
                                (change)="store.patch('mode', pick(modes, $event))"
                            >
                                @for (entry of modes; track entry) {
                                    <option
                                        [value]="entry"
                                        [selected]="entry === s().mode"
                                    >
                                        {{ entry }}
                                    </option>
                                }
                            </select>
                        </label>
                    </div>
                </div>
            </details>
            <p class="readout">{{ items.length }} slides</p>
            @for (key of keys(); track key) {
                <lg-gallery [features]="features()" [mode]="s().mode">
                    <div class="grid">
                        @for (item of items; track item.alt) {
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
export class MixedPage {
    readonly items = MIXED_ITEMS;
    readonly modes = MODES;
    readonly pluginToggles = PLUGIN_TOGGLES;
    readonly pick = pick;
    readonly checked = checked;

    readonly store = settingsStore({
        thumbnail: true,
        zoom: true,
        rotate: false,
        video: true,
        fullscreen: true,
        autoplay: false,
        mode: 'lg-slide' as Mode,
    });
    readonly s = this.store.value;

    readonly keys = computed(() => [JSON.stringify(this.s())]);

    /** Zoom before Rotate keeps zoom as the outermost slide wrapper. */
    readonly features = computed(() => {
        const s = this.s();
        const list = [];
        if (s.thumbnail) list.push(withThumbnail());
        if (s.zoom)
            list.push(withZoom({ showZoomInOutIcons: true, actualSize: true }));
        if (s.rotate) list.push(withRotate());
        if (s.video) list.push(withVideo());
        if (s.fullscreen) list.push(withFullscreen());
        if (s.autoplay) list.push(withAutoplay());
        return list;
    });
}
