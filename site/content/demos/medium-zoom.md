---
title: 'Medium like zoom'
description: 'Easily create image zooming experience as seen on medium. '
lead:
    'Easily create image zooming experience as seen on medium. You can just use
    lightGallery mediumZoom plugin to achieve the same experience out of the
    box.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 17
toc: true
---

If you want to target all images in a blog post, you can add lightGallery to the
outer element and select all images using the selector option.

##### HTML structure

```html
<div class="medium-zoom-demo">
    <p>Lorem ipsum dolor sit amet......</p>
    <figure
        lg-background-color="white"
        class="blog-images"
        data-src="image-1.jpg"
        data-lg-size="1600-1126"
    >
        <img src="thumbnail-1.jpg" />
    </figure>
    <p>Lorem ipsum dolor sit amet......</p>
    <p>Lorem ipsum dolor sit amet......</p>
    <p>Lorem ipsum dolor sit amet......</p>
    <figure
        lg-background-color="rgb(28 62 74)"
        class="blog-images"
        data-src="image-2.jpg"
        data-lg-size="1600-1126"
    >
        <img src="thumbnail-2.jpg" />
    </figure>
    <p>Lorem ipsum dolor sit amet......</p>
    <figure class="blog-images" data-src="image-3.jpg" data-lg-size="1600-1126">
        <img src="thumbnail-3.jpg" />
    </figure>
</div>
```

##### JavaScript

```js
lightGallery(document.querySelector('.medium-zoom-demo'), {
    // Target all images
    selector: '.blog-images',
    // Add medium zoom plugin
    plugins: [lgMediumZoom],
});
```

##### Demo

<div class="medium-zoom-demo">

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eleifend purus
ligula, at gravida augue ullamcorper et. Class aptent taciti sociosqu ad litora
torquent per conubia nostra, per inceptos himenaeos. Cras placerat eu lectus a
condimentum. Nam hendrerit sem augue, ac porta ante venenatis vel. Quisque
ullamcorper dapibus venenatis. Cras cursus justo vitae erat lacinia tristique.
Praesent eu lobortis leo. Vestibulum sollicitudin orci quis augue molestie
convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada
fames ac turpis egestas. Duis eget sem nulla. Nulla ut magna dignissim, rhoncus
mi ut, lobortis metus. Etiam vel pretium ipsum. Vestibulum consequat varius
odio, sed rutrum purus laoreet id. Mauris vitae urna nec ligula vulputate
tincidunt.

<figure lg-background-color="#FFF" class="blog-images" data-src="https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"  data-lg-size="1600-1126" >
<img src="https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=860&q=80"/>
</figure>

Maecenas aliquam lacinia elit, in vehicula enim pretium ut. Aenean consequat
urna in purus blandit rutrum efficitur at tortor. Morbi aliquet lorem eget arcu
rutrum commodo. Vestibulum quis aliquet erat. Nullam sit amet orci nunc. Quisque
faucibus ante eu massa convallis sodales. Proin imperdiet felis augue, vel
egestas diam suscipit sit amet. Etiam non orci justo. Nam aliquam viverra quam
quis elementum. Donec mollis posuere pulvinar. Phasellus ullamcorper, odio non
luctus commodo, felis ex vestibulum orci, vitae vestibulum nisl est in erat.
Donec ut cursus massa. Cras tellus ligula, consectetur eu mauris ornare,
sollicitudin efficitur turpis. Nulla nulla quam, accumsan sit amet ipsum et,
fermentum sodales augue. Fusce rhoncus tortor est, eu commodo diam pellentesque
eu.

Cras varius placerat nulla ut suscipit. Duis suscipit non mi a sagittis. Vivamus
in risus lacinia, rhoncus arcu imperdiet, ultricies diam. Pellentesque pharetra
congue nunc nec sollicitudin. Donec dapibus urna malesuada elit auctor
scelerisque. Nunc ornare egestas odio quis hendrerit. Vestibulum eget suscipit
lacus. Sed in lorem in tellus hendrerit suscipit. Praesent molestie viverra
sollicitudin. Donec interdum, lectus ac molestie ultricies, nunc lectus luctus
lectus, ut pulvinar lectus nunc id risus. Nullam porta aliquet ipsum, in iaculis
diam bibendum non. Aenean at lectus turpis. Fusce nec leo et nisi porta
consectetur at et metus.

