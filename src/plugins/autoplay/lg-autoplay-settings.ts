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

    /**
     * Custom translation strings for aria-labels
     */
    autoplayPluginStrings: { [key: string]: string };
}
export const autoplaySettings: AutoplaySettings = {
    autoplay: true,
    slideShowAutoplay: false,
    slideShowInterval: 5000,
    progressBar: true,
    forceSlideShowAutoplay: false,
    autoplayControls: true,
    appendAutoplayControlsTo: '.lg-toolbar',
    autoplayPluginStrings: { toggleAutoplay: 'Toggle Autoplay' },
};
