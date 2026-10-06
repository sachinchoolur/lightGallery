# Changelog

All notable changes to lightGallery. The format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[Semantic Versioning](https://semver.org/).

## 3.0.0 (unreleased)

Prerelease: `3.0.0-beta.4` (2026-10-06), published under the `next` tag for
every package. `@lightgallery/headless@3.0.0-beta.1` was published without
its build output and is deprecated; no other package shipped that version.

Version 3 restructures lightGallery around a shared, framework-free core
and ships native packages for React, Vue and Angular. The vanilla API is
unchanged; what moved is the packaging and the framework integrations.

### Packages

- **`@lightgallery/headless`**, new. The gallery's logic without a DOM:
  state machine, settings resolution, gesture and zoom math, thumbnail
  windowing, URL drivers, video URL helpers. Every package below builds on it.
- **`@lightgallery/react`**, new native React package. Components, render
  slots, callbacks and an imperative handle; React owns every DOM node.
  Replaces the `lightgallery/react` wrapper.
- **`@lightgallery/vue`**, new native Vue 3 package. `v-model` for the open
  state, slots, `Teleport`. Replaces the `lightgallery/vue` wrapper.
- **`@lightgallery/angular`**, new native Angular package. Standalone
  components, signal inputs, zoneless change detection, CDK overlay.
  Replaces the `lightgallery/angular` wrapper.
- **`lightgallery`**, the vanilla package, modernized build with an
  `exports` map; plugins remain separate entries under `lightgallery/plugins/*`.

### Added

- **Justified layout** plugin: row-justified trigger grids from the gallery
  itself (`lightgallery/plugins/justified`, and grid components in each
  framework package). The grid is never seen unorganised: thumbnails stay
  out of flow until the layout has positioned them, each box then shows as
  a placeholder and its thumbnail fades in once loaded. `justifiedReveal`
  picks whether rows fill in top to bottom or each thumbnail appears on
  its own. Ship `class="lg-justified"` in the container markup so the
  hiding also covers the window before the script runs.
- **Origin crop** plugin (`lightgallery/plugins/originCrop`, and in each
  framework package): the zoom-from-origin flight from a cropped thumbnail.
  A tile cropped with `object-fit: cover` or `background-size: cover` shows
  a window of the photo, and the built-in flight squashes the whole photo
  into it; with the plugin that window grows from the tile at a uniform
  scale while the rest of the photo is revealed around it, and the close
  flies back the same way. It reads the thumbnail's computed fit, so no
  markup or stylesheet is needed.
- **Toolbar overflow**: the toolbar stays on one row. When its buttons do
  not fit beside the counter, the lowest-priority ones move into a "More
  options" menu (`toolbarOverflow`, on by default), labelled by
  `strings.moreOptions` and drawn with the replaceable `more` icon. Touch
  devices also leave out the zoom in, zoom out and actual size buttons,
  which repeat pinch and double-tap (`showGestureButtons`, turned off
  through `mobileSettings`).
- **Zoom from origin in dynamic mode**: a dynamic gallery now flies open
  from the element passed to `openGallery(index, element)`, and closes
  with the centre fade, like the framework packages. The media size comes
  from the new `lgSize` item field (`data-lg-size` on markup items fills
  the same field), or from a `data-lg-size` attribute on that element.
  Dynamic galleries used to force `zoomFromOrigin` off.
- **Virtualization**: `virtualization` setting keeps a window of slides and
  thumbnails mounted for very large galleries.
- **Video facades**: video slides render a poster and load the player on
  first play; `videoFacade` and `youTubeNoCookie` settings.
- **Thumbnail scrubbing**: `scrubThumbnails` turns the thumbnail strip into
  a scrubber that drives the gallery through the release glide.
- **Custom icons**: `icons` setting (React `render.icon`, Vue `:icons`,
  Angular `lgIcon` template) replaces any control icon by name. Built-in
  icons are inline SVG; the icon font is gone.
- **Localization and RTL**: every UI string is a setting (`strings`, merged
  per key over the defaults); `direction` setting with an opt-in
  `lg-rtl.css` layer that mirrors navigation, swipe and chrome.
- **Web Share**: the share button prefers the device's native share sheet
  (`preferNativeShare`) with the social links as fallback; X replaces the
  Twitter target.
- **Hash drivers**: `hashDriver` chooses between the hash, history and
  Navigation API drivers behind one interface.
- **Responsive loading**: size ladders and `srcset`/`sizes` selection for
  the lightbox image, with decode-gated slide completion.
- **Accessibility**: dialog semantics, focus trapping and restoration,
  labelled controls from `strings`, a polite live region announcing slide
  changes (`ariaAnnouncements`), reduced-motion support.
- **Gesture physics**: releases run a velocity-seeded damped spring with
  momentum projection; boundary friction instead of hard clamps;
  pinch-to-close (`pinchToClose`); a `flickVelocity` setting.
- **Instance type**: `lightgallery` exports the `LightGallery` type, for
  typing a variable or a plugin's `core` without `ReturnType`.

### Changed

- Icons are inline SVG; the `lg` icon font and its files are removed.
- Plugin labels (aria-labels and titles) come from the core `strings`
  setting; the per-plugin `*PluginStrings` settings are deprecated aliases.
- The share plugin's Twitter target is now X: the `shareX` icon name, and
  the X mark in place of the old bird.
- `lightgallery` declares Node 18 as its minimum in `engines`, matching
  the other packages.

### Fixed

Long-standing bugs, nearly all of them present in 2.x:

- The slideshow ran on a fixed interval, so on a slow connection it
  advanced past images that had not loaded yet. The countdown (and the
  progress bar) now starts once the slide on screen has loaded; a slide
  that fails to load settles the same way, so a broken image does not
  stall the show.
- In the React, Vue and Angular packages a slide that left the mounted
  pool kept its loaded flag, so returning to it in a large gallery showed
  no loader while the image downloaded again.
- The React `<LightGalleryItem>` and an Angular `[lgGalleryItem]` anchor
  rendered without an `href` unless you passed one, so keyboard users
  could not tab to the thumbnails and the server-rendered markup linked
  nowhere. An anchor trigger now links to `item.src` by default, as the
  Vue `<LgItem>` already did; an explicit `href` still wins.

- Slide transitions crossfaded for the whole slide instead of the brief
  fade the modes ask for, so the outgoing image ghosted across the
  transition. Transform and opacity now keep their own durations, and the
  modes whose effect is the fade keep the long one.
- Zoom clamped a repositioning zoom against a wider window than its own
  release settle uses. Zooming near an edge parked the image where the
  next tap immediately moved it away from.
- Rotating an image and then zooming divided by a zero previous scale,
  handing the pan origin `NaN` and voiding the transform, so panning
  silently stopped tracking.
- Medium zoom closed the gallery on every click, toolbar buttons included,
  so rotating or sharing dismissed the image. Toolbar clicks now leave it
  open; a click on the slide or backdrop still closes.
- The thumbnail strip animated its first positioning, so opening the
  gallery from a thumbnail far along the strip slid it across while the
  image was still flying in. That first positioning is now instant.
- The thumbnail strip is built when the gallery initialises, and its
  images loaded eagerly, so every page with a closed gallery downloaded
  all of its strip thumbnails at load. Strip images are now lazy; nothing
  is fetched until the gallery opens, and thumbs far along the strip load
  as they scroll into view.
- The share dropdown hung from the toolbar's corner instead of the share
  button, so on narrow screens it opened nowhere near the control (and its
  arrow pointed at the wrong one). Button and menu now share a wrapper that
  anchors the menu under the button, which also gets the list out of the
  `<button>` it was nested in. Closing the gallery with the dropdown open
  left it open on the next open; it now closes with the gallery, and the
  share button's `aria-expanded` tracks it.
- The share dropdown stayed open while the other toolbar buttons and the
  arrows were used: its dimming overlay sat below the toolbar, so only a
  click on the slide dismissed it, and Escape closed the whole gallery
  instead. The dropdown now dismisses like the More options menu: on a
  press anywhere outside it, on Escape (the gallery stays open) and when
  focus tabs out of it. A dismissing tap on the backdrop no longer also
  closes the gallery, for the More options menu as well.

### Removed

- The `lightgallery/react`, `lightgallery/vue` and `lightgallery/angular`
  wrappers, replaced by the native packages above.
- The share dropdown's `.lg-dropdown-overlay` element.
- The `supportLegacyBrowser` setting and the responsive-image polyfill
  hook behind it, along with the `CustomEvent` and `Element.matches`
  polyfills and the old-browser scroll fallbacks. Galleries with `srcset`
  or `<picture>` sources no longer log a warning asking for a polyfill.

See the [migration guide](https://www.lightgalleryjs.com/docs/migration/)
for the upgrade steps.

## 2.9.0 and earlier

Release notes for the 2.x line are on
[GitHub releases](https://github.com/sachinchoolur/lightGallery/releases).
