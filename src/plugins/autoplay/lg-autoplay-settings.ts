export interface AutoplayStrings {
    toggleAutoplay: string;
}

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
     * The countdown starts once the slide on screen has loaded, so a slow
     * connection never advances past an image before it is visible.
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

    /**
     * Custom translation strings for aria-labels
     * @deprecated Set these labels on the core `strings` object instead,
     * every user-facing string lives in that one contract. An explicitly set
     * key here still wins (alias).
     */
    autoplayPluginStrings?: Partial<AutoplayStrings>;
}
export const autoplaySettings: AutoplaySettings = {
    autoplay: true,
    slideShowAutoplay: false,
    slideShowInterval: 5000,
    progressBar: true,
    forceSlideShowAutoplay: false,
    autoplayControls: true,
    appendAutoplayControlsTo: '.lg-toolbar',
};
