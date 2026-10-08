---
title: 'lightGallery license'
description:
    'lightGallery is free and open source under the GPLv3. The commercial
    license is for projects that keep their source proprietary: same code,
    every plugin, one-time payment.'
lead:
    'Which license applies to your project, how to pass your license key, and
    what the temporary key does. Plans and pricing are on the
    <a href="/license/">license page</a>.'
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

## Open source license

lightGallery is released under the
[GNU General Public License v3](https://www.gnu.org/licenses/gpl-3.0.html).
It is free to use in any project, personal or commercial, as long as that
project is distributed under GPLv3-compatible terms. The
[GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html) explains what that means
for your own code.

Open-source projects can request a license key at
[contact@lightgalleryjs.com](mailto:contact@lightgalleryjs.com) so the
gallery runs without the console notice.

## Commercial license

If you would rather keep your own source proprietary, the commercial license
is for you. It covers the same code, with every feature and official plugin
included; nothing is gated behind it. Plans are one-time payments, priced by
team size, and come with a license key by email. See
[plans and pricing](/license/).

## Extended commercial license

If you want to include lightGallery as part of a software development kit
(SDK), web application builder or website builder, downloadable or
installable products like WordPress themes, HTML templates, or something
that produces copies that each use lightGallery, you need the Extended
Commercial license.

## Frequently asked

**Is lightGallery free?** Yes. Under the GPLv3 every package and every
plugin is free, for personal and commercial projects alike, when your project
is distributed under GPLv3-compatible terms.

**When do I need a commercial license?** When you keep your source
proprietary, so releasing it under GPLv3-compatible terms is not an option.
The kind of project does not decide this; the terms your own code ships
under do.

**Does the commercial license add features?** No. Both licenses cover the
same code. The license key only turns off the console notice.

**Can I try it before buying?** Yes. The temporary key below runs every
feature and plugin; it only logs a console warning that it is not for
production use.

**I ship a theme, template or site builder. Which license?** Products that
produce copies, each using lightGallery, need the Extended Commercial
license.

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
