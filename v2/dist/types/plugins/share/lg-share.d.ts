import { ShareSettings } from './lg-share-settings';
import { LightGallery } from '../../lightgallery';
export declare class Share {
    core: LightGallery;
    s: ShareSettings;
    constructor(instance: LightGallery);
    init(): void;
    getShareListHtml(): string;
    onAfterSlide(event: CustomEvent): void;
    destroy(clear?: boolean): void;
}
