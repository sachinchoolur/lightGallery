import { Component, computed } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import { withComment } from '@lightgallery/angular/plugins/comment';
import { withFullscreen } from '@lightgallery/angular/plugins/fullscreen';
import { withHash } from '@lightgallery/angular/plugins/hash';
import { withMediumZoom } from '@lightgallery/angular/plugins/mediumZoom';
import { withPager } from '@lightgallery/angular/plugins/pager';
import { withRelativeCaption } from '@lightgallery/angular/plugins/relativeCaption';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withShare } from '@lightgallery/angular/plugins/share';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { MIXED_ITEMS, MODES, type Mode } from '../../../shared/media';
import { checked, flip, pick, settingsStore } from '../settings';

const PLUGIN_IDS = [
    'thumbnail',
    'zoom',
    'rotate',
    'video',
    'share',
    'autoplay',
    'fullscreen',
    'pager',
    'comment',
    'mediumZoom',
    'relativeCaption',
    'hash',
] as const;
type PluginId = (typeof PLUGIN_IDS)[number];

const LABELS: Record<PluginId, string> = {
    thumbnail: 'Thumbnail',
    zoom: 'Zoom',
    rotate: 'Rotate',
    video: 'Video',
    share: 'Share',
    autoplay: 'Autoplay',
    fullscreen: 'Fullscreen',
    pager: 'Pager',
    comment: 'Comment',
    mediumZoom: 'Medium zoom',
    relativeCaption: 'Relative caption',
    hash: 'Hash',
};

const PRESETS: { label: string; ids: PluginId[] }[] = [
    { label: 'Minimal', ids: [] },
    { label: 'Typical', ids: ['thumbnail', 'zoom', 'video'] },
    { label: 'All plugins', ids: [...PLUGIN_IDS] },
];

const DIRECTIONS = ['ltr', 'rtl'] as const;

@Component({
    selector: 'page-combinations',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <section>
            <h2>Plugin combinations</h2>
            <p class="note">
                Images of every shape plus video slides. Toggle any mix of
                plugins and settings; the gallery rebuilds with exactly that
                combination.
            </p>
            <details class="panel" open>
                <summary>Settings</summary>
                <div class="controls">
                    <div class="control-group">
                        <strong>Plugins</strong>
                        @for (id of pluginIds; track id) {
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().active.includes(id)"
                                (change)="
                                    store.patch('active', flip(s().active, id))
                                "
                            />
                            {{ labels[id] }}
                        </label>
                        }
                    </div>
                    <div class="control-group">
                        <strong>Presets</strong>
                        @for (preset of presets; track preset.label) {
                        <button
                            type="button"
                            (click)="store.patch('active', preset.ids)"
                        >
                            {{ preset.label }}
                        </button>
                        }
                    </div>
                    <div class="control-group">
                        <strong>Settings</strong>
                        <label>
                            Mode
                            <select
                                (change)="
                                    store.patch('mode', pick(modes, $event))
                                "
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
                        <label>
                            Direction
                            <select
                                (change)="
                                    store.patch(
                                        'direction',
                                        pick(directions, $event)
                                    )
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
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().actualSize"
                                (change)="
                                    store.patch('actualSize', checked($event))
                                "
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
                                [checked]="s().virtualization"
                                (change)="
                                    store.patch(
                                        'virtualization',
                                        checked($event)
                                    )
                                "
                            />
                            virtualization
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().allowMediaOverlap"
                                (change)="
                                    store.patch(
                                        'allowMediaOverlap',
                                        checked($event)
                                    )
                                "
                            />
                            allowMediaOverlap
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().download"
                                (change)="
                                    store.patch('download', checked($event))
                                "
                            />
                            download
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().counter"
                                (change)="
                                    store.patch('counter', checked($event))
                                "
                            />
                            counter
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                [checked]="s().gestureButtons"
                                (change)="
                                    store.patch(
                                        'gestureButtons',
                                        checked($event)
                                    )
                                "
                            />
                            showGestureButtons (mobile)
                        </label>
                    </div>
                </div>
            </details>
            <p class="readout">
                Active:
                <code>{{ s().active.join(' + ') || 'core only' }}</code> ·
                <code>{{ s().mode }}</code> · <code>{{ s().direction }}</code>
            </p>
            @for (key of keys(); track key) {
            <lg-gallery
                [features]="features()"
                [mode]="s().mode"
                [direction]="s().direction"
                [download]="s().download"
                [counter]="s().counter"
                [mobileSettings]="mobileSettings()"
                [allowMediaOverlap]="s().allowMediaOverlap"
                [virtualization]="virtualization()"
            >
                <div class="grid">
                    @for (item of items; track item.alt) {
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
export class CombinationsPage {
    readonly items = MIXED_ITEMS;
    readonly pluginIds = PLUGIN_IDS;
    readonly labels = LABELS;
    readonly presets = PRESETS;
    readonly modes = MODES;
    readonly directions = DIRECTIONS;
    readonly flip = flip;
    readonly pick = pick;
    readonly checked = checked;

    readonly store = settingsStore({
        active: ['thumbnail', 'zoom', 'video'] as PluginId[],
        mode: 'lg-slide' as Mode,
        direction: 'ltr' as (typeof DIRECTIONS)[number],
        actualSize: true,
        infiniteZoom: true,
        virtualization: false,
        allowMediaOverlap: false,
        download: true,
        counter: true,
        gestureButtons: false,
    });
    readonly s = this.store.value;

    /**
     * User mobileSettings replace the defaults wholesale, so repeat them
     * and let the toggle drive the gesture buttons only.
     */
    readonly mobileSettings = computed(() => ({
        controls: false,
        showCloseIcon: false,
        download: false,
        showGestureButtons: this.s().gestureButtons,
    }));

    /** A changed key destroys and recreates the gallery (`@for` + `track`). */
    readonly keys = computed(() => [JSON.stringify(this.s())]);

    readonly virtualization = computed(() =>
        this.s().virtualization
            ? { slides: 5, thumbs: 'auto' as const }
            : undefined,
    );

    /** Zoom before Rotate keeps zoom as the outermost slide wrapper. */
    readonly features = computed(() => {
        const s = this.s();
        const on = (id: PluginId) => s.active.includes(id);
        const list = [];
        if (on('thumbnail')) list.push(withThumbnail());
        if (on('zoom'))
            list.push(
                withZoom({
                    showZoomInOutIcons: true,
                    actualSize: s.actualSize,
                    infiniteZoom: s.infiniteZoom,
                }),
            );
        if (on('rotate')) list.push(withRotate());
        if (on('video')) list.push(withVideo());
        if (on('share')) list.push(withShare());
        if (on('autoplay')) list.push(withAutoplay());
        if (on('fullscreen')) list.push(withFullscreen());
        if (on('pager')) list.push(withPager());
        if (on('comment')) list.push(withComment());
        if (on('mediumZoom')) list.push(withMediumZoom());
        if (on('relativeCaption')) list.push(withRelativeCaption());
        if (on('hash')) list.push(withHash());
        return list;
    });
}
