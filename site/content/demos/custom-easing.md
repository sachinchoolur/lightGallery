---
title: 'Custom Easing'
description: 'LightGallery custom easing demo'
lead:
    'You can pass easing property via lightGallery <code>easing</code> setting. 
    Bellow you can find some of the possible values of <code>cssEasing</code>. 
    Demo values are taken from <a target="_blank" href="http://twitter.com/matthewlein">@matthewlein</a>`s <a href="http://matthewlein.com/ceaser/">ceaser</a>
'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 15
toc: true
---

#### Demo

{{< image-gallery id="gallery-custom-easing-demo">}}

<div class="choose-select-option-wrap">
<span class="choose-select-option">Change easing : </span>
<select id="select-easing" class="mrb30 select">
    <optgroup label="defaults">
        <option selected="" value="0.250, 0.250, 0.750, 0.750">linear</option>
        <option value="0.250, 0.100, 0.250, 1.000">ease (default)</option>
        <option value="0.420, 0.000, 1.000, 1.000">ease-in</option>
        <option value="0.000, 0.000, 0.580, 1.000">ease-out</option>
        <option value="0.420, 0.000, 0.580, 1.000">ease-in-out</option>
    </optgroup>
    <optgroup label="Penner Equations (approximated)">
        <option value="0.550, 0.085, 0.680, 0.530">easeInQuad</option>
        <option value="0.550, 0.055, 0.675, 0.190">easeInCubic</option>
        <option value="0.895, 0.030, 0.685, 0.220">easeInQuart</option>
        <option value="0.755, 0.050, 0.855, 0.060">easeInQuint</option>
        <option value="0.470, 0.000, 0.745, 0.715">easeInSine</option>
        <option value="0.950, 0.050, 0.795, 0.035">easeInExpo</option>
        <option value="0.600, 0.040, 0.980, 0.335">easeInCirc</option>
        <option value="0.600, -0.280, 0.735, 0.045">easeInBack</option>
        <option value="0.250, 0.460, 0.450, 0.940">easeOutQuad</option>
        <option value="0.215, 0.610, 0.355, 1.000">easeOutCubic</option>
        <option value="0.165, 0.840, 0.440, 1.000">easeOutQuart</option>
        <option value="0.230, 1.000, 0.320, 1.000">easeOutQuint</option>
        <option value="0.390, 0.575, 0.565, 1.000">easeOutSine</option>
        <option value="0.190, 1.000, 0.220, 1.000">easeOutExpo</option>
        <option value="0.075, 0.820, 0.165, 1.000">easeOutCirc</option>
        <option value="0.175, 0.885, 0.320, 1.275">easeOutBack</option>
        <option value="0.455, 0.030, 0.515, 0.955">easeInOutQuad</option>
        <option value="0.645, 0.045, 0.355, 1.000">easeInOutCubic</option>
        <option value="0.770, 0.000, 0.175, 1.000">easeInOutQuart</option>
        <option value="0.860, 0.000, 0.070, 1.000">easeInOutQuint</option>
        <option value="0.445, 0.050, 0.550, 0.950">easeInOutSine</option>
        <option value="1.000, 0.000, 0.000, 1.000">easeInOutExpo</option>
        <option value="0.785, 0.135, 0.150, 0.860">easeInOutCirc</option>
        <option value="0.680, -0.550, 0.265, 1.550" selected="">easeInOutBack</option>
    </optgroup>
</select>
</div>

##### HTML Structure

```html
<div id="gallery-custom-easing-demo">
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
lightGallery(document.getElementById('gallery-custom-easing-demo'), {
    cssEasing: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
    // increasing speed to see the easing correctly
    // Just for the demo purpose
    speed: 1000,
});
```
