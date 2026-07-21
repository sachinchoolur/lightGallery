import type { ReactElement, ReactNode } from 'react';

import {
    useGalleryInternal,
    useGalleryState,
} from '../../context';
import { usePluginSettings } from '../runtime';
import type { GalleryItem } from '../../types';
import type { LgPlugin } from '../types';

/**
 * Comment plugin (2.x `lg-comment`): a slide-synced comment panel.
 * Migration difference vs 2.x (documented): the Facebook/Disqus HTML-string
 * and script integrations are replaced by a `renderComments(item)` render
 * prop — bring any comment system as a ReactNode.
 */

export interface CommentSettings {
    /** Enable the comment box. */
    commentBox: boolean;
    /** Panel title. */
    commentBoxTitle: string;
    /** Render the comment UI for the current slide. */
    renderComments?: (item: GalleryItem, index: number) => ReactNode;
    commentPluginStrings: { toggleComments: string };
}

export const commentSettings: CommentSettings = {
    commentBox: false,
    commentBoxTitle: 'Leave a comment.',
    renderComments: undefined,
    commentPluginStrings: { toggleComments: 'Toggle Comments' },
};

function CommentToggleButton(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<CommentSettings>();
    if (!settings.commentBox) {
        return null;
    }
    const active = internal.pluginOuterClassNames.includes(
        'lg-comment-active',
    );
    return (
        <button
            type="button"
            aria-label={settings.commentPluginStrings.toggleComments}
            className="lg-comment-toggle lg-icon"
            onClick={() =>
                internal.layout.setOuterClass('lg-comment-active', !active)
            }
        />
    );
}

function CommentBox(): ReactElement | null {
    const state = useGalleryState();
    const internal = useGalleryInternal();
    const settings = usePluginSettings<CommentSettings>();
    if (!settings.commentBox) {
        return null;
    }
    const item = internal.items[state.currentIndex];
    const close = () =>
        internal.layout.setOuterClass('lg-comment-active', false);
    return (
        <>
            <div className="lg-comment-box lg-fb-comment-box">
                <div className="lg-comment-header">
                    <h3 className="lg-comment-title">
                        {settings.commentBoxTitle}
                    </h3>
                    <span
                        className="lg-comment-close lg-icon"
                        role="button"
                        tabIndex={0}
                        aria-label="Close comments"
                        onClick={close}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                close();
                            }
                        }}
                    />
                </div>
                <div className="lg-comment-body">
                    {item && settings.renderComments
                        ? settings.renderComments(item, state.currentIndex)
                        : null}
                </div>
            </div>
            <div className="lg-comment-overlay" onClick={close} />
        </>
    );
}

const Comment: LgPlugin<CommentSettings> = {
    name: 'comment',
    defaults: commentSettings,
    slots: {
        toolbar: CommentToggleButton,
        outer: CommentBox,
    },
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        comment: Partial<CommentSettings>;
    }
}

export default Comment;
