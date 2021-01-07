import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}
export declare class FullScreen {
    core: LightGallery;
    s: {
        fullScreen: boolean;
    };
    constructor(instance: LightGallery);
    init(): void;
    isFullScreen(): boolean;
    requestFullscreen(): void;
    exitFullscreen(): void;
    fullScreen(): void;
    destroy(clear?: boolean): void;
}
