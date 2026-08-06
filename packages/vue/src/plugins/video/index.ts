import {
    computed,
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    type PropType,
    type VNodeChild,
} from 'vue';
import {
    getFacadePoster,
    getSlideType,
    getVideoInfo,
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
    getYouTubePosterUrl,
    type PlayerParams,
    type VideoInfo,
} from '@lightgallery/headless';

import { LG_PLUGIN_CONTEXT, type LgVuePlugin } from '../types';
import { LG_RUNTIME } from '../../runtime';
import type { LgGalleryItem } from '../../types';

/**
 * Video plugin: HTML5 / YouTube / Vimeo / Wistia slides (2.x `lg-video`) —
 * the slide-renderer template. The `videojs` option is dropped per the
 * inherited ADR decision; custom players go through the `#slide` slot.
 */

export interface VideoSettings {
    /** Autoplay the first slide's video once it loads. */
    autoplayFirstVideo: boolean;
    /**
     * Render provider video slides (YouTube/Vimeo/Wistia) as lite
     * facades: a poster with a play button, with the provider iframe
     * created only when the user presses play. The facade poster falls
     * back from the item poster to the YouTube thumbnail endpoint (see
     * `loadYouTubePoster`) to the item thumb; a slide with no resolvable
     * poster keeps the eager-iframe behavior. `autoplayFirstVideo` /
     * `autoplayVideoOnSlide` force an immediate materialize by design.
     * Set false for 2.x eager iframes on all provider slides.
     */
    videoFacade: boolean;
    /**
     * Embed YouTube through the privacy-enhanced youtube-nocookie.com
     * host. Set false to embed through youtube.com; slide URLs that
     * already point at youtube-nocookie.com always keep it.
     */
    youTubeNoCookie: boolean;
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
    videoFacade: true,
    youTubeNoCookie: true,
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

function playButton(label: string): VNodeChild {
    return h('div', { class: 'lg-video-play-button' }, [
        h(
            'svg',
            {
                viewBox: '0 0 20 20',
                preserveAspectRatio: 'xMidYMid',
                focusable: 'false',
                role: 'img',
                class: 'lg-video-play-icon',
            },
            [
                h('title', label),
                h('polygon', {
                    class: 'lg-video-play-icon-inner',
                    points: '1,0 20,10 1,20',
                }),
            ],
        ),
        h(
            'svg',
            {
                class: 'lg-video-play-icon-bg',
                viewBox: '0 0 50 50',
                focusable: 'false',
            },
            [h('circle', { cx: '50%', cy: '50%', r: 20 })],
        ),
        h(
            'svg',
            {
                class: 'lg-video-play-icon-circle',
                viewBox: '0 0 50 50',
                focusable: 'false',
            },
            [h('circle', { cx: '50%', cy: '50%', r: 20 })],
        ),
    ]);
}

export const VideoSlide = defineComponent({
    name: 'LgVideoSlide',
    props: {
        item: {
            type: Object as PropType<LgGalleryItem>,
            required: true,
        },
        index: { type: Number, required: true },
    },
    setup(props) {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const settings = computed(
            () => ctx.settings.value as unknown as VideoResolved,
        );
        const html5 = computed(() => parseHtml5Video(props.item.video));
        const info = computed(() =>
            getVideoInfo(props.item.src, !!html5.value),
        );
        // Lite-embed facade poster chain (headless): item poster →
        // YouTube thumbnail endpoint (loadYouTubePoster) → item thumb.
        // With videoFacade:false only the 2.x YouTube synthesis remains.
        const poster = computed(() => {
            if (settings.value.videoFacade) {
                return getFacadePoster(
                    props.item,
                    info.value,
                    settings.value.loadYouTubePoster,
                );
            }
            return (
                props.item.poster ??
                (settings.value.loadYouTubePoster
                    ? getYouTubePosterUrl(info.value)
                    : undefined)
            );
        });
        const hasPoster = computed(() => !!poster.value);
        const runtime = inject(LG_RUNTIME)!;
        // 2.x video-poster dummy (`getVideoPosterMarkup` + dummy
        // content): the first zoom-from-origin slide flies the trigger's
        // already-decoded thumb inside the video cont while the poster
        // loads beneath it; the dummy drops shortly after the load
        // settles.
        const dummySrc = ref<string | null>(null);
        let dummyDone = false;
        let dummyDropTimer: ReturnType<typeof setTimeout> | null = null;
        watch(
            runtime.zoomOriginOpen,
            (flightRunning) => {
                if (
                    dummyDone ||
                    dummySrc.value ||
                    !flightRunning ||
                    !hasPoster.value ||
                    !props.item.lgSize ||
                    ctx.store.state.value.galleryOn ||
                    ctx.store.currentIndex.value !== props.index ||
                    ctx.store.state.value.loadedSlides.has(props.index)
                ) {
                    return;
                }
                const src = runtime.getDummySrc(props.index);
                if (src) {
                    dummySrc.value = src;
                    runtime.firstSlideLoading.value = true;
                } else {
                    dummyDone = true;
                }
            },
            { immediate: true, flush: 'pre' },
        );
        const slideLoaded = computed(() =>
            ctx.store.state.value.loadedSlides.has(props.index),
        );
        watch([dummySrc, slideLoaded], ([src, isLoaded]) => {
            if (!src || !isLoaded) {
                return;
            }
            dummyDropTimer = setTimeout(() => {
                dummyDone = true;
                dummySrc.value = null;
                runtime.firstSlideLoading.value = false;
            }, 300);
        });
        // The poster mounts only once the flight lands — v2 appends the
        // real markup the same way (the image path defers via deferSrc).
        const holdPoster = computed(
            () => !!dummySrc.value && runtime.zoomOriginOpen.value,
        );
        const activated = ref(false);
        const showPlayer = computed(() => activated.value || !hasPoster.value);
        const mediaEl = ref<HTMLVideoElement | HTMLIFrameElement | null>(null);
        let pendingPlay = false;
        const playTimers = new Set<ReturnType<typeof setTimeout>>();

        const isCurrent = (): boolean =>
            ctx.store.currentIndex.value === props.index;

        function markLoaded(): void {
            const state = ctx.store.state.value;
            if (state.loadedSlides.has(props.index)) {
                return;
            }
            const isFirstSlide = !state.galleryOn;
            ctx.actions.dispatch({
                type: 'SLIDE_LOADED',
                index: props.index,
            });
            ctx.emit('slideItemLoad', {
                index: props.index,
                delay: 0,
                isFirstSlide,
            });
        }

        function control(action: 'play' | 'pause'): void {
            const el = mediaEl.value;
            const videoInfo = info.value;
            if (!el || !videoInfo) {
                return;
            }
            if (videoInfo.html5) {
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
                if (videoInfo.youtube) {
                    frame.contentWindow?.postMessage(
                        `{"event":"command","func":"${action}Video","args":""}`,
                        '*',
                    );
                } else if (videoInfo.vimeo) {
                    frame.contentWindow?.postMessage(
                        JSON.stringify({ method: action }),
                        '*',
                    );
                }
                // Wistia control needs its player API script —
                // deliberately skipped (2.x same; noted deviation).
            } catch {
                // Cross-origin messaging is best-effort.
            }
        }

        function activateAndPlay(): void {
            pendingPlay = true;
            activated.value = true;
            control('play');
        }

        function deferPlay(delay: number): void {
            const timer = setTimeout(() => {
                playTimers.delete(timer);
                activateAndPlay();
            }, delay);
            playTimers.add(timer);
        }

        // hasVideo (informational) + load-state for posterless slides: a
        // video slide counts as loaded immediately (2.x parity).
        onMounted(() => {
            ctx.emit('hasVideo', {
                index: props.index,
                src: props.item.src,
                html5Video: props.item.video,
                hasPoster: hasPoster.value,
            });
            if (!hasPoster.value) {
                markLoaded();
            }
        });

        // Autoplay + pause-on-leave via the event bus (2.x wiring).
        const offs = [
            ctx.events.on('slideItemLoad', (detail) => {
                if (detail.index !== props.index) {
                    return;
                }
                const cfg = settings.value;
                if (
                    detail.isFirstSlide &&
                    cfg.autoplayFirstVideo &&
                    isCurrent()
                ) {
                    deferPlay(200);
                } else if (
                    !detail.isFirstSlide &&
                    cfg.autoplayVideoOnSlide &&
                    isCurrent()
                ) {
                    activateAndPlay();
                }
            }),
            ctx.events.on('afterSlide', (detail) => {
                if (
                    settings.value.autoplayVideoOnSlide &&
                    detail.index === props.index &&
                    detail.index !== detail.prevIndex
                ) {
                    deferPlay(100);
                }
            }),
            ctx.events.on('beforeSlide', (detail) => {
                if (
                    detail.prevIndex === props.index &&
                    detail.index !== props.index
                ) {
                    control('pause');
                }
            }),
        ];
        onBeforeUnmount(() => {
            offs.forEach((off) => off());
            playTimers.forEach((timer) => clearTimeout(timer));
            if (dummyDropTimer !== null) {
                clearTimeout(dummyDropTimer);
            }
            if (dummySrc.value) {
                runtime.firstSlideLoading.value = false;
            }
        });

        function onMediaReady(): void {
            if (pendingPlay) {
                pendingPlay = false;
                control('play');
            }
        }

        return () => {
            const videoInfo = info.value;
            if (!videoInfo) {
                return null;
            }
            const cfg = settings.value;
            const [maxWidth = 1280, maxHeight = 720] = cfg.videoMaxSize
                .split('-')
                .map((value) => parseInt(value, 10));
            const title =
                props.item.title ?? props.item.alt ?? 'Embedded video player';
            const iframeProps = {
                ref: mediaEl,
                allow: 'autoplay',
                allowfullscreen: true,
                frameborder: 0,
                title,
                onLoad: onMediaReady,
            };

            let player: VNodeChild = null;
            if (showPlayer.value) {
                if (videoInfo.youtube) {
                    player = h('iframe', {
                        ...iframeProps,
                        class: 'lg-video-object lg-youtube',
                        src: getYouTubeEmbedUrl(
                            videoInfo,
                            cfg.youTubePlayerParams,
                            props.item.src ?? '',
                            cfg.youTubeNoCookie,
                        ),
                    });
                } else if (videoInfo.vimeo) {
                    player = h('iframe', {
                        ...iframeProps,
                        class: 'lg-video-object lg-vimeo',
                        src: getVimeoEmbedUrl(videoInfo, cfg.vimeoPlayerParams),
                    });
                } else if (videoInfo.wistia) {
                    player = h('iframe', {
                        ...iframeProps,
                        class: 'wistia_embed lg-video-object lg-wistia',
                        name: 'wistia_embed',
                        src: getWistiaEmbedUrl(
                            videoInfo,
                            cfg.wistiaPlayerParams,
                        ),
                    });
                } else if (videoInfo.html5 && html5.value) {
                    const html5Video = html5.value;
                    player = h(
                        'video',
                        {
                            ref: mediaEl,
                            class: 'lg-video-object lg-html5',
                            onLoadedmetadata: onMediaReady,
                            onEnded: () => {
                                if (settings.value.gotoNextSlideOnVideoEnd) {
                                    ctx.actions.nextSlide();
                                }
                            },
                            // Keep native-control clicks from starting
                            // drags.
                            onPointerdown: (event: Event) =>
                                event.stopPropagation(),
                            ...(html5Video.attributes ?? {}),
                        },
                        [
                            ...(html5Video.source ?? []).map((source) =>
                                h('source', {
                                    src: source.src,
                                    type: source.type,
                                }),
                            ),
                            ...(html5Video.tracks ?? []).map((track) =>
                                h('track', { ...track }),
                            ),
                            'Your browser does not support HTML5 video.',
                        ],
                    );
                }
            }

            return h(
                'div',
                {
                    class: [
                        'lg-video-cont',
                        providerClass(videoInfo),
                        { 'lg-video-loaded': showPlayer.value },
                    ],
                    style: {
                        width: '100%',
                        maxWidth: `${maxWidth}px`,
                        maxHeight: '100%',
                        aspectRatio: `${maxWidth} / ${maxHeight}`,
                    },
                },
                [
                    player,
                    !activated.value && hasPoster.value && !holdPoster.value
                        ? h(
                              'button',
                              {
                                  type: 'button',
                                  class: 'lg-video-poster-wrap',
                                  style: {
                                      all: 'unset',
                                      cursor: 'pointer',
                                      display: 'block',
                                      width: '100%',
                                      height: '100%',
                                  },
                                  'aria-label': cfg.strings.playVideo,
                                  onClick: () => {
                                      ctx.emit('posterClick', undefined);
                                      activateAndPlay();
                                  },
                              },
                              [
                                  playButton(cfg.strings.playVideo),
                                  h('img', {
                                      class: 'lg-object lg-video-poster',
                                      src: poster.value,
                                      alt: props.item.alt ?? '',
                                      draggable: false,
                                      onLoad: markLoaded,
                                  }),
                              ],
                          )
                        : null,
                    dummySrc.value
                        ? h('img', {
                              class: 'lg-dummy-img',
                              src: dummySrc.value,
                              alt: '',
                              'aria-hidden': 'true',
                              draggable: false,
                              // v2 sizes the dummy to the cont box exactly.
                              style: {
                                  position: 'absolute',
                                  inset: '0',
                                  width: '100%',
                                  height: '100%',
                              },
                          })
                        : null,
                ],
            );
        };
    },
});

const Video: LgVuePlugin<VideoSettings> = {
    name: 'video',
    defaults: videoSettings,
    slideRenderer: {
        component: VideoSlide,
        canRender: (item) => getSlideType(item) === 'video',
    },
};

export default Video;
