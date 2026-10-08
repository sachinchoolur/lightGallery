import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';

// `caption` takes JSX; `captionHtml` takes an HTML string.
const items: GalleryItem[] = [
    {
        src: 'https://picsum.photos/id/10/1600/1067',
        thumb: 'https://picsum.photos/id/10/360/240',
        alt: 'Forest and sea',
        lgSize: '1600-1067',
        caption: (
            <>
                <h4>Forest and sea</h4>
                <p>Evergreen treetops in front of a calm blue bay.</p>
            </>
        ),
    },
    {
        src: 'https://picsum.photos/id/11/1600/1067',
        thumb: 'https://picsum.photos/id/11/360/240',
        alt: 'Misty valley',
        lgSize: '1600-1067',
        captionHtml:
            '<h4>Misty valley</h4><p>A stream winds through a meadow under a grey sky.</p>',
    },
    {
        src: 'https://picsum.photos/id/15/1600/1067',
        thumb: 'https://picsum.photos/id/15/360/240',
        alt: 'Waterfall',
        lgSize: '1600-1067',
        caption: (
            <>
                <h4>Waterfall</h4>
                <p>A narrow waterfall drops into a rocky gorge.</p>
            </>
        ),
    },
    {
        src: 'https://picsum.photos/id/16/1600/1067',
        thumb: 'https://picsum.photos/id/16/360/240',
        alt: 'Rocky shore',
        lgSize: '1600-1067',
        caption: (
            <>
                <h4>Rocky shore</h4>
                <p>Driftwood and boulders at the edge of clear water.</p>
            </>
        ),
    },
];

export default function App() {
    return (
        <>
            <h1>lightGallery captions</h1>
            <LightGallery>
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
