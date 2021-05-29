---
title: 'Transitions'
description: 'LightGallery allows you to build inline image/video galleries.'
lead:
    'lightGallery comes with a numerous number of beautiful built in transitions. 
    You can change the type of transitions by passing the transition name via mode option. 
    lightGallery uses Hardware-Accelerated CSS3 transitions for faster animation performance. 
    You can easily create your own beautiful custom transitions by updating the CSS transform values.
'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 11
toc: true
---

#### Demo

{{< image-gallery id="gallery-transitions-demo">}}

<div class="choose-select-option-wrap">
<span class="choose-select-option">Change transition : </span>
<select id="select-trans" class="mrb30 select">

<option selected="selected" value="lg-slide">lg-slide</option>
<option value="lg-fade">lg-fade</option>
<option value="lg-zoom-in">lg-zoom-in</option>
<option value="lg-zoom-in-big">lg-zoom-in-big</option>
<option value="lg-zoom-out">lg-zoom-out</option>
<option value="lg-zoom-out-big">lg-zoom-out-big</option>
<option value="lg-zoom-out-in">lg-zoom-out-in</option>
<option value="lg-zoom-in-out">lg-zoom-in-out</option>
<option value="lg-soft-zoom">lg-soft-zoom</option>
<option value="lg-scale-up">lg-scale-up</option>
<option value="lg-slide-circular">lg-slide-circular</option>
<option value="lg-slide-circular-vertical">lg-slide-circular-vertical</option>
<option value="lg-slide-vertical">lg-slide-vertical</option>
<option value="lg-slide-vertical-growth">lg-slide-vertical-growth</option>
<option value="lg-slide-skew-only">lg-slide-skew-only</option>
<option value="lg-slide-skew-only-rev">lg-slide-skew-only-rev</option>
<option value="lg-slide-skew-only-y">lg-slide-skew-only-y</option>
<option value="lg-slide-skew-only-y-rev">lg-slide-skew-only-y-rev</option>
<option value="lg-slide-skew">lg-slide-skew</option>
<option value="lg-slide-skew-rev">lg-slide-skew-rev</option>
<option value="lg-slide-skew-cross">lg-slide-skew-cross</option>
<option value="lg-slide-skew-cross-rev">lg-slide-skew-cross-rev</option>
<option value="lg-slide-skew-ver">lg-slide-skew-ver</option>
<option value="lg-slide-skew-ver-rev">lg-slide-skew-ver-rev</option>
<option value="lg-slide-skew-ver-cross">lg-slide-skew-ver-cross</option>
<option value="lg-slide-skew-ver-cross-rev">lg-slide-skew-ver-cross-rev</option>
<option value="lg-lollipop">lg-lollipop</option>
<option value="lg-lollipop-rev">lg-lollipop-rev</option>
<option value="lg-rotate">lg-rotate</option>
<option value="lg-rotate-rev">lg-rotate-rev</option>
<option value="lg-tube">lg-tube</option> </select>
</div>

##### HTML Structure

```html
<div id="custom-transition-demo">
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
lightGallery(document.getElementById('custom-transition-demo'), {
    mode: 'lg-fade',
});
```

### Create custom transition

lightGallery comes with more than 30 transitions effects. If you need more, you
can easily create your own custom transitions.

Let's see how we can create custom transition effects. Before that we need to
understand how transition works in lightGallery. Transitions happen based on 3
CSS class names. `lg-prev-slide`, `lg-current` and `lg-next-slide` When user
tries to navigate a different slide, lightGallery

-   Removes all CSS transition effects from the slides.
-   Remove existing `lg-prev-slide` and `lg-next-slide` classes from the current
    slide.
-   Based on the direction, adds `lg-next-slide` or `lg-prev-slide` to the
    current slide and next slide to determine how the current slide should
    disappear and the next slide should appear. If direction is `previous`,
    `lg-prev-slide` is added to the current slide and `lg-next-slide` is added
    to the next slide. likewise If direction is `next`, `lg-next-slide` is added
    to the current slide and `lg-prev-slide` is added to the next slide.
-   50 ms timer starts to give some time for the browser to perform transitions.
-   After 50 ms, remove `lg-current` class from the current slide.
-   Add `lg-current` class to the next slide.
-   Restore the CSS transitions.

Let's create a custom zoom-in-out transition.

When user navigates to next slide, zoom in transition appears and when user
navigates to the previous slide, zoom out transition appears.

```css
.lg-zoom-in-out {
    .lg-item {
        // By default all slides should be hidden
        opacity: 0;
        will-change: transform, opacity;

        // For the zoom in transition, set scale3d to 2
        &.lg-prev-slide {
            transform: scale3d(2, 2, 2);
        }

        // For the zoom out transition, set scale3d to 0
        &.lg-next-slide {
            transform: scale3d(0, 0, 0);
        }

        // Reset opacity and transition
        &.lg-current {
            transform: scale3d(1, 1, 1);
            opacity: 1;
        }

        // Add CSS transition for opacity and transform
        &.lg-prev-slide,
        &.lg-next-slide,
        &.lg-current {
            transition: transform 1s cubic-bezier(0, 0, 0.25, 1) 0s, opacity 1s
                    ease 0s;
        }
    }
}
```
