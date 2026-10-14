# Methods

> Every public method on a lightGallery instance, with parameters and examples, and the matching handle methods in React, Vue and Angular.

Call methods on the gallery instance to open, close, move between slides or update the gallery from your own code. [Demo](https://www.lightgalleryjs.com/demos/methods/)

Canonical page: https://www.lightgalleryjs.com/docs/methods/

## Access the gallery instance

`lightGallery()` returns the gallery instance. Keep the reference and call
its methods when you need them:

```javascript
const gallery = lightGallery(document.getElementById('lg-method-demo'));

// Go to the third slide. Indexes start from 0.
gallery.slide(2);
```

The `lgInit` event carries the same instance in its detail, which is useful
when another part of your code initializes the gallery:

```javascript
const el = document.getElementById('lg-method-demo');

el.addEventListener('lgInit', (event) => {
    const gallery = event.detail.instance;
    gallery.openGallery(0);
});

lightGallery(el);
```

## In React, Vue and Angular

The framework packages expose the same actions through a handle: a `ref` in
[React](/docs/react/), a template ref in [Vue](/docs/vue/) and a
`#lg="lgGallery"` template reference in [Angular](/docs/angular/).

| Vanilla method | Handle method |
| --- | --- |
| `openGallery(index?)` | `openGallery(index?)` |
| `closeGallery()` | `closeGallery()` |
| `slide(index)` | `goToSlide(index)` |
| `goToNextSlide()` | `nextSlide()` |
| `goToPrevSlide()` | `prevSlide()` |
| `refresh()` | `refresh()` |

`updateSlides()` and `destroy()` have no handle equivalent: rendering a
different `slides` array is the update, and unmounting the component is the
destroy.

## Available public methods

Here you can find the list of available public methods. Not all methods are
exposed, please open an issue if you think you need access to more public
methods.

### `closeGallery()`

Close lightGallery if it is opened.

If closable is false in the settings, you need to pass true via closeGallery method to force close gallery

```js
const plugin = lightGallery();
 plugin.closeGallery();
```

### `destroy()`

Destroy lightGallery. Destroy lightGallery and its plugin instances completely

This method also calls closeGallery function internally. Returns the time it takes to completely close and destroy the instance. In case if you want to re-initialize lightGallery right after destroying it, initialize it only once the destroy process is completed. You can use refresh method most of the time.

```js
const plugin = lightGallery();
 plugin.destroy();
```

### `goToNextSlide()`

Go to next slide

```js
const plugin = lightGallery();
 plugin.goToNextSlide();
```

### `goToPrevSlide()`

Go to previous slide

```js
const plugin = lightGallery({});
 plugin.goToPrevSlide();
```

### `openGallery()`

Open lightGallery. Open gallery with specific slide by passing index of the slide as parameter.

```js
const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
const dynamicGallery = lightGallery($dynamicGallery, {
    dynamic: true,
    dynamicEl: [
        {
             src: 'img/1.jpg',
             thumb: 'img/thumb-1.jpg',
             subHtml: '<h4>Image 1 title</h4><p>Image 1 descriptions.</p>',
        },
        ...
    ],
});
$dynamicGallery.addEventListener('click', function () {
    // Starts with third item.(Optional).
    // This is useful if you want use dynamic mode with
    // custom thumbnails (thumbnails outside gallery),
    dynamicGallery.openGallery(2);
});
```

### `refresh()`

Refresh lightGallery with new set of children.

This is useful to update the gallery when the child elements are changed without calling destroy method. If you are using dynamic mode, you can pass the modified array of dynamicEl as the first parameter to refresh the dynamic gallery

```js
const plugin = lightGallery();
 // Delete or add children, then call
 plugin.refresh();
```

### `slide()`

Goto a specific slide.

```js
const plugin = lightGallery();
 // to go to 3rd slide
 plugin.slide(2);
```

### `updateSlides()`

Update slides dynamically. Add, edit or delete slides dynamically when lightGallery is opened. Modify the current gallery items and pass it via updateSlides method

```js
const plugin = lightGallery();

// Adding slides dynamically
let galleryItems = [
// Access existing lightGallery items
// galleryItems are automatically generated internally from the gallery HTML markup
// or directly from galleryItems when dynamic gallery is used
  ...plugin.galleryItems,
    ...[
      {
        src: 'img/img-1.png',
          thumb: 'img/thumb1.png',
        },
    ],
  ];
  plugin.updateSlides(
    galleryItems,
    plugin.index,
  );

// Remove slides dynamically
galleryItems = JSON.parse(
  JSON.stringify(plugin.galleryItems),
);
galleryItems.shift();
plugin.updateSlides(galleryItems, 1);
```
