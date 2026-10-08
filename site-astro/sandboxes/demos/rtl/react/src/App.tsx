import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';
// Mirrors the gallery controls in a right-to-left gallery.
import 'lightgallery/css/lg-rtl.css';

import { photos } from './photos';

const captions = [
    'الصورة الأولى',
    'الصورة الثانية',
    'الصورة الثالثة',
    'الصورة الرابعة',
    'الصورة الخامسة',
    'الصورة السادسة',
    'الصورة السابعة',
    'الصورة الثامنة',
];

const items = photos.map((photo, index) => ({
    ...photo,
    alt: captions[index],
    caption: captions[index],
}));

export default function App() {
    return (
        <>
            <h1>lightGallery RTL</h1>
            {/* 'rtl' makes the gallery right-to-left. Use 'auto' to follow
                the dir attribute of the page's <html> or <body> instead. */}
            <LightGallery direction="rtl">
                {/* dir="rtl" mirrors the grid on the page. */}
                <div className="gallery" dir="rtl">
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
