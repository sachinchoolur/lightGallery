<script setup lang="ts">
/**
 * Standalone consumer app for `@lightgallery/vue`.
 *
 * Resolves the package through its published `exports` map rather than
 * a source alias, and splits the feature surface into hash-routed pages
 * shared with the React and Angular apps, so the same page can be opened
 * in all three on any device.
 */
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue';

import {
    PAGES,
    isPageHash,
    pageFromHash,
    type PageId,
} from '../../shared/media';
import Combinations from './pages/Combinations.vue';
import Justified from './pages/Justified.vue';
import Mixed from './pages/Mixed.vue';
import Sizes from './pages/Sizes.vue';
import Thumbnails from './pages/Thumbnails.vue';
import Video from './pages/Video.vue';

// CSS stays a consumer import — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-rtl.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-pager.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-comments.css';
import 'lightgallery/css/lg-medium-zoom.css';
import 'lightgallery/css/lg-justified.css';

const PAGE_COMPONENTS: Record<PageId, Component> = {
    combinations: Combinations,
    sizes: Sizes,
    thumbnails: Thumbnails,
    video: Video,
    justified: Justified,
    mixed: Mixed,
};

const page = ref<PageId>(pageFromHash(window.location.hash));

function onHashChange() {
    if (isPageHash(window.location.hash)) {
        page.value = pageFromHash(window.location.hash);
    }
}

onMounted(() => window.addEventListener('hashchange', onHashChange));
onBeforeUnmount(() =>
    window.removeEventListener('hashchange', onHashChange),
);
</script>

<template>
    <main class="demo">
        <h1>@lightgallery/vue — consumer app</h1>
        <p class="note">
            Resolved through the package <code>exports</code> map, not a source
            alias. The same pages exist in the React and Angular apps.
        </p>
        <nav class="demo-nav">
            <a
                v-for="entry of PAGES"
                :key="entry.id"
                :href="`#${entry.id}`"
                :class="{ active: entry.id === page }"
            >
                {{ entry.title }}
            </a>
        </nav>
        <component :is="PAGE_COMPONENTS[page]" :key="page" />
    </main>
</template>
