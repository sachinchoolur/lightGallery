export interface FullscreenSettings {
    /**
     * Enable/Disable fullscreen option
     */
    fullScreen: boolean;

    /**
     * Custom translation strings for aria-labels
     */
    fullscreenPluginStrings: { [key: string]: string };
}

export const fullscreenSettings: FullscreenSettings = {
    fullScreen: true,
    fullscreenPluginStrings: { toggleFullscreen: 'Toggle Fullscreen' },
};
