var pageLoaded = false;
$(document).ready(function() {

    function customizeGallery(trans, ease) {
        $('#lightgallery').lightGallery({
            loop: true,
            fourceAutoply: false,
            autoplay: false,
            thumbnail: false,
            pager: $(window).width() >= 768 ? true : false,
            speed: 700,
            scale: 1,
            keypress: true,
            mode: trans,
            cssEasing: ease
        });
    }

    customizeGallery('lg-slide', 'cubic-bezier(0.250, 0.250, 0.750, 0.750)');

    $('#select-trans').on('change', function() {
        $('#lightgallery').data('lightGallery').destroy(true);
        customizeGallery($('#select-trans').val(), 'cubic-bezier(' + $('#select-ease').val() + ')');
    });

    $('#select-ease').on('change', function() {

        $('#lightgallery').data('lightGallery').destroy(true);
        customizeGallery($('#select-trans').val(), 'cubic-bezier(' + $('#select-ease').val() + ')');
    });

    new WOW().init();

    setTimeout(function() {
        if (!pageLoaded) {
            pageLoading();
            console.log('timeout')
            pageLoaded = true;
        }
    }, 1500);
});

var pageLoading = function() {
    $('body').addClass('loaded');
    setTimeout(function() {
        $('body').addClass('in');
    }, 400);

    setTimeout(function() {
        $('.page-loading').remove();
    }, 600);
};

$(window).on('load', function() {
    if (!pageLoaded) {
        pageLoading();
        pageLoaded = true;
    }

    setTimeout(function() {
        $('#twitter').sharrre({
            share: {
                twitter: true
            },
            enableHover: false,
            enableTracking: true,
            buttons: {
                twitter: {}
            },
            click: function(api, options) {
                api.simulateClick();
                api.openPopup('twitter');
            }
        });
        $('#facebook').sharrre({
            share: {
                facebook: true
            },
            enableHover: false,
            enableTracking: true,
            click: function(api, options) {
                api.simulateClick();
                api.openPopup('facebook');
            }
        });
        $('#googleplus').sharrre({
            share: {
                googlePlus: true
            },
            enableHover: false,
            enableTracking: true,
            click: function(api, options) {
                api.simulateClick();
                api.openPopup('googlePlus');
            }
        })
    }, 800);
})
