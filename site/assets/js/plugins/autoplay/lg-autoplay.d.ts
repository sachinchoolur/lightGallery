import { LightGallery } from '../../lightgallery';
import { AutoplaySettings } from './lg-autoplay-settings';
/**
 * Creates the autoplay plugin.
 * @param {object} element - lightGallery element
 */
export default class Autoplay {
    core: LightGallery;
    settings: AutoplaySettings;
    interval: any;
    fromAuto: boolean;
    pausedOnTouchDrag: boolean;
    pausedOnSlideChange: boolean;
    constructor(instance: LightGallery);
    private init;
    private showProgressBar;
    private controls;
    startAuto(): void;
    cancelAuto(): void;
    closeGallery(): void;
    destroy(): void;
}
