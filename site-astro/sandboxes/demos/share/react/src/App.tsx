import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Share from '@lightgallery/react/plugins/share';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-share.css';

import { photos } from './photos';

// tweetText and pinterestText are the text the post on X and the pin on
// Pinterest start with.
const items: GalleryItem[] = photos.map((photo) => ({
    ...photo,
    tweetText: `${photo.alt}, shared from lightGallery`,
    pinterestText: photo.alt,
}));

export default function App() {
    return (
        <>
            <h1>lightGallery social sharing</h1>
            {/* Share adds a share button to the toolbar. It lists Facebook,
                X and Pinterest; on touch devices it opens the device's
                share sheet first. Pass share={{ preferNativeShare: true }}
                (or false) to choose one for every device. */}
            <LightGallery plugins={[Share]}>
                <div className="gallery">
                    {items.map((item) => (
                        <LightGalleryItem
                            key={item.src}
                            item={item}
                            href={item.src}
                        >
                            <img src={item.thumb} alt={item.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
