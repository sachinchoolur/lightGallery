// Demo-gallery runtime: the Hugo site's app.js gallery initializers,
// running on the v3 vanilla `lightgallery` package (workspace build)
// instead of the bundled v2 UMD globals. Body below is ported from
// site/assets/js/app.js (id-guarded per demo, exactly as before);
// only this bootstrap is new. Carousel vendors (Swiper/slick/flickity/
// owl/videojs) stay page-provided globals — their sections are
// element-guarded and only run on their own demo pages. The trigger
// grids run on lightGallery's own justified layout plugin; jQuery
// loads only for the jQuery-plugin carousels (slick/owl).
import { getJustifiedLayout, parseImageSize } from '@lightgallery/headless';
import lightGallery from 'lightgallery';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgComment from 'lightgallery/plugins/comment';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgHash from 'lightgallery/plugins/hash';
import lgJustified from 'lightgallery/plugins/justified';
import lgMediumZoom from 'lightgallery/plugins/mediumZoom';
import lgPager from 'lightgallery/plugins/pager';
import lgRotate from 'lightgallery/plugins/rotate';
import lgShare from 'lightgallery/plugins/share';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';
import lgZoom from 'lightgallery/plugins/zoom';

// Layout/carousel vendors, loaded as classic scripts (see load-vendor).
import { loadVendor } from './load-vendor.js';
import jQueryUrl from './vendor/jQuery.js?url';
import masonryUrl from './vendor/masonry.pkgd.min.js?url';
import imagesLoadedUrl from './vendor/imagesloaded.pkgd.js?url';
import swiperUrl from './vendor/swiper-bundle.min.js?url';
import flickityUrl from './vendor/flickity.pkgd.min.js?url';
import slickUrl from './vendor/slick.min.js?url';
import owlUrl from './vendor/owl.carousel.min.js?url';

window.lightGallery = lightGallery;
await loadVendor(masonryUrl);
const Masonry = window.Masonry;
await loadVendor(imagesLoadedUrl);
const imagesLoaded = window.imagesLoaded;

// Carousel vendors load only on their own demo pages (the init sections
// below are element-guarded, exactly like the Hugo app.js). slick and
// owl are jQuery plugins — jQuery rides along for those two pages only.
let Swiper;
if (document.getElementById('lg-swipper')) {
    await loadVendor(swiperUrl);
    Swiper = window.Swiper;
}
let Flickity;
if (document.querySelector('#flickity-carousel-gallery-demo')) {
    await loadVendor(flickityUrl);
    Flickity = window.Flickity;
}
if (document.getElementById('slick-carousel-gallery-demo')) {
    await loadVendor(jQueryUrl);
    await loadVendor(slickUrl);
}
if (document.getElementById('owl-carousel-gallery-demo')) {
    await loadVendor(jQueryUrl);
    await loadVendor(owlUrl);
}

// Justified trigger grids: the justified layout plugin positions the
// thumbnails during lightGallery init — one call replaces the old
// two-step layout + lightbox wiring.
function lightGalleryJustified(id, settings = {}) {
    const el = document.getElementById(id);
    if (!el) {
        return null;
    }
    return window.lightGallery(el, {
        justifiedRowHeight: 180,
        justifiedGap: 5,
        justifiedLastRow: 'justify',
        ...settings,
        plugins: [...(settings.plugins || []), lgJustified],
    });
}

// Standalone justified grid (no lightbox bound to the grid element):
// the same headless row math the plugin uses, applied directly.
function justifyGrid(container, { rowHeight = 180, gap = 5 } = {}) {
    const items = Array.from(container.children);
    if (!items.length) {
        return;
    }
    container.classList.add('lg-justified');
    items.forEach((item) => item.classList.add('lg-justified-item'));
    const layout = () => {
        const containerWidth = container.clientWidth;
        if (!containerWidth) {
            return;
        }
        const ratios = items.map((item) => {
            const size = parseImageSize(
                item.getAttribute('data-lg-size') || undefined,
                window.innerWidth,
            );
            if (size) {
                return size.width / size.height;
            }
            const img = item.querySelector('img');
            return img && img.complete && img.naturalWidth > 0
                ? img.naturalWidth / img.naturalHeight
                : 1;
        });
        const { boxes, containerHeight } = getJustifiedLayout({
            ratios,
            containerWidth,
            targetRowHeight: rowHeight,
            gap,
            lastRow: 'justify',
        });
        container.style.height = `${containerHeight}px`;
        items.forEach((item, index) => {
            const box = boxes[index];
            item.style.top = `${box.top}px`;
            item.style.left = `${box.start}px`;
            item.style.width = `${box.width}px`;
            item.style.height = `${box.height}px`;
        });
    };
    layout();
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(layout).observe(container);
    }
}

function getResponsiveThumbnailsSettings() {
    if (window.innerWidth < 768) {
        return {
            thumbWidth: 30,
            thumbHeight: '20px',
            thumbMargin: 2,
        };
    } else {
        return {
            thumbWidth: 100,
            thumbHeight: '80px',
            thumbMargin: 5,
        };
    }
}

