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
export declare const commentDefaults: commentDefaults;
