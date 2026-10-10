# Settings and options reference

> Every lightGallery option with its type, default value and description, core settings plus all plugin settings, in one reference.

lightGallery comes with a lot of settings, events, and methods to customize the gallery without touching the core code. You can find both lightGallery core settings, and the built in plugin settings here.

Canonical page: https://www.lightgalleryjs.com/docs/settings/

## Passing settings

lightGallery accepts two parameters, an HTML element as the first parameter and
library settings as the second parameter. You need to pass settings only if you
want to modify default behaviors.

```javascript
lightGallery(document.getElementById('gallery-container'), {
    speed: 500,
    mode: 'lg-fade',
    // other settings
});
```

The same names apply in every package. In [React](/docs/react/) and
[Vue](/docs/vue/) each core setting is a prop and each plugin's settings
are one object prop named after the plugin, such as `zoom={{ scale: 1.5 }}`.
In [Angular](/docs/angular/) core settings are signal inputs and plugin
settings go to the plugin's factory, such as `withZoom({ scale: 1.5 })`.

## lightGallery core

lightGallery comes with modular architecture. All the basic functionalities are
available in the core module. You need to include plugins if you need
additional functionalities such as thumbnails, video support, zoom, etc. Here you
can find all lightGallery core settings. If you think something is missing,
please check the respective plugins settings as well.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `addClass` | `string` | `''` | Add custom class for gallery container This can be used to set different style for different galleries |
| `allowMediaOverlap` | `boolean` | `false` | If true, toolbar, captions and thumbnails will not overlap with media element This will not affect thumbnails if animateThumb is false Also, toggle thumbnails button is not displayed if allowMediaOverlap is false Note - Changing the position of the media on every slide transition creates a flickering effect. Therefore, the height of the caption is calculated dynamically, only once based on the first slide caption. if you have dynamic captions for each media, you can provide an appropriate height for the captions via defaultCaptionHeight option |
| `appendCounterTo` | `string` | `'.lg-toolbar'` | Where the counter should be appended |
| `appendSubHtmlTo` | `".lg-sub-html" \| ".lg-item" \| ".lg-outer"` | `'.lg-sub-html'` | control where the sub-html should be appended. If you choose '.lg-outer', you are responsible for placing the div at the right position. '.lg-outer' is useful if you want to show custom HTML outside the normal gallery |
| `ariaAnnouncements` | `boolean` | `true` | Announce slide changes to assistive technology through a dedicated polite live region (strings.slideAnnouncement + the slide caption). While enabled, the counter and caption bar are not separate live regions, the announcer is the single source of slide-change announcements. Set to false to restore the previous behavior (live counter and caption, no announcer). See [Accessibility](https://www.lightgalleryjs.com/docs/accessibility/). _Since V3.0.0._ |
| `ariaDescribedby` | `string` | `''` | aria-describedby attribute for gallery |
| `ariaLabelledby` | `string` | `''` | aria-labelledby attribute for gallery |
| `backdropDuration` | `number` | `300` | Backdrop transition duration. Note - Do not change the value of backdrop via css. |
| `closable` | `boolean` | `true` | If false user won't be able to close the gallery at all This is useful for creating inline galleries. |
| `closeOnTap` | `boolean` | `true` | allows clicks on black area to close gallery. |
| `container` | `null \| string \| HTMLElement \| function` | `''` | Configure where the gallery should be appended. Useful to create inline galleries and more It is an empty string in the default settings and later assigned to document.body to avoid accessing document for SSR |
| `controls` | `boolean` | `true` | If false, prev/next buttons will not be displayed. |
| `counter` | `boolean` | `true` | Whether to show total number of images and index number of currently displayed image. |
| `defaultCaptionHeight` | `number` | `0` | Height of the caption for calculating allowMediaOverlap positions Note - this is only used to find the position of media item if allowMediaOverlap is true. Not for setting height of the captions Set 0 if you want to calculate the height of captions dynamically |
| `direction` | `"ltr" \| "rtl" \| "auto"` | `'ltr'` | Gallery reading direction: keyboard arrows, swipe advance and the slide/thumbnail transforms follow it. Visual mirroring is the opt-in lg-rtl.css layer - load it whenever this resolves to 'rtl'. 'auto' inherits the computed direction of the gallery element; the default stays 'ltr' so upgrades never change behavior on existing pages. See [Localization &amp; RTL](https://www.lightgalleryjs.com/docs/localization-rtl/). _Since V3.0.0._ |
| `download` | `boolean` | `true` | Enable download button. By default download url will be taken from data-src/href attribute but it is supported only in modern browsers. If you want you can provide another url for download via data-download-url. pass false in data-download-url if you want to hide download button for the particular slide. |
| `dynamic` | `boolean` | `false` | lightGallery can be instantiated and launched programmatically by setting this option to true and populating dynamicEl option (see below) with the definitions of images. |
| `dynamicEl` | `GalleryItem[]` | `[]` | An array of objects (src, iframe, subHtml, thumb, poster, responsive, srcset sizes) representing gallery elements. |
| `easing` | `string` | `'ease'` | Slide animation CSS easing property |
| `enableDrag` | `boolean` | `true` | Enables desktop mouse drag support |
| `enableSwipe` | `boolean` | `true` | Enables swipe support for touch devices |
| `escKey` | `boolean` | `true` | Whether the lightGallery could be closed by pressing the "Esc" key. |
| `exThumbImage` | `string` | `''` | Option to fetch different thumbnail image other than first image If you want to use external image for thumbnail, add the path of that image inside "data-" attribute and set value of this option to the name of your custom attribute. |
| `extraProps` | `string[]` | `[]` | Fetch custom properties from the selector this is useful for plugin development By default lightGallery fetches and stores all the props selectors to reduce frequent dom interaction for fetching props every time. If you need any additional data to be fetched and stored in the galleryItems variable, you can do this just by passing the prop names via extraProps |
| `flickVelocity` | `number` | `0.5` | Release velocity (px/ms, measured over the gesture's final ~100ms) at which a short swipe still changes slides, a flick. _Since V3.0.0._ |
| `getCaptionFromTitleOrAlt` | `boolean` | `true` | Option to get captions from alt or title tags. |
| `height` | `string` | `'100%'` | Height of the gallery. example '100%' , '300px' |
| `hideBarsDelay` | `number` | `0` | Delay for hiding gallery controls in ms. Pass `0` if you don't want to hide the controls |
| `hideControlOnEnd` | `boolean` | `false` | If true, prev/next button will be hidden on first/last image. Note - this option will be ignored if `loop` or `slideEndAnimation` is set to true |
| `hideScrollbar` | `boolean` | `false` | Hide scrollbar when gallery is opened _Since V2.5.0._ |
| `icons` | `Partial>` | `{}` | Custom icons: SVG markup per icon name, rendered instead of the built-in SVG icon set, bring your own icons without touching CSS. Omitted names keep the built-in icon. State-pair buttons (maximize/minimize, autoplayPlay/autoplayPause, fullscreen/fullscreenExit) need both names provided; a half-provided pair keeps the built-in pair. Size and color follow the button (1em/currentColor-friendly SVGs recommended). See [Custom icons](https://www.lightgalleryjs.com/docs/custom-icons/). _Since V3.0.0._ |
| `iframeHeight` | `string` | `'100%'` | Set height for iframe. |
| `iframeMaxHeight` | `string` | `'100%'` | Set max height for iframe. |
| `iframeMaxWidth` | `string` | `'100%'` | Set max width for iframe. |
| `iframeWidth` | `string` | `'100%'` | Set width for iframe. |
| `index` | `number` | `0` | specify which slide should load initially |
| `isMobile` | `function` | `undefined` | Function to detect mobile devices |
| `keyPress` | `boolean` | `true` | Enable keyboard navigation |
| `licenseKey` | `string` | `'0000-0000-000-0000'` | License key. lightGallery is free under the GPLv3; projects that keep their source proprietary need a commercial license, and its key arrives by email. Open-source projects can request a key at [contact@lightgalleryjs.com](mailto:contact@lightgalleryjs.com). 0000-0000-000-0000 is a temporary key for evaluation: it does not limit any feature, it only logs a console warning. lightGallery 3 keys start with LIG; a key from v1 or v2 logs a warning asking you to upgrade. See [License](https://www.lightgalleryjs.com/docs/license/). |
| `loadYouTubePoster` | `boolean` | `true` | Automatically load poster image for YouTube videos |
| `loop` | `boolean` | `true` | If false, will disable the ability to loop back to the beginning of the gallery from the last slide. |
| `mobileSettings` | `Partial` | `{ controls: false, showCloseIcon: false, download: false, showGestureButtons: false, }` | Separate settings for mobile devices Note - this is applied only at the time of loading by default controls and close buttons are disabled on mobile devices. use this option if you want to enable them or change any other settings for mobile devices Note - mobileSettings does not merge default values, you need to provide all mobileSettings including default values |
| `mode` | `"lg-slide" \| "lg-fade" \| "lg-zoom-in" \| "lg-zoom-in-big" \| "lg-zoom-out" \| "lg-zoom-out-big" \| "lg-zoom-out-in" \| "lg-zoom-in-out" \| "lg-soft-zoom" \| "lg-scale-up" \| "lg-slide-circular" \| "lg-slide-circular-vertical" \| "lg-slide-vertical" \| "lg-slide-vertical-growth" \| "lg-slide-skew-only" \| "lg-slide-skew-only-rev" \| "lg-slide-skew-only-y" \| "lg-slide-skew-only-y-rev" \| "lg-slide-skew" \| "lg-slide-skew-rev" \| "lg-slide-skew-cross" \| "lg-slide-skew-cross-rev" \| "lg-slide-skew-ver" \| "lg-slide-skew-ver-rev" \| "lg-slide-skew-ver-cross" \| "lg-slide-skew-ver-cross-rev" \| "lg-lollipop" \| "lg-lollipop-rev" \| "lg-rotate" \| "lg-rotate-rev" \| "lg-tube"` | `'lg-slide'` | Type of transition between images. |
| `mousewheel` | `boolean` | `false` | ability to navigate to next/prev slides on mousewheel |
| `nextHtml` | `string` | `''` | Custom html for next control |
| `numberOfSlideItemsInDom` | `number` | `10` | Control how many slide items should be kept in dom at a time To improve performance by reducing number of gallery items in the dom, lightGallery keeps only the lowest possible number of slides in the dom at a time. This has a minimum value of 3 |
| `pinchToClose` | `boolean` | `true` | Pinching down on an un-zoomed image and releasing closes the gallery (iOS Photos). Guarded: a pinch that went past fit zoom at any point is a zoom correction and never closes. Requires closable and the zoom plugin. _Since V3.0.0._ |
| `plugins` | `function[]` | `[]` | The plugins to enable for this gallery, as the constructors exported by each plugin entry, for example [lgZoom, lgThumbnail]. A plugin's settings do nothing until the plugin is listed here. See [Plugins](https://www.lightgalleryjs.com/docs/getting-started/#plugins). |
| `preload` | `number` | `2` | number of preload slides will execute only after the current slide is fully loaded. for example, if you click on 4th image and if preload = 1 then 3rd slide and 5th slide will be loaded in the background after the 4th slide is fully loaded. if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded. |
| `prevHtml` | `string` | `''` | Custom html for prev control |
| `resetScrollPosition` | `boolean` | `true` | Reset to previous scrollPosition when lightGallery is closed By default, lightGallery doesn't hide the scrollbar for a smooth opening transition. If a user changes the scroll position, lightGallery resets it to the previous value _Since V2.5.0._ |
| `selector` | `string \| HTMLCollection[]` | `''` | Custom selector property instead of direct children. Based on your markup structure, you can specify custom selectors to fetch media data for the gallery Pass "this" to select same element You can also pass HTMLCollection directly Example - '.my-selector' \| '#my-selector' \| this \| document.querySelectorAll('.my-selector') |
| `selectWithin` | `string` | `''` | By default the selector element is relative to the current gallery. Instead of that you can tell lightGallery to select element relative to another element. Example - '.my-selector-container' \| '#my-selector-container' In the code this becomes selector = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector); |
| `showBarsAfter` | `number` | `10000` | Delay in hiding controls for the first time when gallery is opened |
| `showCloseIcon` | `boolean` | `true` | If false, close button won't be displayed. Useful for creating inline galleries. |
| `showGestureButtons` | `boolean` | `true` | Show the toolbar buttons that repeat a touch gesture. Zoom in, zoom out and actual size do what pinch and double-tap already do. On by default, and turned off on touch devices through mobileSettings. See [showGestureButtons](https://www.lightgalleryjs.com/docs/settings/#showGestureButtons). _Since V3.0.0._ |
| `showMaximizeIcon` | `boolean` | `false` | Show maximize icon. Useful for creating inline galleries. |
| `slideDelay` | `number` | `0` | Delay slide transitions. This is useful if you want to do any action in the current slide before moving to next slide. For example, fading out the captions before going to next slide. `.lg-slide-progress` class name is added to the current slide immediately after calling the slide method. But transition begins only after the delay |
| `slideEndAnimation` | `boolean` | `true` | Enable slideEnd animation |
| `speed` | `number` | `400` | Transition duration (in ms). |
| `startAnimationDuration` | `number` | `400` | Zoom from image animation duration |
| `startClass` | `string` | `'lg-start-zoom'` | Start animation class for the gallery. startClass will be empty if zoomFromOrigin is true. This can be used to change the starting effect when the image is loaded This is also applied when navigating to new slides |
| `strings` | `LightGalleryCoreStrings` | `{ closeGallery: 'Close gallery', toggleMaximize: 'Toggle maximize', previousSlide: 'Previous slide', nextSlide: 'Next slide', download: 'Download', playVideo: 'Play video', mediaLoadingFailed: 'Oops... Failed to load content...', galleryLabel: 'Gallery', slideAnnouncement: 'Image {index} of {total}', moreOptions: 'More options', share: 'Share', toggleThumbnails: 'Toggle thumbnails', toggleAutoplay: 'Toggle Autoplay', toggleFullscreen: 'Toggle Fullscreen', zoomIn: 'Zoom in', zoomOut: 'Zoom out', viewActualSize: 'View actual size', rotateLeft: 'Rotate left', rotateRight: 'Rotate right', flipHorizontal: 'Flip horizontal', flipVertical: 'Flip vertical', toggleComments: 'Toggle Comments', }` | Customize strings. This can be useful if you want to localize the lightGallery strings to other languages. Use your own service to translate the strings and pass it via settings.strings Every core and plugin label lives here; the per-plugin *PluginStrings objects are deprecated. Strings merge per-key over the defaults, override only the keys you need (the old provide-everything requirement is gone). See [Localization &amp; RTL](https://www.lightgalleryjs.com/docs/localization-rtl/). _Since V3.0.0._ |
| `subHtmlSelectorRelative` | `boolean` | `false` | Set to true if the selector in "data-sub-html" should use the current item as its origin. |
| `swipeThreshold` | `number` | `50` | By setting the swipeThreshold (in px) you can set how far the user must swipe for the next/prev image. |
| `swipeToClose` | `boolean` | `true` | allows vertical drag/swipe to close gallery `false` if option `closable` is `false` |
| `toolbarOverflow` | `boolean` | `true` | Keep the toolbar on one row. When the toolbar buttons do not fit beside the counter, the lowest-priority ones move into a "More options" menu. Set to false to let the buttons wrap onto a second row instead. See [toolbarOverflow](https://www.lightgalleryjs.com/docs/settings/#toolbarOverflow). _Since V3.0.0._ |
| `trapFocus` | `boolean` | `true` | Trap focus within the lightGallery _Since V2.5.0._ |
| `videoMaxSize` | `string` | `'1280-720'` | Video max size. This can be over-written by passing specific size via data-lg-size attribute Recommended video resolution and aspect ratios [https://support.google.com/youtube/answer/6375112](https://support.google.com/youtube/answer/6375112) |
| `virtualization` | `VirtualizationSettings` |  | Large-gallery virtualization. Off when undefined, the classic behavior: every thumbnail renders and the mounted-slide window is numberOfSlideItemsInDom. slides overrides the mounted-slide pool size; thumbs turns on thumbnail-strip windowing (only the visible thumbs plus an overscan render, with spacers preserving the strip geometry), a number is the overscan thumb count per side, 'auto' derives one extra viewport per side. The window advances at commit points (release, slide change, resize), never per pointer move. See [Virtualization](https://www.lightgalleryjs.com/docs/virtualization/). _Since V3.0.0._ |
| `width` | `string` | `'100%'` | Width of the gallery. example '100%' , '300px' |
| `zoomFromOrigin` | `boolean` | `true` | Enable zoom from origin effect. You need to know the original image size upfront and provide it via data-lg-size attribute as `data-lg-size="1920-1280"` If you don't know the size of a few images in the list, you can skip the data-lg-size attribute for the particular slides, lightGallery will show the default animation if data-lg-size is not available If you are using responsive images, you can pass a comma separated list of sizes combined with a max-width (up to what size the particular image should be used) example - data-lg-size="240-160-375, 400-267-480, 1600-1067" data-responsive="img-240.jpg 375, img-400.jpg 480" data-src="img-1600.jpg" In the above example, up to 375 width img-240.jpg and lg-size 240-160 will be used. Similarly, up to 480 pixel width size 400-267 and img-400.jpg will be used And above 480, lg-size 1600-1067 and img-1600.jpg will be used When the gallery closes on a slide that has no thumbnail to return to (the trigger is hidden or collapsed, as with the overflow items behind a "+9 photos" tile, it has no data-lg-size, or the gallery is dynamic), the slide shrinks to the centre of the stage and fades out instead of flying to the thumbnail. At the moment, the zoomFromOrigin option is supported only for image slides. The opening flight is skipped if dynamic option is enabled or galleryID found in the URL. startClass will be empty if zoomFromOrigin is true to avoid css conflicts. |

## Zoom plugin

lightGallery zoom plugins enable functionalities like pinch to zoom, double-tap,
or double click to see the actual size, zoom in, zoom out, and more.

> Plugin dependency: include the Zoom plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `actualSize` | `boolean` | `true` | Enable actual size icon. |
| `actualSizeIcons` | `ActualSizeIcons` | `{ zoomIn: 'lg-zoom-in', zoomOut: 'lg-zoom-out', }` | Actual size icons classnames. Specify classnames for both ZoomIn and ZoomOut states You can use actualSizeIcons: { zoomIn: 'lg-actual-size', zoomOut: 'lg-zoom-out' } to show actual size icons instead of zoom in and zoom out icons. |
| `enableZoomAfter` | `number` | `300` | Once the slide transition is completed, how much time the zoom plugin should take to activate Some css styles will be added to the images if zoom is enabled. So it might conflict if you add any custom styles to the images such as the initial transition while opening the gallery. So you can delay adding zoom related styles to the images by changing the value of enableZoomAfter. |
| `infiniteZoom` | `boolean` | `true` | Enable/Disable infinite zoom If you set this to true, you can zoom in more than the original size of the image. |
| `scale` | `number` | `1` | Value by which zoom should be incremented/decremented |
| `showZoomInOutIcons` | `boolean` | `false` | Show zoom in, zoom out icons |
| `zoom` | `boolean` | `true` | Enable/Disable zoom option |
| `zoomPluginStrings` | `Partial` |  | Custom translation strings for aria-labels _Deprecated: Set these labels on the core strings object instead, every user-facing string lives in that one contract. An explicitly set key here still wins (alias)._ |

## Thumbnails plugin

The thumbnails plugin adds the thumbnail strip to your gallery. It supports
animated thumbnails, thumbnail scrubbing, and loads thumbnails for YouTube
videos automatically.

> Plugin dependency: include the Thumbnails plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `alignThumbnails` | `"left" \| "middle" \| "right"` | `'middle'` | Position of thumbnails when the width of all thumbnails combined is less than the gallery's width. |
| `animateThumb` | `boolean` | `true` | Enable thumbnail animation. |
| `appendThumbnailsTo` | `".lg-outer" \| ".lg-components"` | `'.lg-components'` | control where the thumbnails should be appended. By default, thumbnails are appended to '.lg-components' which has inbuilt open close transitions If you don't want initial thumbnails transitions, or want to do more customization, you can append thumbnails to the lightGallery outer div - [Demo](https://www.lightgalleryjs.com/demos/thumbnails/#static-thumbnails) |
| `currentPagerPosition` | `"left" \| "middle" \| "right"` | `'middle'` | Position of selected thumbnail. |
| `enableThumbDrag` | `boolean` | `true` | Enables desktop mouse drag support for thumbnails. |
| `enableThumbSwipe` | `boolean` | `true` | Enables thumbnail touch/swipe support for touch devices |
| `loadYouTubeThumbnail` | `boolean` | `true` | You can automatically load thumbnails for YouTube videos from YouTube by setting loadYouTubeThumbnail true |
| `scrubThumbnails` | `boolean` | `false` | Scrub the gallery with the thumbnail strip: while the strip is dragged (or gliding after a fling), the slide under the strip's travel position becomes current immediately, without slide transitions, the strip works like a scrubber instead of an independent scroll area. The full strip travel spans the whole gallery, so the first and last slides are always reachable. Requires animateThumb; taps still navigate normally. See [Thumbnail scrubbing](https://www.lightgalleryjs.com/docs/thumbnail-scrubbing/). _Since V3.0.0._ |
| `thumbHeight` | `string` | `'80px'` | Height of each thumbnail. |
| `thumbMargin` | `number` | `5` | Spacing between each thumbnail |
| `thumbnail` | `boolean` | `true` | Enable thumbnails for the gallery |
| `thumbnailPluginStrings` | `Partial` |  | Custom translation strings for aria-labels _Deprecated: Set these labels on the core strings object instead, every user-facing string lives in that one contract. An explicitly set key here still wins (alias)._ |
| `thumbnailSwipeThreshold` | `number` | `10` | By setting the thumbnailSwipeThreshold (in px) you can set how far the user must swipe for the next/prev slide. |
| `thumbWidth` | `number` | `100` | Width of each thumbnail. |
| `toggleThumb` | `boolean` | `false` | Enable toggle captions and thumbnails. not applicable if allowMediaOverlap is false |
| `youTubeThumbSize` | `number` | `1` | You can specify the thumbnail size by setting respective number. |

## Justified layout plugin

Justified layout plugin arranges the gallery's trigger thumbnails in rows of
equal height and varying widths that fill the container edge to edge. See the
[justified layout guide](/docs/justified-layout/) for usage across all
frameworks.
<span class="badge rounded-pill bg-danger font-12" title="Available since version 3.0.0">v3.0.0</span>

> Plugin dependency: include the Justified layout plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `justified` | `boolean` | `true` | Enable the justified layout for the gallery's trigger thumbnails: rows of equal height and varying widths that fill the container edge to edge. Inline galleries only, dynamic mode has no trigger grid to lay out. Each box shows as a placeholder and its thumbnail fades in once loaded; put class="lg-justified" on the container markup so nothing shows unorganized before the script runs. See [Justified layout](https://www.lightgalleryjs.com/docs/justified-layout/). _Since V3.0.0._ |
| `justifiedGap` | `number` | `8` | Gap between thumbnails and between rows (px). _Since V3.0.0._ |
| `justifiedLastRow` | `"justify" \| "start" \| "hide"` | `'start'` | Last-row policy: 'justify' scales the leftover row to fill the width like every other row, 'start' keeps the row height aligned to the reading start, 'hide' hides the leftover thumbnails. _Since V3.0.0._ |
| `justifiedMaxScale` | `number` | `1.75` | Row-height clamp as a multiple of justifiedRowHeight, a sparse row never renders taller than this. _Since V3.0.0._ |
| `justifiedReveal` | `"image" \| "row"` | `'row'` | How thumbnails appear as they load: 'row' reveals whole rows top to bottom, each once every thumbnail in it has loaded; 'image' reveals each thumbnail on its own as soon as it has loaded. Until a thumbnail is revealed its box shows as a placeholder. See [Justified layout](https://www.lightgalleryjs.com/docs/justified-layout/). _Since V3.0.0._ |
| `justifiedRowHeight` | `number` | `180` | Row height (px) the layout aims for; actual rows land as close to it as the aspect ratios allow. _Since V3.0.0._ |

## Video plugin

Video plugin is required to display videos in lightGallery. Video plugin
supports YouTube, Vimeo, Wistia and HTML5 videos.

> **Player scripts** - Vimeo and Wistia player control (automatic play and pause, moving to the next slide when a video ends) needs each provider's player script. The plugin loads [player.js](https://github.com/vimeo/player.js/) and the [Wistia player API](https://wistia.com/support/developers/player-api) on demand the first time a video plays, so there is nothing to include yourself.

> Plugin dependency: include the Video plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `autoplayFirstVideo` | `boolean` | `true` | Enable/Disable first video autoplay. Autoplay has to be managed using this setting. Autoplay in PlayerParams doesn't have any effect. |
| `autoplayVideoOnSlide` | `boolean` | `false` | Autoplay video on slide change Make sure you set preload:"none" |
| `gotoNextSlideOnVideoEnd` | `boolean` | `true` | Go to next slide when video is ended Note - this doesn't work with YouTube videos at the moment |
| `videoFacade` | `boolean` | `true` | Render provider video slides (YouTube/Vimeo/Wistia) as lite facades: a poster with a play button, with the provider iframe created only when the user presses play. The facade poster falls back from the item poster to the YouTube thumbnail endpoint (see loadYouTubePoster) to the item thumb; a slide with no resolvable poster keeps the previous eager-iframe behavior. Note autoplayFirstVideo/autoplayVideoOnSlide force an immediate materialize by design. Set false for 2.x eager-iframe behavior on all provider slides. See [Video facades](https://www.lightgalleryjs.com/docs/video-facades/). _Since V3.0.0._ |
| `videojs` | `boolean` | `false` | Enable videojs custom video player **Dependency** - You need to include [videoJs](https://videojs.com/) on your document to enable videojs player |
| `videojsOptions` | `any` | `{}` | Videojs player options |
| `videojsTheme` | `string` | `''` | Class name of the videojs theme You need to include the theme stylesheet on your document. [More info](https://videojs.com/getting-started/#home-page-themes) _Since V2.5.0._ |
| `vimeoPlayerParams` | `PlayerParams` | `false` | Change Vimeo player parameters. You can find the list of vimeo player parameters from the following link [Vimeo player parameters](https://developer.vimeo.com/player/embedding#universal-parameters) |
| `wistiaPlayerParams` | `any` | `false` | Change Wistia player parameters. You can find the list of Wistia player parameters from the following link [Wistia player parameters](https://wistia.com/support/developers/embed-options#using-embed-options) |
| `youTubeNoCookie` | `boolean` | `true` | Embed YouTube videos through the privacy-enhanced youtube-nocookie.com host. Set false to embed through youtube.com instead. Slide URLs that already point at youtube-nocookie.com always keep it. See [Video facades](https://www.lightgalleryjs.com/docs/video-facades/). _Since V3.0.0._ |
| `youTubePlayerParams` | `any` | `false` | Change YouTube player parameters. You can find the list of YouTube player parameters from the following link [YouTube player parameters](https://developers.google.com/youtube/player_parameters) |

## Hash plugin

lightGallery hash plugin lets you provide custom unique URLs for each gallery
image. This link can be used to share media anywhere on the web. It allows you
to navigate to different slides via browser back/forward buttons too.

> Plugin dependency: include the Hash plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `customSlideName` | `boolean` | `false` | Custom slide name to use in the url when hash plugin is enabled |
| `galleryId` | `string` | `'1'` | Unique id for each gallery. It is mandatory when you use hash plugin for multiple galleries on the same page. |
| `hash` | `boolean` | `true` | Enable/Disable hash option |
| `hashDriver` | `HashDriverPreference` | `'auto'` | URL engine behind the hash syncing. 'auto' uses the Navigation API where the browser supports it and falls back to the History API everywhere else; 'history' and 'navigation' force an engine (an unsupported 'navigation' quietly falls back, the enhancement is never load-bearing). The deep-link URL format is identical either way. See [Hash drivers](https://www.lightgalleryjs.com/docs/hash-drivers/). _Since V3.0.0._ |

## Autoplay plugin

lightGallery autoplay plugin supports automatic slideshow which can be stopped
on the first user action. It supports progress bar that indicates the duration
of the current slide. After the last slide the slideshow continues from the
first; see [stopping autoplay at the end](/docs/troubleshooting/#autoplay-restarts-from-the-first-slide-instead-of-stopping).

> Plugin dependency: include the Autoplay plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `appendAutoplayControlsTo` | `string` | `'.lg-toolbar'` | Specify where the autoplay controls should be appended. |
| `autoplay` | `boolean` | `true` | Enable autoplay plugin |
| `autoplayControls` | `boolean` | `true` | Show/hide autoplay controls. |
| `autoplayPluginStrings` | `Partial` |  | Custom translation strings for aria-labels _Deprecated: Set these labels on the core strings object instead, every user-facing string lives in that one contract. An explicitly set key here still wins (alias)._ |
| `forceSlideShowAutoplay` | `boolean` | `false` | If false autoplay will be stopped after first user action |
| `progressBar` | `boolean` | `true` | Show autoplay progressBar |
| `slideShowAutoplay` | `boolean` | `false` | Enable slideshow autoplay |
| `slideShowInterval` | `number` | `5000` | The time (in ms) between each auto transition. The countdown starts once the slide on screen has loaded, so a slow connection never advances past an image before it is visible. |

## Rotate plugin

The rotate plugin adds rotate clockwise, rotate anticlockwise, flip horizontal
and flip vertical, each with a single click.

> Plugin dependency: include the Rotate plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `flipHorizontal` | `boolean` | `true` | Enable flip horizontal. |
| `flipVertical` | `boolean` | `true` | Enable flip vertical. |
| `rotate` | `boolean` | `true` | Enable/Disable rotate option |
| `rotateLeft` | `boolean` | `true` | Enable rotate left. |
| `rotatePluginStrings` | `Partial` |  | Custom translation strings for aria-labels _Deprecated: Set these labels on the core strings object instead, every user-facing string lives in that one contract. An explicitly set key here still wins (alias)._ |
| `rotateRight` | `boolean` | `true` | Enable rotate right. |
| `rotateSpeed` | `number` | `400` | Rotate speed in milliseconds |

## Share plugin

lightGallery share plugin allows you to share your images/videos to social media
platforms such as X (Twitter) or Facebook with unique url. It supports adding your
own social share button too.

> Plugin dependency: include the Share plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `additionalShareOptions` | `ShareOption[]` | `[]` | Array of additional share options This can be used to build additional share options. [Demo](https://www.lightgalleryjs.com/demos/share/) |
| `facebook` | `boolean` | `true` | Enable Facebook share. |
| `facebookDropdownText` | `string` | `'Facebook'` | Facebook dropdown text. |
| `pinterest` | `boolean` | `true` | Enable Pinterest share. |
| `pinterestDropdownText` | `string` | `'Pinterest'` | Pinterest dropdown text. |
| `preferNativeShare` | `boolean` |  | Prefer the OS share sheet (navigator.share) over the dropdown menu when the browser supports it. The share button then opens the native sheet with the slide's URL (per-item shareUrl, falling back to the network share URLs, then the page URL); the dropdown remains as the automatic fallback. URL-sharing only, the image file itself is never attached. Defaults to true on touch devices and false on desktop, where the branded dropdown is kept for consistency. See [Web Share](https://www.lightgalleryjs.com/docs/web-share/). _Since V3.0.0._ |
| `share` | `boolean` | `true` | Enable/Disable share options |
| `sharePluginStrings` | `Partial` |  | Custom translation strings for aria-labels _Deprecated: Set these labels on the core strings object instead, every user-facing string lives in that one contract. An explicitly set key here still wins (alias)._ |
| `twitter` | `boolean` | `true` | Enable Twitter share. |
| `twitterDropdownText` | `string` | `'X'` | Twitter dropdown text. |

## Pager plugin

If you prefer minimal layouts, you can opt pagers plugin instead of thumbnails
using the pager plugin. Pagers create minimal graphics that represent each
slide, and hovering over each pager item, shows the correspondent thumbnails.

> Plugin dependency: include the Pager plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pager` | `boolean` | `true` | Enable/Disable pager option |

## FullScreen plugin

The fullscreen plugin uses the browser's native fullscreen API. You can toggle
fullscreen with one click.

> Plugin dependency: include the FullScreen plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `fullScreen` | `boolean` | `true` | Enable/Disable fullscreen option |
| `fullscreenPluginStrings` | `Partial` |  | Custom translation strings for aria-labels _Deprecated: Set these labels on the core strings object instead, every user-facing string lives in that one contract. An explicitly set key here still wins (alias)._ |

## Comment box plugin

The comment plugin supports Facebook and Disqus comments out of the box, so
people can comment on slides with their Facebook or Disqus accounts. You can
add your own comment widget as well.

> Plugin dependency: include the Comment box plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `commentBox` | `boolean` | `false` | Enable comment box |
| `commentPluginStrings` | `Partial` |  | Custom translation strings for aria-labels _Deprecated: Set these labels on the core strings object instead, every user-facing string lives in that one contract. An explicitly set key here still wins (alias)._ |
| `commentsMarkup` | `string` | `'Leave a comment.'` | Facebook comments default markup |
| `disqusComments` | `boolean` | `false` | Enable Disqus comment box |
| `disqusConfig` | `function` | `{ title: undefined, language: 'en', }` | Disqus comment config |
| `fbComments` | `boolean` | `false` | Enable Facebook comment box |

## Medium zoom plugin

The medium zoom plugin opens an image in place with a minimal interface, the
zooming experience seen on Medium: no toolbar, no thumbnails, and a click
closes it again.

> Plugin dependency: include the Medium zoom plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `backgroundColor` | `string` | `'#000'` | Background color for the gallery This can be overwritten by passing background color via data-lg-background-color for each item |
| `margin` | `number` | `40` | Space between the gallery outer area and images |
| `mediumZoom` | `boolean` | `true` | Enable/Disable medium like zoom experience |

## Vimeo thumbnails plugin

The Vimeo thumbnails plugin loads thumbnails for Vimeo videos automatically.

> Plugin dependency: include the Vimeo Thumbnails plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `showThumbnailWithPlayButton` | `boolean` | `false` | Show thumbnails with play button |
| `showVimeoThumbnails` | `boolean` | `true` | Auto load thumbnails for Vimeo videos |

## Relative caption plugin

The relative caption plugin places each caption relative to its image instead
of at the bottom of the gallery.

> Plugin dependency: include the Relative caption plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `relativeCaption` | `boolean` | `false` | Enable/Disable relative captions |

## Origin crop plugin

Origin crop plugin flies the zoom-from-origin animation from a cropped
thumbnail's crop, so a cover-fitted grid tile grows into the full photo
instead of being squashed into its box.
<span class="badge rounded-pill bg-danger font-12" title="Available since version 3.0.0">v3.0.0</span>

> Plugin dependency: include the Origin crop plugin to use these options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `originCrop` | `boolean` | `true` | Enable/Disable the origin crop plugin: zoom-from-origin flights from cropped thumbnails (`object-fit: cover`, `background-size: cover`) start from the part of the image the thumbnail shows, at a uniform scale, and reveal the rest around it. See [Zoom from origin](https://www.lightgalleryjs.com/demos/zoom-from-origin/). _Since V3.0.0._ |
