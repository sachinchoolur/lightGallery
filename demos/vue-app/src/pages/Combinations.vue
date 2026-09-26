<script setup lang="ts">
import { computed, reactive } from 'vue';
import { LightGallery, type LgVuePlugin } from '@lightgallery/vue';

import Autoplay from '@lightgallery/vue/plugins/autoplay';
import Comment from '@lightgallery/vue/plugins/comment';
import Fullscreen from '@lightgallery/vue/plugins/fullscreen';
import Hash from '@lightgallery/vue/plugins/hash';
import MediumZoom from '@lightgallery/vue/plugins/mediumZoom';
import Pager from '@lightgallery/vue/plugins/pager';
import RelativeCaption from '@lightgallery/vue/plugins/relativeCaption';
import Rotate from '@lightgallery/vue/plugins/rotate';
import Share from '@lightgallery/vue/plugins/share';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Video from '@lightgallery/vue/plugins/video';
import Zoom from '@lightgallery/vue/plugins/zoom';

import { MIXED_ITEMS, MODES, type Mode } from '../../../shared/media';
import Choice from '../ui/Choice.vue';
import Tile from '../ui/Tile.vue';
import Toggle from '../ui/Toggle.vue';
import { flip } from '../ui/flip';

/**
 * Zoom before Rotate keeps zoom as the outermost slide wrapper, matching
 * the 2.x DOM. Order here is the order handed to `plugins`.
 */
const PLUGINS: { id: string; label: string; plugin: LgVuePlugin }[] = [
    { id: 'thumbnail', label: 'Thumbnail', plugin: Thumbnail },
    { id: 'zoom', label: 'Zoom', plugin: Zoom },
    { id: 'rotate', label: 'Rotate', plugin: Rotate },
    { id: 'video', label: 'Video', plugin: Video },
    { id: 'share', label: 'Share', plugin: Share },
    { id: 'autoplay', label: 'Autoplay', plugin: Autoplay },
    { id: 'fullscreen', label: 'Fullscreen', plugin: Fullscreen },
    { id: 'pager', label: 'Pager', plugin: Pager },
    { id: 'comment', label: 'Comment', plugin: Comment },
    { id: 'mediumZoom', label: 'Medium zoom', plugin: MediumZoom },
    {
        id: 'relativeCaption',
        label: 'Relative caption',
        plugin: RelativeCaption,
    },
    { id: 'hash', label: 'Hash', plugin: Hash },
];

const PRESETS: Record<string, string[]> = {
    Minimal: [],
    Typical: ['thumbnail', 'zoom', 'video'],
    'All plugins': PLUGINS.map((entry) => entry.id),
};

const DIRECTIONS = ['ltr', 'rtl'] as const;

const s = reactive({
    active: [...PRESETS.Typical],
    mode: 'lg-slide' as Mode,
    direction: 'ltr' as (typeof DIRECTIONS)[number],
    actualSize: true,
    infiniteZoom: true,
    virtualization: false,
    allowMediaOverlap: false,
    download: true,
    counter: true,
    gestureButtons: false,
});

const plugins = computed(() =>
    PLUGINS.filter((entry) => s.active.includes(entry.id)).map(
        (entry) => entry.plugin,
    ),
);
const key = computed(() => JSON.stringify(s));
</script>

<template>
    <section>
        <h2>Plugin combinations</h2>
        <p class="note">
            Images of every shape plus video slides. Toggle any mix of plugins
            and settings; the gallery rebuilds with exactly that combination.
        </p>
        <details class="panel" open>
            <summary>Settings</summary>
            <div class="controls">
                <div class="control-group">
                    <strong>Plugins</strong>
                    <Toggle
                        v-for="entry of PLUGINS"
                        :key="entry.id"
                        :label="entry.label"
                        :model-value="s.active.includes(entry.id)"
                        @update:model-value="
                            s.active = flip(s.active, entry.id)
                        "
                    />
                </div>
                <div class="control-group">
                    <strong>Presets</strong>
                    <button
                        v-for="(ids, label) of PRESETS"
                        :key="label"
                        type="button"
                        @click="s.active = [...ids]"
                    >
                        {{ label }}
                    </button>
                </div>
                <div class="control-group">
                    <strong>Settings</strong>
                    <Choice v-model="s.mode" label="Mode" :options="MODES" />
                    <Choice
                        v-model="s.direction"
                        label="Direction"
                        :options="DIRECTIONS"
                    />
                    <Toggle v-model="s.actualSize" label="actualSize" />
                    <Toggle v-model="s.infiniteZoom" label="infiniteZoom" />
                    <Toggle v-model="s.virtualization" label="virtualization" />
                    <Toggle
                        v-model="s.allowMediaOverlap"
                        label="allowMediaOverlap"
                    />
                    <Toggle v-model="s.download" label="download" />
                    <Toggle v-model="s.counter" label="counter" />
                    <Toggle
                        v-model="s.gestureButtons"
                        label="showGestureButtons (mobile)"
                    />
                </div>
            </div>
        </details>
        <p class="readout">
            Active: <code>{{ s.active.join(' + ') || 'core only' }}</code> ·
            <code>{{ s.mode }}</code> · <code>{{ s.direction }}</code>
        </p>
        <LightGallery
            :key="key"
            :plugins="plugins"
            :mode="s.mode"
            :direction="s.direction"
            :download="s.download"
            :counter="s.counter"
            :mobile-settings="{
                controls: false,
                showCloseIcon: false,
                download: false,
                showGestureButtons: s.gestureButtons,
            }"
            :allow-media-overlap="s.allowMediaOverlap"
            :virtualization="
                s.virtualization ? { slides: 5, thumbs: 'auto' } : undefined
            "
            :zoom="{
                showZoomInOutIcons: true,
                actualSize: s.actualSize,
                infiniteZoom: s.infiniteZoom,
            }"
        >
            <div class="grid">
                <Tile
                    v-for="item of MIXED_ITEMS"
                    :key="item.alt"
                    :item="item"
                    :caption="false"
                />
            </div>
        </LightGallery>
    </section>
</template>
