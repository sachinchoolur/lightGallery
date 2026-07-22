import {
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    ref,
} from 'vue';

import { LG_PLUGIN_CONTEXT, type LgVuePlugin } from '../types';

/** Pager plugin (2.x `lg-pager`): dot navigation with thumb popovers. */

export interface PagerSettings {
    /** Enable the pager. */
    pager: boolean;
}

export const pagerSettings: PagerSettings = {
    pager: true,
};

export const PagerList = defineComponent({
    name: 'LgPagerList',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const hover = ref(false);
        let hoverTimer: ReturnType<typeof setTimeout> | null = null;
        onBeforeUnmount(() => {
            if (hoverTimer !== null) {
                clearTimeout(hoverTimer);
            }
        });
        return () => {
            const cfg = ctx.settings.value as unknown as PagerSettings;
            if (!cfg.pager) {
                return null;
            }
            return h(
                'div',
                {
                    class: [
                        'lg-pager-outer',
                        { 'lg-pager-hover': hover.value },
                    ],
                    onMouseover: () => {
                        if (hoverTimer !== null) {
                            clearTimeout(hoverTimer);
                            hoverTimer = null;
                        }
                        hover.value = true;
                    },
                    onMouseout: () => {
                        hoverTimer = setTimeout(
                            () => (hover.value = false),
                            0,
                        );
                    },
                },
                ctx.items.value.map((item, index) =>
                    h(
                        'span',
                        {
                            key: index,
                            'data-lg-item-id': index,
                            class: [
                                'lg-pager-cont',
                                {
                                    'lg-pager-active':
                                        index ===
                                        ctx.store.currentIndex.value,
                                },
                            ],
                            role: 'button',
                            tabindex: 0,
                            'aria-label': `Go to slide ${index + 1}`,
                            'aria-current':
                                index === ctx.store.currentIndex.value,
                            onClick: () => ctx.actions.goToSlide(index),
                            onKeydown: (event: KeyboardEvent) => {
                                if (
                                    event.key === 'Enter' ||
                                    event.key === ' '
                                ) {
                                    event.preventDefault();
                                    ctx.actions.goToSlide(index);
                                }
                            },
                        },
                        [
                            h('span', { class: 'lg-pager' }),
                            h(
                                'div',
                                { class: 'lg-pager-thumb-cont' },
                                [
                                    h('span', { class: 'lg-caret' }),
                                    h('img', {
                                        src: item.thumb,
                                        alt: item.alt ?? '',
                                    }),
                                ],
                            ),
                        ],
                    ),
                ),
            );
        };
    },
});

const Pager: LgVuePlugin<PagerSettings> = {
    name: 'pager',
    defaults: pagerSettings,
    slots: {
        components: PagerList,
    },
};

export default Pager;
