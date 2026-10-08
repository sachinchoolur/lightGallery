import { useState } from 'react';
import { LightGallery } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './carousel.css';

import { photos } from './photos';

export default function App() {
    // Kept in state, not in a ref: the gallery can only be rendered into
    // the element once it exists, and setting state renders again.
    const [container, setContainer] = useState<HTMLElement | null>(null);

    return (
        <>
            <h1>lightGallery carousel gallery</h1>
            {/* The gallery is rendered inside this element and takes its
                size, which is set in carousel.css. */}
            <div className="inline-gallery-container" ref={setContainer} />
            {container && (
                <LightGallery
                    container={container}
                    // The carousel is always open and cannot be closed.
                    open
                    closable={false}
                    // Toolbar button that expands it to the whole window.
                    showMaximizeIcon
                    slides={photos}
                    plugins={[Thumbnail, Zoom]}
                />
            )}
        </>
    );
}
