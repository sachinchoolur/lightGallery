import type { ReactElement } from 'react';

import { useGallerySettings } from './context';
import type { GalleryItem } from './types';

export interface IframeSlideProps {
    item: GalleryItem;
    index: number;
    onLoad: () => void;
}

/** Iframe slide renderer (deferred from plan 003), 2.x `getIframeMarkup`. */
export function IframeSlide({
    item,
    onLoad,
}: IframeSlideProps): ReactElement {
    const settings = useGallerySettings();
    return (
        <div
            className="lg-media-cont lg-has-iframe"
            style={{
                width: settings.iframeWidth,
                maxWidth: settings.iframeMaxWidth,
                height: settings.iframeHeight,
                maxHeight: settings.iframeMaxHeight,
            }}
        >
            <iframe
                className="lg-object"
                title={item.iframeTitle ?? item.title ?? 'Embedded content'}
                src={item.src}
                allowFullScreen={true}
                onLoad={onLoad}
            />
        </div>
    );
}
