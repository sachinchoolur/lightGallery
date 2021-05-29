---
title: 'Methods'
description: 'lightGallery instance methods documentation.'
lead:
    'You can use lightGallery plugin instance public methods to trigger specific
    lightGallery actions. lightGallery provides several useful methods which can
    be used to customize the gallery or to build your own features. <a
    href="../../demos/methods/">Demo</a>'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
weight: 4
toc: true
---

## Access plugin instance

lightGallery plugin instance can be accessed in two ways, through the
lightGallery function and through the lightGallery custom `init` event.

```javascript
const lg = document.getElementById('lg-method-demo');

// Get the plugin instance through the lightGallery main function
const plugin = lightGallery(lg);

// or get thought init event
// let plugin = null;
// lg.addEventListener('lgInit', (event) => {
//   plugin = event.detail.instance;
// });

// Go to third slide
// Index starts from 0
plugin.slide(2);
```

## Available public methods

Here you can find the list of available public methods. Not all methods are
exposed, please open an issue if you think you need access to more public
methods.

<div class="docs-methods-list">
    {{< methods >}}
</div>
