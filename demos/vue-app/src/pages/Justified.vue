<script setup lang="ts">
import { computed, reactive } from 'vue';
import { LgItem, LightGallery } from '@lightgallery/vue';
import JustifiedGrid from '@lightgallery/vue/plugins/justified';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

import { SIZE_ITEMS, manyItems } from '../../../shared/media';
import Choice from '../ui/Choice.vue';

const SOURCES = ['mixed ratios', 'size catalog'] as const;
const COUNTS = [12, 40, 100, 200];
const ROW_HEIGHTS = [80, 120, 180, 260];
const GAPS = [0, 4, 8, 16];
const LAST_ROWS = ['start', 'justify', 'hide'] as const;
const MAX_SCALES = [1, 1.5, 1.75, 2.5];
const REVEALS = ['row', 'image'] as const;
const DIRECTIONS = ['auto', 'ltr', 'rtl'] as const;
const PLUGINS = [Thumbnail, Zoom];

const s = reactive({
    source: 'mixed ratios' as (typeof SOURCES)[number],
    count: 40,
    rowHeight: 180,
    gap: 8,
    lastRow: 'start' as (typeof LAST_ROWS)[number],
    maxScale: 1.75,
    reveal: 'row' as (typeof REVEALS)[number],
    direction: 'auto' as (typeof DIRECTIONS)[number],
});

const items = computed(() =>
    s.source === 'size catalog' ? SIZE_ITEMS : manyItems(s.count),
);
const key = computed(() => JSON.stringify(s));
</script>

<template>
    <section>
        <h2>Justified</h2>
        <p class="note">
            Row-justified trigger grid. Resize the window or rotate the device
            and the rows should re-flow. The size catalog feeds it extreme strips
            and tiny images; reload with a slow network to watch the
            placeholders and reveal order.
        </p>
        <details class="panel" open>
            <summary>Settings</summary>
            <div class="controls">
                <div class="control-group">
                    <strong>Content</strong>
                    <Choice v-model="s.source" label="Images" :options="SOURCES" />
                    <Choice v-model="s.count" label="Count" :options="COUNTS" />
                </div>
                <div class="control-group">
                    <strong>Layout</strong>
                    <Choice
                        v-model="s.rowHeight"
                        label="rowHeight"
                        :options="ROW_HEIGHTS"
                    />
                    <Choice v-model="s.gap" label="gap" :options="GAPS" />
                    <Choice
                        v-model="s.lastRow"
                        label="lastRow"
                        :options="LAST_ROWS"
                    />
                    <Choice
                        v-model="s.maxScale"
                        label="maxScale"
                        :options="MAX_SCALES"
                    />
                    <Choice v-model="s.reveal" label="reveal" :options="REVEALS" />
                    <Choice
                        v-model="s.direction"
                        label="direction"
                        :options="DIRECTIONS"
                    />
                </div>
            </div>
        </details>
        <p class="readout">{{ items.length }} images</p>
        <LightGallery :key="key" :plugins="PLUGINS">
            <JustifiedGrid
                :row-height="s.rowHeight"
                :gap="s.gap"
                :last-row="s.lastRow"
                :max-scale="s.maxScale"
                :reveal="s.reveal"
                :direction="s.direction"
            >
                <LgItem
                    v-for="item of items"
                    :key="item.alt"
                    :item="item"
                    :data-lg-size="item.lgSize"
                >
                    <img :src="item.thumb" :alt="item.alt" />
                </LgItem>
            </JustifiedGrid>
        </LightGallery>
    </section>
</template>
