import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import './events.css';

import { photos } from './photos';

const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];

function setBackdrop(index: number) {
    const backdrop = document.querySelector<HTMLElement>(
        '.lg-events-demo-outer .lg-backdrop',
    );
    if (backdrop) {
        backdrop.style.backgroundColor = colours[index % colours.length];
    }
}

export default function App() {
    return (
        <>
            <h1>lightGallery events</h1>
            {/* Every gallery event is a callback prop. This one changes the
                backdrop color on every slide change. `className` is a
                class on the gallery container, used by events.css. */}
            <LightGallery
                className="lg-events-demo-outer"
                onBeforeSlide={({ index }) => setBackdrop(index)}
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
