import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

export default function App() {
    return (
        <>
            <h1>lightGallery HTML markup</h1>
            {/* A trigger is a component: it renders a link, and its `item`
                carries the slide data that data attributes hold in plain
                HTML. */}
            <LightGallery>
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
