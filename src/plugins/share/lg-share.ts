import { ShareSettings, shareSettings } from './lg-share-settings';

import { getFacebookShareLink } from './lg-fb-share-utils';
import { getTwitterShareLink } from './lg-twitter-share-utils';
import { getPinterestShareLink } from './lg-pinterest-share-utils';
import { LightGallery } from '../../lightgallery';
import { lGEvents } from '../../lg-events';
import { ShareOption } from './types';

interface DefaultShareOptions extends ShareOption {
    type: string;
}
export default class Share {
    core: LightGallery;
    settings: ShareSettings;
    private shareOptions: ShareOption[] = [];
    constructor(instance: LightGallery) {
        // get lightGallery core plugin instance
        this.core = instance;

        // extend module default settings with lightGallery core settings
        this.settings = { ...shareSettings, ...this.core.settings };
        return this;
    }

    public init(): void {
        if (!this.settings.share) {
            return;
        }
        this.shareOptions = [
            ...this.getDefaultShareOptions(),
            ...this.settings.additionalShareOptions,
        ];
        this.setLgShareMarkup();
        this.core.outer
            .find('.lg-share .lg-dropdown')
            .append(this.getShareListHtml());

        this.core.LGel.on(
            `${lGEvents.afterSlide}.share`,
            this.onAfterSlide.bind(this),
        );
    }

    private getShareListHtml() {
        let shareHtml = '';
        this.shareOptions.forEach((shareOption) => {
            shareHtml += shareOption.dropdownHTML;
        });

        return shareHtml;
    }

    setLgShareMarkup(): void {
        this.core.$toolbar.append(
            `<button type="button" aria-label="${this.settings.sharePluginStrings['share']}" aria-haspopup="true" aria-expanded="false" class="lg-share lg-icon">
                <ul class="lg-dropdown" style="position: absolute;"></ul></button>`,
        );

        this.core.outer.append('<div class="lg-dropdown-overlay"></div>');
        const $shareButton = this.core.outer.find('.lg-share');
        $shareButton.first().on('click.lg', () => {
            this.core.outer.toggleClass('lg-dropdown-active');
            if (this.core.outer.hasClass('lg-dropdown-active')) {
                this.core.outer.attr('aria-expanded', true);
            } else {
                this.core.outer.attr('aria-expanded', false);
            }
        });

        this.core.outer
            .find('.lg-dropdown-overlay')
            .first()
            .on('click.lg', () => {
                this.core.outer.removeClass('lg-dropdown-active');
                this.core.outer.attr('aria-expanded', false);
            });
    }

    private onAfterSlide(event: CustomEvent) {
        const { index } = event.detail;
        const currentItem = this.core.galleryItems[index];
        setTimeout(() => {
            this.shareOptions.forEach((shareOption) => {
                const selector = shareOption.selector;
                this.core.outer
                    .find(selector)
                    .attr('href', shareOption.generateLink(currentItem));
            });
        }, 100);
    }

    private getShareListItemHTML(type: string, text: string): string {
        return `<li><a class="lg-share-${type}" rel="noopener" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">${text}</span></a></li>`;
    }

    private getDefaultShareOptions(): DefaultShareOptions[] {
        return [
            ...(this.settings.facebook
                ? [
                      {
                          type: 'facebook',
                          generateLink: getFacebookShareLink,
                          dropdownHTML: this.getShareListItemHTML(
                              'facebook',
                              this.settings.facebookDropdownText,
                          ),
                          selector: '.lg-share-facebook',
                      },
                  ]
                : []),
            ...(this.settings.twitter
                ? [
                      {
                          type: 'twitter',
                          generateLink: getTwitterShareLink,
                          dropdownHTML: this.getShareListItemHTML(
                              'twitter',
                              this.settings.twitterDropdownText,
                          ),
                          selector: '.lg-share-twitter',
                      },
                  ]
                : []),
            ...(this.settings.pinterest
                ? [
                      {
                          type: 'pinterest',
                          generateLink: getPinterestShareLink,
                          dropdownHTML: this.getShareListItemHTML(
                              'pinterest',
                              this.settings.pinterestDropdownText,
                          ),
                          selector: '.lg-share-pinterest',
                      },
                  ]
                : []),
        ];
    }

    public destroy(): void {
        this.core.outer.find('.lg-dropdown-overlay').remove();
        this.core.outer.find('.lg-share').remove();
        this.core.LGel.off('.lg.share');
        this.core.LGel.off('.share');
    }
}
