import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

export default function App() {
    return (
        <>
            <h1>lightGallery zoom from origin</h1>
            {/* zoomFromOrigin is on by default: the image grows out of the
                clicked thumbnail and flies back to it on close. It needs
                each item's lgSize, the full-size image's "WIDTH-HEIGHT". */}
            <LightGallery zoomFromOrigin>
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
