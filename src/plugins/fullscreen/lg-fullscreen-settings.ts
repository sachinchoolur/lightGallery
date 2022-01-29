export interface FullscreenStrings {
    toggleFullscreen: string;
}
export interface FullscreenSettings {
    /**
     * Enable/Disable fullscreen option
     */
    fullScreen: boolean;

    /**
     * Custom translation strings for aria-labels
     */
    fullscreenPluginStrings: FullscreenStrings;
}

export const fullscreenSettings: FullscreenSettings = {
    fullScreen: true,
    fullscreenPluginStrings: {
        toggleFullscreen: 'Toggle Fullscreen',
    } as FullscreenStrings,
};
