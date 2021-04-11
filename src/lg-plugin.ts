import { LgQuery } from './lgQuery';
import { LightGallery } from './lightgallery';

export class LgPlugin {
    public core: LightGallery;
    public $LG!: LgQuery;
    constructor(core: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = core;
        this.$LG = $LG;
    }
}
