export interface MediumZoomSettings {
    /**
     * Enable/Disable medium like zoom experience
     */
    mediumZoom: boolean;

    /**
     * Space between the gallery outer area and images
     */
    margin: number;

    /**
     * Background color for the gallery
     * This can be overwritten by passing background color via `lg-background-color` for each item
     */
    backgroundColor: string;
}

export const mediumZoomSettings: MediumZoomSettings = {
    margin: 40,
    mediumZoom: true,
    backgroundColor: '#000',
};
