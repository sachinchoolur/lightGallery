import {
    AfterSlideDetail,
    HasVideoDetail,
    SlideItemLoadDetail,
} from './lg-events';
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
    detail: HasVideoDetail;
}
export interface CustomEventSlideItemLoad extends CustomEvent {
    detail: SlideItemLoadDetail;
}
export interface CustomEventAfterSlide extends CustomEvent {
    detail: AfterSlideDetail;
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
export interface MediaContainerPosition {
    top: number;
    bottom: number;
}
