import '@testing-library/jest-dom';
import lightGallery from '../src';
import Autoplay from '../src/plugins/autoplay/lg-autoplay';
import Comment from '../src/plugins/comment/lg-comment';
import Thumbnail from '../src/plugins/thumbnail/lg-thumbnail';
import Share from '../src/plugins/share/lg-share';
import Zoom from '../src/plugins/zoom/lg-zoom';

const SVG = (id: string) =>
    `<svg data-lg-test="${id}" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>`;

const setup = () => {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png"><img src="b.png" /></a>
            <a href="c.png"><img src="d.png" /></a>
        </div>`;
    return document.getElementById('lightGallery') as HTMLElement;
};

describe('custom icons (settings.icons)', () => {
    it('injects a provided SVG and suppresses the font glyph class-wise', () => {
        lightGallery(setup(), {
            icons: { close: SVG('close') },
        });
        const close = document.querySelector('.lg-close')!;
        expect(close).toHaveClass('lg-icon-custom');
        expect(
            close.querySelector('.lg-ci-close svg[data-lg-test="close"]'),
        ).toBeInTheDocument();
    });

    it('renders the built-in SVG for names without an override', () => {
        lightGallery(setup(), {
            icons: { close: SVG('close') },
        });
        const prev = document.querySelector('.lg-prev')!;
        expect(prev).toHaveClass('lg-icon-custom');
        // Default icon, not the override.
        expect(prev.querySelector('.lg-ci-prev svg')).toBeInTheDocument();
        expect(prev.querySelector('svg[data-lg-test]')).toBeNull();
    });

    it('covers plugin buttons through the same pass', () => {
        lightGallery(setup(), {
            plugins: [Zoom],
            showZoomInOutIcons: true,
            icons: { zoomIn: SVG('zin'), zoomOut: SVG('zout') },
        });
        expect(
            document.querySelector(
                '.lg-zoom-in.lg-icon-custom svg[data-lg-test="zin"]',
            ),
        ).toBeInTheDocument();
        expect(
            document.querySelector(
                '.lg-zoom-out.lg-icon-custom svg[data-lg-test="zout"]',
            ),
        ).toBeInTheDocument();
    });

    it('renders both icons of a state pair', () => {
        lightGallery(setup(), {
            plugins: [Autoplay],
            icons: {
                autoplayPlay: SVG('play'),
                autoplayPause: SVG('pause'),
            },
        });
        const button = document.querySelector('.lg-autoplay-button')!;
        expect(button).toHaveClass('lg-icon-custom');
        expect(
            button.querySelector(
                '.lg-ci-autoplay-play svg[data-lg-test="play"]',
            ),
        ).toBeInTheDocument();
        expect(
            button.querySelector(
                '.lg-ci-autoplay-pause svg[data-lg-test="pause"]',
            ),
        ).toBeInTheDocument();
    });

    it('falls back to the default pair when an override is half-provided', () => {
        lightGallery(setup(), {
            plugins: [Autoplay],
            icons: { autoplayPlay: SVG('play') },
        });
        const button = document.querySelector('.lg-autoplay-button')!;
        expect(button).toHaveClass('lg-icon-custom');
        // Both DEFAULT icons render; the lone override is ignored so no
        // state ends up with a mismatched pair.
        expect(
            button.querySelector('.lg-ci-autoplay-play svg'),
        ).toBeInTheDocument();
        expect(
            button.querySelector('.lg-ci-autoplay-pause svg'),
        ).toBeInTheDocument();
        expect(button.querySelector('svg[data-lg-test]')).toBeNull();
    });

    it('prepends into the share button without destroying its dropdown', () => {
        // The dropdown ul lives INSIDE .lg-share — injection must keep it.
        lightGallery(setup(), {
            plugins: [Share],
            icons: { share: SVG('share') },
        });
        const share = document.querySelector('.lg-share')!;
        expect(
            share.querySelector('.lg-ci-share svg[data-lg-test="share"]'),
        ).toBeInTheDocument();
        expect(share.querySelector('.lg-dropdown')).toBeInTheDocument();
    });

    it('covers the comment plugin buttons', () => {
        lightGallery(setup(), {
            plugins: [Comment],
            commentBox: true,
        });
        expect(
            document.querySelector(
                '.lg-comment-toggle.lg-icon-custom .lg-ci-comment svg',
            ),
        ).toBeInTheDocument();
        expect(
            document.querySelector(
                '.lg-comment-close.lg-icon-custom .lg-ci-comment-close svg',
            ),
        ).toBeInTheDocument();
    });

    it('covers the thumbnail toggle button', () => {
        lightGallery(setup(), {
            plugins: [Thumbnail],
            toggleThumb: true,
            allowMediaOverlap: true,
        });
        expect(
            document.querySelector(
                '.lg-toggle-thumb.lg-icon-custom .lg-ci-toggle-thumbnails svg',
            ),
        ).toBeInTheDocument();
    });

    it('renders the maximize/minimize pair on inline galleries', () => {
        const host = setup();
        const container = document.createElement('div');
        document.body.appendChild(container);
        lightGallery(host, {
            container,
            closable: false,
            showMaximizeIcon: true,
        });
        const button = document.querySelector('.lg-maximize')!;
        expect(button).toHaveClass('lg-icon-custom');
        expect(button.querySelector('.lg-ci-maximize svg')).toBeInTheDocument();
        expect(button.querySelector('.lg-ci-minimize svg')).toBeInTheDocument();
    });
});
