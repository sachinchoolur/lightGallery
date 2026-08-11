---
title: 'Accessibility'
description: 'The lightGallery v3 accessibility contract: dialog semantics, focus management, screen-reader announcements and reduced-motion support in all four packages.'
lead: 'Dialog semantics, focus management, live announcements and reduced motion — the same contract in every package.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Features', name: 'Accessibility' } }
weight: 69
toc: true
---

lightGallery v3 ships one accessibility contract across the vanilla
library and the React, Vue and Angular packages — the suites for all
four run [axe](https://github.com/dequelabs/axe-core) checks against
WCAG 2.0/2.1 A and AA rules.

## Dialog semantics

The open gallery is a modal dialog:

-   `role="dialog"` with `aria-modal="true"`.
-   Accessible name: point `ariaLabelledby` at your own caption
    element, or let the built-in label apply —
    `strings.galleryLabel` (default `'Gallery'`,
    [localizable](/docs/localization-rtl/)).
-   `ariaDescribedby` is available for a longer description.
-   Every control is a real `<button>` with a localizable
    `aria-label` from the same
    [`strings` object](/docs/localization-rtl/).

## Focus management

With `trapFocus` (default `true`):

-   Focus moves into the gallery when it opens and cycles inside it —
    `Tab` never escapes to the page behind the backdrop.
-   When the gallery closes, focus **returns to the trigger** that
    opened it.

## Screen-reader announcements

With `ariaAnnouncements` (default `true`), the gallery maintains a
dedicated polite live region (`.lg-announcer`) and announces every
slide change:

-   The template is `strings.slideAnnouncement` — default
    `'Image {index} of {total}'`, with `{index}` and `{total}`
    replaced by the 1-based position and slide count.
-   The slide's caption, when present, is appended to the
    announcement.
-   While announcements are active, the visual counter is
    `aria-hidden` and the caption bar is not a live region — each
    slide change is announced exactly once.
-   Set `ariaAnnouncements: false` to restore the previous behavior
    (live-region counter and caption bar, no announcer).

```js
lightGallery(el, {
    ariaAnnouncements: true,
    strings: {
        galleryLabel: 'Product photos',
        slideAnnouncement: 'Photo {index} of {total}',
    },
});
```

## Keyboard

-   `Escape` closes the gallery (`escKey`, default `true`).
-   `ArrowLeft` / `ArrowRight` navigate — and follow the reading
    direction under [RTL](/docs/localization-rtl/).
-   Controls are focusable buttons and activate with
    `Enter`/`Space`.

## Reduced motion

When the OS reports `prefers-reduced-motion: reduce`, every package
automatically collapses the gallery's motion: slide and open/close
animation durations drop to `0`, the backdrop appears instantly, and
the zoom-from-origin and slide-end animations are disabled. No
configuration needed — the preference wins over configured
animation settings.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `trapFocus` | `true` | Trap focus inside the open gallery; restore it to the trigger on close |
| `ariaAnnouncements` | `true` | Announce slide changes through a dedicated polite live region |
| `ariaLabelledby` | `''` | ID of the element that labels the gallery dialog |
| `ariaDescribedby` | `''` | ID of the element that describes the gallery dialog |
| `escKey` | `true` | Close the gallery with `Escape` |
| `strings.galleryLabel` | `'Gallery'` | Dialog label when `ariaLabelledby` is not set |
| `strings.slideAnnouncement` | `'Image {index} of {total}'` | Announcement template for slide changes |
