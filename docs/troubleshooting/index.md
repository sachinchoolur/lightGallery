# Troubleshooting

> Fixes for the lightGallery problems behind most bug reports: missing styles, plugins that do nothing, empty slides, videos that will not play, Next.js errors, license warnings and import errors after upgrading, for vanilla JavaScript, React, Vue and Angular.

Symptom by symptom, the cause and the fix, in every package. Three mistakes account for most reports: the CSS is not imported, the plugin is not registered, or the selector does not match your markup.

Canonical page: https://www.lightgalleryjs.com/docs/troubleshooting/

Each section below is one symptom. The answer comes first, then the fix
for each package. If your problem is not here, the
[Discussions board](https://github.com/sachinchoolur/lightGallery/discussions)
and the [issue tracker](https://github.com/sachinchoolur/lightGallery/issues)
are the next stop; a minimal reproduction on StackBlitz gets the fastest
answer, and every [demo page](/demos/) has an "Open in StackBlitz" button
to start from.

## The gallery opens but has no styles

The stylesheet is not loaded. lightGallery ships its CSS as separate files
and none of the packages injects styles for you, so the slides render as a
plain list of images and the page behind keeps scrolling. Import
`lightgallery/css/lightgallery.css` plus one file per plugin, or
`lightgallery/css/lightgallery-bundle.css` for everything.

```js
// Vanilla JavaScript, bundler
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
```

```html
<!-- Vanilla JavaScript, script tags -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@3/css/lightgallery-bundle.css" />
```

```tsx
// React (Next.js: app/layout.tsx or any server component)
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
```

```js
// Vue with Nuxt: nuxt.config
export default {
    css: ['lightgallery/css/lightgallery.css', 'lightgallery/css/lg-thumbnail.css'],
};
```

```json
// Angular: angular.json, under "styles"
["lightgallery/css/lightgallery.css", "lightgallery/css/lg-thumbnail.css"]
```

The framework packages depend on `lightgallery` only for these CSS files,
which is why `lightgallery` is installed next to `@lightgallery/react`,
`@lightgallery/vue` and `@lightgallery/angular`.

## Thumbnails, zoom, video or another plugin does nothing

The plugin is not registered. A feature exists only when its plugin is
passed to the gallery; its settings are ignored otherwise, silently. Pass
the plugin and import its CSS file.

```js
// Vanilla JavaScript
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

lightGallery(document.getElementById('gallery'), {
    plugins: [lgThumbnail, lgZoom],
    thumbnail: { animateThumb: true },
});
```

```tsx
// React
import { LightGallery } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

<LightGallery plugins={[Thumbnail, Zoom]} thumbnail={{ animateThumb: true }} />;
```

```vue
<!-- Vue -->
<script setup lang="ts">
import { LightGallery } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

const plugins = [Thumbnail, Zoom];
</script>

<template>
    <LightGallery :plugins="plugins" :thumbnail="{ animateThumb: true }" />
</template>
```

```ts
// Angular
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

// In the component: features = [withThumbnail({ animateThumb: true }), withZoom()];
// In the template: <lg-gallery [features]="features">
```

With script tags, load `lightgallery.umd.js` first and each plugin file
after it; the plugins register themselves as `lgThumbnail`, `lgZoom` and
so on, and you still pass them in `plugins: []`.

## "data-src is not provided on slide item" or the gallery opens empty

The selector does not match your markup. By default lightGallery treats the
direct children of the element you pass as the slides, and each slide needs
an `href` or `data-src` pointing at the full-size media. If the links sit
deeper in the markup, or the element holds other children, set
[`selector`](/docs/settings/#selector) to the links:

```js
lightGallery(document.getElementById('gallery'), {
    selector: 'a',
});
```

The [attributes reference](/docs/attributes/) lists everything lightGallery
reads from a slide. In React, Vue and Angular the slides come from the
`slides` array or from trigger elements (`<LightGalleryItem>` in React,
`<LgItem>` in Vue, `[lgGalleryItem]` in Angular), so this warning means an
item without `src`.

## The slide fades in instead of zooming from its thumbnail

The item has no size. The zoom-from-origin animation needs the natural
size of the full image as `data-lg-size="WIDTH-HEIGHT"` (or `lgSize` on a
slide object in the framework packages), for example `1600-1067`. Without
it, or with a size that does not match the image, the gallery falls back to
a fade. Your image pipeline usually knows the dimensions; emit them into the
markup, as described in [getting started](/docs/getting-started/).

## Two galleries open, or clicks are handled twice

The same element is initialised twice. Each `lightGallery()` call creates a
new instance with its own click handlers, so a second call on the same
element opens two galleries. The usual causes are a script included twice,
an initialiser that runs on every render or route change, and hot module
reload during development.

- Keep the returned instance and reuse it. Call `refresh()` when the slides
  change and `destroy()` before you really need a new instance.
- In React, Vue and Angular use the component and never call
  `lightGallery()` yourself. The component owns the instance lifecycle,
  including React Strict Mode's double-invoked effects.

## Slides added or removed after init do not show up

The gallery does not watch the DOM. After you add, remove or reorder the
slide elements, call [`refresh()`](/docs/methods/#refresh); in dynamic mode
pass the new array of items to `refresh(items)` or use
[`updateSlides(items, index)`](/docs/methods/#updateSlides) while the
gallery is open.

```js
const gallery = lightGallery(document.getElementById('gallery'));

// Later, after the markup changed:
gallery.refresh();
```

In React, Vue and Angular, rendering a different `slides` array (or
different trigger children) is the update; the handle also exposes
`refresh()`. See the [update slides demo](/demos/update-slides/).

## YouTube, Vimeo or HTML5 videos do not play

Check these in order:

1. The video plugin is registered (`lightgallery/plugins/video`, or the
   `video` subpath of your framework package) and `lg-video.css` is
   imported. Without the plugin a video URL is treated as an image and
   fails to load.
2. Provider videos use the page URL in `href` (or `src`): a YouTube,
   Vimeo or Wistia link, not an embed snippet. By default the slide shows a
   poster and loads the player when the user presses play; see
   [video facades](/docs/video-facades/) if you expect the player
   immediately.
3. HTML5 videos take a JSON object in `data-video` (or the `video` field of
   a slide object) with `source`, `attributes` and an optional `tracks`
   list, and no `src`. The [video gallery demo](/demos/video-gallery/)
   shows the exact shape for every package.
4. A console error that names videojs, player.js or Wistia means that
   player script is not on the page. The video plugin controls those
   players, it does not bundle them.

## The gallery appears behind a modal, header or cookie banner

Something on the page has a higher stacking order. The gallery overlay
(`.lg-outer`) sits at `z-index: 1050` and the backdrop just below it, which
is lower than some modal and toast libraries. Raise it in your stylesheet:

```css
.lg-backdrop,
.lg-outer {
    z-index: 2000;
}
```

If you build the styles from `scss/`, set `$zindex-outer` and
`$zindex-backdrop` instead.

## Controls or the close button are missing on phones

That is the default on small screens. [`mobileSettings`](/docs/settings/#mobileSettings)
hides the arrows, the close icon and the download button below the desktop
breakpoint so gestures have the space. Turn them back on:

```js
lightGallery(document.getElementById('gallery'), {
    mobileSettings: { controls: true, showCloseIcon: true, download: true },
});
```

## The console warns about the license key

Nothing is limited. The message tells you which case you are in:

- "please provide a valid license key": no key was set and the gallery is
  running with no key at all. Pass [`licenseKey`](/docs/settings/#licenseKey)
  or call `setLicenseKey()` once for the page.
- "license key is not valid for production use": you are using the
  temporary key `0000-0000-000-0000`. It is meant for development and
  evaluation; use your purchased key in production.
- "this license key is for v1 or v2 and is not valid for v3": lightGallery 3
  keys start with `LIG`. See the [upgrade note](/license/).

The [license page](/docs/license/) explains which license applies to your
project. Open source projects under a GPLv3-compatible license can request
a key by email.

## Next.js: "Cannot read properties of null (reading 'removeChild')", "useRef is not a function" or hydration warnings

These come from running the gallery during server rendering or from the
retired React wrapper. With `@lightgallery/react`:

- Put the gallery in a client component (`'use client'` at the top of the
  file). No `dynamic(() => …, { ssr: false })` wrapper is needed.
- Import the CSS in `app/layout.tsx` or another server component.
- Do not call the vanilla `lightGallery()` in a `useEffect` next to the
  component; one or the other, never both.

```tsx
'use client';

import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Zoom from '@lightgallery/react/plugins/zoom';

export function Gallery() {
    return (
        <LightGallery plugins={[Zoom]}>
            <LightGalleryItem src="/photos/1.jpg" lgSize="1600-1067">
                <img src="/photos/1-thumb.jpg" alt="One" />
            </LightGalleryItem>
        </LightGallery>
    );
}
```

The overlay never server-renders, in any of the packages, so Nuxt pages do
not need `<ClientOnly>` and Angular SSR has nothing to hydrate; see the
[React](/docs/react/#ssr--nextjs), [Vue](/docs/vue/#ssr--nuxt) and
[Angular](/docs/angular/#ssr--hydration) guides.

## Autoplay restarts from the first slide instead of stopping

That is the autoplay plugin's default: after the last slide it continues
from the first, whatever `loop` says. To stop at the end, watch the
[`lgAfterSlide`](/docs/events/#lgAfterSlide) event and stop the slideshow (or close the
gallery) when the last index is reached:

```js
import lightGallery from 'lightgallery';
import lgAutoplay from 'lightgallery/plugins/autoplay';

const el = document.getElementById('gallery');
const gallery = lightGallery(el, {
    plugins: [lgAutoplay],
    autoplay: { slideShowAutoplay: true, slideShowInterval: 3000 },
});

el.addEventListener('lgAfterSlide', (event) => {
    if (event.detail.index === gallery.galleryItems.length - 1) {
        // Plugin instances live on `gallery.plugins`.
        gallery.plugins.find((p) => p.stopAutoPlay)?.stopAutoPlay();
    }
});
```

The same event is `onAfterSlide` in React, `@after-slide` in Vue and
`(afterSlide)` in Angular; the slideshow also stops on the first user
interaction unless `forceSlideShowAutoplay` is set.

## I want custom HTML in a slide

Slides hold media: an image, a video or an iframe. For arbitrary content,
either render it as a page and open it as an
[iframe slide](/demos/iframe/) (`data-iframe="true"` with the URL in
`data-src`), or put the markup in the caption with `data-sub-html`, which
accepts HTML or a selector of an element on the page, as shown in the
[captions demo](/demos/captions/). The framework packages offer the
`caption` slot for the same purpose.

## Import errors after upgrading to version 3

`lightgallery/react`, `lightgallery/vue` and the Angular `LightgalleryModule`
were the version 2 wrappers and are gone. A bundler reports
`ERR_PACKAGE_PATH_NOT_EXPORTED` or "module not found" for those paths.
Install the native package for your stack and follow the
[migration guide](/docs/migration/), which maps every wrapper prop to its
version 3 equivalent:

```bash
npm install @lightgallery/react lightgallery
```

The vanilla `lightgallery` API itself did not change; only the framework
wrappers were replaced.

## TypeScript cannot find types for a plugin import

`lightgallery/plugins/zoom` and the other plugin subpaths resolve through
the package `exports` map, which TypeScript reads with
`"moduleResolution": "bundler"` (or `"node16"` / `"nodenext"`) in
`tsconfig.json`. The legacy `"node"` resolution ignores `exports` and
reports that the module has no declaration file. Switch the setting; the
code does not change.

## Still stuck?

Open a [Discussion](https://github.com/sachinchoolur/lightGallery/discussions)
with the package and version (`npm ls lightgallery @lightgallery/react`),
the console output and a StackBlitz reproduction. Bugs with a reproduction
go to the [issue tracker](https://github.com/sachinchoolur/lightGallery/issues).
If you work with a coding agent, the
[agent prompt](/docs/getting-started/#ask-your-coding-agent) points it at
the markdown version of these docs, this page included.
