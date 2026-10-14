import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Rotate from '@lightgallery/react/plugins/rotate';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

import { photos } from './photos';

export default function App() {
    return (
        <>
            <h1>lightGallery image zoom</h1>
            {/* Zoom in and zoom out buttons next to the actual-size
                button; the library shows only actual size by default.
                `scale` is how much each step changes the scale. */}
            <LightGallery
                plugins={[Zoom, Rotate, Thumbnail]}
                zoom={{ showZoomInOutIcons: true, actualSize: true, scale: 1 }}
            >
                <div className="gallery">
                    {photos.map((photo) => (
                        <LightGalleryItem
                            key={photo.src}
                            item={photo}
                            href={photo.src}
                        >
                            <img src={photo.thumb} alt={photo.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
