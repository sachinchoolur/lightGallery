const getUseLeft = function () {
    const isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return !!(isChrome && parseInt(isChrome[2], 10) < 54);
};

export interface ZoomDefaults {
    scale: number;
    zoom: boolean;
    actualSize: boolean;
    enableZoomAfter: number;
    showZoomInOutIcons: boolean;
    actualSizeIcons: {
        zoomIn: 'lg-zoom-in' | 'lg-actual-size';
        zoomOut: 'lg-zoom-out' | 'lg-actual-size';
    };
    useLeftForZoom: boolean;
}

export const zoomDefaults: ZoomDefaults = {
    scale: 1,
    zoom: true,
    actualSize: true,
    showZoomInOutIcons: false,
    actualSizeIcons: {
        zoomIn: 'lg-zoom-in',
        zoomOut: 'lg-zoom-out',
    },
    enableZoomAfter: 300,
    useLeftForZoom: getUseLeft(),
};
