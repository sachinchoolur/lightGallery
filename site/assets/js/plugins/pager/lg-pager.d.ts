import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { PagerSettings } from './lg-pager-settings';
export default class Pager {
    core: LightGallery;
    settings: PagerSettings;
    private $LG;
    constructor(instance: LightGallery, $LG: LgQuery);
    private getPagerHtml;
    private init;
    private manageActiveClass;
    destroy(): void;
}
