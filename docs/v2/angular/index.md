# lightGallery 2.x Angular wrapper (archive)

> Archived documentation for the lightGallery 2.x Angular wrapper. Version 3 ships a native Angular package, see the migration guide.

Documentation for the legacy 2.x Angular wrapper, kept for projects that have not migrated yet.

Canonical page: https://www.lightgalleryjs.com/docs/v2/angular/

> **Archived.** This page documents the **2.x** `lightgallery/angular` wrapper,
> which embedded the vanilla runtime. lightGallery 3 ships
> [`@lightgallery/angular`](/docs/angular/), a native Angular package, start
> there for new projects, and see the
> [migration guide](/docs/migration/) to upgrade.

<a class="btn btn-outline-primary" href="https://stackblitz.com/edit/lightgallery-angular" target="_blank">StackBlitz
Demo</a>

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
// For angular version 14
import { LightgalleryModule } from 'lightgallery/angular';

// lightGallery supports the last 4 major version of Angular,
// if you are using older versions of angular, you can import the respective versions
// For example, if you are using Angular version 13, you can import it using
// import { LightgalleryModule } from 'lightgallery/angular/13';

@NgModule({
    imports: [LightgalleryModule],
})
export class AppModule {}
```

Since, [version 2.2.0](https://github.com/sachinchoolur/lightGallery/releases/tag/2.2.0), lightGallery supports the last 4 major versions of Angular.
If you are using an older version of Angular, please choose the respective version.

For example, if you are using Angular version 13, you can import it by suffixing the version number as shown below

```js
import { LightgalleryModule } from 'lightgallery/angular/13';
```

-   import styles in styles.scss

```scss
@import '~lightgallery/scss/lightgallery';
```

-   template

```html
<lightgallery [settings]="settings" [onInit]="onInit">
    <a href="img/img1.jpg">
        <img alt="img1" src="img/thumb1.jpg" />
    </a>
    <a href="img/img1.jpg">
        <img alt="img2" src="img/thumb1.jpg" />
    </a>
</lightgallery>
```

## Inputs

All lightGallery settings can be passed to angular component via settings input.
Additionally, you can use lifecycle hook methods listed below to hook into
lightGallery component lifecycle. Almost every method passes a detail object
which holds useful plugin data

#### usage example

```js
@Component({
    selector: 'gallery',
    template: `
        <lightgallery [settings]="settings" [onBeforeSlide]="onBeforeSlide">
            <a href="img/img1.jpg">
                <img alt="img1" src="img/thumb1.jpg" />
            </a>
            <a href="img/img1.jpg">
                <img alt="img2" src="img/thumb1.jpg" />
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

### `onInit`

Fired only once when lightGallery is initialized

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `instance` | `LightGallery` | The gallery instance, the same object lightGallery() returns. |

**Example**

```js
const lg = document.getElementById('custom-events-demo');
  // Perform any action on lightGallery initialization.
  // Init event returns the plugin instance that can be used to call any lightGallery public method
  let pluginInstance = null;
  lg.addEventListener('lgInit', (event) => {
     pluginInstance = event.detail.instance;
  });
  lightGallery(lg);
```

See also: [Methods](https://www.lightgalleryjs.com/docs/methods/)
### `onBeforeOpen`

Fired immediately before opening the gallery
### `onAfterOpen`

Fired immediately after opening the gallery
### `onAfterAppendSlide`

Fired when the slide content has been inserted into its slide container.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `onAfterAppendSubHtml`

Fired when the sub-html content (ex : title/ description) has been appended into the slide.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `onSlideItemLoad`

Fired once the media inside the slide has been completely loaded, or has failed to load and the slide shows its error message instead.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `delay` | `number` | For the first slide, lightGallery adds some delay for displaying the loaded slide item. This delay is required for the transition effect when the slide item is displayed Respect the delay when you use this event |
| `index` | `number` | Index of the slide |
| `isFirstSlide` | `boolean` | True when the loaded slide is the first one shown after the gallery opened. |
### `onHasVideo`

Fired when lightGallery detects video slide

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `hasPoster` | `boolean` | True if video has poster |
| `html5Video` | `VideoSource` | HTML5 video source if available HTML5 video source = source: { src: string; type: string; }[]; attributes: HTMLVideoElement; |
| `index` | `number` | Index of the slide |
| `src` | `string` | Video source |
### `onBeforeSlide`

Fired immediately before each slide transition.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `fromThumb` | `boolean` | true if slide function called via thumbnail click |
| `fromTouch` | `boolean` | true if slide function called via touch event or mouse drag |
| `index` | `number` | Index of the slide |
| `prevIndex` | `number` | Index of the previous slide |

**Example**

```js
const lg = document.getElementById('custom-events-demo');
  // Perform any action before each slide transition
  lg.addEventListener('lgBeforeSlide', (event) => {
      const { index, prevIndex } = event.detail;
      alert(index, prevIndex);
  });
  lightGallery(lg);
```
### `onAfterSlide`

Fired immediately after each slide transition.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `fromThumb` | `boolean` | true if slide function called via thumbnail click |
| `fromTouch` | `boolean` | true if slide function called via touch event or mouse drag |
| `index` | `number` | Index of the slide |
| `prevIndex` | `number` | Index of the previous slide |
### `onBeforeNextSlide`

Fired immediately before each "next" slide transition

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `fromTouch` | `boolean` | true if slide function called via touch event or mouse drag |
| `index` | `number` | Index of the slide |
### `onBeforePrevSlide`

Fired immediately before each "prev" slide transition

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `fromTouch` | `boolean` | true if slide function called via touch event or mouse drag |
| `index` | `number` | Index of the slide |
### `onPosterClick`

Fired when the video poster is clicked.
### `onDragStart`

Fired when the drag event to move to different slide starts.
### `onDragMove`

Fired periodically during the drag operation.
### `onDragEnd`

Fired when the user has finished the drag operation
### `onContainerResize`

Fired when the lightGallery container has been resized.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `onBeforeClose`

Fired immediately before the start of the close process.
### `onAfterClose`

Fired immediately once lightGallery is closed.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `instance` | `LightGallery` | The gallery instance, the same object lightGallery() returns. |
### `onRotateLeft`

Fired when the image is rotated in anticlockwise direction

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `onRotateRight`

Fired when the image is rotated in clockwise direction

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `onFlipHorizontal`

Fired when the image is flipped horizontally

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `onFlipVertical`

Fired when the image is flipped vertically

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |

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
