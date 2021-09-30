import { LightGallery } from '../../lightgallery';
import TranslateService from './service';

/**
 * Creates the i18next plugin.
 * @param {object} element - lightGallery element
 */
export default class I18Next {
    core: LightGallery;

    constructor(instance: LightGallery) {
        this.core = instance;

        // Translation i18next initialization
        TranslateService.init();

        return this;
    }

    init(): void {}
}
