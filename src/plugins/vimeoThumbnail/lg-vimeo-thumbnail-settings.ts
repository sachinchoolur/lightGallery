export interface VimeoThumbnailSettings {
    /**
     * Auto load thumbnails for Vimeo videos
     */
    showVimeoThumbnails: boolean;

    /**
     * Show thumbnails with play button
     */
    showThumbnailWithPlayButton: boolean;
}
export const vimeoSettings: VimeoThumbnailSettings = {
    showVimeoThumbnails: true,
    showThumbnailWithPlayButton: false,
};
