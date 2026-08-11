---
title: 'Video facades'
description: 'Provider video slides load as lightweight poster facades — the YouTube, Vimeo or Wistia iframe is created only when the user presses play.'
lead: 'Poster-first video slides: the provider iframe loads only when the user presses play.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Features', name: 'Video facades' } }
weight: 68
toc: true
---

A provider video embed (YouTube, Vimeo, Wistia) drags a lot of
JavaScript into the page the moment its iframe mounts. In v3 the
video plugin renders provider slides as **lite facades** by default: a
poster image with a play button, visually identical to the loaded
player. The real iframe is created only when the user presses play —
sliding past a video costs nothing.

```js
lightGallery(el, {
    plugins: [lgVideo],
    // Facades are the default — set false for the classic
    // eager-iframe behavior on all provider slides.
    videoFacade: true,
});
```

The setting ships in the video plugin and works identically in all
four packages (`videoFacade` prop/setting alongside the Video
plugin).

## The poster chain

The facade needs an image. It resolves, in order:

1.  The item's `poster`.
2.  For YouTube slides, the thumbnail endpoint
    (`img.youtube.com`) — controlled by the existing
    `loadYouTubePoster` setting (default `true`).
3.  The item's `thumb`.

A slide with **no resolvable poster** keeps the previous
eager-iframe behavior — a facade never renders as an empty box.
Vimeo and Wistia posters are not synthesized from provider endpoints
(those need authenticated APIs); give those slides a `poster` or rely
on the `thumb` chain — with the vimeoThumbnail plugin active, the
fetched Vimeo thumb feeds the chain automatically.

Two settings intentionally bypass the facade: `autoplayFirstVideo`
(default `true`) and `autoplayVideoOnSlide` materialize the iframe
immediately — an autoplaying facade would defeat both.

HTML5 `<video>` slides are unaffected: they already load metadata
lazily and keep their native poster handling.

## Privacy-enhanced YouTube embeds

YouTube embeds now default to the **youtube-nocookie.com** host:

```js
lightGallery(el, {
    plugins: [lgVideo],
    youTubeNoCookie: true, // the default
});
```

-   Set `youTubeNoCookie: false` to embed through `youtube.com`
    instead.
-   Slide URLs that already point at `youtube-nocookie.com` always
    keep it, regardless of the setting.

## Framework packages

Both settings live in the Video plugin's options object:

```tsx
<LightGallery
    slides={slides}
    plugins={[Video]}
    video={{ videoFacade: true, youTubeNoCookie: true }}
/>
```

```vue
<LightGallery
    :slides="slides"
    :plugins="[Video]"
    :video="{ videoFacade: true, youTubeNoCookie: true }"
/>
```

```html
<lg-gallery
    [slides]="slides"
    [features]="[withVideo({ videoFacade: true, youTubeNoCookie: true })]"
/>
```

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `videoFacade` | `true` | Render provider slides as poster facades; the iframe mounts on play |
| `youTubeNoCookie` | `true` | Embed YouTube through the privacy-enhanced `youtube-nocookie.com` host |
| `loadYouTubePoster` | `true` | Load YouTube thumbnails as posters (feeds the facade poster chain) |
