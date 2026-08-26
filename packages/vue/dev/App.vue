<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
    LightGallery,
    LgItem,
    type LgGalleryItem,
} from '@lightgallery/vue';
import Autoplay from '@lightgallery/vue/plugins/autoplay';
import Comment from '@lightgallery/vue/plugins/comment';
import Fullscreen from '@lightgallery/vue/plugins/fullscreen';
import Hash from '@lightgallery/vue/plugins/hash';
import Pager from '@lightgallery/vue/plugins/pager';
import Rotate from '@lightgallery/vue/plugins/rotate';
import Share from '@lightgallery/vue/plugins/share';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Video from '@lightgallery/vue/plugins/video';
import Zoom from '@lightgallery/vue/plugins/zoom';
import { JustifiedGrid } from '@lightgallery/vue/plugins/justified';

const picsum = (id: number, w: number, h: number): string =>
    `https://picsum.photos/id/${id}/${w}/${h}`;
// Rig-only responsive ladder: real w-descriptor srcset so device passes
// exercise the plan-002 selection math end to end.
const picsumSrcset = (id: number): string =>
    [640, 960, 1280, 1600]
        .map((w) => `${picsum(id, w, Math.round((w * 1067) / 1600))} ${w}w`)
        .join(', ');

const SOURCES = [
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
    { id: 1019, title: 'Lakeside cliffs' },
    { id: 1039, title: 'Waterfall in the forest' },
    { id: 1043, title: 'Village at dusk' },
    { id: 1044, title: 'Foggy shore' },
    { id: 1051, title: 'Ridge line' },
];

const items: LgGalleryItem[] = SOURCES.map((source) => ({
    src: picsum(source.id, 1600, 1067),
    srcset: picsumSrcset(source.id),
    sizes: '100vw',
    thumb: picsum(source.id, 240, 160),
    lgSize: '1600-1067',
    alt: source.title,
    caption: source.title,
}));

// Video matrix for device passes: YouTube (endpoint poster), Vimeo with
// an explicit poster, posterless Vimeo/Wistia (thumb-fallback facades)
// and a self-hosted HTML5 file.
const videoItems: LgGalleryItem[] = [
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/1.jpg',
        alt: 'Big Buck Bunny (YouTube)',
        caption: 'YouTube video slide',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: picsum(1015, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1015, 240, 160),
        alt: 'Vimeo demo video (poster first)',
        caption: 'Vimeo, poster first',
    },
    {
        src: 'https://vimeo.com/115041822',
        lgSize: '1280-720',
        thumb: picsum(1019, 240, 160),
        alt: 'Vimeo demo video',
        caption: 'Vimeo video slide (thumb-fallback facade)',
    },
    {
        src: 'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
        lgSize: '1280-720',
        thumb: picsum(1039, 240, 160),
        alt: 'Wistia demo video',
        caption: 'Wistia video slide (thumb-fallback facade)',
    },
    {
        video: {
            source: [
                {
                    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                    type: 'video/mp4',
                },
            ],
            attributes: { preload: false, controls: true },
        },
        poster: picsum(1043, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1043, 240, 160),
        alt: 'HTML5 demo video',
        caption: 'HTML5, self-hosted mp4',
    },
];

const rtlItems: LgGalleryItem[] = items.slice(0, 5).map((item, i) => ({
    ...item,
    caption: `شريحة ${i + 1} — ${item.alt}`,
}));

// Kitchen sink (zoom before rotate: zoom stays the outermost wrapper,
// 2.x DOM order).
const kitchenSinkPlugins = [
    Thumbnail,
    Zoom,
    Video,
    Autoplay,
    Fullscreen,
    { ...Hash, defaults: { ...Hash.defaults!, galleryId: 'demo' } },
    Pager,
    Share,
    Rotate,
    { ...Comment, defaults: { ...Comment.defaults!, commentBox: true } },
];

// Stress rig: 1,000 items, opened imperatively so the page grid stays
// light. Virtualization bounds the mounted slides + thumb strip.
const stressItems: LgGalleryItem[] = Array.from({ length: 1000 }, (_, i) => ({
    src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
    thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
    lgSize: '1600-1067',
    alt: `Stress slide ${i + 1}`,
    caption: `Stress slide ${i + 1} / 1000`,
}));

/**
 * The device-test matrix — the same scenario ids as the vanilla, React
 * and Angular rigs (hash-routed), so a phone can be deep-linked to e.g.
 * #share on all four ports and the packages compared on identical
 * content. One scenario mounts at a time to keep the page light.
 */