const $lgInlineContainer = document.getElementById('inline-gallery-container');
if ($lgInlineContainer) {
    const inlineGallery = window.lightGallery($lgInlineContainer, {
        container: $lgInlineContainer,
        dynamic: true,
        thumbnail: true,
        swipeToClose: false,
        addClass: 'lg-inline',
        mode: 'lg-scale-up',
        slideShowAutoplay: true,
        hash: false,
        pager: false,
        closable: false,
        showMaximizeIcon: true,
        rotate: true,
        download: true,
        slideDelay: 400,
        plugins: [
            lgZoom,
            lgAutoplay,
            lgFullscreen,
            lgShare,
            lgThumbnail,
            lgRotate,
        ],
        appendSubHtmlTo: '.lg-item',
        ...getResponsiveThumbnailsSettings(),
        dynamicEl: [
            {
                src: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
                    <p>Published on November 13, 2018</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
                    <p>Published on September 14, 2016</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
                    <p>Published on May 8, 2020</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                    <p>Description of the slide 4</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@charlespostiaux">Charles Postiaux</a></h4>
                    <p>Published on November 24, 2018</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@bruno_adam">Bruno Adam</a></h4>
                    <p>Published on January 6, 2021</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@sigmund">Sigmund</a></h4>
                    <p>Published on November 6, 2019</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@chow_parij">Parij Borgohain</a></h4>
                    <p>Published on January 19, 2020</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@inespiazzese">Ines Piazzese</a></h4>
                    <p>Published on September 1, 2020</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@rdsaunders">Richard Saunders</a></h4>
                    <p>Published on June 19, 2019</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@jalanmeier">J. Meier</a></h4>
                    <p>Published on October 17, 2019</p>
                </div>`,
            },
            {
                src: 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                    <p>Published on October 6, 2020</p>
                </div>`,
            },
        ],
    });
    inlineGallery.openGallery();
}

window.lightGallery(
    document.getElementById('gallery-demo-animated-thumbnails'),
    {
        pager: false,
        hash: false,
        plugins: [
            lgZoom,
            lgAutoplay,
            lgFullscreen,
            lgPager,
            lgRotate,
            lgShare,
            lgThumbnail,
            lgVideo,
        ],
        ...getResponsiveThumbnailsSettings(),
    },
);

lightGalleryJustified('animated-thumbnails-wp', {
    justifiedRowHeight: 120,
    justifiedLastRow: 'hide',
    autoplayFirstVideo: false,
    pager: false,
    galleryId: 'nature',
    plugins: [
        lgZoom,
        lgAutoplay,
        lgHash,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgThumbnail,
        lgVideo,
    ],
    ...getResponsiveThumbnailsSettings(),
    preload: 3,
    videoMaxWidth: '1400px',
    mobileSettings: {
        controls: false,
        showCloseIcon: false,
        download: false,
        rotate: false,
    },
});
lightGalleryJustified('animated-thumbnails-gallery', {
    justifiedLastRow: 'hide',
    autoplayFirstVideo: false,
    pager: false,
    galleryId: 'nature',
    plugins: [
        lgZoom,
        lgAutoplay,
        lgHash,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgThumbnail,
        lgVideo,
    ],
    ...getResponsiveThumbnailsSettings(),
    preload: 3,
    videoMaxWidth: '1400px',
    mobileSettings: {
        controls: false,
        showCloseIcon: false,
        download: false,
        rotate: false,
    },
});

const masonryElMixed = document.getElementById('static-thumbnails-gallery');
if (masonryElMixed) {
    imagesLoaded(
        document.getElementById('static-thumbnails-gallery'),
        function () {
            new Masonry(masonryElMixed, {
                temSelector: '.gallery-item',
                percentPosition: true,
                gutter: 0,
            });
            window.lightGallery(masonryElMixed, {
                animateThumb: false,
                pager: false,
                plugins: [lgZoom, lgAutoplay, lgFullscreen, lgThumbnail],
                hash: false,
                zoomFromOrigin: false,
                toggleThumb: true,
                allowMediaOverlap: true,
            });
        },
    );
}

lightGalleryJustified('customize-thumbnails-gallery', {
    justifiedLastRow: 'hide',
    animateThumb: false,
    addClass: 'lg-custom-thumbnails',
    appendThumbnailsTo: '.lg-outer',
    pager: false,
    hash: false,
    plugins: [lgZoom, lgAutoplay, lgFullscreen, lgThumbnail],
    allowMediaOverlap: true,
});

const galleryEventsDemo = document.getElementById('gallery-events-demo');

if (galleryEventsDemo) {
    const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];
    galleryEventsDemo.addEventListener('lgBeforeSlide', (event) => {
        const { index } = event.detail;
        document.querySelector('.lg-backdrop').style.backgroundColor =
            colours[index];
    });
    lightGalleryJustified('gallery-events-demo', {
        zoom: false,
        thumbnail: false,
        addClass: 'lg-events-demo-outer',
        rotate: false,
        pager: false,
        plugins: [],
        hash: false,
        fullScreen: false,
        download: false,
    });
}

let customTransitionsGallery;

