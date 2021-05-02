import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { RotateSettings } from './lg-rotate-settings';
export default class Rotate {
    core: LightGallery;
    settings: RotateSettings;
    rotateValuesList: {
        [key: string]: any;
    };
    private $LG;
    constructor(instance: LightGallery, $LG: LgQuery);
    buildTemplates(): void;
    init(): void;
    applyStyles(): void;
    rotateLeft(): void;
    rotateRight(): void;
    getCurrentRotation(el: HTMLElement): number;
    flipHorizontal(): void;
    flipVertical(): void;
    isImageOrientationChanged(): boolean;
    closeGallery(): void;
    destroy(): void;
}
