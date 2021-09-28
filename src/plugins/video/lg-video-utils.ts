import { VideoInfo } from '../../types';
export type PlayerParams = Record<string, string | number | boolean> | boolean;

export const param = (obj: {
    [x: string]: string | number | boolean;
}): string => {
    return Object.keys(obj)
        .map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        })
        .join('&');
};
export const getVimeoURLParams = (
    defaultParams: PlayerParams,
    videoInfo?: VideoInfo,
): string => {
    if (!videoInfo || !videoInfo.vimeo) return '';
    let urlParams = videoInfo.vimeo[2] || '';
    urlParams =
        urlParams[0] == '?' ? '&' + urlParams.slice(1) : urlParams || '';

    const defaultPlayerParams = defaultParams
        ? '&' + param(defaultParams as any)
        : '';

    // For vimeo last parms gets priority if duplicates found
    const vimeoPlayerParams = `?autoplay=0&muted=1${defaultPlayerParams}${urlParams}`;
    return vimeoPlayerParams;
};
