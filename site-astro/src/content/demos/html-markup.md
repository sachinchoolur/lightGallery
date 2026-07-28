---
title: 'HTML Markup'
description: 'lightGallery - HTML markup demo'
lead:
    'LightGallery does not force you to use any specific HTML markup. You can
    use almost any kind of markup with the help of `selector` setting.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 13
toc: true
---

##### HTML Structure

```html
<div id="anchor-tag">
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('anchor-tag'));
```

---

##### HTML Structure

```html
<ul id="ul-li">
    <li data-src="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </li>
    <li data-src="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </li>
    ...
</ul>
```

##### JavaScript

```js
lightGallery(document.getElementById('ul-li'));
```

---

##### HTML Structure

```html
<div id="selector1">
  <h2>Gallery title</h3>
  <div class="item" data-src="img/img1.jpg">
      <img src="img/thumb1.jpg" />
  </div>
  <div class="item" data-src="img/img2.jpg">
      <img src="img/thumb2.jpg" />
  </div>
  ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('selector1'), {
    selector: '.item',
});
```

---

##### HTML Structure

```html
<a id="selector2" href="img/img1.jpg"> Click to open </a>
```

##### JavaScript

```js
lightGallery(document.getElementById('selector2'), {
    selector: 'this',
});
```
