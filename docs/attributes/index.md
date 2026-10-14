# Attributes

> Every HTML attribute lightGallery reads from your gallery markup: the image, thumbnail, size, caption, video, download and share attributes.

When you build a gallery from markup, lightGallery reads everything it needs from attributes on each item. This page lists all of them.

Canonical page: https://www.lightgalleryjs.com/docs/attributes/

## Where attributes go

Attributes sit on the item element, usually an anchor whose `href` is the
full-size image and whose child image is the thumbnail:

```html
<div id="gallery">
    <a
        href="img/1.jpg"
        data-lg-size="1600-1067"
        data-sub-html="<h4>Mountains</h4>"
        data-download-url="img/1-original.jpg"
    >
        <img src="img/thumb-1.jpg" alt="Mountains" />
    </a>
</div>
```

In the [React](/docs/react/), [Vue](/docs/vue/) and
[Angular](/docs/angular/) packages the same information is passed as item
fields instead; the [dynamic variables page](/docs/dynamic-variables/)
lists those.

## External thumbnails

By default the image inside the item is the thumbnail. To read the
thumbnail URL from an attribute instead, set the `exThumbImage` setting
to the attribute's name, such as `data-external-thumb-image`; that
attribute is read from the item element rather than becoming a field of
the item.

## Available attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `data-__slide-video-info` | `VideoInfo` |  |
| `data-alt` | `string` | alt attribute for the image |
| `data-disqus-identifier` | `string` | Disqus page identifier Please refer official [disqus documentation](https://help.disqus.com/en/articles/1717084-javascript-configuration-variables) for more info |
| `data-disqus-url` | `string` | Disqus page url Please refer official [disqus documentation](https://help.disqus.com/en/articles/1717084-javascript-configuration-variables) for more info |
| `data-download` | `string \| boolean` | Name of the file after it is downloaded. The HTML value of the download attribute. There are no restrictions on allowed values, and the browser will automatically detect the correct file extension and add it to the file (.img, .pdf, .txt, .html, etc.). [More info](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download) |
| `data-download-url` | `string \| boolean` | Download url for your image/video. Pass false if you want to disable the download button. |
| `data-facebook-share-url` | `string` | Facebook share URL. Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL is taken. |
| `data-fb-html` | `string` | Facebook comments body html Please refer [facebook official documentation](https://developers.facebook.com/docs/plugins/comments/#comments-plugin) for generating the HTML markup |
| `data-iframe` | `boolean` | Set true is you want to open your url in an iframe |
| `data-iframe-title` | `string` | Title for iframe |
| `data-lg-size` | `string` | Original size of the media as "WIDTH-HEIGHT", for example 1600-1067. Drives the zoom-from-origin opening and closing animation and the size of video slides. In a gallery built from markup it is read from the item element. In dynamic mode set it on the item and pass the element the slide should grow out of as the second argument of openGallery; a data-lg-size attribute on that element still wins. |
| `data-pinterest-share-url` | `string` | Pinterest share URL. Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken. Note?: Pinterest requires absolute URL |
| `data-pinterest-text` | `string` | Description for Pinterest post. |
| `data-poster` | `string` | Poster url |
| `data-responsive` | `string` | List of images and viewport's max width separated by comma. Ex?: img/1-375.jpg 375, img/1-480.jpg 480, img/1-757.jpg 757. |
| `data-share-url` | `string` | Canonical share URL for the native share sheet (Web Share API). Specify only if you want a separate URL for the specific slide. Falls back to the network-specific share URLs, then the current browser URL. |
| `data-sizes` | `string` | srcset sizes attribute for the main image |
| `data-slide-name` | `string` | Custom slide name to use in the url when hash plugin is enabled |
| `data-sources` | `ImageSources[]` | Source attributes for the [picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attributes) element |
| `data-src` | `string` | url of the media |
| `data-srcset` | `string` | srcset attribute values for the main image |
| `data-sub-html` | `string` | Caption for the slide You can either pass the HTML markup or the ID or class name of the element which contains the captions |
| `data-sub-html-url` | `string` | url of the file which contain the sub html. Note - Does not support Internet Explorer browser |
| `data-thumb` | `string` | Thumbnail url By default lightGallery uses the image inside gallery selector as thumbnail. But, If you want to use external image for thumbnail, pass the thumbnail url via any data attribute and pass the attribute name via exThumbImage option |
| `data-title` | `string` | Title attribute for the image or video. With the getCaptionFromTitleOrAlt setting, it is used as the caption when subHtml is not set. |
| `data-tweet-text` | `string` | Tweet text |
| `data-twitter-share-url` | `string` | Twitter share URL. Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken. |
| `data-video` | `VideoSource` | Video source |
| `data-width` | `string` | Actual size of the image in px. This is used in zoom plugin to see the actual size of the image when double-tapped on the image. |
