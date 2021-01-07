import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { RotateSettings } from './lg-rotate-settings';
declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}
export declare class Rotate {
    core: LightGallery;
    s: RotateSettings;
    rotateValuesList: {
        [key: string]: any;
    };
    constructor(instance: LightGallery);
    buildTemplates(): void;
    init(): void;
    applyStyles(): void;
    rotateLeft(): void;
    rotateRight(): void;
    getCurrentRotation(el: HTMLElement): number;
    flipHorizontal(): void;
    flipVertical(): void;
    destroy(clear?: boolean): void;
}
