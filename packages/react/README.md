# @lightgallery/react

> **Alpha, pre-publish.** A ground-up, native React implementation of
> lightGallery — React owns every DOM node; no runtime dependency on the
> vanilla `lightgallery` JS. Styling reuses the published
> `lightgallery/css/*` files unchanged.

## Install & styles

```bash
npm install @lightgallery/react lightgallery
```

```tsx
// CSS is a consumer import — the React package ships no CSS.
import 'lightgallery/css/lightgallery.css';
// Per-plugin styles as needed:
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
```

## Uncontrolled (thumbnail grid)

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

const items = [
    {
        src: 'img/1-1600.jpg',
        thumb: 'img/1-240.jpg',
        alt: 'Mountains',
        lgSize: '1600-1067', // enables the zoom-from-origin open animation
        caption: <h4>Mountains</h4>,
    },
];

export function Gallery() {
    return (
        <LightGallery plugins={[Thumbnail, Zoom]} zoom={{ scale: 1.5 }}>
            {items.map((item) => (
                <LightGalleryItem key={item.src} item={item} href={item.src}>
                    <img src={item.thumb} alt={item.alt} />
                </LightGalleryItem>
            ))}
        </LightGallery>
    );
}
```

## Controlled

```tsx
const [open, setOpen] = useState(false);
const [index, setIndex] = useState(0);

<LightGallery
    slides={items}
    open={open}
    onClose={() => setOpen(false)}
    index={index}
    onIndexChange={setIndex}
/>;
```

Settings are flat props with the vanilla 2.x names (`mode`, `speed`, `loop`,
`preload`, …). Per-plugin settings are props named by plugin
(`zoom={{ scale: 1.5 }}`), typed via module augmentation from each plugin
entry. Lifecycle callbacks use the documented 2.x event names
(`onBeforeSlide`, `onAfterSlide`, `onSlideItemLoad`, …).

An imperative handle is available via `ref`:
`{ openGallery(index?), closeGallery(), goToSlide(i), nextSlide(),
prevSlide(), refresh() }`.

## SSR / Next.js

The gallery is SSR-safe by construction: every entry point imports cleanly
in bare Node (ESM and CJS), and `renderToString` emits nothing for the
gallery itself — the portal mounts client-side after hydration. Trigger
children (`<LightGalleryItem>`) server-render as static markup, so grids
are crawlable.

With the Next.js App Router the component must live in a client component:

```tsx
'use client';

import { LightGallery, LightGalleryItem } from '@lightgallery/react';
// ... as above
```

Import the CSS in your root layout (or any server component):

```tsx
// app/layout.tsx
import 'lightgallery/css/lightgallery.css';
```

No `dynamic(() => …, { ssr: false })` wrapper is needed.

## Accessibility

Beyond 2.x: dialog semantics (`role="dialog"`, `aria-modal`, accessible
name), focus moves into the gallery on open, Tab is trapped while open and
focus returns to the trigger on close, thumbnails and pager dots are
keyboard-operable, and `prefers-reduced-motion` disables all animations.
The open gallery passes axe WCAG A/AA checks (automated in CI).

## Keyboard bindings

| Key | Action |
|---|---|
| `Esc` | close (`escKey`) |
| `←` / `→` | previous / next slide (`keyPress`) |
| `Tab` / `Shift+Tab` | cycle focus within the gallery (`trapFocus`) |
| `Enter` / `Space` | activate focused thumbnail / pager dot |
