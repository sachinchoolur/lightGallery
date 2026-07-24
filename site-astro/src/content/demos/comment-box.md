---
title: 'lightbox gallery with Facebook and Disqus comments'
description: 'lightbox gallery with Facebook and Disqus comments'
lead:
    'Create lightBox gallery with Facebook and Disqus comments. LightGallery supports Facebook and Disqus comments out of the box with the
    help of lg-comments plugin.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
        name: 'Comment box'
weight: 16
toc: true
---

#### facebook comments in lightbox

{{< image-gallery id="gallery-fb-comments-demo">}}

Step 1 - Include the
<a href="https://developers.facebook.com/docs/plugins/comments/#comments-plugin">facebook
comment plugin code</a> on your page, ideally right after the opening `<body>`
tag.

```html
<div id="fb-root"></div>

<script>
    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4';
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
</script>
```

Step 2 - Place the facebook comment plugin html code inside data-fb-html
attribute of each lightGallery item.

```html
<div
    class="fb-comments"
    data-href="http://sachinchoolur.github.io/lightGallery/demos/comment-box#lg=1&slide=0"
    data-width="400"
    data-numposts="5"
></div>
```

#### Final HTML structure

```html
<div id="gallery-fb-comments-demo">
    <a
        href="img/img1.jpg"
        data-fb-html='<div class="fb-comments" data-href="http://sachinchoolur.github.io/lightGallery/demos/comment-box#lg=1&slide=1" data-width="400" data-numposts="5"></div>'
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        href="img/img2.jpg"
        data-fb-html='<div class="fb-comments" data-href="http://sachinchoolur.github.io/lightGallery/demos/comment-box#lg=1&slide=2" data-width="400" data-numposts="5"></div>'
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-fb-comments-demo'), {
    hash: true,
    commentBox: true,
    fbComments: true,
});
```

### Disqus comments in lightbox

{{< image-gallery id="gallery-disqus-comments-demo">}}

Step 1 - Install Disqus using the
<a href="https://lg-disqus.disqus.com/admin/install/platforms/universalcode/">universal
code</a>

```html
<div id="disqus_thread"></div>
<script>
    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function () {
        // DON'T EDIT BELOW THIS LINE
        var d = document,
            s = d.createElement('script');
        s.src = 'https://lg-disqus.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
```

Step 2 - Construct HTML markup with disqus identifier and url

```html
<div id="gallery-disqus-comments-demo">
    <a
        href="img/img1.jpg"
        data-disqus-identifier="{DISQUS-IDENTIFIER}"
        data-disqus-url="https://{WEBSITE_URL}/img/img1.jpg"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        href="img/img2.jpg"
        data-disqus-identifier="{DISQUS-IDENTIFIER}"
        data-disqus-url="https://{WEBSITE_URL}/img/img2.jpg"
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-disqus-comments-demo'), {
    hash: true,
    commentBox: true,
    disqusComments: true,
});
```
