---
title: 'Hash drivers'
description: 'The hash plugin syncs deep links through the modern Navigation API where available, with an automatic History API fallback — same URLs everywhere.'
lead: 'Deep-link syncing rides the Navigation API where the browser has it — same URLs, cleaner history.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Features', name: 'Hash drivers' } }
weight: 71
toc: true
---

The hash plugin keeps the URL in sync with the open gallery
(`#lg=galleryId&slide=n`), so slides can be deep-linked and the back
button closes the gallery. In v3, the **URL engine** behind that
syncing is pluggable:

```js
lightGallery(el, {
    plugins: [lgHash],
    galleryId: 'nature',
    hashDriver: 'auto', // the default
});
```

| Value | Engine |
| --- | --- |
| `'auto'` (default) | The [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) where the browser supports it, the History API everywhere else |
| `'history'` | Force the classic engine: `history.replaceState` + `hashchange` |
| `'navigation'` | Force the Navigation API; quietly falls back to `'history'` where unsupported |

Guarantees, whichever engine runs:

-   **The URL format is identical** — deep links produced by one
    engine open correctly under the other. Nothing about your links
    changes.
-   All updates use **replace semantics**, so stepping through slides
    never floods the browser history; back closes the gallery.
-   Traversing history entries (back/forward) moves the gallery to
    the matching slide, and removing the `lg=` marker closes it.
-   The enhancement is never load-bearing: an explicit
    `'navigation'` preference on a browser without the API simply
    runs the history engine.

The behavior is identical in all four packages; the frameworks take
the settings in the Hash plugin's options object:

```tsx
<LightGallery slides={slides} plugins={[Hash]} hash={{ galleryId: 'nature' }} />
```

```vue
<LightGallery :slides="slides" :plugins="[Hash]" :hash="{ galleryId: 'nature' }" />
```

```html
<lg-gallery [slides]="slides" [features]="[withHash({ galleryId: 'nature' })]" />
```

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `hash` | `true` | Enable URL syncing |
| `hashDriver` | `'auto'` | URL engine: `'auto'`, `'history'` or `'navigation'` |
| `galleryId` | `'1'` | Unique id per gallery — mandatory with multiple galleries on one page |
| `customSlideName` | `false` | Use the item's `slideName` in the URL instead of the index |
