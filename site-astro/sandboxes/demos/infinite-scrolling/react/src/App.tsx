import { useEffect, useRef, useState } from 'react';
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

import { photos as firstPhotos, type Photo } from './photos';

const PAGE_SIZE = 12;
const LAST_PAGE = 8;

// Stands in for a request to your server: resolves to one page of photos.
function fetchPage(page: number): Promise<Photo[]> {
    const photos = Array.from({ length: PAGE_SIZE }, (_, i) => {
        const n = firstPhotos.length + (page - 1) * PAGE_SIZE + i + 1;
        return {
            src: `https://picsum.photos/seed/lg-${n}/1600/1067`,
            thumb: `https://picsum.photos/seed/lg-${n}/360/240`,
            alt: `Sample photo ${n}`,
            lgSize: '1600-1067',
        };
    });
    return new Promise((resolve) => setTimeout(() => resolve(photos), 400));
}

export default function App() {
    const [photos, setPhotos] = useState(firstPhotos);
    const [page, setPage] = useState(0);
    const status = useRef<HTMLParagraphElement>(null);

    // The status line sits after the gallery. When it comes within 200px of
    // the viewport, the next page loads. The effect runs again after every
    // page, so a status line that is still in view after a short page loads
    // the next one too.
    useEffect(() => {
        if (page === LAST_PAGE) {
            return;
        }
        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }
                // One request at a time.
                observer.disconnect();
                const next = await fetchPage(page + 1);
                // Appending to the array is all it takes: the gallery picks
                // up the new slides on the next render.
                setPhotos((current) => [...current, ...next]);
                setPage(page + 1);
            },
            { rootMargin: '200px' },
        );
        observer.observe(status.current!);
        return () => observer.disconnect();
    }, [page]);

    return (
        <>
            <h1>lightGallery infinite scrolling</h1>
            <LightGallery plugins={[Thumbnail]} speed={500}>
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
            <p ref={status}>
                {page === LAST_PAGE
                    ? 'All photos loaded.'
                    : 'Loading more photos…'}
            </p>
        </>
    );
}
