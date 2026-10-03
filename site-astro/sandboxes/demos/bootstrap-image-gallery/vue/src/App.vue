<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

// The grid needs Bootstrap's stylesheet only, none of its JavaScript.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

const plugins = [Zoom, Thumbnail];

// The photos of each grid column. `lgSize` is the full-size image's
// WIDTH-HEIGHT; it lets the image open from its thumbnail.
const columns: LgGalleryItem[][] = [
    [
        {
            src: 'https://picsum.photos/id/10/1600/1067',
            thumb: 'https://picsum.photos/id/10/480/320',
            alt: 'Sample photo 1',
            lgSize: '1600-1067',
        },
        {
            src: 'https://picsum.photos/id/11/1200/1600',
            thumb: 'https://picsum.photos/id/11/480/640',
            alt: 'Sample photo 2',
            lgSize: '1200-1600',
        },
    ],
    [
        {
            src: 'https://picsum.photos/id/15/1200/1600',
            thumb: 'https://picsum.photos/id/15/480/640',
            alt: 'Sample photo 3',
            lgSize: '1200-1600',
        },
        {
            src: 'https://picsum.photos/id/16/1600/1067',
            thumb: 'https://picsum.photos/id/16/480/320',
            alt: 'Sample photo 4',
            lgSize: '1600-1067',
        },
    ],
    [
        {
            src: 'https://picsum.photos/id/28/1200/1200',
            thumb: 'https://picsum.photos/id/28/480/480',
            alt: 'Sample photo 5',
            lgSize: '1200-1200',
        },
        {
            src: 'https://picsum.photos/id/29/1200/1200',
            thumb: 'https://picsum.photos/id/29/480/480',
            alt: 'Sample photo 6',
            lgSize: '1200-1200',
        },
    ],
];
</script>

<template>
    <h1>lightGallery with a Bootstrap image gallery</h1>
    <!-- The items can sit at any depth inside the gallery, so the Bootstrap
         grid keeps its own markup. -->
    <LightGallery :plugins="plugins">
        <div class="row g-2">
            <div v-for="(column, index) of columns" :key="index" class="col-4">
                <LgItem
                    v-for="photo of column"
                    :key="photo.src"
                    :item="photo"
                    class="d-block mb-2"
                >
                    <img
                        :src="photo.thumb"
                        class="d-block w-100"
                        :alt="photo.alt"
                    />
                </LgItem>
            </div>
        </div>
    </LightGallery>
</template>
