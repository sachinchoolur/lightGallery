export interface OriginCropSettings {
    /**
     * Enable/Disable the origin crop plugin: zoom-from-origin flights from
     * cropped thumbnails (<code>object-fit: cover</code>,
     * <code>background-size: cover</code>) start from the part of the image
     * the thumbnail shows, at a uniform scale, and reveal the rest around it.
     * See <a href="/demos/zoom-from-origin/">Zoom from origin</a>.
     * @version 3.0.0
     */
    originCrop: boolean;
}

export const originCropSettings: OriginCropSettings = {
    originCrop: true,
};
