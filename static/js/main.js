$(document).ready(function() {
    $('#lightgallery').lightGallery({
        loop: true,
        fourceAutoply: false,
        autoplay: false,
        thumbnail: false,
        pager: $(window).width() >= 768 ? true : false,
        speed: 300,
        scale: 2,
        keypress: true
    });
    new WOW().init();
});

$(window).on('load', function() {
    $('body').addClass('loaded');
    setTimeout(function() {
        $('body').addClass('in');
    }, 400);

    setTimeout(function() {
        $('.page-loading').remove();
    }, 600);
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
