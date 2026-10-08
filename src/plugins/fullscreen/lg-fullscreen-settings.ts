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
     * @deprecated Set these labels on the core `strings` object instead,
     * every user-facing string lives in that one contract. An explicitly set
     * key here still wins (alias).
     */
    fullscreenPluginStrings?: Partial<FullscreenStrings>;
}

export const fullscreenSettings: FullscreenSettings = {
    fullScreen: true,
};
