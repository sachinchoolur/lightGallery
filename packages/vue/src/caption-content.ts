import { defineComponent, h, inject, type PropType } from 'vue';

import { LG_SLOTS } from './runtime';
import type { LgGalleryItem } from './types';

/**
 * Caption content resolution (ADR 0001 §4): the gallery's `#caption`
 * scoped slot wins, then the item's `caption` string; raw HTML only via
 * the explicit `captionHtml` opt-in (`v-html` semantics — consumer
 * sanitizes, same deliberately loud escape hatch as the siblings).
 */
export const LgCaptionContent = defineComponent({
    name: 'LgCaptionContent',
    props: {
        item: {
            type: Object as PropType<LgGalleryItem | undefined>,
            default: undefined,
        },
        index: { type: Number, required: true },
    },
    setup(props) {
        const slots = inject(LG_SLOTS, undefined);
        return () => {
            const captionSlot = slots?.caption;
            if (captionSlot) {
                return captionSlot({
                    item: props.item,
                    index: props.index,
                });
            }
            if (props.item?.caption != null) {
                return String(props.item.caption);
            }
            if (props.item?.captionHtml) {
                return h('div', { innerHTML: props.item.captionHtml });
            }
            return null;
        };
    },
});

export function hasCaption(item: LgGalleryItem | undefined): boolean {
    return !!item && (item.caption != null || !!item.captionHtml);
}
