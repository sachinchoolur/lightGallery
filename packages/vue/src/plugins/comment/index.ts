import {
    defineComponent,
    h,
    inject,
    ref,
    watch,
    type Ref,
} from 'vue';

import { LG_SLOTS } from '../../runtime';
import {
    LG_PLUGIN_CONTEXT,
    type LgPluginContext,
    type LgVuePlugin,
} from '../types';

/**
 * Comment plugin (2.x `lg-comment`): a slide-synced comment panel.
 * Migration difference vs 2.x (documented): the Facebook/Disqus
 * HTML-string and script integrations are replaced by the gallery's
 * `#comments="{ item, index }"` scoped slot — bring any comment system as
 * a template (the Vue analog of the sibling render prop / TemplateRef).
 */

export interface CommentSettings {
    /** Enable the comment box. */
    commentBox: boolean;
    /** Panel title. */
    commentBoxTitle: string;
    commentPluginStrings: { toggleComments: string };
}

export const commentSettings: CommentSettings = {
    commentBox: false,
    commentBoxTitle: 'Leave a comment.',
    commentPluginStrings: { toggleComments: 'Toggle Comments' },
};

/** Panel open-state shared between toggle and panel, per gallery. */
const commentStates = new WeakMap<LgPluginContext, Ref<boolean>>();
function useCommentState(ctx: LgPluginContext): Ref<boolean> {
    let state = commentStates.get(ctx);
    if (!state) {
        state = ref(false);
        commentStates.set(ctx, state);
        watch(state, (active) =>
            ctx.layout.setOuterClass('lg-comment-active', active),
        );
    }
    return state;
}

export const CommentToggle = defineComponent({
    name: 'LgCommentToggle',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const active = useCommentState(ctx);
        return () => {
            const cfg = ctx.settings.value as unknown as CommentSettings;
            if (!cfg.commentBox) {
                return null;
            }
            return h('button', {
                type: 'button',
                class: 'lg-comment-toggle lg-icon',
                'aria-label': cfg.commentPluginStrings.toggleComments,
                onClick: () => (active.value = !active.value),
            });
        };
    },
});

export const CommentBox = defineComponent({
    name: 'LgCommentBox',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const slots = inject(LG_SLOTS, undefined);
        const active = useCommentState(ctx);
        const close = (): void => {
            active.value = false;
        };
        return () => {
            const cfg = ctx.settings.value as unknown as CommentSettings;
            if (!cfg.commentBox) {
                return null;
            }
            const index = ctx.store.currentIndex.value;
            const item = ctx.items.value[index];
            const commentsSlot = (
                slots as
                    | Record<
                          string,
                          | ((props: {
                                item: typeof item;
                                index: number;
                            }) => unknown)
                          | undefined
                      >
                    | undefined
            )?.['comments'];
            return [
                h('div', { class: 'lg-comment-box lg-fb-comment-box' }, [
                    h('div', { class: 'lg-comment-header' }, [
                        h(
                            'h3',
                            { class: 'lg-comment-title' },
                            cfg.commentBoxTitle,
                        ),
                        h('span', {
                            class: 'lg-comment-close lg-icon',
                            role: 'button',
                            tabindex: 0,
                            'aria-label': 'Close comments',
                            onClick: close,
                            onKeydown: (event: KeyboardEvent) => {
                                if (event.key === 'Enter') {
                                    close();
                                }
                            },
                        }),
                    ]),
                    h(
                        'div',
                        { class: 'lg-comment-body' },
                        item && commentsSlot
                            ? (commentsSlot({
                                  item,
                                  index,
                              }) as never)
                            : undefined,
                    ),
                ]),
                h('div', {
                    class: 'lg-comment-overlay',
                    onClick: close,
                }),
            ];
        };
    },
});

const Comment: LgVuePlugin<CommentSettings> = {
    name: 'comment',
    defaults: commentSettings,
    slots: {
        toolbar: CommentToggle,
        outer: CommentBox,
    },
};

export default Comment;
