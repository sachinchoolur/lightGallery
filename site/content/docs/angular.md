---
title: lightGallery Angular
description: Full featured image and video gallery component for Angular
lead: Full featured image and video gallery component for angular.
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: {docs: {parent: API Docs, name: Angular}}
weight: 9
toc: true
---

<a class="btn btn-outline-primary" href="https://stackblitz.com/edit/lightgallery-angular" target="_blank">StackBlitz
Demo</a>

## Installation

Follow the below steps to use lightGallery angular component in your
application. Angular component is part of the main lightGallery package on NPM.
You can import it using the following way

-   Install lightGallery via NPM


    npm install lightgallery

-   Import lightGallery module

```jsx
import { LightgalleryModule } from 'lightgallery/angular';

// lightGallery supports the last 4 major version of Angular,
// if you are using older versions of angular, you can import the respective versions
// For example, if you are using Angular version 10, you can import it using
// import { LightgalleryModule } from 'lightgallery/angular/9';

@NgModule({
    imports: [LightgalleryModule],
})
export class AppModule {}
```

Since, [version 2.2.0](https://github.com/sachinchoolur/lightGallery/releases/tag/2.2.0), lightGallery supports the last 4 major versions of Angular.
If you are using an older version of Angular, please choose the respective version.

For example, if you are using Angular version 10, you can import it by suffixing the version number as shown below

```js
import { LightgalleryModule } from 'lightgallery/angular/10';
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
    {{< callbacks interface="RotateLeftDetail" >}}
    {{< callbacks interface="RotateRightDetail" >}}
    {{< callbacks interface="FlipHorizontalDetail" >}}
    {{< callbacks interface="FlipVerticalDetail" >}}
</div>

## Updating slides

lightGallery does not update slides automatically due to performance reasons.
But you can easily update slides whenever needed by calling `refresh` method.

<a class="btn btn-outline-primary" href="https://stackblitz.com/edit/lightgallery-angular-update-slides" target="_blank">StackBlitz
Demo</a>

```ts
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    private lightGallery!: LightGallery;
    private needRefresh = false;
    ngAfterViewChecked(): void {
        if (this.needRefresh) {
            this.lightGallery.refresh();
            this.needRefresh = false;
        }
    }
    title = 'angular-demo';
    settings = {
        counter: false,
        plugins: [lgZoom],
    };
    items = [
        {
            id: '1',
            size: '1400-800',
            src: 'img-1.jpg',
            thumb: 'thumb-1.jpg',
        },
        {
            id: '2',
            size: '1400-800',
            src: 'img-2.jpg',
            thumb: 'thumb-2.jpg',
        },
    ];
    onInit = (detail: InitDetail): void => {
        this.lightGallery = detail.instance;
    };
    addImage = () => {
        this.items = [
            ...this.items,
            {
                id: '5',
                size: '1400-800',
                src: 'img-5.jpg',
                thumb: 'thumb-5.jpg',
            },
        ];
        this.needRefresh = true;
    };
}
```
