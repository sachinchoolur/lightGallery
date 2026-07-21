import {
    useEffect,
    useRef,
    useState,
    type ReactElement,
    type SyntheticEvent,
} from 'react';
import {
    getSlideType,
    getVideoInfo,
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
    type PlayerParams,
    type VideoInfo,
} from '@lightgallery/headless';

import { cx } from '../../cx';
import {
    useGalleryActions,
    useGalleryInternal,
    useGalleryState,
} from '../../context';
import { usePluginSettings } from '../runtime';
import type { GalleryItem } from '../../types';
import type { LgPlugin } from '../types';

/**
 * Video plugin: HTML5 / YouTube / Vimeo / Wistia slides (2.x `lg-video`).
 * The `videojs` option is dropped per ADR 0001 §10 — custom players go
 * through `render.slide`.
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

function PlayButton({ label }: { label: string }): ReactElement {
    return (
        <div className="lg-video-play-button">
            <svg
                viewBox="0 0 20 20"
                preserveAspectRatio="xMidYMid"
                focusable="false"
                aria-labelledby={label}
                role="img"
                className="lg-video-play-icon"
            >
                <title>{label}</title>
                <polygon
                    className="lg-video-play-icon-inner"
                    points="1,0 20,10 1,20"
                />
            </svg>
            <svg
                className="lg-video-play-icon-bg"
                viewBox="0 0 50 50"
                focusable="false"
            >
                <circle cx="50%" cy="50%" r="20" />
            </svg>
            <svg
                className="lg-video-play-icon-circle"
                viewBox="0 0 50 50"
                focusable="false"
            >
                <circle cx="50%" cy="50%" r="20" />
            </svg>
        </div>
    );
}

export function VideoSlide({
    item,
    index,
}: {
    item: GalleryItem;
    index: number;
}): ReactElement | null {
    const state = useGalleryState();
    const actions = useGalleryActions();
    const internal = useGalleryInternal();
    const settings = usePluginSettings<VideoSettings>();

    const html5Video = parseHtml5Video(item.video);
    const videoInfo = getVideoInfo(item.src, !!html5Video);

    // 2.x loadYouTubePoster: derive a poster for YouTube slides that
    // declare none.
    const poster =
        item.poster ??
        (settings.loadYouTubePoster && videoInfo?.youtube
            ? `//img.youtube.com/vi/${videoInfo.youtube[1]}/maxresdefault.jpg`
            : undefined);
    const hasPoster = !!poster;
    const [activated, setActivated] = useState(!hasPoster);
    const pendingPlayRef = useRef(false);
    const mediaRef = useRef<HTMLVideoElement | HTMLIFrameElement | null>(
        null,
    );
    const isCurrent = state.currentIndex === index;
    const isCurrentRef = useRef(isCurrent);
    isCurrentRef.current = isCurrent;
    const settingsRef = useRef(settings);
    settingsRef.current = settings;

    const control = (action: 'play' | 'pause') => {
        const el = mediaRef.current;
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
            // Wistia control needs its player API script — deliberately
            // skipped (2.x pushed to window._wq; noted deviation).
        } catch {
            // Cross-origin messaging is best-effort.
        }
    };

    const activateAndPlay = () => {
        pendingPlayRef.current = true;
        setActivated(true);
        // Already activated → the media is (or soon is) ready.
        control('play');
    };

    // hasVideo (informational) + load-state for slides without a poster:
    // a video slide counts as loaded immediately (2.x
    // `isHTML5VideoWithoutPoster` / video-cont path).
    useEffect(() => {
        internal.emit('onHasVideo', {
            index,
            src: item.src,
            html5Video: item.video,
            hasPoster,
        });
        if (!hasPoster && !state.loadedSlides.has(index)) {
            const isFirstSlide = !state.galleryOn;
            actions.dispatch({ type: 'SLIDE_LOADED', index });
            internal.emit('onSlideItemLoad', {
                index,
                delay: 0,
                isFirstSlide,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Autoplay + pause-on-leave via the event bus (2.x event wiring).
    useEffect(() => {
        const offLoad = internal.events.on('slideItemLoad', (detail) => {
            if (detail.index !== index) {
                return;
            }
            const current = isCurrentRef.current;
            const cfg = settingsRef.current;
            if (detail.isFirstSlide && cfg.autoplayFirstVideo && current) {
                window.setTimeout(() => activateAndPlay(), 200);
            } else if (
                !detail.isFirstSlide &&
                cfg.autoplayVideoOnSlide &&
                current
            ) {
                activateAndPlay();
            }
        });
        const offAfter = internal.events.on('afterSlide', (detail) => {
            if (
                settingsRef.current.autoplayVideoOnSlide &&
                detail.index === index &&
                detail.index !== detail.prevIndex
            ) {
                window.setTimeout(() => activateAndPlay(), 100);
            }
        });
        const offBefore = internal.events.on('beforeSlide', (detail) => {
            if (detail.prevIndex === index && detail.index !== index) {
                control('pause');
            }
        });
        return () => {
            offLoad();
            offAfter();
            offBefore();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!videoInfo) {
        return null;
    }

    const [maxWidth = 1280, maxHeight = 720] = settings.videoMaxSize
        .split('-')
        .map((value) => parseInt(value, 10));

    const onMediaReady = () => {
        if (pendingPlayRef.current) {
            pendingPlayRef.current = false;
            control('play');
        }
    };

    const title = item.title ?? item.alt ?? 'Embedded video player';
    const iframeProps = {
        allow: 'autoplay',
        allowFullScreen: true,
        frameBorder: 0,
        title,
        onLoad: onMediaReady,
    } as const;

    let player: ReactElement | null = null;
    if (activated) {
        if (videoInfo.youtube) {
            player = (
                <iframe
                    {...iframeProps}
                    ref={(el) => {
                        mediaRef.current = el;
                    }}
                    className="lg-video-object lg-youtube"
                    src={getYouTubeEmbedUrl(
                        videoInfo,
                        settings.youTubePlayerParams,
                        item.src ?? '',
                    )}
                />
            );
        } else if (videoInfo.vimeo) {
            player = (
                <iframe
                    {...iframeProps}
                    ref={(el) => {
                        mediaRef.current = el;
                    }}
                    className="lg-video-object lg-vimeo"
                    src={getVimeoEmbedUrl(
                        videoInfo,
                        settings.vimeoPlayerParams,
                    )}
                />
            );
        } else if (videoInfo.wistia) {
            player = (
                <iframe
                    {...iframeProps}
                    ref={(el) => {
                        mediaRef.current = el;
                    }}
                    className="wistia_embed lg-video-object lg-wistia"
                    name="wistia_embed"
                    src={getWistiaEmbedUrl(
                        videoInfo,
                        settings.wistiaPlayerParams,
                    )}
                />
            );
        } else if (videoInfo.html5 && html5Video) {
            const attributes: Record<string, string | boolean> = {};
            Object.entries(html5Video.attributes ?? {}).forEach(
                ([key, value]) => {
                    attributes[key === 'controlslist' ? 'controlsList' : key] =
                        value;
                },
            );
            player = (
                <video
                    className="lg-video-object lg-html5"
                    ref={(el) => {
                        mediaRef.current = el;
                    }}
                    onLoadedMetadata={onMediaReady}
                    onEnded={() => {
                        if (settingsRef.current.gotoNextSlideOnVideoEnd) {
                            actions.nextSlide();
                        }
                    }}
                    // Keep clicks on the native controls from starting drags.
                    onPointerDown={(event: SyntheticEvent) =>
                        event.stopPropagation()
                    }
                    {...attributes}
                >
                    {html5Video.source?.map((source, sourceIndex) => (
                        <source
                            key={sourceIndex}
                            src={source.src}
                            type={source.type}
                        />
                    ))}
                    {html5Video.tracks?.map((track, trackIndex) => (
                        <track key={trackIndex} {...track} />
                    ))}
                    Your browser does not support HTML5 video.
                </video>
            );
        }
    }

    return (
        <div
            className={cx(
                'lg-video-cont',
                providerClass(videoInfo),
                activated && 'lg-video-loaded',
            )}
            style={{
                width: '100%',
                maxWidth: `${maxWidth}px`,
                maxHeight: '100%',
                aspectRatio: `${maxWidth} / ${maxHeight}`,
            }}
        >
            {player}
            {!activated && hasPoster && (
                <button
                    type="button"
                    className="lg-video-poster-wrap"
                    style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'block',
                        width: '100%',
                        height: '100%',
                    }}
                    aria-label={settings.strings.playVideo}
                    onClick={() => {
                        internal.emit('onPosterClick');
                        activateAndPlay();
                    }}
                >
                    <PlayButton label={settings.strings.playVideo} />
                    <img
                        className="lg-object lg-video-poster"
                        src={poster}
                        alt={item.alt ?? ''}
                        draggable={false}
                        onLoad={() => {
                            if (!state.loadedSlides.has(index)) {
                                const isFirstSlide = !state.galleryOn;
                                actions.dispatch({
                                    type: 'SLIDE_LOADED',
                                    index,
                                });
                                internal.emit('onSlideItemLoad', {
                                    index,
                                    delay: 0,
                                    isFirstSlide,
                                });
                            }
                        }}
                    />
                </button>
            )}
        </div>
    );
}

const Video: LgPlugin<VideoSettings> = {
    name: 'video',
    defaults: videoSettings,
    slideRenderer: (item, index) => {
        if (getSlideType(item) !== 'video') {
            return undefined;
        }
        return <VideoSlide item={item} index={index} />;
    },
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        video: Partial<VideoSettings>;
    }
}

export default Video;
