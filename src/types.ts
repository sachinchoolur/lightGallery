import { LightGallerySettings } from './lg-settings';
import { $LG } from './lgQuery';
import { LightGallery } from './lightgallery';

declare global {
    interface Window {
        lgModules: any;
        $LG: typeof $LG;
        lightGallery: (
            el: HTMLElement,
            options: Partial<LightGallerySettings>,
        ) => LightGallery | undefined;
    }
}

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

export type SlideDirection = 'next' | 'prev';
export interface Coords {
    pageX: number;
    pageY: number;
}
export interface VideoInfo {
    html5?: boolean;
    youtube?: string[];
    vimeo?: string[];
    wistia?: string[];
    dailymotion?: string[];
}
