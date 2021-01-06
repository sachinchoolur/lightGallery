export interface AutoplaySettings {
    autoplay: boolean;
    pause: number;
    progressBar: boolean;
    forceAutoplay: boolean;
    autoplayControls: boolean;
    appendAutoplayControlsTo: string;
}
export const autoplaySettings: AutoplaySettings = {
    autoplay: false,
    pause: 5000,
    progressBar: true,
    forceAutoplay: false,
    autoplayControls: true,
    appendAutoplayControlsTo: '.lg-toolbar',
};
