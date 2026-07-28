---
title: 'Creating Plugins'
description: 'Guide to create plugins for lightGallery.'
lead:
    'One of the core features of lightGallery is the ability extend or modify
    functionalities using plugins. In this article, we will see how we can
    create plugins for lightGallery'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
weight: 20
toc: true
---

## Build process

You can skip this step is you are not using lightGallery build system to create
lightGallery plugins

-   Add the new plugin configuration to the `plugins-config-rollup.json` file in
    the following format

```js
{
    "name": "autoplay",
    "folder": "plugins/autoplay/",
    "fileName": "lg-autoplay"
},
```

This helps lightGallery to generate required rollup config files for your new
plugin

-   Navigate to `src/plugins` folder
-   Create plugin ts file for the plugin `lg-autoplay.ts`
-   Run `LG_PLUGINS=['autoplay'] npm start` to start the build process in watch
    mode
-   Navigate to `site/` folder and run npm run start to see the preview
    `cd site && npm run start`
-   You might need to include the compiled JavaScript and CSS files in
    the`site/layouts/partials/footer/script-footer.html` and
    `site/layouts/partials/head/stylesheet.html` respectively

## Plugin structure

Plugins have access to the current lightGallery instance. Also, it provide a
utility for DOM manipulation. For examples, you can take a look at the existing
plugin's
[source code](https://github.com/sachinchoolur/lightGallery/tree/master/src/plugins)
You can find the basic structure of lightGallery plugins below

```ts
// Dom manipulation utility module from lightGallery
import { LgQuery } from '../../lgQuery';
// lightGallery core
import { LightGallery } from '../../lightgallery';
import { AutoplaySettings, autoplaySettings } from './lg-medium-zoom-settings';

export default class MediumZoom {
    core: LightGallery;
    settings: AutoplaySettings;
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;

        this.$LG = $LG;

        // extend module default settings with lightGallery core settings
        this.settings = { ...autoplaySettings, ...this.core.settings };

        return this;
    }

    // Do not call init function in constructor
    // lightGallery will automatically call init at the right time
    init(): void {
        if (this.settings.autoplay) {
            // Write your awesome stuff
        }
    }

    // Cleanup plugin
    destroy(): void {}
}
```
