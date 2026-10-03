import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';
// Every mode other than lg-slide and lg-fade needs this stylesheet.
import 'lightgallery/css/lg-transitions.css';

import { photos } from './photos';

export default function App() {
    return (
        <>
            <h1>lightGallery transitions</h1>
            {/* Try 'lg-zoom-in', 'lg-slide-vertical', 'lg-rotate' or
                'lg-tube'. */}
            <LightGallery mode="lg-fade">
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
