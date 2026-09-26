<script setup lang="ts">
import { computed, reactive } from 'vue';
import { LightGallery, type LgVuePlugin } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Video from '@lightgallery/vue/plugins/video';
import Zoom from '@lightgallery/vue/plugins/zoom';

import { VIDEO_ITEMS, VIDEO_PROVIDERS } from '../../../shared/media';
import Tile from '../ui/Tile.vue';
import Toggle from '../ui/Toggle.vue';
import { flip } from '../ui/flip';

const s = reactive({
    providers: [...VIDEO_PROVIDERS],
    thumbnail: true,
    zoom: false,
    loadYouTubeThumbnail: true,
    autoplayFirstVideo: false,
    videoFacade: true,
    youTubeNoCookie: true,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false,
});

const items = computed(() =>
    VIDEO_ITEMS.filter((item) =>
        s.providers.some((provider) => item.tags.includes(provider)),
    ),
);
const plugins = computed(
    () =>
        [Video, s.thumbnail && Thumbnail, s.zoom && Zoom].filter(
            Boolean,
        ) as LgVuePlugin[],
);
const key = computed(() => JSON.stringify(s));
</script>

<template>
    <section>
        <h2>Video</h2>
        <p class="note">
            YouTube, Vimeo, Wistia and self-hosted HTML5, each with an explicit
            poster and without one. With facades on, the player loads only when
            you press play. On a phone, check play, pause when swiping away,
            fullscreen and rotation; mobile browsers usually only autoplay muted
            video.
        </p>
        <details class="panel" open>
            <summary>Settings</summary>
            <div class="controls">
                <div class="control-group">
                    <strong>Providers</strong>
                    <Toggle
                        v-for="entry of VIDEO_PROVIDERS"
                        :key="entry"
                        :label="entry"
                        :model-value="s.providers.includes(entry)"
                        @update:model-value="
                            s.providers = flip(s.providers, entry)
                        "
                    />
                </div>
                <div class="control-group">
                    <strong>Video settings</strong>
                    <Toggle v-model="s.videoFacade" label="videoFacade" />
                    <Toggle
                        v-model="s.autoplayFirstVideo"
                        label="autoplayFirstVideo"
                    />
                    <Toggle
                        v-model="s.autoplayVideoOnSlide"
                        label="autoplayVideoOnSlide"
                    />
                    <Toggle
                        v-model="s.gotoNextSlideOnVideoEnd"
                        label="gotoNextSlideOnVideoEnd"
                    />
                    <Toggle v-model="s.youTubeNoCookie" label="youTubeNoCookie" />
                </div>
                <div class="control-group">
                    <strong>Other plugins</strong>
                    <Toggle v-model="s.thumbnail" label="Thumbnail" />
                    <Toggle
                        v-model="s.loadYouTubeThumbnail"
                        label="loadYouTubeThumbnail"
                    />
                    <Toggle v-model="s.zoom" label="Zoom" />
                </div>
            </div>
        </details>
        <p class="readout">{{ items.length }} videos</p>
        <LightGallery
            :key="key"
            :plugins="plugins"
            :video="{
                autoplayFirstVideo: s.autoplayFirstVideo,
                videoFacade: s.videoFacade,
                youTubeNoCookie: s.youTubeNoCookie,
                gotoNextSlideOnVideoEnd: s.gotoNextSlideOnVideoEnd,
                autoplayVideoOnSlide: s.autoplayVideoOnSlide,
            }"
            :thumbnail="{ loadYouTubeThumbnail: s.loadYouTubeThumbnail }"
        >
            <div class="grid">
                <Tile v-for="item of items" :key="item.alt" :item="item" />
            </div>
        </LightGallery>
    </section>
</template>
