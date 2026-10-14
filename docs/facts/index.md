# lightGallery facts and figures

> The numbers behind lightGallery: bundle sizes for the core, every plugin and the framework packages, dependencies, supported browsers and framework versions, media types, accessibility, license and prices.

One page of checkable facts: how big lightGallery is, what it depends on, what it runs in, what it plays, and what it costs. Sizes are measured from the build this site was made with.

Canonical page: https://www.lightgalleryjs.com/docs/facts/

lightGallery is an open-source JavaScript lightbox and gallery for images
and video, with native React, Vue and Angular packages built on one
shared core, no dependencies, and every feature outside the core shipped
as an opt-in plugin. This page is the reference for the numbers; the
figures that come from the build are measured when the site is built, so
they match the version in the heading below.

## What is the current version?

| | |
| --- | --- |
| Version |  |
| First 3.0 release | 9 October 2026 |
| Packages | `lightgallery`, `@lightgallery/headless`, `@lightgallery/react`, `@lightgallery/vue`, `@lightgallery/angular` |
| Versioning | The five packages always ship together under one version number |
| Started | 2014, as a jQuery plugin; dependency-free since version 2 |
| Language | TypeScript, with type declarations in every package |

## How big is lightGallery?

The core is the lightbox itself. Thumbnails, zoom, video and the rest
are plugins with their own entry points, so a gallery pays only for the
features it imports. A typical image gallery with thumbnails and zoom is
the core plus two plugins, about 30 KB of JavaScript gzipped.

## What does it depend on?

| Package | Runtime dependencies |
| --- | --- |
| `lightgallery` | None |
| `@lightgallery/headless` | None |
| `@lightgallery/react` | `@lightgallery/headless` |
| `@lightgallery/vue` | `@lightgallery/headless` |
| `@lightgallery/angular` | `@lightgallery/headless`, `tslib`, and the Angular CDK as a peer |

jQuery is not required anywhere. The stylesheets come from the
`lightgallery` package and are shared by every binding.

## Which frameworks and versions does it support?

| Package | Framework range | Server rendering |
| --- | --- | --- |
| `lightgallery` | Plain JavaScript or TypeScript, ES module and UMD builds, CDN script tags | Markup renders on the server; the gallery initialises in the browser |
| `@lightgallery/react` | React 18 and 19 | Yes: trigger grids render on the server, the lightbox mounts after hydration, no dynamic import needed |
| `@lightgallery/vue` | Vue 3.4 and later | Yes, including Nuxt |
| `@lightgallery/angular` | Angular 21 and 22, standalone components, signal inputs, zoneless | Yes, including Angular SSR with hydration |
| `@lightgallery/headless` | Any framework: the state machine, settings, gesture, zoom and thumbnail maths with no DOM | Not applicable |

Node 18 or later is required for the build tooling; the browser bundles
have no Node requirement.

## Which browsers does it run in?

Current evergreen browsers: Chrome, Edge, Firefox and Safari on desktop,
Safari on iOS and Chrome on Android. The builds target ES2017 and run
without transpiling or polyfills. Internet Explorer is not supported.

## What media does it show?

| Type | How |
| --- | --- |
| Images | `src`, `srcset` and `sizes`, and `<picture>` sources for art direction and format negotiation |
| YouTube, Vimeo and Wistia | By URL. Provider slides load as a poster facade; the provider iframe is created only when the visitor presses play. YouTube uses the privacy-enhanced no-cookie host by default |
| HTML5 video | MP4, WebM and other formats the browser plays, with poster images |
| Iframes | Any page, map or PDF viewer |
| Inline HTML | Any markup, as a slide |
| Dynamic content | Slides built from a JavaScript array, added and removed while the gallery is open |

## How much of the API is there?

| | Count |
| --- | --- |
| Settings | 158, across the core and 15 plugins |
| Events | 22 |
| Methods | 8 |
| Plugins | 15 |
| Slide transitions | 20 and more, switched with one setting |

The [settings](/docs/settings/), [events](/docs/events/) and
[methods](/docs/methods/) references are generated from the source, and
the same data is served as JSON at `/api/settings.json`,
`/api/events.json` and `/api/methods.json`.

## Is it accessible?

The open gallery is a modal dialog with `role="dialog"` and
`aria-modal`, focus moves into it on open, Tab is trapped while it is
open and focus returns to the trigger on close. Slide changes are
announced to screen readers, the controls are labelled and translatable,
and `prefers-reduced-motion` disables the animations. All four packages
run axe checks against WCAG 2.0 and 2.1 A and AA rules in continuous
integration. The [accessibility page](/docs/accessibility/) has the full
contract.

## Is lightGallery free?

Yes. lightGallery is free and open source under the GPLv3, for personal
and commercial projects alike, as long as the project is distributed
under GPLv3-compatible terms.

## How much does the commercial license cost?

A project that keeps its source proprietary needs a commercial license.
It is a one-time payment, the code and every plugin are the same, and
there are no feature gates.

| License | Price (USD, one-time) | Covers |
| --- | --- | --- |
| Hobby | 48 | One developer, one product, not for a product that is sold |
| Team | 118 | Up to eight developers, up to five products, products for sale allowed |
| Organization | 188 | Unlimited developers and products, products for sale allowed |
| Extended | 239 | Unlimited developers, one product that itself produces copies, such as an SDK, site builder, theme or template |

Open-source projects under a GPLv3-compatible license can request a free
key. The [license page](/license/) has the purchase links and the full
terms.

## Does a version 2 license cover version 3?

No. A license covers every release within the major version it was
bought for, so a 2.x license covers all 2.x releases and version 3 needs
a new license. Licenses bought in the six months before the 3.0 release
can be exchanged by email. Version 3 keys start with `LIG`; an older key
keeps the gallery working and logs a console warning.

## How widely is it used?

| | Figure |
| --- | --- |
| npm downloads of `lightgallery` | About 90,000 a week in October 2026 |
| GitHub | About 7,000 stars |
| CDN | Served by jsDelivr, cdnjs and unpkg |

## Where do I get it?

| | |
| --- | --- |
| npm | `npm install lightgallery`, or the framework package plus `lightgallery` for the stylesheets |
| CDN | `https://cdn.jsdelivr.net/npm/lightgallery@3/lightgallery.min.js` and `/css/lightgallery.css`, the same paths on cdnjs and unpkg; `@3` follows the latest 3.x release |
| Source | [github.com/sachinchoolur/lightGallery](https://github.com/sachinchoolur/lightGallery) |
| For coding agents | [llms.txt](/llms.txt), a markdown twin of every docs page at its URL plus `index.md`, and the [agent skill](https://github.com/sachinchoolur/lightGallery/tree/main/skills/lightgallery) |

The [getting started guide](/docs/getting-started/) takes it from here.
