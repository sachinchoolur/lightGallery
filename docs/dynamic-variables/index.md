# Dynamic variables

> Every field a lightGallery item can carry in dynamic mode, from src and thumb to captions, video, download and share URLs, with the matching data attributes.

In dynamic mode you build the gallery from data instead of markup: set the dynamic option and pass an array of item objects as dynamicEl. The fields below are the ones each item can carry. [Demo](https://www.lightgalleryjs.com/demos/dynamic-mode/)

Canonical page: https://www.lightgalleryjs.com/docs/dynamic-variables/

## Passing items

Each item is a plain object. Only `src` is required; the other fields
switch on captions, video, downloads and sharing per slide.

```javascript
const gallery = lightGallery(document.getElementById('dynamic-gallery'), {
    dynamic: true,
    dynamicEl: [
        {
            src: 'img/1.jpg',
            thumb: 'img/thumb-1.jpg',
            subHtml: '<h4>Image 1</h4><p>Description of image 1.</p>',
        },
        {
            src: 'img/2.jpg',
            thumb: 'img/thumb-2.jpg',
            subHtml: '<h4>Image 2</h4>',
        },
    ],
});

// Open at the second slide.
gallery.openGallery(1);
```

A dynamic gallery has no trigger markup, so the zoom-from-origin animation
needs two things from you: the media size on the item as `lgSize`, and the
element the slide should grow out of as the second argument of
`openGallery`:

```javascript
const gallery = lightGallery(document.getElementById('dynamic-gallery'), {
    dynamic: true,
    dynamicEl: [
        { src: 'img/1.jpg', thumb: 'img/thumb-1.jpg', lgSize: '1600-1067' },
    ],
});

document.getElementById('cover').addEventListener('click', () => {
    gallery.openGallery(0, document.getElementById('cover'));
});
```

A `data-lg-size` attribute on that element works too and takes
precedence. Without a size or an element, the slide uses the default
opening animation.

In [React](/docs/react/), [Vue](/docs/vue/) and [Angular](/docs/angular/)
the same fields describe an item or an entry of the `slides` array, with
`caption` in place of `subHtml`.

## Available fields

Every field has an HTML attribute twin for galleries built from markup; the
[attributes page](/docs/attributes/) lists those.

| Property | Type | Description |
| --- | --- | --- |
| `__slideVideoInfo` | `VideoInfo` |  |
| `alt` | `string` | alt attribute for the image |
| `disqusIdentifier` | `string` | Disqus page identifier Please refer official [disqus documentation](https://help.disqus.com/en/articles/1717084-javascript-configuration-variables) for more info |
| `disqusUrl` | `string` | Disqus page url Please refer official [disqus documentation](https://help.disqus.com/en/articles/1717084-javascript-configuration-variables) for more info |
| `download` | `string \| boolean` | Name of the file after it is downloaded. The HTML value of the download attribute. There are no restrictions on allowed values, and the browser will automatically detect the correct file extension and add it to the file (.img, .pdf, .txt, .html, etc.). [More info](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download) |
| `downloadUrl` | `string \| boolean` | Download url for your image/video. Pass false if you want to disable the download button. |
| `facebookShareUrl` | `string` | Facebook share URL. Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL is taken. |
| `fbHtml` | `string` | Facebook comments body html Please refer [facebook official documentation](https://developers.facebook.com/docs/plugins/comments/#comments-plugin) for generating the HTML markup |
| `iframe` | `boolean` | Set true is you want to open your url in an iframe |
| `iframeTitle` | `string` | Title for iframe |
| `lgSize` | `string` | Original size of the media as "WIDTH-HEIGHT", for example 1600-1067. Drives the zoom-from-origin opening and closing animation and the size of video slides. In a gallery built from markup it is read from the item element. In dynamic mode set it on the item and pass the element the slide should grow out of as the second argument of openGallery; a data-lg-size attribute on that element still wins. |
| `pinterestShareUrl` | `string` | Pinterest share URL. Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken. Note?: Pinterest requires absolute URL |
| `pinterestText` | `string` | Description for Pinterest post. |
| `poster` | `string` | Poster url |
| `responsive` | `string` | List of images and viewport's max width separated by comma. Ex?: img/1-375.jpg 375, img/1-480.jpg 480, img/1-757.jpg 757. |
| `shareUrl` | `string` | Canonical share URL for the native share sheet (Web Share API). Specify only if you want a separate URL for the specific slide. Falls back to the network-specific share URLs, then the current browser URL. |
| `sizes` | `string` | srcset sizes attribute for the main image |
| `slideName` | `string` | Custom slide name to use in the url when hash plugin is enabled |
| `sources` | `ImageSources[]` | Source attributes for the [picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attributes) element |
| `src` | `string` | url of the media |
| `srcset` | `string` | srcset attribute values for the main image |
| `subHtml` | `string` | Caption for the slide You can either pass the HTML markup or the ID or class name of the element which contains the captions |
| `subHtmlUrl` | `string` | url of the file which contain the sub html. Note - Does not support Internet Explorer browser |
| `thumb` | `string` | Thumbnail url By default lightGallery uses the image inside gallery selector as thumbnail. But, If you want to use external image for thumbnail, pass the thumbnail url via any data attribute and pass the attribute name via exThumbImage option |
| `title` | `string` | Title attribute for the image or video. With the getCaptionFromTitleOrAlt setting, it is used as the caption when subHtml is not set. |
| `tweetText` | `string` | Tweet text |
| `twitterShareUrl` | `string` | Twitter share URL. Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken. |
| `video` | `VideoSource` | Video source |
| `width` | `string` | Actual size of the image in px. This is used in zoom plugin to see the actual size of the image when double-tapped on the image. |
