---
title: 'Custom icons'
description: 'Replace any of the gallery controls'' inline SVG icons with your own, per icon name — in vanilla JavaScript, React, Vue, and Angular.'
lead: 'Every control icon is an inline SVG you can swap per name — bring your own icon set without touching CSS.'
date: 2026-09-03T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Features', name: 'Custom icons' } }
weight: 74
toc: true
---

lightGallery's controls render inline SVG icons — there is no icon
font to load, and every icon follows the button's `color` through
`currentColor`. The **`icons`** setting swaps any of them by name:

```js
lightGallery(el, {
    icons: {
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
        prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>',
        next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
    },
});
```

How overrides resolve:

-   **Omitted names keep the built-in icon** — override a single
    button or the whole set.
-   **State pairs apply together.** Buttons that swap icons with
    state — `maximize`/`minimize`, `autoplayPlay`/`autoplayPause`,
    `fullscreen`/`fullscreenExit` — render both icons and CSS toggles
    which one shows. Provide both names of a pair; a half-provided
    pair keeps the built-ins so no state ends up iconless.
-   **Size and color come from the button.** Icons render at the
    button's font size and inherit its color — SVGs that fill their
    viewBox and draw with `currentColor` (via `fill` or `stroke`)
    drop in with no CSS changes.
-   **Plugin icons ship with their plugin.** A name renders only when
    its feature's button is on screen, and the built-in artwork for a
    plugin's buttons is bundled with that plugin.

See it running in the <a href="/demos/custom-icons/">custom icons
demo</a>.

## React, Vue, and Angular

Each framework package takes custom icons in its own idiomatic form;
the resolution rules above are identical everywhere.

React — the `render.icon` slot returns a node per name; return
`undefined` for names that should keep the built-in icon:

```tsx
<LightGallery
    slides={slides}
    render={{
        icon: (name) => (name === 'close' ? <CloseIcon /> : undefined),
    }}
/>
```

Vue — the `:icons` prop maps names to SVG components or raw SVG
strings:

```vue
<LightGallery
    :slides="slides"
    :icons="{ close: CloseIcon, next: NextIcon }"
/>
```

Angular — an `lgIcon` template declares the names it covers and
renders an SVG per name:

```html
<lg-gallery [slides]="slides">
    <ng-template [lgIcon]="['close', 'prev', 'next']" let-name>
        @switch (name) {
            @case ('close') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" /></svg> }
            @case ('prev') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6" /></svg> }
            @case ('next') { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" /></svg> }
        }
    </ng-template>
</lg-gallery>
```

The template's `lgIcon` name list plays the role of the object keys —
a state pair must have both names listed (and rendered) for the pair
to apply.

## Icon names

| Feature | Names |
| --- | --- |
| Core | `close`, `prev`, `next`, `download`, `maximize` / `minimize` (pair) |
| Zoom plugin | `zoomIn`, `zoomOut`, `actualSize` |
| Rotate plugin | `rotateLeft`, `rotateRight`, `flipHorizontal`, `flipVertical` |
| Share plugin | `share`, `shareFacebook`, `shareX`, `sharePinterest` |
| Autoplay plugin | `autoplayPlay` / `autoplayPause` (pair) |
| Fullscreen plugin | `fullscreen` / `fullscreenExit` (pair) |
| Comment plugin | `comment`, `commentClose` |
| Thumbnail plugin | `toggleThumbnails` |

One asymmetry worth knowing: the vanilla package's actual-size button
renders the `zoomIn` / `zoomOut` pair and the active zoom state picks
one, while the React, Vue, and Angular packages render the
`actualSize` name on that button. Providing all three names covers
every stack.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `icons` | `{}` | SVG markup per icon name; omitted names keep the built-in icon |
