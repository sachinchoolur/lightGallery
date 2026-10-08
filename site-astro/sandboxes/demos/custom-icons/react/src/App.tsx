import type { ReactNode } from 'react';
import {
    LightGallery,
    LightGalleryItem,
    type LgIconName,
    type RenderSlots,
} from '@lightgallery/react';
import Autoplay from '@lightgallery/react/plugins/autoplay';
import Zoom from '@lightgallery/react/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-zoom.css';

import { photos } from './photos';

// Any SVG works; drawing with currentColor keeps the hover and active
// colors of the buttons.
const icon = (path: string) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d={path} />
    </svg>
);

const icons: Partial<Record<LgIconName, ReactNode>> = {
    close: icon('M6 6l12 12M18 6L6 18'),
    // A state pair needs both names, or the pair keeps the built-ins.
    autoplayPlay: icon('M9 5.8v12.4L19 12z'),
    autoplayPause: icon('M8.5 6v12M15.5 6v12'),
};

// A node per name; `undefined` keeps the built-in icon.
const render: RenderSlots = {
    icon: (name) => icons[name],
};

export default function App() {
    return (
        <>
            <h1>lightGallery custom icons</h1>
            <LightGallery plugins={[Zoom, Autoplay]} render={render}>
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
