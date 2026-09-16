# Changelog

All notable changes to lightGallery. The format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[Semantic Versioning](https://semver.org/).

## 3.0.0 (unreleased)

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
- **Toolbar overflow**: the toolbar stays on one row. When its buttons do
  not fit beside the counter, the lowest-priority ones move into a "More
  options" menu (`toolbarOverflow`, on by default), labelled by
  `strings.moreOptions` and drawn with the replaceable `more` icon. Touch
  devices also leave out the zoom in, zoom out and actual size buttons,
  which repeat pinch and double-tap (`showGestureButtons`, turned off
  through `mobileSettings`).
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

### Changed

- Icons are inline SVG; the `lg` icon font and its files are removed.
- Plugin labels (aria-labels and titles) come from the core `strings`
  setting; the per-plugin `*PluginStrings` settings are deprecated aliases.
- The share plugin's Twitter target is now X (`shareX` icon name).

### Fixed

Long-standing bugs, all of them present in 2.x:

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

### Removed

- The `lightgallery/react`, `lightgallery/vue` and `lightgallery/angular`
  wrappers, replaced by the native packages above.

See the [migration guide](https://www.lightgalleryjs.com/docs/migration/)
for the upgrade steps.

## 2.9.0 and earlier

Release notes for the 2.x line are on
[GitHub releases](https://github.com/sachinchoolur/lightGallery/releases).
