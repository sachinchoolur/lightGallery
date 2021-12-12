<template>
    <div ref="container" class="lightgallery-vue"><slot></slot></div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Options, Vue } from 'vue-class-component';
import lightGallery from '../../../src';
import { LightGallery as LGPlugin } from '../../../src/lightgallery';
import { LightGallerySettings } from '../../../src/lg-settings';
import {
    AfterAppendSubHtmlDetail,
    AfterCloseDetail,
    RotateLeftDetail,
    RotateRightDetail,
    FlipHorizontalDetail,
    FlipVerticalDetail,
    AfterOpenDetail,
    AfterSlideDetail,
    BeforeCloseDetail,
    BeforeNextSlideDetail,
    BeforeOpenDetail,
    BeforePrevSlideDetail,
    BeforeSlideDetail,
    ContainerResizeDetail,
    DragEndDetail,
    DragMoveDetail,
    DragStartDetail,
    InitDetail,
    lGEvents,
    PosterClickDetail,
    SlideItemLoadDetail,
} from '../../../src/lg-events';

@Options({
    props: {
        settings: {
            type: Object as PropType<LightGallerySettings>,
        },
        onAfterAppendSlide: {
            type: Function,
        },
        onInit: {
            type: Function,
        },
        onHasVideo: {
            type: Function,
        },
        onContainerResize: {
            type: Function,
        },
        onAfterAppendSubHtml: {
            type: Function,
        },
        onBeforeOpen: {
            type: Function,
        },
        onAfterOpen: {
            type: Function,
        },
        onSlideItemLoad: {
            type: Function,
        },
        onBeforeSlide: {
            type: Function,
        },
        onAfterSlide: {
            type: Function,
        },
        onPosterClick: {
            type: Function,
        },
        onDragStart: {
            type: Function,
        },
        onDragMove: {
            type: Function,
        },
        onDragEnd: {
            type: Function,
        },
        onBeforeNextSlide: {
            type: Function,
        },
        onBeforePrevSlide: {
            type: Function,
        },
        onBeforeClose: {
            type: Function,
        },
        onAfterClose: {
            type: Function,
        },
        onRotateLeft: {
            type: Function,
        },
        onRotateRight: {
            type: Function,
        },
        onFlipHorizontal: {
            type: Function,
        },
        onFlipVertical: {
            type: Function,
        },
    },
})
export default class Lightgallery extends Vue {
    $refs!: {
        container: HTMLElement;
    };

    settings!: LightGallerySettings;

    onAfterAppendSlide!: (detail: AfterSlideDetail) => void;
    onInit!: (detail: InitDetail) => void;
    onHasVideo!: (detail: InitDetail) => void;
    onContainerResize!: (detail: ContainerResizeDetail) => void;
    onAfterAppendSubHtml!: (detail: AfterAppendSubHtmlDetail) => void;
    onBeforeOpen!: (detail: BeforeOpenDetail) => void;
    onAfterOpen!: (detail: AfterOpenDetail) => void;
    onSlideItemLoad!: (detail: SlideItemLoadDetail) => void;
    onBeforeSlide!: (detail: BeforeSlideDetail) => void;
    onAfterSlide!: (detail: AfterSlideDetail) => void;
    onPosterClick!: (detail: PosterClickDetail) => void;
    onDragStart!: (detail: DragStartDetail) => void;
    onDragMove!: (detail: DragMoveDetail) => void;
    onDragEnd!: (detail: DragEndDetail) => void;
    onBeforeNextSlide!: (detail: BeforeNextSlideDetail) => void;
    onBeforePrevSlide!: (detail: BeforePrevSlideDetail) => void;
    onBeforeClose!: (detail: BeforeCloseDetail) => void;
    onAfterClose!: (detail: AfterCloseDetail) => void;
    onRotateLeft?: (detail: RotateLeftDetail) => void;
    onRotateRight?: (detail: RotateRightDetail) => void;
    onFlipHorizontal?: (detail: FlipHorizontalDetail) => void;
    onFlipVertical?: (detail: FlipVerticalDetail) => void;

    LG!: LGPlugin;

    mounted(): void {
        this.registerEvents.call(this);
        this.LG = lightGallery(this.$refs.container, { ...this.settings });
    }

    unmounted(): void {
        this.LG.destroy();
    }

    /* eslint-disable */
    private getMethodName(word: string) {
        return `on${word.charAt(0).toUpperCase() + word.slice(1)}`;
    }
    /* eslint-enable */

    private registerEvents(): void {
        Object.keys(lGEvents).forEach((key: string) => {
            // https://github.com/microsoft/TypeScript/issues/28357
            (this.$refs.container as any).addEventListener(
                lGEvents[key].split('.')[0],
                (event: CustomEvent) => {
                    if ((this as any)[this.getMethodName(key)]) {
                        (this as any)[this.getMethodName.call(this, key)](
                            event.detail,
                        );
                    }
                },
            );
        });
    }
}
</script>