function customTransitions(trans) {
    customTransitionsGallery = lightGalleryJustified(
        'gallery-transitions-demo',
        {
            mode: trans,
            zoom: false,
            thumbnail: false,
            rotate: false,
            pager: false,
            plugins: [],
            hash: false,
            fullScreen: false,
            download: false,
        },
    );
}
customTransitions('lg-slide');

document.getElementById('select-trans')?.addEventListener('change', (event) => {
    customTransitionsGallery.destroy();
    customTransitions(event.target.value);
});

let customEasingGallery;

function initCustomEasing(easing) {
    customEasingGallery = lightGalleryJustified('gallery-custom-easing-demo', {
        easing: easing,
        zoom: false,
        thumbnail: false,
        rotate: false,
        pager: false,
        hash: false,
        plugins: [],
        speed: 1000,
        fullScreen: false,
        download: false,
    });
}
initCustomEasing('cubic-bezier(0.680, -0.550, 0.265, 1.550)');
document
    .getElementById('select-easing')
    ?.addEventListener('change', (event) => {
        const val = event.target.value;
        prompt('You can copy cubic-bezier from here', val);
        customEasingGallery.destroy();
        initCustomEasing('cubic-bezier(' + val + ')');
    });

let methodsInstance;
const $lgGalleryMethodsDemo = document.getElementById('gallery-methods-demo');
if ($lgGalleryMethodsDemo) {
    $lgGalleryMethodsDemo.addEventListener('lgInit', () => {
        const previousBtn =
            '<button type="button" aria-label="Previous slide" class="lg-prev"> Prev Slide </button>';
        const nextBtn =
            '<button type="button" aria-label="Next slide" class="lg-next"> Next Slide </button>';
        const $lgContainer = document.querySelector('.lg-content');
        $lgContainer.insertAdjacentHTML('beforeend', nextBtn);
        $lgContainer.insertAdjacentHTML('beforeend', previousBtn);
        document.querySelector('.lg-next').addEventListener('click', () => {
            methodsInstance.goToNextSlide();
        });
        document.querySelector('.lg-prev').addEventListener('click', () => {
            methodsInstance.goToPrevSlide();
        });
    });
    methodsInstance = lightGalleryJustified('gallery-methods-demo', {
        zoom: false,
        thumbnail: false,
        rotate: false,
        fullScreen: false,
        plugins: [lgZoom],
        addClass: 'lg-methods-demo',
        controls: false,
        download: false,
        pager: false,
        hash: false,
    });
}

