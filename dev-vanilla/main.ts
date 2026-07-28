import lightGallery from '../src/index';
import Thumbnail from '../src/plugins/thumbnail/lg-thumbnail';
import Video from '../src/plugins/video/lg-video';
import Zoom from '../src/plugins/zoom/lg-zoom';
import Rotate from '../src/plugins/rotate/lg-rotate';

// Styles compile from the scss sources so plugin CSS edits hot-reload
// too. The bundle covers fonts/theme/plugins/core; transitions ship
// separately (same split the react demo consumes from dist/css).
import '../src/scss/lightgallery-bundle.scss';
import '../src/scss/lg-transitions.scss';

// Same images as packages/react/dev/main.tsx — keep the two demos
// aligned so v2 and v3 gesture behavior can be compared side by side
// on the same slides.
const picsum = (id: number, w: number, h: number) =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

const items = [
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
    { id: 1019, title: 'Lakeside cliffs' },
    { id: 1039, title: 'Waterfall in the forest' },
    { id: 1043, title: 'Village at dusk' },
    { id: 1044, title: 'Foggy shore' },
    { id: 1051, title: 'Ridge line' },
];

const gallery = document.getElementById('gallery')!;
gallery.innerHTML = items
    .map(
        ({ id, title }) => `
    <a
        href="${picsum(id, 1600, 1067)}"
        data-lg-size="1600-1067"
        data-sub-html="<h4>${title} <small>(#${id})</small></h4>"
    >
        <img src="${picsum(id, 240, 160)}" alt="${title}" />
    </a>`,
    )
    .join('');

const instance = lightGallery(gallery, {
    selector: 'a',
    plugins: [Thumbnail, Zoom, Video, Rotate],
    speed: 500,
    showZoomInOutIcons: true,
    actualSize: true,
});

// Handy for poking at internals from the console while debugging.
(window as unknown as { lg: unknown }).lg = instance;
