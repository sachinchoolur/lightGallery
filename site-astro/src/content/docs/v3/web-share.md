---
title: 'Web Share'
description: 'The share plugin opens the native OS share sheet on touch devices and falls back to the classic dropdown — plus the X share target.'
lead: 'Native OS share sheet first, classic dropdown as the fallback — and sharing targets brought up to date.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'V3 (alpha)', name: 'Web Share' } }
weight: 70
toc: true
---

> **Alpha release** — the v3 packages are published under the `alpha`
> dist-tag. APIs may change between alpha releases; feedback is very
> welcome on
> [GitHub](https://github.com/sachinchoolur/lightGallery/issues).

The share plugin in v3 is a **hybrid**: where the
[Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
is available, the share button opens the native OS share sheet — the
user shares to any app on their device, not just the networks in a
dropdown. Everywhere else (and whenever the browser vetoes the
payload) the classic dropdown appears, exactly as before.

```js
lightGallery(el, {
    plugins: [lgShare],
    // Optional. Defaults to native-first on touch devices,
    // dropdown-first elsewhere.
    preferNativeShare: true,
});
```

-   **Default behavior**: touch devices go native-first; desktop
    keeps the dropdown. Set `preferNativeShare` explicitly to
    override in either direction.
-   If the browser rejects the payload (`navigator.canShare`), the
    click falls back to the dropdown — which stays rendered
    underneath, so there is always a working share path.
-   A user dismissing the OS sheet is not an error; nothing else
    happens.

The behavior is identical in all four packages; the frameworks take
the setting in the Share plugin's options object:

```tsx
<LightGallery slides={slides} plugins={[Share]} share={{ preferNativeShare: true }} />
```

```vue
<LightGallery :slides="slides" :plugins="[Share]" :share="{ preferNativeShare: true }" />
```

```html
<lg-gallery [slides]="slides" [features]="[withShare({ preferNativeShare: true })]" />
```

## What gets shared

The native payload is assembled per slide:

| Field | Source, in order |
| --- | --- |
| `url` | `shareUrl` → `twitterShareUrl` → `facebookShareUrl` → the page URL |
| `title` | item `title` → `alt` |
| `text` | `tweetText` → `pinterestText` |

`shareUrl` is a new item field (`data-share-url` in vanilla markup) —
one canonical share link per slide, used by the native sheet and
available to custom targets.

```html
<a
    data-src="img/photo.jpg"
    data-share-url="https://example.com/photos/42"
    data-tweet-text="Sunset over the ridge"
>
    <img src="img/thumb.jpg" alt="Sunset" />
</a>
```

## Updated share targets

-   The Twitter target is now **X**: links use the
    `x.com/intent/post` endpoint and the dropdown label defaults to
    `'X'`. Setting names, CSS classes and icons are unchanged
    (`lg-share-twitter`), so existing customizations keep working.
-   The share text is URL-encoded properly in the intent link.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `preferNativeShare` | touch devices | Try the OS share sheet first; dropdown as fallback |
| `share` | `true` | Enable the share button |
| `additionalShareOptions` | `[]` | Custom dropdown entries (unchanged from 2.x) |
