// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { LightGallery, LightGalleryItem } from './index';
import Autoplay from './plugins/autoplay';
import Comment from './plugins/comment';
import Fullscreen from './plugins/fullscreen';
import Hash from './plugins/hash';
import MediumZoom from './plugins/mediumZoom';
import Pager from './plugins/pager';
import RelativeCaption from './plugins/relativeCaption';
import Rotate from './plugins/rotate';
import Share from './plugins/share';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';
import VimeoThumbnail from './plugins/vimeoThumbnail';
import Zoom from './plugins/zoom';

// Importing every entry in the node environment is itself the module-scope
// safety assertion: any `window`/`document` access on import would throw.
const ALL_PLUGINS = [
    Thumbnail,
    Zoom,
    Video,
    Autoplay,
    Fullscreen,
    Hash,
    Pager,
    Share,
    Rotate,
    Comment,
    MediumZoom,
    RelativeCaption,
    VimeoThumbnail,
];

describe('SSR', () => {
    it('renders to string without touching browser globals (closed)', () => {
        const html = renderToString(
            <LightGallery
                slides={[{ src: 'a.jpg' }]}
                open={false}
                onClose={() => undefined}
            />,
        );
        expect(html).toBe('');
    });

    it('renders to string without throwing even when open', () => {
        // Portals cannot exist on the server; the component must render
        // nothing rather than touch document/window.
        const html = renderToString(
            <LightGallery
                slides={[{ src: 'a.jpg' }]}
                open={true}
                onClose={() => undefined}
            />,
        );
        expect(html).toBe('');
    });

    it('renders with all 13 plugins on the server (open and closed)', () => {
        for (const open of [false, true]) {
            const html = renderToString(
                <LightGallery
                    slides={[
                        { src: 'a.jpg', alt: 'a' },
                        { src: 'https://vimeo.com/1', alt: 'v' },
                    ]}
                    open={open}
                    onClose={() => undefined}
                    plugins={ALL_PLUGINS}
                    comment={{
                        commentBox: true,
                        renderComments: () => <p>c</p>,
                    }}
                />,
            );
            expect(html).toBe('');
        }
    });

    it('server-renders uncontrolled trigger children as static markup', () => {
        const html = renderToString(
            <LightGallery slides={[{ src: 'a.jpg' }]}>
                <LightGalleryItem item={{ src: 'a.jpg' }} href="a.jpg">
                    <img src="thumb.jpg" alt="thumb" />
                </LightGalleryItem>
            </LightGallery>,
        );
        expect(html).toContain('thumb.jpg');
        expect(html).not.toContain('lg-container');
    });
});
