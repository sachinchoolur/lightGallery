import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Hash from '@lightgallery/react/plugins/hash';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

export default function App() {
    return (
        <>
            <h1>lightGallery hash</h1>
            <p>
                Open a photo and look at the address bar. Loading that URL opens
                the gallery on the same photo.
            </p>
            {/* galleryId is the id in the URL: #lg=1&slide=2. Give each
                gallery on a page its own. hashDriver 'auto' uses the
                Navigation API where the browser has it and the History API
                everywhere else. */}
            <LightGallery
                plugins={[Hash]}
                hash={{ galleryId: '1', hashDriver: 'auto' }}
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
