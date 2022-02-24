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
