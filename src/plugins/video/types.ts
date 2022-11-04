export interface VideoSource {
    source: {
        src: string;
        type: string;
    }[];
    tracks: Partial<HTMLTrackElement>[];
    attributes: Partial<HTMLVideoElement>;
}
