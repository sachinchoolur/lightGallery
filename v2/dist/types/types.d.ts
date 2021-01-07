export interface Coordinates {
    pageX: number;
    pageY: number;
}
export interface CustomEventHasVideo extends CustomEvent {
    detail: {
        index: number;
        src: string;
        html5Video?: string;
        hasPoster: boolean;
    };
}
