export interface ZoomSettings {
    /**
     * Value of zoom should be incremented/decremented
     */
    scale: number;
    /**
     * Enable/Disable zoom option
     */
    zoom: boolean;
    /**
     * Enable actual size icon.
     */
    actualSize: boolean;
    /**
     * Once the slide transition is completed, how much time should take zoom plugin to activate
     * @description Some css styles will be added to the images if zoom is enabled.
     * So it might conflict if you add any custom styles to the images such as the initial transition while opening the gallery.
     * So you can delay adding zoom related styles to the images by changing the value of enableZoomAfter.
     */
    enableZoomAfter: number;
    /**
     * Show zoom in, zoom out icons
     */
    showZoomInOutIcons: boolean;
    /**
     * Actual size icons
     */
    actualSizeIcons: {
        zoomIn: 'lg-zoom-in' | 'lg-actual-size';
        zoomOut: 'lg-zoom-out' | 'lg-actual-size';
    };
}
export declare const zoomSettings: ZoomSettings;
