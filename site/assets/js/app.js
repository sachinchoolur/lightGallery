$(window).on('scroll', function () {
    if ($(window).scrollTop() > 50) {
        $('body').addClass('has-fixed-header');
        $('#nav-header').addClass('fixed-header ');
    } else {
        $('body').removeClass('has-fixed-header');
        $('#nav-header').removeClass('fixed-header ');
    }
});

function getResponsiveThumbnailsSettings() {
    if ($(window).width() < 768) {
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
        rotate: false,
        download: false,
        slideDelay: 400,
        plugins: [lgZoom, lgShare, lgAutoplay, lgThumbnail],
        appendSubHtmlTo: '.lg-item',
        ...getResponsiveThumbnailsSettings(),
        dynamicEl: [
            {
                src:
                    'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
                    <p>Published on November 13, 2018</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
                    <p>Published on September 14, 2016</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
                    <p>Published on May 8, 2020</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                    <p>Description of the slide 4</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@charlespostiaux">Charles Postiaux</a></h4>
                    <p>Published on November 24, 2018</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@bruno_adam">Bruno Adam</a></h4>
                    <p>Published on January 6, 2021</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@sigmund">Sigmund</a></h4>
                    <p>Published on November 6, 2019</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@chow_parij">Parij Borgohain</a></h4>
                    <p>Published on January 19, 2020</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@inespiazzese">Ines Piazzese</a></h4>
                    <p>Published on September 1, 2020</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@rdsaunders">Richard Saunders</a></h4>
                    <p>Published on June 19, 2019</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@jalanmeier">J. Meier</a></h4>
                    <p>Published on October 17, 2019</p>
                </div>`,
            },
            {
                src:
                    'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                responsive:
                    'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                thumb:
                    'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
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

jQuery('#animated-thumbnails-wp')
    .justifiedGallery({
        captions: false,
        lastRow: 'hide',
        rowHeight: 120,
        maxRowsCount: 4,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('animated-thumbnails-wp'), {
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
    });
jQuery('#animated-thumbnails-gallery')
    .justifiedGallery({
        captions: false,
        lastRow: 'hide',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('animated-thumbnails-gallery'),
            {
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
            },
        );
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

jQuery('#customize-thumbnails-gallery')
    .justifiedGallery({
        captions: false,
        lastRow: 'hide',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('customize-thumbnails-gallery'),
            {
                animateThumb: false,
                addClass: 'lg-custom-thumbnails',
                appendThumbnailsTo: '.lg-outer',
                pager: false,
                hash: false,
                plugins: [lgZoom, lgAutoplay, lgFullscreen, lgThumbnail],
                allowMediaOverlap: true,
            },
        );
    });

const $galleryEventsDemo = jQuery('#gallery-events-demo');
const galleryEventsDemo = $galleryEventsDemo[0];

if (galleryEventsDemo) {
    const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];
    galleryEventsDemo.addEventListener('lgBeforeSlide', (event) => {
        const { index } = event.detail;
        document.querySelector('.lg-backdrop').style.backgroundColor =
            colours[index];
    });
    $galleryEventsDemo
        .justifiedGallery({
            captions: false,
            lastRow: 'justify',
            rowHeight: 180,
            margins: 5,
        })
        .on('jg.complete', function () {
            window.lightGallery(galleryEventsDemo, {
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
        });
}

let customTransitionsGallery;

function customTransitions(trans) {
    jQuery('#gallery-transitions-demo')
        .justifiedGallery({
            captions: false,
            lastRow: 'justify',
            rowHeight: 180,
            margins: 5,
        })
        .on('jg.complete', function () {
            customTransitionsGallery = window.lightGallery(
                document.getElementById('gallery-transitions-demo'),
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
        });
}
customTransitions('lg-slide');

jQuery('#select-trans').on('change', function () {
    customTransitionsGallery.destroy();

    jQuery('#gallery-transitions-demo').justifiedGallery('destroy');
    jQuery('#gallery-transitions-demo').off('jg.complete');
    customTransitions(jQuery(this).val());
});

let customEasingGallery;

function initCustomEasing(easing) {
    jQuery('#gallery-custom-easing-demo')
        .justifiedGallery({
            captions: false,
            lastRow: 'justify',
            rowHeight: 180,
            margins: 5,
        })
        .on('jg.complete', function () {
            customEasingGallery = window.lightGallery(
                document.getElementById('gallery-custom-easing-demo'),
                {
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
                },
            );
        });
}
initCustomEasing('cubic-bezier(0.680, -0.550, 0.265, 1.550)');
jQuery('#select-easing').on('change', function () {
    const val = jQuery(this).val();
    prompt('You can copy cubic-bezier from here', val);
    customEasingGallery.destroy();

    jQuery('#gallery-custom-easing-demo').justifiedGallery('destroy');
    jQuery('#gallery-custom-easing-demo').off('jg.complete');

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
    jQuery('#gallery-methods-demo')
        .justifiedGallery({
            captions: false,
            lastRow: 'justify',
            rowHeight: 180,
            margins: 5,
        })
        .on('jg.complete', function () {
            methodsInstance = window.lightGallery($lgGalleryMethodsDemo, {
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
        });
}

const $lgDemoUpdateSlides = jQuery('#gallery-update-slides-demo');
const lgDemoUpdateSlides = $lgDemoUpdateSlides.get(0);
let updateSlidesGallery = null;
let slidesUpdated = false;
if (lgDemoUpdateSlides) {
    lgDemoUpdateSlides.addEventListener('lgAfterClose', () => {
        if (slidesUpdated) {
            setTimeout(() => {
                $lgDemoUpdateSlides.justifiedGallery('destroy');
                $lgDemoUpdateSlides.off('jg.complete');

                // Justified Gallery removes the src of added images after destroy for some reason
                // So manually adding src values of newly added items
                $('.lg-added-item').attr(
                    'src',
                    'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100',
                );
            }, 100);
            setTimeout(() => {
                $lgDemoUpdateSlides
                    .justifiedGallery({
                        captions: false,
                        lastRow: 'center',
                        rowHeight: 180,
                        margins: 5,
                    })
                    .on('jg.complete', function () {
                        updateSlidesGallery.refresh();
                    });
                slidesUpdated = false;
            }, 200);
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
                        src:
                            'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80',
                        thumb:
                            'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100',
                        subHtml: `<div class="lightGallery-captions">
                    <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                    <p>Description of the slide 1</p>
                </div>`,
                    },
                ],
            ];
            $lgDemoUpdateSlides.append(`<a
            data-lg-size="1600-1067"
            data-src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Fading Light</h4><p>layers of blue.</p>"
        >
            <img
                alt="Captions"
                style="height: 200px; max-width: none; width: 200px"
                class="img-responsive lg-added-item"
                src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=100"
            />
        </a>`);
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
            $lgDemoUpdateSlides.children().first().remove();
            slidesUpdated = true;
        });
    });
    const jG = $lgDemoUpdateSlides.justifiedGallery({
        captions: false,
        lastRow: 'center',
        rowHeight: 180,
        margins: 5,
    });
    jG.on('jg.complete', function () {
        updateSlidesGallery = window.lightGallery(lgDemoUpdateSlides, {
            addClass: 'lg-update-slide-demo',
            controls: false,
            pager: false,
            hash: false,
            plugins: [lgZoom, lgAutoplay, lgFullscreen, lgShare, lgThumbnail],
            download: false,
        });
    });
}

// Dynamic mode
const $dynamicGallery = jQuery('#dynamic-gallery-demo');
const dynamicEl = [
    {
        src:
            'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
        thumb:
            'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src:
            'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
        thumb:
            'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    },
    {
        src:
            'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
        thumb:
            'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
    {
        src:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        responsive:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
        thumb:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    },
];
const dynamicGallery = window.lightGallery($dynamicGallery[0], {
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
$dynamicGallery.on('click', function () {
    dynamicGallery.openGallery(2);
});
$('#dynamic-gallery-demo-load-more').on('click', () => {
    const newItems = [
        {
            src:
                'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
            responsive:
                'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
            thumb:
                'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
        },
        {
            src:
                'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
            responsive:
                'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
            thumb:
                'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
        },
    ];
    const updatedDynamicElements = [...dynamicEl, ...newItems];
    dynamicGallery.refresh(updatedDynamicElements);
    dynamicGallery.openGallery(4);
});

window.lightGallery(document.getElementById('open-website'), {
    selector: 'this',
});
window.lightGallery(document.getElementById('open-google-map'), {
    selector: 'this',
});
window.lightGallery(document.getElementById('open-pdf'), {
    selector: 'this',
});

jQuery('#gallery-videos-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('gallery-videos-demo'), {
            thumbnail: false,
            pager: false,
            plugins: [lgAutoplay, lgFullscreen, lgShare, lgThumbnail, lgVideo],
            hash: false,
            preload: 0,
        });
    });
jQuery('#gallery-videojs-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('gallery-videojs-demo'), {
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
    });
jQuery('#gallery-hash-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('gallery-hash-demo'), {
            thumbnail: false,
            plugins: [lgHash],
            pager: false,
            galleryId: 1,
            customSlideName: false,
        });
    });
jQuery('#gallery-custom-hash-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('gallery-custom-hash-demo'),
            {
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
            },
        );
    });
jQuery('#gallery-share-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('gallery-share-demo'), {
            thumbnail: false,
            pager: false,
            hash: true,
            plugins: [lgZoom, lgShare, lgThumbnail, lgHash],
        });
    });
jQuery('#gallery-captions-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('gallery-captions-demo'), {
            thumbnail: false,
            plugins: [lgZoom, lgShare],
            allowMediaOverlap: true,
            pager: true,
            hash: true,
        });
    });
jQuery('#gallery-animated-captions-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('gallery-animated-captions-demo'),
            {
                speed: 500,
                allowMediaOverlap: true,
                // Append caption inside the slide item
                // to apply some animation for the captions (Optional)
                appendSubHtmlTo: '.lg-item',
                // Delay slide transition to complete captions animations
                // before navigating to different slides (Optional)
                // You can find caption animation demo on the captions demo page
                slideDelay: 400,
            },
        );
    });
jQuery('#gallery-srcset-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('gallery-srcset-demo'), {
            thumbnail: false,
            plugins: [lgZoom, lgShare],
            allowMediaOverlap: true,
            pager: true,
            hash: true,
        });
    });
jQuery('#gallery-picture-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('gallery-picture-demo'), {
            thumbnail: false,
            plugins: [lgZoom, lgShare],
            allowMediaOverlap: true,
            pager: true,
            hash: true,
        });
    });
jQuery('#responsive-images-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(document.getElementById('responsive-images-demo'), {
            thumbnail: false,
            pager: true,
            hash: true,
            plugins: [lgAutoplay, lgThumbnail],
        });
    });
jQuery('#gallery-fb-comments-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('gallery-fb-comments-demo'),
            {
                thumbnail: false,
                pager: false,
                hash: true,
                plugins: [lgZoom, lgComment, lgShare, lgThumbnail],
                commentBox: true,
                disqusComments: false,
                fbComments: true,
            },
        );
    });
jQuery('#gallery-disqus-comments-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('gallery-disqus-comments-demo'),
            {
                thumbnail: false,
                pager: false,
                hash: true,
                plugins: [lgComment, lgRotate],
                commentBox: true,
                disqusComments: true,
                fbComments: false,
            },
        );
    });
jQuery('#gallery-mixed-content-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('gallery-mixed-content-demo'),
            {
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
            },
        );
    });
jQuery('#gallery-mixed-content-all-demo')
    .justifiedGallery({
        captions: false,
        rowHeight: 130,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('gallery-mixed-content-all-demo'),
            {
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
            },
        );
    });
jQuery('#gallery-share-reddit-demo')
    .justifiedGallery({
        captions: false,
        lastRow: 'justify',
        rowHeight: 180,
        margins: 5,
    })
    .on('jg.complete', function () {
        window.lightGallery(
            document.getElementById('gallery-share-reddit-demo'),
            {
                thumbnail: false,
                pager: false,
                hash: true,
                galleryId: 2,
                plugins: [
                    lgZoom,
                    lgAutoplay,
                    lgHash,
                    lgFullscreen,
                    lgShare,
                    lgThumbnail,
                ],
                addClass: 'lg-custom-share-demo',
                extraProps: ['redditTitle'],
                additionalShareOptions: [
                    {
                        selector: '.lg-share-reddit',
                        dropdownHTML:
                            '<li class="lg-share-item-reddit"><a class="lg-share-reddit" target="_blank"><svg class="lg-reddit" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><title>reddit</title><path d="M8 20c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20 20c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20.097 24.274c0.515-0.406 1.262-0.317 1.668 0.198s0.317 1.262-0.198 1.668c-1.434 1.13-3.619 1.86-5.567 1.86s-4.133-0.73-5.567-1.86c-0.515-0.406-0.604-1.153-0.198-1.668s1.153-0.604 1.668-0.198c0.826 0.651 2.46 1.351 4.097 1.351s3.271-0.7 4.097-1.351zM32 16c0-2.209-1.791-4-4-4-1.504 0-2.812 0.83-3.495 2.057-2.056-1.125-4.561-1.851-7.29-2.019l2.387-5.36 4.569 1.319c0.411 1.167 1.522 2.004 2.83 2.004 1.657 0 3-1.343 3-3s-1.343-3-3-3c-1.142 0-2.136 0.639-2.642 1.579l-5.091-1.47c-0.57-0.164-1.173 0.116-1.414 0.658l-3.243 7.282c-2.661 0.187-5.102 0.907-7.114 2.007-0.683-1.227-1.993-2.056-3.496-2.056-2.209 0-4 1.791-4 4 0 1.635 0.981 3.039 2.387 3.659-0.252 0.751-0.387 1.535-0.387 2.341 0 5.523 6.268 10 14 10s14-4.477 14-10c0-0.806-0.134-1.589-0.387-2.34 1.405-0.62 2.387-2.025 2.387-3.66zM27 5.875c0.621 0 1.125 0.504 1.125 1.125s-0.504 1.125-1.125 1.125-1.125-0.504-1.125-1.125 0.504-1.125 1.125-1.125zM2 16c0-1.103 0.897-2 2-2 0.797 0 1.487 0.469 1.808 1.145-1.045 0.793-1.911 1.707-2.552 2.711-0.735-0.296-1.256-1.016-1.256-1.856zM16 29.625c-6.42 0-11.625-3.414-11.625-7.625s5.205-7.625 11.625-7.625c6.42 0 11.625 3.414 11.625 7.625s-5.205 7.625-11.625 7.625zM28.744 17.856c-0.641-1.003-1.507-1.918-2.552-2.711 0.321-0.676 1.011-1.145 1.808-1.145 1.103 0 2 0.897 2 2 0 0.84-0.52 1.56-1.256 1.856z"></path></svg><span class="lg-dropdown-text">Reddit</span></a></li>',
                        generateLink: (galleryItem) => {
                            const url = encodeURIComponent(
                                window.location.href,
                            );
                            const title = galleryItem.redditTitle;
                            const redditShareLink = `//reddit.com/submit?url=${url}&title=${title}`;
                            return redditShareLink;
                        },
                    },
                ],
            },
        );
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

const $infiniteScrollingGallery = $('#infinite-scroll-gallery');
if ($('#infinite-scroll-gallery').length) {
    let infiniteScrollingGallery = lightGallery($infiniteScrollingGallery[0], {
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
    $(window).on('scroll', function () {
        if (
            $(window).scrollTop() >=
            $(document).height() -
                $(window).height() -
                ($(document).height() -
                    ($infiniteScrollingGallery.position().top +
                        $infiniteScrollingGallery.outerHeight(true)))
        ) {
            $('#infinite-scroll-gallery').append(images);
            infiniteScrollingGallery.refresh();
        }
    });
}

lightGallery(document.querySelector('.medium-zoom-demo'), {
    selector: '.blog-images',
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
