import i18next, { TFunction } from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import french from './fr';
import english from './en';

class TranslateService {
    private static isCreated: boolean;

    public static async init(): Promise<void> {
        if (!TranslateService.isCreated) {
            await this.initTranslateService();
            this.isCreated = true;
        }
    }

    public static translate(key: string): string {
        return i18next.t(key);
    }

    static async initTranslateService(): Promise<TFunction> {
        const options = {
            order: ['navigator'],
        };

        return i18next.use(languageDetector).init({
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
    }
}

export default TranslateService;
