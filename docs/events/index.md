# Events

> Every lightGallery event, from open to close, with the detail object each one carries, and how the same events surface as callbacks in React, Vue and Angular.

lightGallery emits several custom events throughout the gallery lifecycle. This can be used to customize the gallery or to add your own features. [Demo](https://www.lightgalleryjs.com/demos/events/)

Canonical page: https://www.lightgalleryjs.com/docs/events/

## Usage example

lightGallery custom events can be attached to the HTML element that you are
using to initialize the gallery. Every custom event holds useful plugin data
that can be used to control or customize lightGallery. Make sure that you attach
event listeners before initializing lightGallery.

```javascript
const lg = document.getElementById('custom-events-demo');

// Perform any action just before opening the gallery
lg.addEventListener('lgBeforeOpen', () => {
    alert('onBeforeOpen');
});

// custom event with useful plugin data
lg.addEventListener('lgBeforeSlide', (event) => {
    const { index, prevIndex } = event.detail;
    console.log(index, prevIndex);
});

lightGallery(lg);
```

The framework packages expose the same events, with the same detail
object as the callback argument, under their own naming rule. In
[React](/docs/react/) each event is a callback prop with an `on` prefix,
`onBeforeSlide={(detail) => …}`. In [Vue](/docs/vue/) it is a kebab-case
emit without the prefix, `@before-slide="onSlide"`. In
[Angular](/docs/angular/) it is an output without the prefix,
`(beforeSlide)="onSlide($event)"`.

## Available custom events

Here you can find the list of available custom events. Most of the events
provide useful lightGallery data via the event detail object. The table in each
event section represents the event detail object.

### `lgInit`

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
### `lgBeforeOpen`

Fired immediately before opening the gallery
### `lgAfterOpen`

Fired immediately after opening the gallery
### `lgAfterAppendSlide`

Fired when the slide content has been inserted into its slide container.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `lgAfterAppendSubHtml`

Fired when the sub-html content (ex : title/ description) has been appended into the slide.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `lgSlideItemLoad`

Fired once the media inside the slide has been completely loaded, or has failed to load and the slide shows its error message instead.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `delay` | `number` | For the first slide, lightGallery adds some delay for displaying the loaded slide item. This delay is required for the transition effect when the slide item is displayed Respect the delay when you use this event |
| `index` | `number` | Index of the slide |
| `isFirstSlide` | `boolean` | True when the loaded slide is the first one shown after the gallery opened. |
### `lgHasVideo`

Fired when lightGallery detects video slide

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `hasPoster` | `boolean` | True if video has poster |
| `html5Video` | `VideoSource` | HTML5 video source if available HTML5 video source = source: { src: string; type: string; }[]; attributes: HTMLVideoElement; |
| `index` | `number` | Index of the slide |
| `src` | `string` | Video source |
### `lgBeforeSlide`

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
### `lgAfterSlide`

Fired immediately after each slide transition.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `fromThumb` | `boolean` | true if slide function called via thumbnail click |
| `fromTouch` | `boolean` | true if slide function called via touch event or mouse drag |
| `index` | `number` | Index of the slide |
| `prevIndex` | `number` | Index of the previous slide |
### `lgBeforeNextSlide`

Fired immediately before each "next" slide transition

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `fromTouch` | `boolean` | true if slide function called via touch event or mouse drag |
| `index` | `number` | Index of the slide |
### `lgBeforePrevSlide`

Fired immediately before each "prev" slide transition

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `fromTouch` | `boolean` | true if slide function called via touch event or mouse drag |
| `index` | `number` | Index of the slide |
### `lgPosterClick`

Fired when the video poster is clicked.
### `lgDragStart`

Fired when the drag event to move to different slide starts.
### `lgDragMove`

Fired periodically during the drag operation.
### `lgDragEnd`

Fired when the user has finished the drag operation
### `lgContainerResize`

Fired when the lightGallery container has been resized.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `lgBeforeClose`

Fired immediately before the start of the close process.
### `lgAfterClose`

Fired immediately once lightGallery is closed.

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `instance` | `LightGallery` | The gallery instance, the same object lightGallery() returns. |
### `lgRotateLeft`

Fired when the image is rotated in anticlockwise direction

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `lgRotateRight`

Fired when the image is rotated in clockwise direction

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `lgFlipHorizontal`

Fired when the image is flipped horizontally

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |
### `lgFlipVertical`

Fired when the image is flipped vertically

**Detail**

| Name | Type | Description |
| --- | --- | --- |
| `index` | `number` | Index of the slide |

## More events

These events have no detail interface of their own:

| Event | Fires | Detail |
| --- | --- | --- |
| `lgUpdateSlides` | After the slides change, through `updateSlides()` or `refresh()` | none |
| `lgAutoplayStart` | When the autoplay slideshow starts (autoplay plugin) | `{ index }` |
| `lgAutoplay` | Before autoplay moves to the next slide (autoplay plugin) | `{ index }`, the slide it moves to |
| `lgAutoplayStop` | When the autoplay slideshow stops (autoplay plugin) | `{ index }` |
