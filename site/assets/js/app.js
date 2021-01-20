/**
 * Inline Gallery
 */
const lgCont = document.getElementById('gallery-container');
const LG = window.LG;
LG(lgCont).css('height', window.innerHeight + 'px');
window.lightGallery(document.getElementById('gallery-container'), {
    container: document.getElementById('gallery-container'),
    dynamic: true,
    thumbnail: true,
    swipeToClose: false,
    hash: false,
    pager: false,
    closable: false,
    mobileSettings: {
        showCloseIcon: false,
    },
    dynamicEl: [
        {
            src: '/images/demo/image-5.jpg',
            thumb: '/images/demo/image-1-thumb.jpg',
        },
        {
            src: '/images/demo/image-6.jpg',
            thumb: '/images/demo/image-2-thumb.jpg',
        },
        {
            src: '/images/demo/image-7.jpg',
            thumb: '/images/demo/image-3-thumb.jpg',
        },
        {
            src: '/images/demo/image-8.jpg',
            thumb: '/images/demo/image-4-thumb.jpg',
        },
        {
            src: '/images/demo/image-9.jpg',
            thumb: '/images/demo/image-5-thumb.jpg',
        },
    ],
});

window.lightGallery(document.getElementById('lightGallery-videos'));
