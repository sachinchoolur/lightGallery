export interface AutoplaySettings {
    /**
     * Enable autoplay plugin
     */
    autoplay: boolean;
    /**
     * Enable slideshow autoplay
     */
    slideShowAutoplay: boolean;
    /**
     * The time (in ms) between each auto transition.
     */
    slideShowInterval: number;
    /**
     * Show autoplay progressBar
     */
    progressBar: boolean;
    /**
     * If false autoplay will be stopped after first user action
     */
    forceSlideShowAutoplay: boolean;
    /**
     * Show/hide autoplay controls.
     */
    autoplayControls: boolean;
    /**
     * Specify where the autoplay controls should be appended.
     */
    appendAutoplayControlsTo: string;
}
export declare const autoplaySettings: AutoplaySettings;
