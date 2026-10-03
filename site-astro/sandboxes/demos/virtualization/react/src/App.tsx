import { useState } from 'react';
import { LightGallery } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

const slides = Array.from({ length: 1000 }, (_, i) => ({
    src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
    thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
    caption: `Slide ${i + 1} / 1000`,
}));

export default function App() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    return (
        <>
            <h1>lightGallery virtualization</h1>
            <button type="button" onClick={() => setOpen(true)}>
                Open the 1,000-slide gallery
            </button>
            {/* slides: how many slides are in the DOM at once, around the
                current one. thumbs: only the visible thumbnails are in the
                DOM, plus one more viewport of them on each side. */}
            <LightGallery
                slides={slides}
                plugins={[Thumbnail]}
                virtualization={{ slides: 7, thumbs: 'auto' }}
                open={open}
                onClose={() => setOpen(false)}
                index={index}
                onIndexChange={setIndex}
            />
        </>
    );
}
