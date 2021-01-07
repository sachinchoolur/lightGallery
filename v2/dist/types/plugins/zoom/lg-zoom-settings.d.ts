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
export declare const zoomDefaults: ZoomDefaults;
