/**
 * Comment plugin: Disqus gets each item's `data-disqus-url`. Rotate
 * plugin: a gallery with `rotate: false` closes without the plugin
 * throwing.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallerySettings } from '../src/lg-settings';
import Comment from '../src/plugins/comment/lg-comment';
import Rotate from '../src/plugins/rotate/lg-rotate';

const ZERO_MOTION: LightGallerySettings = {
    speed: 0,
    backdropDuration: 0,
    startAnimationDuration: 0,
    zoomFromOrigin: false,
};

function markup(attrs = ''): void {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png" ${attrs}><img src="a-t.png" alt="a" /></a>
            <a href="b.png"><img src="b-t.png" alt="b" /></a>
        </div>`;
}

describe('comment plugin, Disqus', () => {
    afterEach(() => {
        delete (window as unknown as { DISQUS?: unknown }).DISQUS;
        jest.useRealTimers();
    });

    it('passes the item data-disqus-url to DISQUS.reset', () => {
        jest.useFakeTimers();
        const page: { identifier?: string; url?: string } = {};
        const reset = jest.fn(({ config }: { config: () => void }) => {
            config.call({ page });
        });
        (window as unknown as { DISQUS: unknown }).DISQUS = { reset };
        markup(
            'data-disqus-identifier="slide-a" data-disqus-url="https://example.com/slide-a"',
        );
        const lg = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                ...ZERO_MOTION,
                plugins: [Comment],
                commentBox: true,
                disqusComments: true,
            },
        );
        lg.openGallery(0);
        jest.runAllTimers();

        expect(reset).toHaveBeenCalled();
        expect(page.identifier).toBe('slide-a');
        expect(page.url).toBe('https://example.com/slide-a');
        lg.destroy();
    });
});

describe('rotate plugin, switched off', () => {
    it('closes without a module warning when rotate is false', () => {
        const warn = jest
            .spyOn(console, 'warn')
            .mockImplementation(() => undefined);
        markup();
        const lg = lightGallery(
            document.getElementById('lightGallery') as HTMLElement,
            {
                ...ZERO_MOTION,
                plugins: [Rotate],
                rotate: false,
            },
        );
        lg.openGallery(0);
        lg.closeGallery();

        const moduleWarnings = warn.mock.calls.filter((args) =>
            String(args[0]).includes('properly destroyed'),
        );
        expect(moduleWarnings).toHaveLength(0);
        warn.mockRestore();
        lg.destroy();
    });
});
