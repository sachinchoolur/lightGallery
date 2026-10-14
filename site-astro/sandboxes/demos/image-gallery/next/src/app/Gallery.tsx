'use client'; // the gallery listens to clicks and gestures

import Image from 'next/image';
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

import type { Photo } from '../photos';

export function Gallery({ photos }: { photos: Photo[] }) {
    return (
        <LightGallery plugins={[Thumbnail, Zoom]}>
            <div className="gallery">
                {photos.map((photo) => (
                    // `next/image` renders the thumbnail; the slide is `photo.src`.
                    <LightGalleryItem key={photo.src} item={photo} href={photo.src}>
                        <Image src={photo.thumb} alt={photo.alt} width={360} height={240} />
                    </LightGalleryItem>
                ))}
            </div>
        </LightGallery>
    );
}
