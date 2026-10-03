import { useState } from 'react';
import { LightGallery, type GalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';

// `iframe: true` shows the page at `src` in an iframe.
const slides: GalleryItem[] = [
    {
        src: 'https://example.com/',
        iframe: true,
        iframeTitle: 'Website',
    },
    {
        src: 'https://www.openstreetmap.org/export/embed.html?bbox=-5.2884,35.1588,-5.2484,35.1788',
        iframe: true,
        iframeTitle: 'Map',
    },
    {
        src: 'https://www.lightgalleryjs.com/pdf/sample.pdf',
        iframe: true,
        iframeTitle: 'PDF file',
    },
];

export default function App() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const openSlide = (slide: number) => {
        setIndex(slide);
        setOpen(true);
    };

    return (
        <>
            <h1>lightGallery iframe</h1>
            <div className="gallery">
                <button type="button" onClick={() => openSlide(0)}>
                    Open website
                </button>
                <button type="button" onClick={() => openSlide(1)}>
                    Open map
                </button>
                <button type="button" onClick={() => openSlide(2)}>
                    Open PDF file
                </button>
            </div>
            <LightGallery
                slides={slides}
                open={open}
                onClose={() => setOpen(false)}
                index={index}
                onIndexChange={setIndex}
            />
        </>
    );
}
