import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from './index';
import Autoplay from './plugins/autoplay';
import Comment from './plugins/comment';
import Fullscreen from './plugins/fullscreen';
import Pager from './plugins/pager';
import Rotate from './plugins/rotate';
import Share from './plugins/share';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';
import Zoom from './plugins/zoom';

const slides: GalleryItem[] = [
    { src: 'a.jpg', alt: 'a', thumb: 'a-t.jpg', caption: 'Caption A' },
    { src: 'b.jpg', alt: 'b', thumb: 'b-t.jpg' },
    { src: 'c.jpg', alt: 'c', thumb: 'c-t.jpg' },
];

describe('accessibility', () => {
    describe('with fake timers', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            act(() => {
                vi.runOnlyPendingTimers();
            });
            vi.useRealTimers();
        });

        function tick(ms: number) {
            act(() => {
                vi.advanceTimersByTime(ms);
            });
        }

        it('has dialog semantics with an accessible name', () => {
            render(
                <LightGallery
                    slides={slides}
                    open={true}
                    onClose={() => undefined}
                />,
            );
            tick(450);
            const dialog = document.querySelector('.lg-container');
            expect(dialog).toHaveAttribute('role', 'dialog');
            expect(dialog).toHaveAttribute('aria-modal', 'true');
            expect(dialog).toHaveAttribute('aria-label', 'Gallery');
        });

        it('traps Tab within the dialog in both directions', () => {
            // download off so <button> elements are the only focusables.
            render(
                <LightGallery
                    slides={slides}
                    open={true}
                    onClose={() => undefined}
                    download={false}
                />,
            );
            tick(450);
            const container = document.querySelector<HTMLElement>(
                '.lg-container',
            )!;
            const buttons = [
                ...container.querySelectorAll<HTMLElement>('button'),
            ];
            const last = buttons[buttons.length - 1]!;

            last.focus();
            fireEvent.keyDown(document, { key: 'Tab' });
            expect(document.activeElement).toBe(buttons[0]);

            fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
            expect(document.activeElement).toBe(last);
        });

        it('moves focus into the gallery on open and back to the trigger on close', () => {
            render(
                <LightGallery slides={slides}>
                    {slides.map((item, index) => (
                        <LightGalleryItem
                            key={index}
                            item={item}
                            data-testid={`trig-${index}`}
                            href={item.src}
                        >
                            <img src={item.thumb} alt={item.alt} />
                        </LightGalleryItem>
                    ))}
                </LightGallery>,
            );
            const trigger = screen.getByTestId('trig-1');
            trigger.focus();
            fireEvent.click(trigger);
            tick(50);
            expect(document.activeElement).toBe(
                document.querySelector('.lg-container'),
            );

            fireEvent.keyDown(document, { key: 'Escape' });
            tick(500);
            expect(document.querySelector('.lg-container')).toBeNull();
            expect(document.activeElement).toBe(trigger);
        });

        it('collapses animation durations under prefers-reduced-motion', () => {
            const matchMedia = vi
                .spyOn(window, 'matchMedia')
                .mockImplementation(
                    (query: string) =>
                        ({
                            matches: query.includes('prefers-reduced-motion'),
                            media: query,
                            addEventListener: () => undefined,
                            removeEventListener: () => undefined,
                        }) as unknown as MediaQueryList,
                );
            render(
                <LightGallery
                    slides={slides}
                    open={true}
                    onClose={() => undefined}
                />,
            );
            tick(450);
            expect(
                document.querySelector<HTMLElement>('.lg-inner')!.style
                    .transitionDuration,
            ).toBe('0ms');
            expect(
                document.querySelector<HTMLElement>('.lg-backdrop')!.style
                    .transitionDuration,
            ).toBe('0ms');
            matchMedia.mockRestore();
        });

        it('makes thumbnails and pager dots keyboard operable', () => {
            render(
                <LightGallery
                    slides={slides}
                    open={true}
                    onClose={() => undefined}
                    plugins={[Thumbnail, Pager]}
                />,
            );
            tick(450);
            fireEvent.load(
                document.querySelector('img.lg-image[alt="a"]')!,
            );

            const thumb = document.querySelectorAll('.lg-thumb-item')[2]!;
            expect(thumb).toHaveAttribute('role', 'button');
            expect(thumb).toHaveAttribute('tabindex', '0');
            fireEvent.keyDown(thumb, { key: 'Enter' });
            expect(
                document.querySelector('.lg-counter-current')?.textContent,
            ).toBe('3');
            tick(600);

            const dot = document.querySelectorAll('.lg-pager-cont')[0]!;
            fireEvent.keyDown(dot, { key: ' ' });
            expect(
                document.querySelector('.lg-counter-current')?.textContent,
            ).toBe('1');
            tick(600);
        });
    });

    it('has zero WCAG A/AA axe violations with plugins loaded', async () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                backdropDuration={10}
                speed={10}
                plugins={[
                    Thumbnail,
                    Zoom,
                    Video,
                    Autoplay,
                    Fullscreen,
                    Pager,
                    Share,
                    Rotate,
                    Comment,
                ]}
                comment={{
                    commentBox: true,
                    renderComments: () => <p>Comments</p>,
                }}
                zoom={{ showZoomInOutIcons: true }}
            />,
        );
        await waitFor(() =>
            expect(document.querySelector('.lg-outer')).not.toBeNull(),
        );
        const results = await axe(
            document.querySelector<HTMLElement>('.lg-container')!,
            { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
        );
        expect(results.violations).toEqual([]);
    }, 20000);
});