const lgDemoUpdateSlides = document.getElementById(
    'gallery-update-slides-demo',
);
let updateSlidesGallery = null;
let slidesUpdated = false;
if (lgDemoUpdateSlides) {
    lgDemoUpdateSlides.addEventListener('lgAfterClose', () => {
        if (slidesUpdated) {
            // refresh() rewires the trigger clicks and the justified
            // plugin relays the grid out for the new trigger set.
            updateSlidesGallery.refresh();
            slidesUpdated = false;
        }
    });
    lgDemoUpdateSlides.addEventListener('lgInit', (event) => {
        let updateSlideInstance = event.detail.instance;
        const addBtn =
            '<button type="button" aria-label="Add slide" class="lg-icon" id="lg-add"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 13h3v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg></button>';
        const deleteBtn =
            '<button class="lg-icon" type="button" aria-label="Remove slide" class="lg-icon" id="lg-delete"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg></button>';

        updateSlideInstance.outer.find('.lg-toolbar').append(deleteBtn);
        updateSlideInstance.outer.find('.lg-toolbar').append(addBtn);
        updateSlideInstance.outer.find('#lg-add').on('click', () => {
            let galleryItems = [
                ...updateSlideInstance.galleryItems,
                ...[
                    {
                        src: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80',
                        thumb: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100',
                        subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                    <p>Description of the slide 1</p>
                </div>`,
                    },
                ],
            ];
            lgDemoUpdateSlides.insertAdjacentHTML(
                'beforeend',
                `<a
            data-lg-size="1600-1067"
            data-src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Fading Light</h4><p>layers of blue.</p>"
        >
            <img
                alt="Captions"
                class="img-responsive lg-added-item"
                src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100"
            />
        </a>`,
            );
            updateSlideInstance.updateSlides(
                galleryItems,
                updateSlideInstance.index,
            );
            slidesUpdated = true;
        });
        updateSlideInstance.outer.find('#lg-delete').on('click', () => {
            let galleryItems = JSON.parse(
                JSON.stringify(updateSlideInstance.galleryItems),
            );
            galleryItems.shift();
            updateSlideInstance.updateSlides(galleryItems, 1);
            lgDemoUpdateSlides.firstElementChild.remove();
            slidesUpdated = true;
        });
    });
    updateSlidesGallery = lightGalleryJustified('gallery-update-slides-demo', {
        justifiedLastRow: 'start',
        addClass: 'lg-update-slide-demo',
        controls: false,
        pager: false,
        hash: false,
        plugins: [lgZoom, lgAutoplay, lgFullscreen, lgShare, lgThumbnail],
        download: false,
    });
}

// Dynamic mode
const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
const dynamicEl = [
    {
        src: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
        thumb: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
        thumb: 'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
        thumb: 'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
        thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
];
const dynamicGallery = window.lightGallery($dynamicGallery, {
    dynamic: true,
    hash: false,
    rotate: false,
    plugins: [
        lgZoom,
        lgAutoplay,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgVideo,
    ],
    dynamicEl: dynamicEl,
});
$dynamicGallery?.addEventListener('click', function () {
    dynamicGallery.openGallery(2);
});

//dynamic mode image

const $dynamicimgGallery = document.getElementById('dynamic-mode-images');
const dynamicimgEl = [
    {
        src: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
        thumb: 'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },

    {
        src: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2407&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1596370743446-6a7ef43a36f9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1596370743446-6a7ef43a36f9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1510011560141-62c7e8fc7908?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1510011560141-62c7e8fc7908?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1586276393635-5ecd8a851acc?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1586276393635-5ecd8a851acc?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1471931452361-f5ff1faa15ad?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1471931452361-f5ff1faa15ad?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src: 'https://images.unsplash.com/photo-1610448721566-47369c768e70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80',
        thumb: 'https://images.unsplash.com/photo-1610448721566-47369c768e70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
];
const dynamicimgGallery = window.lightGallery($dynamicimgGallery, {
    dynamic: true,
    hash: false,
    rotate: false,
    plugins: [
        lgZoom,
        lgAutoplay,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgVideo,
    ],
    dynamicEl: dynamicimgEl,
});
$dynamicimgGallery?.addEventListener('click', function () {
    dynamicimgGallery.openGallery(5);
});

const dynamicThumbnailsGrid = document.getElementById(
    'gallery-dynamic-thumbnails',
);
if (dynamicThumbnailsGrid) {
    Array.from(dynamicThumbnailsGrid.querySelectorAll('.gallery-item')).forEach(
        (item, index) => {
            item.addEventListener('click', () => {
                dynamicimgGallery.openGallery(index);
            });
        },
    );
    justifyGrid(dynamicThumbnailsGrid);
}

document
    .getElementById('dynamic-gallery-demo-load-more')
    ?.addEventListener('click', () => {
        const newItems = [
            {
                src: 'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
            },
            {
                src: 'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb: 'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
            },
        ];
        const updatedDynamicElements = [...dynamicEl, ...newItems];
        dynamicGallery.refresh(updatedDynamicElements);
        dynamicGallery.openGallery(4);
    });

window.lightGallery(document.getElementById('open-website'), {
    selector: 'this',
    download: false,
    mobileSettings: {
        controls: true,
    },
});
window.lightGallery(document.getElementById('open-google-map'), {
    selector: 'this',
    download: false,
    mobileSettings: {
        controls: true,
    },
});
window.lightGallery(document.getElementById('open-pdf'), {
    selector: 'this',
    download: false,
    mobileSettings: {
        controls: true,
    },
});

lightGalleryJustified('gallery-videos-demo', {
    thumbnail: false,
    pager: false,
    plugins: [lgAutoplay, lgFullscreen, lgShare, lgThumbnail, lgVideo],
    hash: false,
    preload: 0,
});
lightGalleryJustified('gallery-videojs-demo', {
    //thumbnail: false,
    pager: false,
    hash: false,
    preload: 0,
    plugins: [lgAutoplay, lgFullscreen, lgShare, lgThumbnail, lgVideo],
    videojs: true,
    videojsOptions: {
        muted: true,
    },
});
lightGalleryJustified('gallery-hash-demo', {
    thumbnail: false,
    plugins: [lgHash],
    pager: false,
    galleryId: 1,
    customSlideName: false,
});
lightGalleryJustified('gallery-custom-hash-demo', {
    thumbnail: false,
    plugins: [
        lgZoom,
        lgHash,
        lgAutoplay,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgThumbnail,
        lgVideo,
    ],
    galleryId: 2,
    pager: false,
    customSlideName: true,
});
lightGalleryJustified('gallery-share-demo', {
    thumbnail: false,
    pager: false,
    hash: true,
    plugins: [lgZoom, lgShare, lgThumbnail, lgHash],
});
lightGalleryJustified('gallery-zoom-from-origin-demo', {
    thumbnail: false,
    pager: false,
    hash: true,
    plugins: [lgZoom, lgShare, lgThumbnail, lgHash],
});
lightGalleryJustified('gallery-captions-demo', {
    thumbnail: false,
    plugins: [lgZoom, lgShare],
    allowMediaOverlap: true,
    pager: true,
    hash: true,
});
lightGalleryJustified('gallery-animated-captions-demo', {
    speed: 500,
    allowMediaOverlap: true,
    // Append caption inside the slide item
    // to apply some animation for the captions (Optional)
    appendSubHtmlTo: '.lg-item',
    // Delay slide transition to complete captions animations
    // before navigating to different slides (Optional)
    // You can find caption animation demo on the captions demo page
    slideDelay: 400,
});
lightGalleryJustified('gallery-srcset-demo', {
    thumbnail: false,
    plugins: [lgZoom, lgShare],
    allowMediaOverlap: true,
    pager: true,
    hash: true,
});
lightGalleryJustified('gallery-picture-demo', {
    thumbnail: false,
    plugins: [lgZoom, lgShare],
    allowMediaOverlap: true,
    pager: true,
    hash: true,
});
lightGalleryJustified('responsive-images-demo', {
    thumbnail: false,
    pager: true,
    hash: true,
    plugins: [lgAutoplay, lgThumbnail],
});
lightGalleryJustified('gallery-fb-comments-demo', {
    thumbnail: false,
    pager: false,
    hash: true,
    plugins: [lgZoom, lgComment, lgShare, lgThumbnail],
    commentBox: true,
    disqusComments: false,
    fbComments: true,
});
lightGalleryJustified('gallery-disqus-comments-demo', {
    thumbnail: false,
    pager: false,
    hash: true,
    plugins: [lgComment, lgRotate],
    commentBox: true,
    disqusComments: true,
    fbComments: false,
});
lightGalleryJustified('gallery-mixed-content-demo', {
    thumbnail: false,
    pager: false,
    hash: true,
    plugins: [
        lgZoom,
        lgAutoplay,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgThumbnail,
        lgVideo,
    ],
});
lightGalleryJustified('gallery-mixed-content-all-demo', {
    justifiedRowHeight: 130,
    justifiedLastRow: 'start',
    thumbnail: false,
    pager: false,
    hash: true,
    plugins: [
        lgZoom,
        lgAutoplay,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgThumbnail,
        lgVideo,
    ],
});
lightGalleryJustified('gallery-share-reddit-demo', {
    thumbnail: false,
    pager: false,
    hash: true,
    galleryId: 2,
    plugins: [lgZoom, lgAutoplay, lgHash, lgFullscreen, lgShare, lgThumbnail],
    addClass: 'lg-custom-share-demo',
    extraProps: ['redditTitle'],
    additionalShareOptions: [
        {
            selector: '.lg-share-reddit',
            dropdownHTML:
                '<li class="lg-share-item-reddit"><a class="lg-share-reddit" target="_blank"><svg class="lg-reddit" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><title>reddit</title><path d="M8 20c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20 20c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20.097 24.274c0.515-0.406 1.262-0.317 1.668 0.198s0.317 1.262-0.198 1.668c-1.434 1.13-3.619 1.86-5.567 1.86s-4.133-0.73-5.567-1.86c-0.515-0.406-0.604-1.153-0.198-1.668s1.153-0.604 1.668-0.198c0.826 0.651 2.46 1.351 4.097 1.351s3.271-0.7 4.097-1.351zM32 16c0-2.209-1.791-4-4-4-1.504 0-2.812 0.83-3.495 2.057-2.056-1.125-4.561-1.851-7.29-2.019l2.387-5.36 4.569 1.319c0.411 1.167 1.522 2.004 2.83 2.004 1.657 0 3-1.343 3-3s-1.343-3-3-3c-1.142 0-2.136 0.639-2.642 1.579l-5.091-1.47c-0.57-0.164-1.173 0.116-1.414 0.658l-3.243 7.282c-2.661 0.187-5.102 0.907-7.114 2.007-0.683-1.227-1.993-2.056-3.496-2.056-2.209 0-4 1.791-4 4 0 1.635 0.981 3.039 2.387 3.659-0.252 0.751-0.387 1.535-0.387 2.341 0 5.523 6.268 10 14 10s14-4.477 14-10c0-0.806-0.134-1.589-0.387-2.34 1.405-0.62 2.387-2.025 2.387-3.66zM27 5.875c0.621 0 1.125 0.504 1.125 1.125s-0.504 1.125-1.125 1.125-1.125-0.504-1.125-1.125 0.504-1.125 1.125-1.125zM2 16c0-1.103 0.897-2 2-2 0.797 0 1.487 0.469 1.808 1.145-1.045 0.793-1.911 1.707-2.552 2.711-0.735-0.296-1.256-1.016-1.256-1.856zM16 29.625c-6.42 0-11.625-3.414-11.625-7.625s5.205-7.625 11.625-7.625c6.42 0 11.625 3.414 11.625 7.625s-5.205 7.625-11.625 7.625zM28.744 17.856c-0.641-1.003-1.507-1.918-2.552-2.711 0.321-0.676 1.011-1.145 1.808-1.145 1.103 0 2 0.897 2 2 0 0.84-0.52 1.56-1.256 1.856z"></path></svg><span class="lg-dropdown-text">Reddit</span></a></li>',
            generateLink: (galleryItem) => {
                const url = encodeURIComponent(window.location.href);
                const title = galleryItem.redditTitle;
                const redditShareLink = `//reddit.com/submit?url=${url}&title=${title}`;
                return redditShareLink;
            },
        },
    ],
});

// var rellax = new Rellax('.vertical-gallery .gallery-item', {
//     center: true,
// });

lightGallery(document.getElementById('gallery-demo-super-customizable'), {
    pager: false,
    hash: false,
    mode: 'lg-zoom-in-out',
    selector: '.gallery-item',
    addClass: 'lightGallery-white-theme',
    plugins: [
        lgZoom,
        lgAutoplay,
        lgFullscreen,
        lgPager,
        lgRotate,
        lgShare,
        lgThumbnail,
        lgVideo,
    ],
    mobileSettings: {
        controls: false,
        showCloseIcon: false,
        download: false,
        rotate: false,
    },
});

const infiniteScrollEl = document.getElementById('infinite-scroll-gallery');
if (infiniteScrollEl) {
    let infiniteScrollingGallery = lightGallery(infiniteScrollEl, {
        plugins: [lgThumbnail, lgZoom],
    });

    const images = `
    <a data-lg-size="1600-1067" data-pinterest-text="Pin it3" data-tweet-text="lightGallery slide  4"
            class="gallery-item"
            data-src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@flovayn' >Jay Mantri</a></h4><p>  Misty shroud over a forest</p>">
            <img class="img-responsive"
                src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80" />
        </a>
        <a data-lg-size="1600-1067" data-pinterest-text="Pin it3" data-tweet-text="lightGallery slide  4"
            class="gallery-item"
            data-src="https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@flovayn' >Florian van Duyn</a></h4><p>Location - <a href='Bled, Slovenia'>Bled, Slovenia</a> </p>">
            <img class="img-responsive"
                src="https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80" />
        </a>
        <a data-lg-size="1600-1126" data-pinterest-text="Pin it3" data-tweet-text="lightGallery slide  4"
            class="gallery-item"
            data-src="https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@juanster' >Juan Davila</a></h4><p>Location - <a href='Bled, Slovenia'>Bled, Slovenia</a> Wooded lake island </p>">
            <img class="img-responsive"
                src="https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80" />
        </a>
        <a data-lg-size="1600-1063" data-pinterest-text="Pin it3" data-tweet-text="lightGallery slide  4"
            class="gallery-item"
            data-src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@davidmarcu' >David Marcu</a></h4><p>Location - <a href='https://unsplash.com/s/photos/ciuca%C8%99-peak%2C-romania'>Ciucaș Peak, Romania</a> Alone in the unspoilt wilderness </p>">
            <img class="img-responsive"
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80" />
        </a>`;
    window.addEventListener('scroll', function () {
        // Load more once the gallery's bottom edge scrolls into view.
        if (
            infiniteScrollEl.getBoundingClientRect().bottom <=
            window.innerHeight
        ) {
            infiniteScrollEl.insertAdjacentHTML('beforeend', images);
            infiniteScrollingGallery.refresh();
        }
    });
}

lightGallery(document.querySelector('.medium-zoom-demo'), {
    selector: '.blog-images',
    plugins: [lgMediumZoom],
});

lightGallery(document.querySelector('.blog-wrapper'), {
    selector: '.blog-images',
    getCaptionFromTitleOrAlt: false,
    backgroundColor: '#FFF',
    plugins: [lgMediumZoom],
});

// var Airtable = require('airtable');

// function subscribe() {
//     const email = $('#subscribe-email').val();

//     var base = new Airtable({ apiKey: 'keyaUjHRn2iCSdyIu' }).base(
//         'appeau7igth6rETjo',
//     );

//     $subscribeBtn.attr('disabled', 'disabled');

//     base('Subscribers').create(
//         [
//             {
//                 fields: {
//                     Email: email,
//                 },
//             },
//         ],
//         function (err) {
//             $subscribeBtn.removeAttr('disabled');
//             $('#subscribe-email').val('');
//             if (err) {
//                 console.error(err);
//                 $('#subscribe').addClass('subscribed-error');
//                 return;
//             }
//             $('#subscribe').addClass('subscribed');
//         },
//     );
// }

// const $subscribeBtn = $('#subscribe-btn');
// $('#subscribe-btn').on('click', subscribe);
// $('#subscribe-email').on('keypress', function (e) {
//     if (e.which == 13) {
//         subscribe();
//     }
// });

let $lgSwiper = document.getElementById('lg-swipper');
if ($lgSwiper) {
    const swiper = new Swiper('.swiper', {
        // other parameters
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init: function () {
                const lg = lightGallery($lgSwiper);
                $lgSwiper.addEventListener('lgBeforeClose', () => {
                    swiper.slideTo(lg.index, 0);
                });
            },
        },
    });
}

const $lgInlineVideoContainer = document.getElementById(
    'inline-video-gallery-container',
);

if ($lgInlineVideoContainer) {
    const _inlineGallery = window.lightGallery($lgInlineVideoContainer, {
        container: $lgInlineVideoContainer,
        dynamic: true,
        thumbnail: true,
        swipeToClose: false,
        addClass: 'lg-inline',
        mode: 'lg-scale-up',
        slideShowAutoplay: false,
        hash: false,
        pager: false,
        closable: false,
        showMaximizeIcon: true,
        rotate: true,
        download: true,
        slideDelay: 400,
        plugins: [
            lgZoom,
            lgAutoplay,
            lgFullscreen,
            lgPager,
            lgRotate,
            lgShare,
            lgThumbnail,
            lgVideo,
        ],
        appendSubHtmlTo: '.lg-item',
        ...getResponsiveThumbnailsSettings(),
        dynamicEl: [
            {
                src: '//vimeo.com/112836958',
                poster: location.origin + '/images/demo/vimeo-video-poster.jpg',
                thumb: location.origin + '/images/demo/vimeo-video-poster.jpg',
                subHtml:
                    "<h4>Nature</h4><p>Video by <a target='_blank' href='https://vimeo.com/charliekaye'>Charlie Kaye</a></p>",
            },
            {
                size: '1280-720',
                src: '//www.youtube.com/watch?v=EIUJfXk3_3w',
                poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
                thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
                subHtml:
                    '<h4>Puffin Hunts Fish To Feed Puffling | Blue Planet II | BBC Earth</h4><p>This puffin parent must go out to sea to feed his chick, but he must evade other birds that would rob him.</p>',
            },
            {
                // HTML5 sources belong under `video` — at the top level the
                // slide reads as an image with no src.
                video: {
                    source: [
                        {
                            src: location.origin + '/videos/video1.mp4',
                            type: 'video/mp4',
                        },
                    ],
                    tracks: [
                        {
                            src: location.origin + '/videos/title.txt',
                            kind: 'captions',
                            srclang: 'en',
                            label: 'English',
                            default: 'true',
                        },
                    ],
                    attributes: { preload: false, controls: true },
                },
                poster: location.origin + '/images/demo/html5-video-poster.jpg',
                thumb: location.origin + '/images/demo/html5-video-poster.jpg',
                subHtml:
                    "<h4>'Peck Pocketed' by Kevin Herron | Disney Favorite</h4>",
            },
            {
                src: 'https://private-sharing.wistia.com/medias/mwhrulrucj',
                poster:
                    location.origin + '/images/demo/wistia-video-poster.jpeg',
                thumb:
                    location.origin + '/images/demo/wistia-video-poster.jpeg',
                subHtml: '<h4>Thank You!</h4><p> Sample Wistia video </p>',
            },
        ],
    });
    _inlineGallery.openGallery();
}

{
    let bootstrapEl = document.getElementById('bootstrap-gallery-carousel');
    if (bootstrapEl) {
        // Bootstrap 5 auto-inits via data-bs-ride; the explicit init
        // only pins the keyboard option.
        window.bootstrap?.Carousel?.getOrCreateInstance(bootstrapEl, {
            keyboard: true,
        });
        const container = document.querySelector('.carousel-inner');
        window.lightGallery(container, {
            thumbnail: true,
            zoomFromOrigin: false,
            pager: false,
            plugins: [lgZoom, lgAutoplay, lgFullscreen, lgRotate, lgShare],
            hash: false,
            preload: 4,
            selector: '.lg-item',
        });
    }

    let owlEl = document.getElementById('owl-carousel-gallery-demo');
    if (owlEl) {
        let owl = window.jQuery('#owl-carousel-gallery-demo');
        owl.on('initialized.owl.carousel', function (event) {
            const container = document.querySelector('.owl-stage');
            window.lightGallery(container, {
                plugins: [
                    lgZoom,
                    lgAutoplay,
                    lgFullscreen,
                    lgRotate,
                    lgShare,
                    lgThumbnail,
                ],
                selector: '.carousel-cell',
            });
        });
        owl.owlCarousel({
            center: true,
            items: 1,
            loop: false,
            margin: 10,
            nav: true,
        });
    }

    let slickEl = document.getElementById('slick-carousel-gallery-demo');
    if (slickEl) {
        var $slickDemo = window.jQuery('#slick-carousel-gallery-demo');

        $slickDemo.on('init', function (event, slick, direction) {
            console.log('Slick slider initialized');
            const container = document.querySelector('.slick-track');
            window.lightGallery(container, {
                pager: false,
                plugins: [
                    lgZoom,
                    lgAutoplay,
                    lgFullscreen,
                    lgRotate,
                    lgShare,
                    lgThumbnail,
                ],
                hash: false,
                preload: 4,
            });
        });
        $slickDemo.slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            customPaging: '10px',
            focusOnSelect: true,
            swipe: false,
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 3,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 1,
                    },
                },
            ],
        });
    }
}

