export interface commentSettings {
    /**
     * Enable comment box
     */
    commentBox: boolean;
    /**
     * Enable facebook comment box
     */
    fbComments: boolean;
    /**
     * Enable disqus comment box
     */
    disqusComments: boolean;

    /**
     * Disqus comment config
     */
    disqusConfig: {
        title?: string;
        language: string;
    };

    /**
     * Facebook comments default markup
     */
    fbCommentsMarkup: string;
}

export const commentSettings: commentSettings = {
    commentBox: true,
    fbComments: false,
    disqusComments: true,
    disqusConfig: {
        title: undefined,
        language: 'en',
    },
    fbCommentsMarkup:
        '<div id="lg-comment-box" class="lg-comment-box lg-fb-comment-box"><div class="lg-comment-header"><h3 class="lg-comment-title">Leave a comment.</h3><span id="lg-comment-close"  class="lg-icon"></span></div><div id="lg-comment-body"></div></div>',
};
