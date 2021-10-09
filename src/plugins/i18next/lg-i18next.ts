import { LightGallery } from '../../lightgallery';
import i18next from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import french from './fr';
import english from './en';

/**
 * Creates the i18next plugin.
 * @param {object} element - lightGallery element
 */
export default class I18Next {
    core: LightGallery;

    constructor(instance: LightGallery) {
        this.core = instance;

        this.init();

        return this;
    }

    private async init() {
        const options = {
            order: ['navigator'],
        };

        await i18next.use(languageDetector).init({
            detection: options,
            resources: {
                en: {
                    translation: english,
                },
                fr: {
                    translation: french,
                },
            },
        });

        this.core.settings.strings.closeGallery = this.translate(
            'closeGallery',
        );

        // How to refresh lightGallery after all translations?
    }

    private translate(key: string): string {
        return i18next.t(key);
    }
}
