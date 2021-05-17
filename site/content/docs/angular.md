---
title: 'lightGallery Angular'
description: 'Full featured image and video gallery component for Angular'
lead: 'Full featured image and video gallery component for angular.'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
        name: 'Angular'
weight: 9
toc: true
---

## Installation

Follow the below steps to use lightGallery angular component in your
application. Angular component is part of the main lightGallery package on NPM.
You can import it using the following way

-   Install lightGallery via NPM

```
npm install lightgallery
```

-   Import lightGallery module

```jsx
import { LightgalleryModule } from 'lightgallery/angular';

@NgModule({
    imports: [LightgalleryModule],
})
export class AppModule {}
```

-   import styles in styles.scss

```scss
@import '~lightgallery/scss/lightgallery';
```

-   template

```html
<lightgallery [settings]="settings" [onInit]="onInit">
    <a href="img/img1.jpg">
        <img alt=".." src="img/thumb1.jpg" />
    </a>
    <a href="img/img1.jpg">
        <img alt=".." src="img/thumb1.jpg" />
    </a>
</lightgallery>
```

## Inputs

All lightGallery settings can be passed to angular component via settings input.
Additionally, you can use lifecycle hook methods listed below to hook into
lightGalley component lifecycle. Almost every method passes a detail object
which holds useful plugin data

#### usage example

```js
@Component({
    selector: 'gallery',
    template: `
        <lightgallery [settings]="settings" [onBeforeSlide]="onBeforeSlide">
            <a href="img/img1.jpg">
                <img alt=".." src="img/thumb1.jpg" />
            </a>
            <a href="img/img1.jpg">
                <img alt=".." src="img/thumb1.jpg" />
            </a>
        </lightgallery>
    `,
})
export class AppComponent {
    settings = {
        counter: false,
        plugins: [lgZoom],
    };
    onBeforeSlide = (detail: BeforeSlideDetail): void => {
        const { index, prevIndex } = detail;
        console.log(index, prevIndex);
    };
}
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