<figure lg-background-color="rgb(22 37 44)" style="float:left" class="blog-images" data-src="https://images.unsplash.com/photo-1465311530779-5241f5a29892?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"  data-lg-size="1600-1067" >
<img src="https://images.unsplash.com/photo-1465311530779-5241f5a29892?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=860&q=80"/>
</figure>

Curabitur vitae interdum sem. Curabitur blandit massa quis elit molestie
dapibus. Mauris eget dolor ac sem tempor dapibus sit amet et velit. Nulla
facilisi. Vestibulum laoreet finibus molestie. Donec vel convallis enim. Morbi
feugiat pretium nunc aliquet tincidunt. Sed congue dapibus sem, ac vestibulum
urna egestas commodo. Vivamus eu dolor quis metus egestas laoreet ut eu quam.
Phasellus imperdiet sapien id nisl consectetur lobortis. Mauris quam felis,
porttitor eu convallis vel, tincidunt sit amet nulla. Cras ut vehicula arcu,
ornare mollis risus. Vivamus at commodo lacus, sed commodo eros. In tincidunt
malesuada magna at ullamcorper. Etiam neque est, vulputate id turpis in,
volutpat molestie leo.

Fusce efficitur ipsum volutpat, finibus dui ut, scelerisque ex. Donec tempus
quis felis non iaculis. Nam volutpat vehicula odio, sit amet semper leo ornare
imperdiet. Nulla tincidunt sagittis nisl a rutrum. Maecenas fermentum erat quis
volutpat fringilla. Proin commodo nunc vel dui mattis, vitae consectetur purus
feugiat. Aenean vitae arcu metus. Ut mattis dui ut nunc tincidunt, eget finibus
velit imperdiet. In dignissim sapien sit amet venenatis efficitur. Phasellus
pulvinar, velit non lacinia scelerisque, nisi lectus pulvinar ex, sagittis
pellentesque mauris massa varius turpis. Suspendisse quis placerat magna, eget
tempus erat. Nunc non eros vel eros mollis interdum. Duis porttitor, ante ac
accumsan molestie, odio nunc venenatis purus, sit amet viverra augue tortor
tempus turpis. Proin quis vehicula arcu.

<figure lg-background-color="rgb(28 62 74)" class="blog-images" data-src="https://images.unsplash.com/photo-1610448721566-47369c768e70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"  data-lg-size="1600-2400" style="float: right; margin-left: 2rem;">
<img src="https://images.unsplash.com/photo-1610448721566-47369c768e70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=340&q=80"/>
</figure>

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
himenaeos. Donec ullamcorper metus et massa sodales pretium. Donec velit libero,
faucibus eget nisi eu, fringilla maximus est. Curabitur id turpis vel dolor
malesuada commodo in eget sem. Sed semper nulla ac ligula ornare, ac hendrerit
dui porttitor. Morbi magna velit, suscipit sit amet mauris nec, semper varius
velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
cubilia curae; Nam vitae lacus blandit, gravida augue consectetur, auctor mi.
Etiam blandit mi at mauris cursus, nec efficitur diam tincidunt. Aenean non
pulvinar neque, eget efficitur mi. Ut at condimentum lacus, et venenatis nibh.
Pellentesque enim lectus, posuere a consequat et, tincidunt eget leo.

Etiam a felis nunc. Interdum et malesuada fames ac ante ipsum primis in
faucibus. Vivamus nisl magna, feugiat sit amet nisi vitae, dignissim tempus
metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
ridiculus mus. Ut dictum ipsum quis justo efficitur viverra quis vel nulla.
Mauris nec mauris eros. Fusce ornare justo at purus congue, ac dictum lacus
commodo. Cras ullamcorper luctus purus, non fermentum arcu. Praesent vitae
lacinia lacus, eget mollis mi. Pellentesque at enim a mi congue porta.

</div>
