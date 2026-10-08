import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import OriginCrop from '@lightgallery/react/plugins/originCrop';

import 'lightgallery/css/lightgallery.css';
import './tiles.css';

import { photos } from './photos';

export default function App() {
    return (
        <>
            <h1>lightGallery zoom from origin, cropped thumbnails</h1>
            {/* The tiles are square and crop every photo with object-fit:
                cover. The origin crop plugin flies the part of the photo a
                tile shows and reveals the rest around it; without the
                plugin the whole photo would be squashed into the tile. It
                reads the tile's object-fit and object-position, nothing is
                needed in the markup. */}
            <LightGallery plugins={[OriginCrop]}>
                <div className="tiles">
                    {photos.map((photo) => (
                        <LightGalleryItem
                            key={photo.src}
                            item={photo}
                            href={photo.src}
                        >
                            <img
                                src={photo.thumb}
                                alt={photo.alt}
                                style={{ objectPosition: photo.position }}
                            />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
