<script setup lang="ts">
import { ref } from 'vue';
import {
    LightGallery,
    LgItem,
    type LgGalleryItem,
} from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Video from '@lightgallery/vue/plugins/video';
import Zoom from '@lightgallery/vue/plugins/zoom';

const picsum = (id: number, w: number, h: number): string =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

const SOURCES = [
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
    { id: 1019, title: 'Lakeside cliffs' },
    { id: 1039, title: 'Waterfall in the forest' },
    { id: 1043, title: 'Foggy ridge' },
];

const items: LgGalleryItem[] = [
    ...SOURCES.map((source) => ({
        src: picsum(source.id, 1600, 1067),
        thumb: picsum(source.id, 240, 160),
        lgSize: '1600-1067',
        alt: source.title,
        caption: source.title,
    })),
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/1.jpg',
        alt: 'Big Buck Bunny (YouTube)',
        caption: 'YouTube video slide (video plugin)',
    },
];

const plugins = [Thumbnail, Zoom, Video];

const mode = ref<'lg-slide' | 'lg-fade' | 'lg-lollipop'>('lg-slide');
const loop = ref(true);
const hideBars = ref(false);
const lastEvent = ref('');
const controlledOpen = ref(false);
const controlledIndex = ref(0);
const lg = ref<InstanceType<typeof LightGallery> | null>(null);
</script>

<template>

        <div style="font-family: system-ui, sans-serif; padding: 1rem 2rem 4rem">
            <h1>@lightgallery/vue dev demo</h1>

            <section>
                <h2>Uncontrolled (triggers + zoom-from-origin)</h2>
                <p>
                    <label style="margin-right: 1rem">
                        Transition:
                        <select v-model="mode">
                            <option value="lg-slide">lg-slide</option>
                            <option value="lg-fade">lg-fade</option>
                            <option value="lg-lollipop">
                                lg-lollipop (CSS-only)
                            </option>
                        </select>
                    </label>
                    <label style="margin-right: 1rem">
                        <input type="checkbox" v-model="loop" /> loop
                    </label>
                    <label>
                        <input type="checkbox" v-model="hideBars" />
                        hideBarsDelay 2s
                    </label>
                </p>
                <LightGallery
                    :ref="(el) => (lg = el as never)"
                    :mode="mode"
                    :loop="loop"
                    :hide-bars-delay="hideBars ? 2000 : 0"
                    :mousewheel="true"
                    :plugins="plugins"
                    :zoom="{ showZoomInOutIcons: true }"
                    @before-slide="lastEvent = 'beforeSlide → ' + $event.index"
                    @after-slide="lastEvent = 'afterSlide → ' + $event.index"
                    @slide-item-load="lastEvent = 'slideItemLoad → ' + $event.index"
                >
                    <div style="display: flex; flex-wrap: wrap; gap: 8px">
                        <LgItem
                            v-for="item of items"
                            :key="item.src"
                            :item="item"
                        >
                            <img
                                :src="item.thumb"
                                :alt="item.alt"
                                style="display: block; width: 240px; height: 160px; object-fit: cover; border-radius: 4px"
                            />
                        </LgItem>
                    </div>
                    <template #caption="{ item, index }">
                        <h4>{{ item?.caption }}</h4>
                        <p>Slide {{ index + 1 }} — scoped-slot caption</p>
                    </template>
                </LightGallery>
                <p>
                    <button type="button" @click="lg?.openGallery(2)">
                        Imperative: open at slide 3
                    </button>
                    <span style="margin-left: 1rem; color: #666">{{
                        lastEvent
                    }}</span>
                </p>
            </section>

            <section>
                <h2>Controlled (v-model:open + v-model:index)</h2>
                <p>
                    <button type="button" @click="controlledOpen = true">
                        Open
                    </button>
                    <button type="button" @click="controlledIndex = 4">
                        index → 5
                    </button>
                    current index: {{ controlledIndex }}
                </p>
                <LightGallery
                    :slides="items"
                    v-model:open="controlledOpen"
                    v-model:index="controlledIndex"
                    :zoom-from-origin="false"
                />
            </section>
        </div>
    
</template>
