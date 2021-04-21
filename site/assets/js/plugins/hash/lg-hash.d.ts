import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { HashSettings } from './lg-hash-settings';
export default class Hash {
    core: LightGallery;
    settings: HashSettings;
    oldHash: string;
    private $LG;
    constructor(instance: LightGallery, $LG: LgQuery);
    private init;
    private onAfterSlide;
    private onCloseAfter;
    private onHashchange;
    closeGallery(): void;
    destroy(): void;
}
