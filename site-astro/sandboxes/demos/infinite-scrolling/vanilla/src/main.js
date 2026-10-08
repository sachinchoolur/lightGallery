import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import './demo.css';

const PAGE_SIZE = 12;
const LAST_PAGE = 8;

// Stands in for a request to your server: resolves to one page of
// thumbnails as HTML.
function fetchPage(page) {
    const thumbnails = Array.from({ length: PAGE_SIZE }, (_, i) => {
        // The first 8 photos are in index.html.
        const n = 8 + (page - 1) * PAGE_SIZE + i + 1;
        return `
            <a
                href="https://picsum.photos/seed/lg-${n}/1600/1067"
                data-lg-size="1600-1067"
            >
                <img
                    src="https://picsum.photos/seed/lg-${n}/360/240"
                    alt="Sample photo ${n}"
                />
            </a>`;
    });
    return new Promise((resolve) =>
        setTimeout(() => resolve(thumbnails.join('')), 400),
    );
}

const gallery = document.getElementById('gallery');
const status = document.getElementById('status');

const lg = lightGallery(gallery, {
    plugins: [lgThumbnail],
    speed: 500,
});

let page = 0;
let loading = false;

// The status line sits after the gallery. When it comes within 200px of
// the viewport, the next page loads.
const observer = new IntersectionObserver(
    async ([entry]) => {
        if (!entry.isIntersecting || loading) {
            return;
        }
        loading = true;
        const thumbnails = await fetchPage(page + 1);
        page += 1;
        loading = false;

        gallery.insertAdjacentHTML('beforeend', thumbnails);
        // The gallery picks up the new items as they are; there is no need
        // to destroy and re-create it.
        lg.refresh();

        if (page === LAST_PAGE) {
            status.textContent = 'All photos loaded.';
            observer.disconnect();
            return;
        }
        // Observe again, so a status line that is still in view after a
        // short page loads the next one too.
        observer.unobserve(status);
        observer.observe(status);
    },
    { rootMargin: '200px' },
);
observer.observe(status);
