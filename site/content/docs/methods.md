---
title: 'Methods'
description: 'lightGallery instance methods documentation.'
lead:
    'You can use lightGallery plugin instance public methods to trigger specific
    lightGallery actions. lightGallery provides several useful methods which can
    be used to customize the gallery or to build your own features. <a
    href="/docs/methods/">Demo</a>'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
weight: 4
toc: true
---

## Access plugin instance

```javascript
const lg = document.getElementById('lg-method-demo');

const plugin = lightGallery(lg);

// Go to third slide
// Index starts from 0
plugin.slide(2);
```

{{< methods interface="BeforeOpenDetail" >}}
