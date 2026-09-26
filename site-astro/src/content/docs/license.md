---
title: 'lightGallery license'
description:
    'lightGallery is a free and open-source library, however, if you are using
    the library for business, commercial sites, projects, and applications, the
    Commercial license is the appropriate license. With this option, your source
    code is kept proprietary.'
lead:
    'lightGallery is a free and open-source library, however, if you are using
    the library for business, commercial sites, projects, and applications, the
    Commercial license is the appropriate license. With this option, your source
    code is kept proprietary. <a href="/license/">More info</a>'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
        name: 'License'
weight: 9
toc: true
---

## Commercial License

lightGallery is a free and open-source library, however, if you are using the
library for business, commercial sites, projects, and applications, the
Commercial license is the appropriate license. With this option, your source
code is kept proprietary.

Once purchased, you’ll receive a commercial license PDF and be all set to use
lightGallery in your commercial applications.

## Extended Commercial license

If you want to include lightGallery as part of software developer kit (SDK), web application builder or website builder, downloadable or installable products like Wordpress themes, HTML templates,or something that produces copies that each use lightGallery, you need to choose the Extended Commercial license

## Open source license

If you are creating an open source application under a license compatible with
the GNU GPL license v3, you may use this project under the terms of the GPLv3.
Questions? Read the [GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html).

## License key

Pass your key with the [`licenseKey`](/docs/settings/#licenseKey) setting:

```js
lightGallery(document.getElementById('lightgallery'), {
    licenseKey: 'your_license_key',
});
```

-   **Commercial licenses** come with a key by email once you purchase.
    lightGallery 3 keys start with `LIG`.
-   **Upgrading from v1 or v2?** Those keys don't start with `LIG` and
    aren't valid for lightGallery 3. The gallery keeps working and logs a
    console warning asking you to upgrade; see the
    [upgrade note on the license page](/license/).
-   **Open source projects** under a GPLv3-compatible license can get a key
    at [contact@lightgalleryjs.com](mailto:contact@lightgalleryjs.com).
-   **Trying it out?** Use `0000-0000-000-0000` as a temporary key. It
    doesn't limit anything: every feature and plugin works exactly as it
    does with a purchased key. The only difference is a console warning
    that the key is not for production use, so if you see an error, it
    comes from something else, not from licensing.

### One key for every gallery on the page

With several galleries on a page, set the key once with `setLicenseKey`
before creating them. A gallery's own `licenseKey` still wins, and each
license message is logged once per page, not once per gallery.

```js
// Vanilla JavaScript (script tag: window.lightGallery.setLicenseKey)
import lightGallery from 'lightgallery';

lightGallery.setLicenseKey('your_license_key');
```

```ts
// React, Vue or Angular: once at app start, for example in main.ts
import { setLicenseKey } from '@lightgallery/react'; // or /vue, /angular

setLicenseKey('your_license_key');
```

The temporary key is also the default, so a gallery without a
`licenseKey` shows the same warning. An empty `licenseKey` logs a console
error pointing here instead; the gallery still runs.
