export interface FullscreenSettings {
    /**
     * Enable/Disable fullscreen option
     */
    fullScreen: boolean;

    fullscreenPluginStrings: { [key: string]: string };
}

export const fullscreenSettings: FullscreenSettings = {
    fullScreen: true,
    fullscreenPluginStrings: { toggleFullscreen: 'Toggle Fullscreen' },
};
