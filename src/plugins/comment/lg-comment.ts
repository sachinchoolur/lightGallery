/**
 * lightGallery comments module
 * Supports facebook and disqus comments
 *
 * @ref - https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
 * @ref - https://github.com/disqus/DISQUS-API-Recipes/blob/master/snippets/js/disqus-reset/disqus_reset.html
 * @ref - https://css-tricks.com/lazy-loading-disqus-comments/
 * @ref - https://developers.facebook.com/docs/plugins/comments/#comments-plugin
 *
 */

import { lGEvents } from '../../lg-events';
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { commentSettings, CommentSettings } from './lg-comment-settings';

declare let FB: any;
declare let DISQUS: any;

export default class CommentBox {
    core: LightGallery;
    settings: CommentSettings;
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;

        // extend module default settings with lightGallery core settings
        this.settings = { ...commentSettings, ...this.core.settings };

        return this;
    }

    public init(): void {
        if (!this.settings.commentBox) {
            return;
        }
        this.setMarkup();
        this.toggleCommentBox();
        if (this.settings.fbComments) {
            this.addFbComments();
        } else if (this.settings.disqusComments) {
            this.addDisqusComments();
        }
    }

    private setMarkup() {
        this.core.outer.append(
            this.settings.commentsMarkup +
                '<div class="lg-comment-overlay"></div>',
        );

        const commentToggleBtn = `<button type="button" aria-label="${this.settings.commentPluginStrings['toggleComments']}" class="lg-comment-toggle lg-icon"></button>`;
        this.core.$toolbar.append(commentToggleBtn);
    }

    toggleCommentBox(): void {
        this.core.outer
            .find('.lg-comment-toggle')
            .first()
            .on('click.lg.comment', () => {
                this.core.outer.toggleClass('lg-comment-active');
            });

        this.core.outer
            .find('.lg-comment-overlay')
            .first()
            .on('click.lg.comment', () => {
                this.core.outer.removeClass('lg-comment-active');
            });
        this.core.outer
            .find('.lg-comment-close')
            .first()
            .on('click.lg.comment', () => {
                this.core.outer.removeClass('lg-comment-active');
            });
    }

    addFbComments() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        this.core.LGel.on(`${lGEvents.beforeSlide}.comment`, (event) => {
            const html = this.core.galleryItems[event.detail.index].fbHtml;
            this.core.outer.find('.lg-comment-body').html(html as string);
        });
        this.core.LGel.on(`${lGEvents.afterSlide}.comment`, function () {
            try {
                FB.XFBML.parse();
            } catch (err) {
                _this.$LG(window).on('fbAsyncInit', function () {
                    FB.XFBML.parse();
                });
            }
        });
    }

    addDisqusComments(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        const $disqusThread = this.$LG('#disqus_thread');
        $disqusThread.remove();
        this.core.outer
            .find('.lg-comment-body')
            .append('<div id="disqus_thread"></div>');

        this.core.LGel.on(`${lGEvents.beforeSlide}.comment`, () => {
            $disqusThread.html('');
        });

        this.core.LGel.on(`${lGEvents.afterSlide}.comment`, (event) => {
            const { index } = event.detail;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const _this = this;
            // DISQUS needs sometime to intialize when lightGallery is opened from direct url(hash plugin).
            setTimeout(
                function () {
                    try {
                        DISQUS.reset({
                            reload: true,
                            config: function () {
                                this.page.identifier =
                                    _this.core.galleryItems[
                                        index
                                    ].disqusIdentifier;
                                this.page.url =
                                    _this.core.galleryItems[index].disqusURL;
                                this.page.title =
                                    _this.settings.disqusConfig.title;
                                this.language =
                                    _this.settings.disqusConfig.language;
                            },
                        });
                    } catch (err) {
                        console.error(
                            'Make sure you have included disqus JavaScript code in your document. Ex - https://lg-disqus.disqus.com/admin/install/platforms/universalcode/',
                        );
                    }
                },
                _this.core.lGalleryOn ? 0 : 1000,
            );
        });
    }

    destroy(): void {
        this.core.LGel.off('.lg.comment');
        this.core.LGel.off('.comment');
    }
}
