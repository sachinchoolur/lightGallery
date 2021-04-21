import { ShareSettings } from './lg-share-settings';
import { LightGallery } from '../../lightgallery';
export default class Share {
    core: LightGallery;
    settings: ShareSettings;
    private shareOptions;
    constructor(instance: LightGallery);
    private init;
    private getShareListHtml;
    setLgShareMarkup(): void;
    private onAfterSlide;
    private getShareListItemHTML;
    private getDefaultShareOptions;
    destroy(): void;
}
