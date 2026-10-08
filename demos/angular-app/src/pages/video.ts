import { Component, computed } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { VIDEO_ITEMS, VIDEO_PROVIDERS } from '../../../shared/media';
import { checked, flip, settingsStore } from '../settings';

type VideoToggle =
    | 'videoFacade'
    | 'autoplayFirstVideo'
    | 'autoplayVideoOnSlide'
    | 'gotoNextSlideOnVideoEnd'
    | 'youTubeNoCookie'
    | 'thumbnail'
    | 'loadYouTubeThumbnail'
    | 'zoom';

const TOGGLE_GROUPS: { title: string; keys: VideoToggle[] }[] = [
    {
        title: 'Video settings',
        keys: [
            'videoFacade',
            'autoplayFirstVideo',
            'autoplayVideoOnSlide',
            'gotoNextSlideOnVideoEnd',
            'youTubeNoCookie',
        ],
    },
    {
        title: 'Other plugins',
        keys: ['thumbnail', 'loadYouTubeThumbnail', 'zoom'],
    },
];

@Component({
    selector: 'page-video',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <section>
            <h2>Video</h2>
            <p class="note">
                YouTube, Vimeo, Wistia and self-hosted HTML5, each with an
                explicit poster and without one. With facades on, the player
                loads only when you press play. On a phone, check play, pause
                when swiping away, fullscreen and rotation; mobile browsers
                usually only autoplay muted video.
            </p>
            <details class="panel" open>
                <summary>Settings</summary>
                <div class="controls">
                    <div class="control-group">
                        <strong>Providers</strong>
                        @for (entry of providers; track entry) {
                            <label>
                                <input
                                    type="checkbox"
                                    [checked]="s().providers.includes(entry)"
                                    (change)="
                                        store.patch(
                                            'providers',
                                            flip(s().providers, entry)
                                        )
                                    "
                                />
                                {{ entry }}
                            </label>
                        }
                    </div>
                    @for (group of toggleGroups; track group.title) {
                        <div class="control-group">
                            <strong>{{ group.title }}</strong>
                            @for (name of group.keys; track name) {
                                <label>
                                    <input
                                        type="checkbox"
                                        [checked]="s()[name]"
                                        (change)="store.patch(name, checked($event))"
                                    />
                                    {{ name }}
                                </label>
                            }
                        </div>
                    }
                </div>
            </details>
            <p class="readout">{{ items().length }} videos</p>
            @for (key of keys(); track key) {
                <lg-gallery [features]="features()">
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
export class VideoPage {
    readonly providers = VIDEO_PROVIDERS;
    readonly toggleGroups = TOGGLE_GROUPS;
    readonly flip = flip;
    readonly checked = checked;

    readonly store = settingsStore({
        providers: [...VIDEO_PROVIDERS],
        thumbnail: true,
        zoom: false,
        loadYouTubeThumbnail: true,
        autoplayFirstVideo: false,
        videoFacade: true,
        youTubeNoCookie: true,
        gotoNextSlideOnVideoEnd: true,
        autoplayVideoOnSlide: false,
    });
    readonly s = this.store.value;

    readonly keys = computed(() => [JSON.stringify(this.s())]);

    readonly items = computed(() => {
        const s = this.s();
        return VIDEO_ITEMS.filter((item) =>
            s.providers.some((provider) => item.tags.includes(provider)),
        );
    });

    readonly features = computed(() => {
        const s = this.s();
        const list = [];
        list.push(
            withVideo({
                autoplayFirstVideo: s.autoplayFirstVideo,
                videoFacade: s.videoFacade,
                youTubeNoCookie: s.youTubeNoCookie,
                gotoNextSlideOnVideoEnd: s.gotoNextSlideOnVideoEnd,
                autoplayVideoOnSlide: s.autoplayVideoOnSlide,
            }),
        );
        if (s.thumbnail)
            list.push(
                withThumbnail({ loadYouTubeThumbnail: s.loadYouTubeThumbnail }),
            );
        if (s.zoom) list.push(withZoom());
        return list;
    });
}
