import {
    defineComponent,
    h,
    type Component,
    type PropType,
    type VNodeChild,
} from 'vue';

import type { OriginAnimation } from './LgSlide.vue';

/**
 * Renders the slide list through every plugin `slidesWrapper` (ADR §5),
 * first plugin = outermost — the React runtime's `wrapSlides` reduceRight.
 * Each wrapper receives the opening or closing slide's `originAnim` and
 * the wrapped content through its default slot.
 */
export default defineComponent({
    name: 'LgStageWrappers',
    props: {
        wrappers: {
            type: Array as PropType<readonly Component[]>,
            required: true,
        },
        originAnim: {
            type: Object as PropType<OriginAnimation | null>,
            default: null,
        },
    },
    setup(props, { slots }) {
        return (): VNodeChild => {
            // A lone slot node renders as the root itself: without any
            // wrapper the slide list sits in the stage as it always has,
            // with no fragment anchors around it.
            const content = slots.default?.() ?? [];
            return props.wrappers.reduceRight<VNodeChild>(
                (acc, Wrapper) =>
                    h(
                        Wrapper,
                        { originAnim: props.originAnim },
                        {
                            default: () => acc,
                        },
                    ),
                content.length === 1 ? content[0]! : content,
            );
        };
    },
});
