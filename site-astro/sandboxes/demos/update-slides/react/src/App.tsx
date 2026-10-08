import { useState } from 'react';
import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import './update-slides.css';

import { photos as firstPhotos, type Photo } from './photos';

let added = 0;

function newPhoto(): Photo {
    added += 1;
    return {
        src: `https://picsum.photos/seed/lg-added-${added}/1600/1067`,
        thumb: `https://picsum.photos/seed/lg-added-${added}/360/240`,
        alt: `Added photo ${added}`,
        lgSize: '1600-1067',
    };
}

export default function App() {
    // Rendering a different list is the update, also while the gallery is
    // open. There is no method to call.
    const [photos, setPhotos] = useState(firstPhotos);

    const add = () => setPhotos([...photos, newPhoto()]);
    const remove = (index: number) =>
        setPhotos(photos.filter((_, i) => i !== index));

    return (
        <>
            <h1>lightGallery update slides</h1>
            <p>Open a photo, then use the buttons under it.</p>

            {/* render.caption puts the buttons in the caption area of
                every slide. */}
            <LightGallery
                render={{
                    caption: (_item, index) => (
                        <div className="slide-actions">
                            <button type="button" onClick={add}>
                                Add a photo
                            </button>
                            <button
                                type="button"
                                disabled={photos.length === 1}
                                onClick={() => remove(index)}
                            >
                                Remove this photo
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
