# @lightgallery/angular

Native Angular lightGallery over `@lightgallery/headless` — every DOM node
rendered by Angular (standalone components, signals, zoneless-ready), with
the shared framework-free state machine, gesture math and plugin logic from
the headless package. Full packaging/docs land with plan 008; this README
carries the plan-007 consumer notes.

## Quick start

```ts
import { LgGalleryComponent, LgGalleryItemDirective } from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

// CSS is a consumer import from the vanilla package:
import 'lightgallery/css/lightgallery.css';
```

```html
<lg-gallery [features]="[withThumbnail(), withZoom()]">
    <a *ngFor="..." [href]="item.src" [lgGalleryItem]="item">
        <img [src]="item.thumb" [alt]="item.alt" />
    </a>
</lg-gallery>
```

Controlled mode: `[open]` + `(closed)`, two-way index via `[(index)]`.
Imperative: `#lg="lgGallery"` → `lg.openGallery(2)`. Inline gallery:
`[container]="element"`.

## SSR / hydration notes (plan 007)

- **Zoneless and server-safe.** The package touches no browser global at
  construction time. With `@angular/ssr` (or `renderApplication`), a page
  containing `<lg-gallery>` server-renders its projected triggers as static
  markup; the lightbox overlay itself **never server-renders** — even when
  `[open]` is true at bootstrap — so there is nothing to hydrate-mismatch.
  The overlay is created in response to `open` in the browser only.
- **Hydration:** because the closed gallery renders only your trigger
  markup (plain anchors/images you author), standard non-destructive
  hydration applies to it; the gallery adds no DOM of its own until opened.
  Open-on-load flows (e.g. the hash feature's deep links) run after
  hydration via a browser-only timer.
- **Feature services** registered under `LG_FEATURE_INIT` are instantiated
  on the server too — guard any window/document access (the built-in
  features already do; the hash feature is a no-op on the server).
- Verified by `src/ssr.spec.ts` against `@angular/platform-server`
  `renderApplication` with zoneless change detection.

## Accessibility (plan 007)

`role="dialog"` + `aria-modal` with an accessible-name fallback, CDK
`FocusTrap` while open (focus in on open, Tab/Shift+Tab trapped, returned
to the trigger on close), every control a labelled `<button>`,
keyboard-operable thumbnails/pager dots, and `prefers-reduced-motion`
collapsing all animation. Automated axe run (WCAG A/AA): zero violations
(`src/a11y.spec.ts`).