var $flickityLG = document.querySelector('#flickity-carousel-gallery-demo');
if ($flickityLG) {
    var flkty = new Flickity($flickityLG, {
        cellAlign: 'center',
        pageDots: false,
        contain: true,
        autoPlay: true,
        on: {
            ready: function () {
                const container = document.querySelector('.flickity-slider');
                window.lightGallery(container, {
                    selector: '.lg-item',
                    plugins: [
                        lgZoom,
                        lgAutoplay,
                        lgFullscreen,
                        lgRotate,
                        lgShare,
                        lgThumbnail,
                    ],
                });
            },
        },
    });
}

const container = document.querySelector('#bootstrap-image-gallery');
window.lightGallery(container, {
    selector: '.lg-item',
    zoomFromOrigin: true,
    download: true,
    thumbnail: true,
    plugins: [lgZoom, lgAutoplay, lgFullscreen, lgRotate, lgShare, lgThumbnail],
});

const masonryGalleryDemo = document.querySelector('#masonry-gallery-demo');
if (masonryGalleryDemo) {
    const msnry = new Masonry(masonryGalleryDemo, {
        itemSelector: '.lg-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 10,
        horizontalOrder: true,
        fitWidth: true,
    });

    imagesLoaded(masonryGalleryDemo).on('progress', function () {
        // layout Masonry after each image loads
        msnry.layout();
    });
    window.lightGallery(masonryGalleryDemo, {
        thumbnail: true,
        pager: true,
        plugins: [
            lgAutoplay,
            lgFullscreen,
            lgShare,
            lgThumbnail,
            lgVideo,
            lgRotate,
        ],
        hash: false,
        preload: 0,
        selector: '.lg-item',
    });
}

