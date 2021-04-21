export interface VideoSource {
    source: {
        src: string;
        type: string;
    }[];
    attributes: HTMLVideoElement;
}
