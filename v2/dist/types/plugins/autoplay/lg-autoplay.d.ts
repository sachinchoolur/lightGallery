import { LightGallery } from '../../lightgallery';
import { AutoplaySettings } from './lg-autoplay-settings';
/**
 * Creates the autoplay plugin.
 * @param {object} element - lightGallery element
 */
export declare class Autoplay {
    core: LightGallery;
    s: AutoplaySettings;
    interval: any;
    fromAuto: boolean;
    pausedOnTouchDrag: boolean;
    pausedOnSlideChange: boolean;
    constructor(instance: LightGallery);
    init(): void;
    showProgressBar(): void;
    controls(): void;
    startAuto(): void;
    cancelAuto(): void;
    destroy(clear?: boolean): void;
}
