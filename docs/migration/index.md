# Migrating to lightGallery 3

> Upgrade guide for lightGallery 3, changed defaults and settings for vanilla users, and wrapper-to-native tables for React, Vue and Angular.

What changes when you upgrade, framework by framework. Vanilla galleries keep working as documented; the framework wrappers are replaced by native packages.

Canonical page: https://www.lightgalleryjs.com/docs/migration/

lightGallery 3 restructures the project around a framework-free core plus
native packages for React, Vue and Angular. The vanilla library keeps its
runtime and its API; the framework wrappers, which embedded that runtime
and mirrored its DOM, are replaced by components that render natively.

| You were using | You now install |
| --- | --- |
| `lightgallery` | `lightgallery` (unchanged) |
| `lightgallery/react` | [`@lightgallery/react`](/docs/react/) |
| `lightgallery/vue` | [`@lightgallery/vue`](/docs/vue/) |
| `lightgallery/angular` | [`@lightgallery/angular`](/docs/angular/) |

## Vanilla JavaScript

Version 3 is a complete rewrite, but the API is unchanged. The upgrade is
packaging, a handful of new settings, a few changed defaults and four
removals.

-   **Imports are unchanged**, `import lightGallery from 'lightgallery'`,
    plugins from `lightgallery/plugins/<name>`, CSS from
    `lightgallery/css/<name>.css`. The package now has proper export maps,
    so bundlers and Node resolve subpaths without deep-path workarounds.
    The CDN paths are unchanged too: the package root is still the build
    folder, so `css/lightgallery.css` and `plugins/zoom/lg-zoom.umd.js` are
    where 2.x had them on jsDelivr, unpkg and cdnjs.
-   **The icon font is gone.** Controls render inline SVG icons, and the
    `fonts/lg.*` files and their `@font-face` rule no longer ship. If you
    self-hosted the font or restyled icons through font glyphs on
    `.lg-icon`, replace them with [custom icons](/docs/custom-icons/).
