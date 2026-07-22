import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import {
    DomSanitizer,
    type SafeResourceUrl,
} from '@angular/platform-browser';
import {
    getSlideType,
    getVideoInfo,
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
    type PlayerParams,
    type VideoInfo,
} from '@lightgallery/headless';
import {
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';

/**
 * Video feature: HTML5 / YouTube / Vimeo / Wistia slides (2.x `lg-video`) —
 * the slide-renderer template wave 2 copies. The `videojs` option is
 * dropped per the inherited ADR decision; custom players go through the
 * `lgSlide` template slot (wave 2).
 *
 * The embed URLs come from the headless builders (validated video ids), so
 * bypassing Angular's resource-URL sanitizer for them is deliberate and
 * confined to those builders' output.
 */

export interface VideoSettings {
    /** Autoplay the first slide's video once it loads. */
    autoplayFirstVideo: boolean;
    /** Extra YouTube player parameters. */
    youTubePlayerParams: PlayerParams;
    /** Extra Vimeo player parameters. */
    vimeoPlayerParams: PlayerParams;
    /** Extra Wistia player parameters. */
    wistiaPlayerParams: PlayerParams;
    /** Go to the next slide when an HTML5 video ends. */
    gotoNextSlideOnVideoEnd: boolean;
    /** Autoplay videos when their slide becomes current. */
    autoplayVideoOnSlide: boolean;
}

export const videoSettings: VideoSettings = {
    autoplayFirstVideo: true,
    youTubePlayerParams: false,
    vimeoPlayerParams: false,
    wistiaPlayerParams: false,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false,
};

interface Html5VideoSource {
    source?: Array<{ src: string; type?: string }>;
    tracks?: Array<Record<string, string>>;
    attributes?: Record<string, string | boolean>;
}

function parseHtml5Video(video: unknown): Html5VideoSource | undefined {
    if (!video) {
        return undefined;
    }
    if (typeof video === 'string') {
        try {
            return JSON.parse(video) as Html5VideoSource;
        } catch {
            return undefined;
        }
    }
    return video as Html5VideoSource;
}

function providerClass(videoInfo: VideoInfo): string {
    if (videoInfo.youtube) {
        return 'lg-has-youtube';
    }
    if (videoInfo.vimeo) {
        return 'lg-has-vimeo';
    }
    if (videoInfo.wistia) {
        return 'lg-has-wistia';
    }
    return 'lg-has-html5';
}

type VideoResolved = VideoSettings & {
    videoMaxSize: string;
    loadYouTubePoster: boolean;
    strings: { playVideo: string };
};

@Component({
    selector: 'lg-video-slide',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (info(); as info) {
            <div
                class="lg-video-cont"
                [class]="contClasses()"
                [style.width]="'100%'"
                [style.max-width.px]="maxSize().width"
                [style.max-height]="'100%'"
                [style.aspect-ratio]="
                    maxSize().width + ' / ' + maxSize().height
                "
            >
                @if (showPlayer()) {
                    @if (embedUrl(); as url) {
                        <iframe
                            #media
                            [class]="iframeClasses()"
                            [attr.name]="
                                info.wistia ? 'wistia_embed' : null
                            "
                            [src]="url"
                            allow="autoplay"
                            allowfullscreen
                            frameborder="0"
                            [attr.title]="mediaTitle()"
                            (load)="onMediaReady()"
                        ></iframe>
                    } @else if (html5()) {
                        <video
                            #media
                            class="lg-video-object lg-html5"
                            (loadedmetadata)="onMediaReady()"
                            (ended)="onVideoEnded()"
                            (pointerdown)="$event.stopPropagation()"
                        >
                            @for (
                                source of html5()?.source ?? [];
                                track $index
                            ) {
                                <source
                                    [attr.src]="source.src"
                                    [attr.type]="source.type ?? null"
                                />
                            }
                            @for (
                                track of html5()?.tracks ?? [];
                                track $index
                            ) {
                                <track
                                    [attr.kind]="track['kind'] ?? null"
                                    [attr.src]="track['src'] ?? null"
                                    [attr.srclang]="track['srclang'] ?? null"
                                    [attr.label]="track['label'] ?? null"
                                    [attr.default]="track['default'] ?? null"
                                />
                            }
                            Your browser does not support HTML5 video.
                        </video>
                    }
                }
                @if (!activated() && hasPoster()) {
                    <button
                        type="button"
                        class="lg-video-poster-wrap"
                        style="
                            all: unset;
                            cursor: pointer;
                            display: block;
                            width: 100%;
                            height: 100%;
                        "
                        [attr.aria-label]="settings().strings.playVideo"
                        (click)="onPosterClick()"
                    >
                        <div class="lg-video-play-button">
                            <svg
                                viewBox="0 0 20 20"
                                preserveAspectRatio="xMidYMid"
                                focusable="false"
                                role="img"
                                class="lg-video-play-icon"
                            >
                                <title>
                                    {{ settings().strings.playVideo }}
                                </title>
                                <polygon
                                    class="lg-video-play-icon-inner"
                                    points="1,0 20,10 1,20"
                                />
                            </svg>
                            <svg
                                class="lg-video-play-icon-bg"
                                viewBox="0 0 50 50"
                                focusable="false"
                            >
                                <circle cx="50%" cy="50%" r="20" />
                            </svg>
                            <svg
                                class="lg-video-play-icon-circle"
                                viewBox="0 0 50 50"
                                focusable="false"
                            >
                                <circle cx="50%" cy="50%" r="20" />
                            </svg>
                        </div>
                        <img
                            class="lg-object lg-video-poster"
                            [src]="poster()"
                            [alt]="item().alt ?? ''"
                            draggable="false"
                            (load)="onPosterLoad()"
                        />
                    </button>
                }
            </div>
        }
    `,
})
export class LgVideoSlideComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();

    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    private readonly sanitizer = inject(DomSanitizer);

    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as VideoResolved,
    );
    protected readonly html5 = computed(() =>
        parseHtml5Video(this.item().video),
    );
    protected readonly info = computed(() =>
        getVideoInfo(this.item().src, !!this.html5()),
    );
    // 2.x loadYouTubePoster: derive a poster for YouTube slides without one.
    protected readonly poster = computed(() => {
        const item = this.item();
        if (item.poster) {
            return item.poster;
        }
        const info = this.info();
        if (this.settings().loadYouTubePoster && info?.youtube) {
            return `//img.youtube.com/vi/${info.youtube[1]}/maxresdefault.jpg`;
        }
        return undefined;
    });
    protected readonly hasPoster = computed(() => !!this.poster());
    protected readonly activated = signal(false);
    protected readonly showPlayer = computed(
        () => this.activated() || !this.hasPoster(),
    );
    protected readonly contClasses = computed(() => {
        const info = this.info();
        return [
            info ? providerClass(info) : '',
            this.showPlayer() ? 'lg-video-loaded' : '',
        ]
            .filter(Boolean)
            .join(' ');
    });
    protected readonly iframeClasses = computed(() => {
        const info = this.info();
        if (info?.youtube) {
            return 'lg-video-object lg-youtube';
        }
        if (info?.vimeo) {
            return 'lg-video-object lg-vimeo';
        }
        return 'wistia_embed lg-video-object lg-wistia';
    });
    protected readonly maxSize = computed(() => {
        const [width = 1280, height = 720] = this.settings()
            .videoMaxSize.split('-')
            .map((value) => parseInt(value, 10));
        return { width, height };
    });
    protected readonly mediaTitle = computed(
        () =>
            this.item().title ??
            this.item().alt ??
            'Embedded video player',
    );
    protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
        const info = this.info();
        const settings = this.settings();
        if (!info) {
            return null;
        }
        let url: string | undefined;
        if (info.youtube) {
            url = getYouTubeEmbedUrl(
                info,
                settings.youTubePlayerParams,
                this.item().src ?? '',
            );
        } else if (info.vimeo) {
            url = getVimeoEmbedUrl(info, settings.vimeoPlayerParams);
        } else if (info.wistia) {
            url = getWistiaEmbedUrl(info, settings.wistiaPlayerParams);
        }
        return url
            ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
            : null;
    });

    private readonly mediaEl = viewChild<ElementRef<HTMLElement>>('media');
    private pendingPlay = false;
    private playTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        // hasVideo (informational) + load-state for slides without a poster:
        // a video slide counts as loaded immediately (2.x parity).
        afterNextRender(() => {
            const index = this.index();
            const item = this.item();
            this.ctx.emit('hasVideo', {
                index,
                src: item.src,
                html5Video: item.video,
                hasPoster: untracked(this.hasPoster),
            });
            if (!untracked(this.hasPoster)) {
                this.markLoaded();
            }
        });
        // Apply the item's arbitrary html5 `attributes` record (controls,
        // muted, playsinline, ...) — Angular templates cannot spread
        // attributes, so this is imperative on purpose.
        effect(() => {
            const el = this.mediaEl()?.nativeElement;
            const html5 = this.html5();
            if (!el || !html5 || el.tagName !== 'VIDEO') {
                return;
            }
            Object.entries(html5.attributes ?? {}).forEach(
                ([key, value]) => {
                    if (value === false) {
                        el.removeAttribute(key);
                    } else {
                        el.setAttribute(
                            key,
                            value === true ? '' : String(value),
                        );
                    }
                },
            );
        });
        // Autoplay + pause-on-leave via the event bus (2.x event wiring).
        const offs = [
            this.ctx.events.on('slideItemLoad', (detail) => {
                if (detail.index !== this.index()) {
                    return;
                }
                const current = this.isCurrent();
                const cfg = untracked(this.settings);
                if (
                    detail.isFirstSlide &&
                    cfg.autoplayFirstVideo &&
                    current
                ) {
                    this.playTimer = setTimeout(
                        () => this.activateAndPlay(),
                        200,
                    );
                } else if (
                    !detail.isFirstSlide &&
                    cfg.autoplayVideoOnSlide &&
                    current
                ) {
                    this.activateAndPlay();
                }
            }),
            this.ctx.events.on('afterSlide', (detail) => {
                if (
                    untracked(this.settings).autoplayVideoOnSlide &&
                    detail.index === this.index() &&
                    detail.index !== detail.prevIndex
                ) {
                    this.playTimer = setTimeout(
                        () => this.activateAndPlay(),
                        100,
                    );
                }
            }),
            this.ctx.events.on('beforeSlide', (detail) => {
                if (
                    detail.prevIndex === this.index() &&
                    detail.index !== this.index()
                ) {
                    this.control('pause');
                }
            }),
        ];
        inject(DestroyRef).onDestroy(() => {
            offs.forEach((off) => off());
            if (this.playTimer !== null) {
                clearTimeout(this.playTimer);
            }
        });
    }

    private isCurrent(): boolean {
        return this.ctx.state().currentIndex === this.index();
    }

    private markLoaded(): void {
        const index = this.index();
        const state = this.ctx.state();
        if (state.loadedSlides.has(index)) {
            return;
        }
        const isFirstSlide = !state.galleryOn;
        this.ctx.actions.dispatch({ type: 'SLIDE_LOADED', index });
        this.ctx.emit('slideItemLoad', { index, delay: 0, isFirstSlide });
    }

    private control(action: 'play' | 'pause'): void {
        const el = this.mediaEl()?.nativeElement;
        const info = untracked(this.info);
        if (!el || !info) {
            return;
        }
        if (info.html5) {
            const video = el as HTMLVideoElement;
            if (action === 'play') {
                void video.play?.()?.catch?.(() => undefined);
            } else {
                video.pause?.();
            }
            return;
        }
        const frame = el as HTMLIFrameElement;
        try {
            if (info.youtube) {
                frame.contentWindow?.postMessage(
                    `{"event":"command","func":"${action}Video","args":""}`,
                    '*',
                );
            } else if (info.vimeo) {
                frame.contentWindow?.postMessage(
                    JSON.stringify({ method: action }),
                    '*',
                );
            }
            // Wistia control needs its player API script — deliberately
            // skipped (2.x pushed to window._wq; noted deviation).
        } catch {
            // Cross-origin messaging is best-effort.
        }
    }

    private activateAndPlay(): void {
        this.pendingPlay = true;
        this.activated.set(true);
        // Already activated → the media is (or soon is) ready.
        this.control('play');
    }

    protected onMediaReady(): void {
        if (this.pendingPlay) {
            this.pendingPlay = false;
            this.control('play');
        }
    }

    protected onVideoEnded(): void {
        if (untracked(this.settings).gotoNextSlideOnVideoEnd) {
            this.ctx.actions.nextSlide();
        }
    }

    protected onPosterClick(): void {
        this.ctx.emit('posterClick', undefined);
        this.activateAndPlay();
    }

    protected onPosterLoad(): void {
        this.markLoaded();
    }
}

export function withVideo(
    options: Partial<VideoSettings> = {},
): LgFeature<VideoSettings> {
    return {
        name: 'video',
        defaults: videoSettings,
        options,
        slideRenderer: {
            component: LgVideoSlideComponent,
            canRender: (item) => getSlideType(item) === 'video',
        },
    };
}