window.lightGallery(document.getElementById('bootstrap-video-gallery'), {
    thumbnail: true,
    pager: true,
    plugins: [
        lgAutoplay,
        lgFullscreen,
        lgShare,
        lgThumbnail,
        lgVideo,
        lgRotate,
    ],
    hash: false,
    preload: 0,
});

window.lightGallery(document.getElementById('bootstrap-video-carousel'), {
    thumbnail: true,
    pager: true,
    plugins: [
        lgAutoplay,
        lgFullscreen,
        lgShare,
        lgThumbnail,
        lgVideo,
        lgRotate,
    ],
    hash: false,
    preload: 0,
    selector: '.lg-item',
});

const $lfYoutubeForm = document.getElementById('thumbnailForm');
if ($lfYoutubeForm) {
    $lfYoutubeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const videoUrl = document.getElementById('url').value;
        if (!videoUrl) {
            alert('Please enter a YouTube video URL');
            return;
        }
        const youtube = videoUrl.match(
            /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i,
        );

        const videoId = youtube && youtube[1];

        if (!videoId) {
            alert('Invalid URL');
            return;
        }
        const qualities = [
            'maxresdefault',
            'hqdefault',
            'sddefault',
            'mqdefault',
            'default',
        ];
        qualities.forEach((q) => {
            const imgUrl = `https://img.youtube.com/vi/${videoId}/${q}.jpg`;
            const container = document.getElementById(q);
            const imgElement = container.querySelector('img');
            const btnElement = container.querySelector('.download-btn');

            imgElement.src = imgUrl;
            btnElement.href = imgUrl;
            imgElement.alt = `Thumbnail ${q}`;
            container.style.display = 'block'; // Unhide the container
        });
        document.getElementById('thumbnail').scrollIntoView();
    });
}