-   **No Internet Explorer.** The ES module and UMD builds target ES2017
    for current evergreen browsers and iOS Safari, with no ES5 build (the
    ES module keeps its historical `*.es5.js` file name). See
    [browser support](/docs/getting-started/#browser-support); v2 remains
    available for IE.
-   **`supportLegacyBrowser` is gone.** It only hooked up a polyfill
    for `srcset` and `<picture>`, which every supported browser handles
    natively. Remove the setting from your options; TypeScript
    reports it as an unknown property. The `CustomEvent` and
    `Element.matches` polyfills the library used to install on the page
    are removed with it.
-   **The share dropdown has no overlay.** It dismisses like the
    toolbar's More options menu: on a press anywhere outside it, on
    Escape and when focus tabs out of it. The `.lg-dropdown-overlay`
    element that dimmed the gallery behind it is not rendered, so drop
    any CSS that targeted it. See
    [Web Share](/docs/web-share/#dismissing-the-dropdown).
-   **New settings keep the 2.x behavior by default**, except the ones
    listed under [changed defaults](#changed-defaults) below:
    [`strings`](/docs/localization-rtl/) and
    [`direction`](/docs/localization-rtl/),
    [`virtualization`](/docs/virtualization/),
    [`hashDriver`](/docs/hash-drivers/),
    [`videoFacade`](/docs/video-facades/),
    [`preferNativeShare`](/docs/web-share/),
    the [justified layout](/docs/justified-layout/) plugin,
    `ariaAnnouncements`, `flickVelocity` and `pinchToClose`.

### Changed defaults

| Setting | 2.x | 3.0 | Effect |
| --- | --- | --- | --- |
| `videoFacade` | n/a (eager iframe) | `true` | Provider video slides render a poster with a play button; the iframe mounts on play. Set `false` for the old behavior |
| `youTubeNoCookie` | n/a (`youtube.com`) | `true` | YouTube embeds go through `youtube-nocookie.com`. URLs that already point there always keep it |
| `preferNativeShare` | n/a | touch: `true`, desktop: `false` | On touch devices the share button opens the system share sheet, with the branded dropdown as the fallback |
| `hashDriver` | n/a (History API) | `'auto'` | Deep links use the Navigation API where the browser has it, History everywhere else. Force the old engine with `'history'` |
| `toolbarOverflow` | n/a (buttons wrap) | `true` | When the toolbar buttons do not fit beside the counter, the lowest-priority ones move into a "More options" menu. Set `false` to let them wrap onto a second row as before |
| `showGestureButtons` | n/a (always shown) | desktop: `true`, touch: `false` | Touch devices leave out the zoom in, zoom out and actual-size buttons, since pinch and double-tap do the same. Set `mobileSettings: { showGestureButtons: true }` to show them |

`direction` stays `'ltr'`, so nothing mirrors until you opt in with
`'rtl'` or `'auto'`.

### Strings are unified

Every user-facing label, core controls *and* plugin buttons, now lives in
one `strings` object:

```js
lightGallery(el, {
    plugins: [lgZoom, lgThumbnail],
    strings: {
        closeGallery: 'Galerie schließen',
        nextSlide: 'Nächstes Bild',
        zoomIn: 'Vergrößern',
        toggleThumbnails: 'Miniaturen umschalten',
    },
});
```

The seven per-plugin objects still work and are **deprecated**:
`autoplayPluginStrings`, `commentPluginStrings`, `fullscreenPluginStrings`,
`rotatePluginStrings`, `sharePluginStrings`, `thumbnailPluginStrings` and
`zoomPluginStrings`. A legacy key you set explicitly still wins over the
`strings` default, so mixed configurations keep working while you move
across. The full key list is in the
[localization guide](/docs/localization-rtl/).

## License keys

lightGallery 3 keys start with `LIG`. A v1 or v2 key is not valid for
version 3: the gallery keeps working and logs a console warning asking
you to upgrade. The [upgrade note on the license page](/license/)
explains how to get a v3 key, and the [license docs](/docs/license/)
cover open-source use and the temporary key for evaluation.

## React

The 2.x component wrapped the vanilla runtime; `@lightgallery/react` renders
every node itself. The archived wrapper docs stay at
[/docs/v2/react/](/docs/v2/react/).

```bash
npm install @lightgallery/react lightgallery
```

Keep `lightgallery` installed, the CSS still ships from it, unchanged.

| 2.x wrapper | 3.0 native package |
| --- | --- |
| `import LightGallery from 'lightgallery/react'` | `import { LightGallery } from '@lightgallery/react'` |
| Anchor children scraped for `data-*` attributes | `<LightGalleryItem item={item}>` children, or a `slides` array |
| `dynamic` + `dynamicEl={items}` | `slides={items}` |
| `elementClassNames` | `className` |
| `onInit={({ instance }) => …}` then calling methods on `instance` | `ref` handle: `gallery.current.openGallery(0)` |
| Plugin settings flat on the component (`thumbWidth={130}`) | One object prop per plugin (`thumbnail={{ thumbWidth: 130 }}`) |
| `subHtml` HTML strings | `caption` React nodes (`captionHtml` for raw HTML) |
| `plugins={[lgThumbnail]}` from `lightgallery/plugins/*` | `plugins={[Thumbnail]}` from `@lightgallery/react/plugins/*` |

Lifecycle callbacks keep their documented names (`onBeforeSlide`,
`onAfterSlide`, `onSlideItemLoad`, …) and their detail payloads. Slide data
uses the same field names, with `size` renamed to `lgSize`.

Two behaviors are worth knowing about:

-   **Controlled mode is available**: `open`, `index`, `onClose` and
    `onIndexChange` let React own the state, the wrapper had no equivalent.
-   **Updating slides needs no `refresh()`**: rendering different children
    or a different `slides` array is the update. The `refresh()` method
    remains on the handle for API parity.

## Vue

The 2.x wrapper is documented at [/docs/v2/vue/](/docs/v2/vue/).
`@lightgallery/vue` needs `vue >=3.4`.

```bash
npm install @lightgallery/vue lightgallery
```

| 2.x wrapper | 3.0 native package |
| --- | --- |
| `import Lightgallery from 'lightgallery/vue'` | `import { LightGallery, LgItem } from '@lightgallery/vue'` |
| Anchor children with `data-*` attributes | `<LgItem :item="item">` children, or a `:slides` array |
| `:settings="{ speed: 500, plugins }"`, one settings object | Core settings as individual props (`:speed="500"`), `:plugins` on its own |
| `:onBeforeSlide="handler"` props | Kebab-case emits: `@before-slide`, `@after-slide`, … |
| Plugin settings inside `settings` | One object prop per plugin (`:zoom="{ scale: 1.5 }"`) |
| `subHtml` HTML strings | `caption` values, or the `#caption` scoped slot |

`v-model:open` and `v-model:index` are new, as are the `#caption`,
`#counter`, `#prev-button` and `#next-button` scoped slots and the
template-ref handle (`openGallery`, `closeGallery`, `goToSlide`,
`nextSlide`, `prevSlide`, `refresh`).

## Angular

The 2.x wrapper is documented at [/docs/v2/angular/](/docs/v2/angular/).
`@lightgallery/angular` requires `@angular/core`, `@angular/common`,
`@angular/platform-browser` and `@angular/cdk` `>=21 <23`, and runs without `zone.js`.

```bash
npm install @lightgallery/angular @angular/cdk lightgallery
```

| 2.x wrapper | 3.0 native package |
| --- | --- |
| `LightgalleryModule` from `lightgallery/angular` | Standalone `LgGalleryComponent` + `LgGalleryItemDirective` in `imports` |
| `<lightgallery [settings]="settings">` | `<lg-gallery>` with same-named signal inputs (`[speed]`, `[loop]`, …) |
| `settings.plugins: [lgZoom]` | `[features]="[withZoom()]"` from `@lightgallery/angular/plugins/zoom` |
| `settings.dynamicEl` | `[slides]`, or `[lgGalleryItem]` triggers |
| `[onBeforeSlide]="handler"` inputs | `(beforeSlide)` outputs, no `on` prefix |
| `subHtml` HTML strings | `caption` values, or the `lgCaption` `ng-template` |

Two-way `[(index)]`, `[open]`/`(closed)`, the `ng-template` slots and the
`#lg="lgGallery"` handle are new.

## Behavior parity

All four packages share the same headless core, so settings, gesture
thresholds and plugin semantics match everywhere. If a gallery behaves
differently after migrating, that is a bug worth
[reporting](https://github.com/sachinchoolur/lightGallery/issues), please
include which package and which setting.
