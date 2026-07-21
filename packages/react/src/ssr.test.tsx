// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { LightGallery } from './index';

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
});