// Justified layout demo page: plugin defaults, then a customized row.
lightGalleryJustified('gallery-justified-layout-demo', {
    justifiedRowHeight: 180,
    justifiedGap: 8,
    justifiedLastRow: 'start',
    pager: false,
    hash: false,
    plugins: [lgZoom, lgThumbnail],
});
lightGalleryJustified('gallery-justified-custom-demo', {
    justifiedRowHeight: 120,
    justifiedGap: 12,
    justifiedLastRow: 'justify',
    pager: false,
    hash: false,
    plugins: [lgZoom, lgThumbnail],
});

// RTL demo page: the grid carries dir="rtl"; direction 'auto' inherits it.
lightGalleryJustified('gallery-rtl-demo', {
    direction: 'auto',
    strings: {
        closeGallery: 'إغلاق المعرض',
        previousSlide: 'الشريحة السابقة',
        nextSlide: 'الشريحة التالية',
        slideAnnouncement: 'صورة {index} من {total}',
    },
    pager: false,
    hash: false,
    plugins: [lgZoom, lgThumbnail],
});

// Virtualization stress demo: 1,000 dynamic slides behind a button, with a
// live mounted-slide/thumb counter proving the DOM stays bounded.
const virtualizationStressHost = document.getElementById(
    'virtualization-stress-demo',
);
if (virtualizationStressHost) {
    const stressSlides = Array.from({ length: 1000 }, (_, i) => ({
        src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
        thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
        subHtml: `<h4>Slide ${i + 1} / 1000</h4>`,
    }));
    const stressGallery = window.lightGallery(virtualizationStressHost, {
        dynamic: true,
        dynamicEl: stressSlides,
        hash: false,
        plugins: [lgThumbnail],
        virtualization: {
            slides: 7,
            thumbs: 'auto',
        },
    });
    const stressStats = document.getElementById(
        'virtualization-stress-demo-stats',
    );
    virtualizationStressHost.addEventListener('lgAfterSlide', (event) => {
        const outer = document.querySelector('.lg-outer');
        if (!outer || !stressStats) {
            return;
        }
        const mountedSlides = outer.querySelectorAll('.lg-item').length;
        const mountedThumbs = outer.querySelectorAll('.lg-thumb-item').length;
        stressStats.textContent =
            `Slide ${event.detail.index + 1} of 1000 — ` +
            `${mountedSlides} slides and ${mountedThumbs} thumbnails in the DOM.`;
    });
    document
        .getElementById('virtualization-stress-demo-open')
        ?.addEventListener('click', () => stressGallery.openGallery(0));
}

// Video facades demo page: facades and the no-cookie host are the defaults;
// stated explicitly so the demo matches its code sample.
lightGalleryJustified('gallery-video-facades-demo', {
    thumbnail: false,
    pager: false,
    hash: false,
    preload: 0,
    videoFacade: true,
    youTubeNoCookie: true,
    // Autoplay forces an immediate materialize by design — keep it off
    // so the facade is what the visitor sees.
    autoplayFirstVideo: false,
    plugins: [lgAutoplay, lgFullscreen, lgThumbnail, lgVideo],
});
