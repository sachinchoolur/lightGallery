import { LightGallery, LightGalleryItem, type GalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

export default function Gallery({ items }: { items: GalleryItem[] }) {
    return (
        <LightGallery plugins={[Zoom, Thumbnail]} thumbnail={{ animateThumb: true }}>
            <div className="grid">
                {items.map((item) => (
                    <LightGalleryItem key={item.src} item={item}>
                        <img src={item.thumb} alt={item.alt} />
                    </LightGalleryItem>
                ))}
            </div>
        </LightGallery>
    );
}
