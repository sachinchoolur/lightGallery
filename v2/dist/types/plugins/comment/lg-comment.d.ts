/**
 * @desc lightGallery comments module
 * Supports facebook and disqus comments
 *
 * @ref - https://paulund.co.uk/add-google-comments-to-your-site
 * @ref - https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
 * @ref - https://github.com/disqus/DISQUS-API-Recipes/blob/master/snippets/js/disqus-reset/disqus_reset.html
 * @ref - https://css-tricks.com/lazy-loading-disqus-comments/
 *
 */
import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { commentDefaults } from './lg-comment-settings';
declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}
export declare class CommentBox {
    core: LightGallery;
    s: commentDefaults;
    constructor(instance: LightGallery);
    init(): void;
    setMarkup(): void;
    toggleCommentBox(): void;
    addFbComments(): void;
    addDisqusComments(): void;
    destroy(clear?: boolean): void;
}
