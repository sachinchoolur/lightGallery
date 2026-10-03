import { useState } from 'react';
import { LightGallery } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

// The slides are data: there is no gallery markup on the page.
const slides = photos.map((photo) => ({ ...photo, caption: photo.alt }));

export default function App() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <h1>lightGallery dynamic mode</h1>
            <button type="button" onClick={() => setOpen(true)}>
                Open gallery
            </button>
            {/* defaultIndex={2} opens on the third slide. */}
            <LightGallery
                slides={slides}
                open={open}
                defaultIndex={2}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
