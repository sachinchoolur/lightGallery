export interface commentDefaults {
    commentBox: boolean;
    fbComments: boolean;
    disqusComments: boolean;
    disqusConfig: {
        title: undefined | string;
        language: string;
    };
    fbCommentsMarkup: string;
}

export const commentDefaults: commentDefaults = {
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
