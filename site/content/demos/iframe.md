---
title: 'Iframe lightbox'
description: 'Open iframe in lightGallery.'
lead:
    'Create simple lightbox iframe gallery with lightGallery. If you want to display a webpage, google map, PDF file or any other iframe within the gallery, you just need to set
    data-iframe attribute true for the slide item. lightGallery will
    automatically display the source in an iframe. This can be used to view PDF
    files, google maps and more.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 8
toc: true
---

<button class="btn btn-success mrb50" data-iframe="true" id="open-website" data-iframe-title="All new time tracking. Greater insight." data-src="https://www.paritydeals.com/">Open
website</button>
<button class="btn btn-success mrb50" data-iframe="true" id="open-google-map" data-src="https://www.google.com/maps/embed">Google
map</button>
<button class="btn btn-success mrb50" data-iframe="true" id="open-pdf" data-src="/pdf/sample.pdf">Open
PDF file</button>

##### HTML Structure

```html
<button
    class="btn btn-success btn-lg mrb50"
    data-iframe="true"
    id="open-website"
    data-src="https://tack.one/"
    data-iframe-title="All new time tracking. Greater insight."
>
    Open website
</button>
<button
    class="btn btn-success btn-lg mrb50"
    data-iframe="true"
    id="open-google-map"
    data-src="https://www.google.com/maps/embed"
>
    Google map
</button>
<button
    class="btn btn-success btn-lg mrb50"
    data-iframe="true"
    id="open-pdf"
    data-src="https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf"
>
    Open PDF file
</button>
```

##### JavaScript

```js
lightGallery(document.getElementById('open-website'), {
    selector: 'this',
});
lightGallery(document.getElementById('open-google-map'), {
    selector: 'this',
});
lightGallery(document.getElementById('open-pdf'), {
    selector: 'this',
});
```
