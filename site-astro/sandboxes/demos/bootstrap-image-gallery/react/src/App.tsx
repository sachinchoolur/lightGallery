import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

// The grid needs Bootstrap's stylesheet only, none of its JavaScript.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

// The photos of each grid column. `lgSize` is the full-size image's
// WIDTH-HEIGHT; it lets the image open from its thumbnail.
const columns: GalleryItem[][] = [
    [
        {
            src: 'https://picsum.photos/id/10/1600/1067',
            thumb: 'https://picsum.photos/id/10/480/320',
            alt: 'Sample photo 1',
            lgSize: '1600-1067',
        },
        {
            src: 'https://picsum.photos/id/11/1200/1600',
            thumb: 'https://picsum.photos/id/11/480/640',
            alt: 'Sample photo 2',
            lgSize: '1200-1600',
        },
    ],
    [
        {
            src: 'https://picsum.photos/id/15/1200/1600',
            thumb: 'https://picsum.photos/id/15/480/640',
            alt: 'Sample photo 3',
            lgSize: '1200-1600',
        },
        {
            src: 'https://picsum.photos/id/16/1600/1067',
            thumb: 'https://picsum.photos/id/16/480/320',
            alt: 'Sample photo 4',
            lgSize: '1600-1067',
        },
    ],
    [
        {
            src: 'https://picsum.photos/id/28/1200/1200',
            thumb: 'https://picsum.photos/id/28/480/480',
            alt: 'Sample photo 5',
            lgSize: '1200-1200',
        },
        {
            src: 'https://picsum.photos/id/29/1200/1200',
            thumb: 'https://picsum.photos/id/29/480/480',
            alt: 'Sample photo 6',
            lgSize: '1200-1200',
        },
    ],
];

export default function App() {
    return (
        <>
            <h1>lightGallery with a Bootstrap image gallery</h1>
            {/* The items can sit at any depth inside the gallery, so the
                Bootstrap grid keeps its own markup. */}
            <LightGallery plugins={[Zoom, Thumbnail]}>
                <div className="row g-2">
                    {columns.map((column, index) => (
                        <div key={index} className="col-4">
                            {column.map((photo) => (
                                <LightGalleryItem
                                    key={photo.src}
                                    item={photo}
                                    href={photo.src}
                                    className="d-block mb-2"
                                >
                                    <img
                                        src={photo.thumb}
                                        className="d-block w-100"
                                        alt={photo.alt}
                                    />
                                </LightGalleryItem>
                            ))}
                        </div>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
