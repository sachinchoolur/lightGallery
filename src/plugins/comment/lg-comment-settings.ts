export interface CommentSettings {
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
    commentsMarkup: string;

    /**
     * Custom translation strings for aria-labels
     */
    commentPluginStrings: { [key: string]: string };
}

export const commentSettings: CommentSettings = {
    commentBox: false,
    fbComments: false,
    disqusComments: false,
    disqusConfig: {
        title: undefined,
        language: 'en',
    },
    commentsMarkup:
        '<div id="lg-comment-box" class="lg-comment-box lg-fb-comment-box"><div class="lg-comment-header"><h3 class="lg-comment-title">Leave a comment.</h3><span class="lg-comment-close lg-icon"></span></div><div class="lg-comment-body"></div></div>',
    commentPluginStrings: { toggleComments: 'Toggle Comments' },
};
