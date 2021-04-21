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
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { CommentSettings } from './lg-comment-settings';
export default class CommentBox {
    core: LightGallery;
    settings: CommentSettings;
    private $LG;
    constructor(instance: LightGallery, $LG: LgQuery);
    private init;
    private setMarkup;
    toggleCommentBox(): void;
    addFbComments(): void;
    addDisqusComments(): void;
    destroy(): void;
}
