/**
 * Video URL detection and embed-URL builders, ported from 2.x
 * `utils.isVideo` (`src/lg-utils.ts`) and `lg-video-utils.ts` as pure
 * functions. The video plugin renders the returned URLs; nothing here
 * touches the DOM.
 */

export interface VideoInfo {
    /** RegExp match parts: `[match, videoId, urlParams?]`. */
    youtube?: string[];
    vimeo?: string[];
    /** RegExp match parts; index 4 is the media id. */
    wistia?: string[];
    html5?: boolean;
}

// `true` is accepted for 2.x-contract compatibility and means the same
// as an empty params object.
export type PlayerParams = Record<string, string | number | boolean> | boolean;

function toParamsObject(
    params: PlayerParams,
): Record<string, string | number | boolean> {
    return typeof params === 'object' && params ? params : {};
}

/** Detect the video provider for a src URL (2.x `utils.isVideo`). */
export function getVideoInfo(
    src: string | undefined,
    hasHtml5Video: boolean,
): VideoInfo | undefined {
    if (!src) {
        return hasHtml5Video ? { html5: true } : undefined;
    }
    const youtube = src.match(
        /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-_%]+)([&|?][\S]*)*/i,
    );
    if (youtube) {
        return { youtube: [...youtube] };
    }
    const vimeo = src.match(
        /\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i,
    );
    if (vimeo) {
        return { vimeo: [...vimeo] };
    }
    const wistia = src.match(
        /https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/,
    );
    if (wistia) {
        return { wistia: [...wistia] };
    }
    return hasHtml5Video ? { html5: true } : undefined;
}

/** Serialize params as a query string (2.x `param`). */
export function param(obj: Record<string, string | number | boolean>): string {
    return Object.keys(obj)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(obj[key]!)}`,
        )
        .join('&');
}

/** Parse `?a=b&c=d` into an object (2.x `paramsToObject`). */
export function paramsToObject(url: string): Record<string, string> {
    return url
        .slice(1)
        .split('&')
        .map((pair) => pair.split('='))
        .reduce<Record<string, string>>((obj, pair) => {
            const [key, value] = pair.map(decodeURIComponent);
            if (key) {
                obj[key] = value ?? '';
            }
            return obj;
        }, {});
}

export function isYouTubeNoCookie(url: string): boolean {
    return url.includes('youtube-nocookie.com');
}

/**
 * YouTube embed URL. Precedence (2.x parity): defaults < settings < params
 * already present on the slide URL. The privacy-enhanced
 * `youtube-nocookie.com` host is the default; pass `preferNoCookie: false`
 * (the `youTubeNoCookie` setting) to revert to `youtube.com`. A slide URL
 * that already names the nocookie host always keeps it.
 */
export function getYouTubeEmbedUrl(
    videoInfo: VideoInfo,
    playerParamsSettings: PlayerParams,
    srcUrl: string,
    preferNoCookie = true,
): string | undefined {
    if (!videoInfo.youtube) {
        return undefined;
    }
    const slideUrlParams = videoInfo.youtube[2]
        ? paramsToObject(videoInfo.youtube[2])
        : {};
    const params = {
        wmode: 'opaque',
        autoplay: 0,
        mute: 1,
        enablejsapi: 1,
        ...toParamsObject(playerParamsSettings),
        ...slideUrlParams,
    };
    const base =
        preferNoCookie || isYouTubeNoCookie(srcUrl)
            ? '//www.youtube-nocookie.com/'
            : '//www.youtube.com/';
    return `${base}embed/${videoInfo.youtube[1]}?${param(params)}`;
}

/**
 * YouTube's public thumbnail endpoint for a detected video — the one
 * provider poster that needs no API call. (Vimeo/Wistia poster endpoints
 * require a fetch/auth, so their facades rely on the item's own
 * poster/thumb — see getFacadePoster.)
 */
export function getYouTubePosterUrl(
    videoInfo: VideoInfo | undefined,
): string | undefined {
    if (!videoInfo?.youtube) {
        return undefined;
    }
    return `//img.youtube.com/vi/${videoInfo.youtube[1]}/maxresdefault.jpg`;
}

/**
 * Poster for a provider-video facade (lite embed): the explicit item
 * poster wins, then the YouTube thumbnail endpoint (when enabled), then
 * the item's grid thumb — for Vimeo galleries the vimeoThumbnail plugin
 * rewrites `thumb` to the oEmbed thumbnail, which feeds this chain.
 * HTML5 slides never get a synthesized poster (unchanged 2.x behavior);
 * a provider slide with no resolvable poster returns undefined and keeps
 * the eager-iframe path.
 */
export function getFacadePoster(
    item: { poster?: string; thumb?: string },
    videoInfo: VideoInfo | undefined,
    loadYouTubePoster: boolean,
): string | undefined {
    if (!videoInfo || videoInfo.html5) {
        return item.poster || undefined;
    }
    return (
        item.poster ||
        (loadYouTubePoster ? getYouTubePosterUrl(videoInfo) : undefined) ||
        item.thumb ||
        undefined
    );
}

/**
 * Provider player-API script URLs, loaded on demand at first play (the
 * vanilla runtime's control paths need them; the framework bindings drive
 * players via postMessage and load nothing).
 */
export const VIMEO_PLAYER_SCRIPT_URL = 'https://player.vimeo.com/api/player.js';
export const WISTIA_PLAYER_SCRIPT_URL =
    'https://fast.wistia.com/assets/external/E-v1.js';

/**
 * Vimeo embed URL, including the private-video hash handling (2.x
 * `getVimeoURLParams`).
 */
export function getVimeoEmbedUrl(
    videoInfo: VideoInfo,
    playerParamsSettings: PlayerParams,
): string | undefined {
    if (!videoInfo.vimeo) {
        return undefined;
    }
    let urlParams = videoInfo.vimeo[2] || '';
    const defaultPlayerParams = {
        autoplay: 0,
        muted: 1,
        ...toParamsObject(playerParamsSettings),
    };
    let defaultParams = param(defaultPlayerParams);

    // Private videos carry a hash as the last path segment.
    const urlWithHash = videoInfo.vimeo[0]!.split('/').pop() || '';
    const urlWithHashWithoutParams = urlWithHash.split('?')[0] || '';
    const hash = urlWithHashWithoutParams.split('#')[0]!;
    const isPrivate = videoInfo.vimeo[1] !== hash;
    if (isPrivate) {
        urlParams = urlParams.replace(`/${hash}`, '');
    }
    urlParams =
        urlParams[0] === '?' ? `&${urlParams.slice(1)}` : urlParams || '';
    const privateUrlParams = isPrivate ? `h=${hash}` : '';
    defaultParams = privateUrlParams ? `&${defaultParams}` : defaultParams;

    return `//player.vimeo.com/video/${videoInfo.vimeo[1]}?${privateUrlParams}${defaultParams}${urlParams}`;
}

/** Wistia embed URL. */
export function getWistiaEmbedUrl(
    videoInfo: VideoInfo,
    playerParamsSettings: PlayerParams,
): string | undefined {
    if (!videoInfo.wistia) {
        return undefined;
    }
    const paramsObject = toParamsObject(playerParamsSettings);
    const params = Object.keys(paramsObject).length ? param(paramsObject) : '';
    return `//fast.wistia.net/embed/iframe/${videoInfo.wistia[4]}${
        params ? `?${params}` : ''
    }`;
}
