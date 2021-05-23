export interface MediumZoomSettings {
    /**
     * Enable/Disable medium like zoom experience
     */
    mediumZoom: boolean;

    /**
     * Space between the gallery outer area and images
     */
    margin: number;
}

export const mediumZoomSettings: MediumZoomSettings = {
    margin: 40,
    mediumZoom: true,
};
