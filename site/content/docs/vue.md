---
title: 'lightGallery Vue'
description: 'Full featured image and video gallery component for Vue.js'
lead: 'Full featured image and video gallery component for vue.'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
        name: 'Vue'
weight: 8
toc: true
---

## Installation

Follow the below steps to use lightGallery vue component in your application.
Vue component is part of the main lightGallery package on NPM. You can import it
using the following way

-   Install lightGallery via NPM

```
npm install lightgallery
```

-   Import vue component and styles

```vue
<template>
    <lightgallery
        :settings="{ speed: 500, plugins: plugins }"
        :onInit="onInit"
        :onBeforeSlide="onBeforeSlide"
    >
        <a href="img/img1.jpg">
            <img alt=".." src="img/thumb1.jpg" />
        </a>
        <a href="img/img2.jpg">
            <img alt=".." src="img/thumb2.jpg" />
        </a>
        ...
    </lightgallery>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import Lightgallery from 'lightgallery/vue';
    import lgThumbnail from 'lightgallery/plugins/lg-thumbnail';
    import lgZoom from 'lightgallery/plugins/lg-zoom';

    @Options({
        components: {
            Lightgallery,
        },
        data: () => ({
            plugins: [lgThumbnail, lgZoom],
        }),
        methods: {
            onInit: () => {
                console.log('lightGallery has been initialized');
            },
            onBeforeSlide: () => {
                console.log('calling before slide');
            },
        },
    })
    export default class App extends Vue {}
</script>
<style lang="css" scoped>
    @import 'lightgallery/css/lightgallery.css';
</style>
```

## Props and methods

All lightGallery settings can be passed to vue component via settings prop.
Additionally, you can use lifecycle hook methods listed below to hook into
lightGalley component lifecycle. Almost every method passes a detail object
which holds useful plugin data

#### usage example

```js
<template>
    <lightgallery
        :onBeforeSlide="onBeforeSlide"
    >
        <a href="img/img1.jpg">
            <img alt=".." src="img/thumb1.jpg" />
        </a>
        <a href="img/img2.jpg">
            <img alt=".." src="img/thumb2.jpg" />
        </a>
        ...
    </lightgallery>
</template>
@Options({
    components: {
        Lightgallery,
    },
    methods: {
        onBeforeSlide: (detail) => {
            const { index, prevIndex } = detail;
            console.log(index, prevIndex);
        },
    },
})
export default class App extends Vue {}
```

<div class="event-docs-list">
    {{< callbacks interface="InitDetail" >}}
    {{< callbacks interface="BeforeOpenDetail" >}}
    {{< callbacks interface="AfterOpenDetail" >}}
    {{< callbacks interface="AfterAppendSlideEventDetail" >}}
    {{< callbacks interface="AfterAppendSubHtmlDetail" >}}
    {{< callbacks interface="SlideItemLoadDetail" >}}
    {{< callbacks interface="HasVideoDetail" >}}
    {{< callbacks interface="BeforeSlideDetail" >}}
    {{< callbacks interface="AfterSlideDetail" >}}
    {{< callbacks interface="BeforeNextSlideDetail" >}}
    {{< callbacks interface="BeforePrevSlideDetail" >}}
    {{< callbacks interface="PosterClickDetail" >}}
    {{< callbacks interface="DragStartDetail" >}}
    {{< callbacks interface="DragMoveDetail" >}}
    {{< callbacks interface="DragEndDetail" >}}
    {{< callbacks interface="ContainerResizeDetail" >}}
    {{< callbacks interface="BeforeCloseDetail" >}}
    {{< callbacks interface="AfterCloseDetail" >}}
</div>