const SCENARIOS = [
    {
        id: 'images',
        title: 'Images',
        note: 'Plain grid — thumbnails + zoom defaults, srcset ladder.',
    },
    {
        id: 'thumbnails',
        title: 'Thumbnails',
        note: 'Static strip + toggle button (animateThumb off, allowMediaOverlap).',
    },
    {
        id: 'zoom',
        title: 'Zoom',
        note: 'actualSize + infiniteZoom + icons — pinch, double-tap, drag.',
    },
    {
        id: 'video',
        title: 'Video',
        note: 'YouTube / Vimeo / Wistia facades + HTML5 mp4; autoplayFirstVideo off.',
    },
    {
        id: 'share',
        title: 'Share',
        note: 'preferNativeShare — expect the system share sheet on devices.',
    },
    {
        id: 'dynamic',
        title: 'Dynamic',
        note: 'v-model open/index; add/remove slides is a state update.',
    },
    {
        id: 'virtualization',
        title: 'Virtualization',
        note: '1,000 slides; slide pool 7, thumb strip windowed.',
    },
    {
        id: 'justified',
        title: 'Justified',
        note: 'Justified trigger rows — resize/rotate the device to re-flow.',
    },
    {
        id: 'rtl',
        title: 'RTL',
        note: 'direction: rtl — arrows/keys/swipe mirror, chrome flips.',
    },
    {
        id: 'kitchen-sink',
        title: 'Kitchen sink',
        note: 'Images + videos, all plugins at once.',
    },
] as const;

type ScenarioId = (typeof SCENARIOS)[number]['id'];

const readHash = (): ScenarioId => {
    const hash = window.location.hash.replace(/^#/, '');
    return SCENARIOS.some((entry) => entry.id === hash)
        ? (hash as ScenarioId)
        : SCENARIOS[0].id;
};

const current = ref<ScenarioId>(readHash());
// Unknown hashes belong to the galleries themselves (the Hash plugin
// writes #lg=… deep links) — never switch scenarios on one.
const onHashChange = () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (SCENARIOS.some((entry) => entry.id === hash)) {
        current.value = hash as ScenarioId;
    }
};
onMounted(() => window.addEventListener('hashchange', onHashChange));
onUnmounted(() => window.removeEventListener('hashchange', onHashChange));
const note = computed(
    () => SCENARIOS.find((entry) => entry.id === current.value)?.note ?? '',
);

// dynamic scenario state
const dynOpen = ref(false);
const dynIndex = ref(0);
const dynCount = ref(4);
const dynSlides = computed(() => items.slice(0, dynCount.value));

// button-opened galleries
const stressLg = ref<InstanceType<typeof LightGallery> | null>(null);
const rtlLg = ref<InstanceType<typeof LightGallery> | null>(null);
const sinkLg = ref<InstanceType<typeof LightGallery> | null>(null);
const lastEvent = ref('');
</script>

