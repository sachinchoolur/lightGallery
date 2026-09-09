---
title: 'Creating plugins'
description: 'How lightGallery plugins work and how to write your own: the plugin contract, settings, events, styles, and how a plugin is built and shipped.'
lead:
    'Everything outside the core is a plugin: thumbnails, zoom, video, autoplay
    and the rest. The same contract is open to you.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
weight: 20
toc: true
---

This page covers plugins for the vanilla `lightgallery` package. The
native packages have their own plugin shapes that fit their frameworks:
React plugins are objects with render slots and a hook, Vue plugins are
similar, and Angular plugins are `withName()` feature functions. Their
contracts are documented in the package guides for
[React](/docs/react/), [Vue](/docs/vue/) and [Angular](/docs/angular/).
Logic that has no DOM (math, state, URL handling) belongs in
[`@lightgallery/headless`](/docs/headless/) so every package can share it.

## The contract

A plugin is a class. lightGallery constructs it with the gallery instance
and its DOM utility, then calls a few well-known methods at the right
moments:

| Method | When it runs |
| --- | --- |
| `constructor(instance, $LG)` | Once, while the gallery is being set up. Store the instance and merge your defaults with the user's settings. Do not touch the DOM yet. |
| `init()` | After the gallery structure exists and every plugin is constructed. Add your UI, subscribe to events. |
| `closeGallery()` | Optional. Each time the gallery closes. Pause timers, reset state. |
| `destroy()` | When the gallery is destroyed. Remove your UI and listeners. |

Pass the class in the `plugins` setting and lightGallery does the rest:

```js
lightGallery(document.getElementById('gallery'), {
    plugins: [lgZoom, lgThumbnail, MyPlugin],
});
```

## A complete plugin

A small but real one: a toolbar button that shows the slide position and
keeps it current as the user navigates.

```ts
// lg-counter.ts
import { lGEvents } from '../../lg-events';
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { CounterSettings, counterSettings } from './lg-counter-settings';

export default class Counter {
    core: LightGallery;
    settings: CounterSettings;
    private $LG: LgQuery;

    constructor(instance: LightGallery, $LG: LgQuery) {
        this.core = instance;
        this.$LG = $LG;
        // Plugin defaults first, then whatever the user passed.
        this.settings = { ...counterSettings, ...this.core.settings };
    }

    init(): void {
        if (!this.settings.counter) {
            return;
        }
        this.core.$toolbar.append(
            `<button type="button" class="lg-icon lg-counter-btn" aria-live="polite">${this.label()}</button>`,
        );
        // Namespace your listeners so `destroy()` can remove only yours.
        this.core.LGel.on(`${lGEvents.afterSlide}.counter`, () => {
            this.core.outer.find('.lg-counter-btn').html(this.label());
        });
    }

    label(): string {
        const template = this.settings.counterTemplate;
        return template
            .replace('{index}', String(this.core.index + 1))
            .replace('{total}', String(this.core.galleryItems.length));
    }

    closeGallery(): void {
        // Nothing to pause here; this is where a timer plugin would stop.
    }

    destroy(): void {
        this.core.LGel.off('.counter');
        this.core.outer.find('.lg-counter-btn').remove();
    }
}
```

The settings live in their own file, typed and with defaults:

```ts
// lg-counter-settings.ts
export interface CounterSettings {
    /** Enable the counter plugin. */
    counter: boolean;
    /** `{index}` and `{total}` are replaced with the slide position. */
    counterTemplate: string;
}

export const counterSettings: CounterSettings = {
    counter: true,
    counterTemplate: '{index} of {total}',
};
```

What the plugin has access to:

-   **`this.core`**, the gallery instance: `index`, `galleryItems`,
    `settings`, `outer` (the `.lg-outer` element), `$toolbar`,
    `$content`, and every public [method](/docs/methods/).
-   **`this.core.LGel`**, the element the gallery was initialized on. All
    [events](/docs/events/) fire on it; subscribe with a namespace
    (`${lGEvents.afterSlide}.counter`) so you can `off('.counter')` later.
-   **`this.$LG`**, a tiny DOM utility (`find`, `on`, `off`, `addClass`,
    `html`, `css`, …) so plugins need no dependencies.

## Settings, strings and icons

-   Merge your defaults under the user's settings as in the example;
    lightGallery does not merge plugin settings for you.
-   Labels that users may want to translate belong in `strings`. Read them
    from `this.core.settings.strings` so one localized object covers the
    core and every plugin.
-   The built-in plugins register their SVG artwork with
    `this.core.registerDefaultIcons(...)` so the [`icons`](/docs/custom-icons/)
    setting can replace it by name. A plugin outside this repository draws
    its own buttons; put the SVG in your markup and keep it
    `currentColor`-friendly so it follows the toolbar's colors.

## Styles

Plugin styles are separate files, so consumers pay only for what they
use. In this repository a plugin's stylesheet is `src/scss/lg-<name>.scss`
and ships as `lightgallery/css/lg-<name>.css`. Outside the repository,
ship a CSS file next to your plugin and document the import the same way.

## Using a plugin outside this repository

You do not need lightGallery's build system. Write the class in your own
project, type it against the package, and pass it in `plugins`:

```ts
import lightGallery from 'lightgallery';

type LightGallery = ReturnType<typeof lightGallery>;

export default class Ping {
    core: LightGallery;
    constructor(instance: LightGallery) {
        this.core = instance;
    }
    init(): void {
        console.log('gallery ready', this.core.galleryItems.length);
    }
    destroy(): void {}
}
```

## Adding a plugin to this repository

If you are contributing a plugin to lightGallery itself, the build picks
it up from one registry:

1.  Create `src/plugins/<name>/lg-<name>.ts` and
    `src/plugins/<name>/lg-<name>-settings.ts` (and `src/scss/lg-<name>.scss`
    if it needs styles).
2.  Register the entry in `plugins-config-rollup.json`:

```json
{
    "name": "counter",
    "folder": "plugins/counter/",
    "fileName": "lg-counter"
}
```

3.  Add the settings type to `LightGalleryAllSettings` and `MobileSettings`
    in `src/lg-settings.ts`, so `plugins: [...]` users get typed settings.
4.  Add the package stub `packages/plugins/<name>/package.json` (copy an
    existing one) and the `./plugins/<name>` entry in the root
    `package.json` `exports` map. Both point at the files the build emits.
5.  Try it in the vanilla dev rig: import it in `dev-vanilla/main.ts` and run
    `npx vite --config dev-vanilla/vite.config.ts`.
6.  `npm run build` produces `dist/plugins/<name>/` with ES, UMD and
    minified bundles plus types; `npm test` runs the suites in `test/`.

Then mirror it: a plugin in the vanilla package should exist in the React,
Vue and Angular packages too, with the same settings and behavior.
