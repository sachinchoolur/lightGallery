import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

export default function App() {
    return (
        <>
            <h1>lightGallery custom easing</h1>
            {/* `easing` is any CSS timing function. The speed is slower
                than the default 400, so the curve is easy to see. */}
            <LightGallery
                easing="cubic-bezier(0.680, -0.550, 0.265, 1.550)"
                speed={1000}
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