<template>
    <div style="font-family: system-ui, sans-serif; padding: 1rem 2rem 4rem">
        <h1>@lightgallery/vue dev demo</h1>
        <nav class="scenario-nav">
            <a
                v-for="entry of SCENARIOS"
                :key="entry.id"
                :href="'#' + entry.id"
                :class="{ active: entry.id === current }"
            >
                {{ entry.title }}
            </a>
        </nav>
        <p class="scenario-note">{{ note }}</p>

        <section v-if="current === 'images'">
            <LightGallery :plugins="[Thumbnail, Zoom]">
                <div class="demo-grid">
                    <LgItem v-for="item of items" :key="item.src" :item="item">
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </div>
            </LightGallery>
        </section>

        <section v-else-if="current === 'thumbnails'">
            <LightGallery
                :plugins="[Thumbnail]"
                :thumbnail="{ animateThumb: false, toggleThumb: true }"
                :allow-media-overlap="true"
            >
                <div class="demo-grid">
                    <LgItem v-for="item of items" :key="item.src" :item="item">
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </div>
            </LightGallery>
        </section>

        <section v-else-if="current === 'zoom'">
            <LightGallery
                :plugins="[Zoom, Thumbnail]"
                :zoom="{
                    showZoomInOutIcons: true,
                    actualSize: true,
                    infiniteZoom: true,
                }"
            >
                <div class="demo-grid">
                    <LgItem v-for="item of items" :key="item.src" :item="item">
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </div>
            </LightGallery>
        </section>

        <section v-else-if="current === 'video'">
            <LightGallery
                :plugins="[Video, Thumbnail]"
                :video="{ autoplayFirstVideo: false }"
            >
                <div class="demo-grid">
                    <LgItem
                        v-for="item of videoItems"
                        :key="item.src ?? item.alt"
                        :item="item"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </div>
            </LightGallery>
        </section>

        <section v-else-if="current === 'share'">
            <LightGallery
                :plugins="[Share, Thumbnail]"
                :share="{ preferNativeShare: true }"
            >
                <div class="demo-grid">
                    <LgItem
                        v-for="item of items.slice(0, 5)"
                        :key="item.src"
                        :item="item"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </div>
            </LightGallery>
        </section>

        <section v-else-if="current === 'dynamic'">
            <div class="demo-controls">
                <button type="button" @click="dynOpen = true">
                    open gallery
                </button>
                <button
                    type="button"
                    @click="dynCount = Math.min(dynCount + 1, items.length)"
                >
                    add slide
                </button>
                <button
                    type="button"
                    @click="dynCount = Math.max(dynCount - 1, 1)"
                >
                    remove slide
                </button>
                <span>{{ dynCount }} slides · index {{ dynIndex }}</span>
            </div>
            <LightGallery
                :slides="dynSlides"
                :plugins="[Thumbnail, Zoom]"
                v-model:open="dynOpen"
                v-model:index="dynIndex"
            />
        </section>

        <section v-else-if="current === 'virtualization'">
            <div class="demo-controls">
                <button type="button" @click="stressLg?.openGallery(0)">
                    open 1,000-item gallery
                </button>
                <button type="button" @click="stressLg?.openGallery(500)">
                    open at #500
                </button>
            </div>
            <LightGallery
                ref="stressLg"
                :slides="stressItems"
                :plugins="[Thumbnail]"
                :virtualization="{ slides: 7, thumbs: 'auto' }"
                :zoom-from-origin="false"
            />
        </section>

        <section v-else-if="current === 'justified'">
            <LightGallery :plugins="[Thumbnail, Zoom]">
                <JustifiedGrid :row-height="140" :gap="8">
                    <LgItem
                        v-for="item of items"
                        :key="'justified-' + item.src"
                        :item="item"
                        data-lg-size="1600-1067"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </JustifiedGrid>
            </LightGallery>
        </section>

        <section v-else-if="current === 'rtl'">
            <div class="demo-controls">
                <button type="button" @click="rtlLg?.openGallery(0)">
                    open RTL gallery (direction: rtl)
                </button>
            </div>
            <LightGallery
                ref="rtlLg"
                :slides="rtlItems"
                direction="rtl"
                :plugins="[Thumbnail, Zoom]"
            />
        </section>

        <section v-else>
            <div class="demo-controls">
                <button type="button" @click="sinkLg?.openGallery(2)">
                    Imperative: open at slide 3
                </button>
                <span style="color: #666">{{ lastEvent }}</span>
            </div>
            <LightGallery
                :ref="(el) => (sinkLg = el as never)"
                :mousewheel="true"
                :plugins="kitchenSinkPlugins"
                :zoom="{ showZoomInOutIcons: true, actualSize: true }"
                @before-slide="lastEvent = 'beforeSlide → ' + $event.index"
                @after-slide="lastEvent = 'afterSlide → ' + $event.index"
            >
                <div class="demo-grid">
                    <LgItem
                        v-for="item of [...items, ...videoItems.slice(0, 3)]"
                        :key="item.src ?? item.alt"
                        :item="item"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </div>
                <template #comments="{ item, index }">
                    <div style="padding: 1rem">
                        <p><strong>{{ item?.caption }}</strong></p>
                        <p>
                            Comment panel for slide {{ index + 1 }} — bring
                            any comment system as a template.
                        </p>
                    </div>
                </template>
                <template #caption="{ item, index }">
                    <h4>{{ item?.caption }}</h4>
                    <p>Slide {{ index + 1 }} — scoped-slot caption</p>
                </template>
            </LightGallery>
        </section>
    </div>
</template>

<style>
.scenario-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    margin: 12px 0;
}
.scenario-nav a {
    text-decoration: none;
}
.scenario-nav a.active {
    font-weight: 700;
    text-decoration: underline;
}
.scenario-note {
    color: #667;
    margin: 0 0 12px;
}
.demo-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.demo-grid img {
    display: block;
    width: 160px;
    height: 107px;
    object-fit: cover;
}
.demo-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 12px;
}
</style>
