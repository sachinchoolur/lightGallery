import { VideoInfo } from '../../types';
export type PlayerParams = Record<string, string | number | boolean> | boolean;

export type YouTubeParams = {
    [x: string]: string | number | boolean;
};

export const param = (obj: YouTubeParams): string => {
    return Object.keys(obj)
        .map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        })
        .join('&');
};
export const paramsToObject = (url: string): YouTubeParams => {
    const paramas = url
        .slice(1)
        .split('&')
        .map((p) => p.split('='))
        .reduce((obj: any, pair) => {
            const [key, value] = pair.map(decodeURIComponent);
            obj[key] = value;
            return obj;
        }, {});
    return paramas;
};

export const getYouTubeParams = (
    videoInfo: VideoInfo,
    youTubePlayerParamsSettings: YouTubeParams | false,
): string => {
    if (!videoInfo.youtube) return '';
    const slideUrlParams = videoInfo.youtube[2]
        ? paramsToObject(videoInfo.youtube[2])
        : '';

    // For youtube first params gets priority if duplicates found
    const defaultYouTubePlayerParams = {
        wmode: 'opaque',
        autoplay: 0,
        mute: 1,
        enablejsapi: 1,
    };

    const playerParamsSettings = youTubePlayerParamsSettings || {};

    const youTubePlayerParams = {
        ...defaultYouTubePlayerParams,
        ...playerParamsSettings,
        ...slideUrlParams,
    };

    const youTubeParams = `?${param(youTubePlayerParams)}`;
    return youTubeParams;
};

export const isYouTubeNoCookie = (url: string): boolean => {
    return url.includes('youtube-nocookie.com');
};

export const getVimeoURLParams = (
    defaultParams: PlayerParams,
    videoInfo?: VideoInfo,
): string => {
    if (!videoInfo || !videoInfo.vimeo) return '';
    let urlParams = videoInfo.vimeo[2] || '';

    const defaultPlayerParams =
        defaultParams && Object.keys(defaultParams).length !== 0
            ? '&' + param(defaultParams as any)
            : '';

    // Support private video
    const urlWithHash = videoInfo.vimeo[0].split('/').pop() || '';
    const urlWithHashWithParams = urlWithHash.split('?')[0] || '';
    const hash = urlWithHashWithParams.split('#')[0];

    const isPrivate = videoInfo.vimeo[1] !== hash;
    if (isPrivate) {
        urlParams = urlParams.replace(`/${hash}`, '');
    }

    urlParams =
        urlParams[0] == '?' ? '&' + urlParams.slice(1) : urlParams || '';

    // For vimeo last params gets priority if duplicates found
    const vimeoPlayerParams = `?autoplay=0&muted=1${
        isPrivate ? `&h=${hash}` : ''
    }${defaultPlayerParams}${urlParams}`;
    return vimeoPlayerParams;
};
