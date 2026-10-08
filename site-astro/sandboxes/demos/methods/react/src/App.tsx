import { useRef } from 'react';
import {
    LightGallery,
    LightGalleryItem,
    type LightGalleryRefHandle,
} from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import './methods.css';

import { photos } from './photos';

export default function App() {
    // The ref gives access to the gallery's methods.
    const gallery = useRef<LightGalleryRefHandle>(null);

    return (
        <>
            <h1>lightGallery methods</h1>
            <p>
                <button
                    type="button"
                    onClick={() => gallery.current?.openGallery(2)}
                >
                    Open on the third photo
                </button>
            </p>

            {/* controls={false} hides the built-in previous and next
                buttons. render.caption puts custom buttons in the caption
                area of every slide. */}
            <LightGallery
                ref={gallery}
                controls={false}
                render={{
                    caption: () => (
                        <div className="gallery-nav">
                            <button
                                type="button"
                                onClick={() => gallery.current?.prevSlide()}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => gallery.current?.nextSlide()}
                            >
                                Next
                            </button>
                            <button
                                type="button"
                                onClick={() => gallery.current?.closeGallery()}
                            >
                                Close
                            </button>
                        </div>
                    ),
                }}
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
