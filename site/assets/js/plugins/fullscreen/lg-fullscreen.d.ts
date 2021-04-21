import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { FullscreenSettings } from './lg-fullscreen-settings';
export default class FullScreen {
    core: LightGallery;
    settings: FullscreenSettings;
    private $LG;
    constructor(instance: LightGallery, $LG: LgQuery);
    private init;
    private isFullScreen;
    private requestFullscreen;
    private exitFullscreen;
    private fullScreen;
    closeGallery(): void;
    destroy(): void;
}
