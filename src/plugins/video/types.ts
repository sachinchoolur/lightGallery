export interface VideoSource {
    source: {
        src: string;
        type: string;
    }[];
    tracks: HTMLTrackElement[];
    attributes: HTMLVideoElement;
}
