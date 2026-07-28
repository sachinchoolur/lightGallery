---
title: 'lightGallery v3'
description: 'lightGallery v3: one shared headless core with native React, Vue and Angular packages, plus the modernized vanilla library.'
lead: 'One gallery, native everywhere — a shared headless core with first-class React, Vue and Angular packages.'
date: 2026-07-24T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'V3 (alpha)', name: 'Overview' } }
weight: 60
toc: true
---

> **Alpha release** — the v3 packages are published under the `alpha`
> dist-tag. APIs may change between alpha releases; feedback is very
> welcome on
> [GitHub](https://github.com/sachinchoolur/lightGallery/issues).

## What v3 is

lightGallery v3 restructures the project around a **framework-free
headless core** and **native framework packages** built on top of it:

| Package | What it is |
| --- | --- |
| [`lightgallery`](/docs/getting-started/) | The vanilla library — the same battle-tested runtime, with a fully modernized build system and package exports |
| [`@lightgallery/headless`](/docs/v3/headless/) | The shared core: state machine, settings resolution, gesture math, plugin logic — no DOM framework, no rendering |
| [`@lightgallery/react`](/docs/v3/react/) | Native React component — every DOM node rendered by React |
| [`@lightgallery/vue`](/docs/v3/vue/) | Native Vue 3 component — `v-model`, scoped slots, Teleport |
| [`@lightgallery/angular`](/docs/v3/angular/) | Native Angular component — standalone, signals, zoneless |

In v2, the framework wrappers embedded the vanilla runtime and mirrored
its DOM. In v3, each framework package **renders natively** while the
headless core guarantees identical behavior everywhere: the same
settings, the same gesture thresholds, the same plugin semantics —
one product, rendered four ways.

## What stays the same

-   All 13 plugins (thumbnail, zoom, video, autoplay, fullscreen, hash,
    pager, share, rotate, comment, mediumZoom, relativeCaption,
    vimeoThumbnail) are available in every package as tree-shakable
    entries.
-   The CSS ships from the vanilla `lightgallery` package and is shared
    by all bindings.
-   The vanilla library keeps working exactly as documented — v3
    modernizes its packaging, not its behavior.

## Choosing a package

-   Building with **React, Vue or Angular**? Use the native package for
    your framework — it is not a wrapper, and supports SSR
    (Next.js/Nuxt/Angular SSR) out of the box.
-   Using **plain JavaScript** or another stack? Use `lightgallery`
    exactly as before.
-   Building your own binding or advanced integration? The
    [headless core](/docs/v3/headless/) is the shared foundation.

## Licensing

v3 keeps lightGallery's licensing model: GPL-3.0-only, with a
[commercial license](/docs/license/) available for commercial projects.
