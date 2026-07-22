import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    Injectable,
    signal,
    type TemplateRef,
} from '@angular/core';
import {
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';

/**
 * Comment feature (2.x `lg-comment`): a slide-synced comment panel.
 * Migration difference vs 2.x (documented): the Facebook/Disqus HTML-string
 * and script integrations are replaced by a `commentsTemplate` TemplateRef
 * (`withComment({ commentsTemplate })`, context `{ $implicit: item, index }`)
 * — the Angular analog of React's `renderComments` render prop. Bring any
 * comment system as a template.
 */

export interface CommentContext {
    $implicit: LgGalleryItem | undefined;
    index: number;
}

export interface CommentSettings {
    /** Enable the comment box. */
    commentBox: boolean;
    /** Panel title. */
    commentBoxTitle: string;
    /** Template rendering the comment UI for the current slide. */
    commentsTemplate?: TemplateRef<CommentContext>;
    commentPluginStrings: { toggleComments: string };
}

export const commentSettings: CommentSettings = {
    commentBox: false,
    commentBoxTitle: 'Leave a comment.',
    commentsTemplate: undefined,
    commentPluginStrings: { toggleComments: 'Toggle Comments' },
};

/** Panel open-state shared between the toggle button and the panel. */
@Injectable()
export class LgCommentStateService {
    readonly active = signal(false);

    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        effect(() => {
            ctx.layout.setOuterClass('lg-comment-active', this.active());
        });
    }
}

@Component({
    selector: 'lg-comment-toggle',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().commentBox) {
            <button
                type="button"
                class="lg-comment-toggle lg-icon"
                [attr.aria-label]="
                    settings().commentPluginStrings.toggleComments
                "
                (click)="state.active.set(!state.active())"
            ></button>
        }
    `,
})
export class LgCommentToggleComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly state = inject(LgCommentStateService);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as CommentSettings,
    );
}

@Component({
    selector: 'lg-comment-box',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        @if (settings().commentBox) {
            <div class="lg-comment-box lg-fb-comment-box">
                <div class="lg-comment-header">
                    <h3 class="lg-comment-title">
                        {{ settings().commentBoxTitle }}
                    </h3>
                    <span
                        class="lg-comment-close lg-icon"
                        role="button"
                        tabindex="0"
                        aria-label="Close comments"
                        (click)="state.active.set(false)"
                        (keydown.enter)="state.active.set(false)"
                    ></span>
                </div>
                <div class="lg-comment-body">
                    @if (settings().commentsTemplate; as tpl) {
                        <ng-container
                            *ngTemplateOutlet="tpl; context: context()"
                        />
                    }
                </div>
            </div>
            <div
                class="lg-comment-overlay"
                (click)="state.active.set(false)"
            ></div>
        }
    `,
})
export class LgCommentBoxComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly state = inject(LgCommentStateService);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as CommentSettings,
    );
    protected readonly context = computed<CommentContext>(() => ({
        $implicit: this.ctx.items()[this.ctx.state().currentIndex],
        index: this.ctx.state().currentIndex,
    }));
}

export function withComment(
    options: Partial<CommentSettings> = {},
): LgFeature<CommentSettings> {
    return {
        name: 'comment',
        defaults: commentSettings,
        options,
        slots: {
            toolbar: LgCommentToggleComponent,
            outer: LgCommentBoxComponent,
        },
        providers: [LgCommentStateService],
    };
}
