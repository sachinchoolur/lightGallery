import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LightGallery, type GalleryItem, type LgIconName } from './index';
import Autoplay from './plugins/autoplay';
import Comment from './plugins/comment';

const slides: GalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'B' },
];

const svg = (id: string) => (
    <svg data-lg-test={id} viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" />
    </svg>
);

describe('custom icons (render.icon)', () => {
    it('renders provided icons and suppresses the glyph class-wise', () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                render={{
                    icon: (name: LgIconName) =>
                        name === 'close' ? svg('close') : undefined,
                }}
            />,
        );
        const close = document.querySelector('.lg-close')!;
        expect(close.classList.contains('lg-icon-custom')).toBe(true);
        expect(
            close.querySelector('.lg-ci-close svg[data-lg-test="close"]'),
        ).not.toBeNull();
        // Un-answered names render the built-in default SVG.
        const prev = document.querySelector('.lg-prev')!;
        expect(prev.classList.contains('lg-icon-custom')).toBe(true);
        expect(prev.querySelector('.lg-ci-prev svg')).not.toBeNull();
        expect(prev.querySelector('svg[data-lg-test]')).toBeNull();
    });

    it('renders both icons of a state pair and skips half pairs', () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                plugins={[Autoplay]}
                render={{
                    icon: (name: LgIconName) => {
                        if (name === 'autoplayPlay') return svg('play');
                        if (name === 'autoplayPause') return svg('pause');
                        return undefined;
                    },
                }}
            />,
        );
        const button = document.querySelector('.lg-autoplay-button')!;
        expect(button.classList.contains('lg-icon-custom')).toBe(true);
        expect(
            button.querySelector('.lg-ci-autoplay-play [data-lg-test="play"]'),
        ).not.toBeNull();
        expect(
            button.querySelector(
                '.lg-ci-autoplay-pause [data-lg-test="pause"]',
            ),
        ).not.toBeNull();
    });

    it('lets the whole-button prev/next slots win over the icon slot', () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                render={{
                    prevButton: () => <span data-lg-test="whole-prev" />,
                    icon: () => svg('generic'),
                }}
            />,
        );
        const prev = document.querySelector('.lg-prev')!;
        expect(prev.querySelector('[data-lg-test="whole-prev"]')).not.toBeNull();
        expect(prev.classList.contains('lg-icon-custom')).toBe(false);
        expect(prev.querySelector('.lg-ci')).toBeNull();
    });

    it('covers the comment plugin buttons with defaults', () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                plugins={[Comment]}
                comment={{ commentBox: true }}
            />,
        );
        expect(
            document.querySelector(
                '.lg-comment-toggle.lg-icon-custom .lg-ci-comment svg',
            ),
        ).not.toBeNull();
        expect(
            document.querySelector(
                '.lg-comment-close.lg-icon-custom .lg-ci-comment-close svg',
            ),
        ).not.toBeNull();
    });
});
