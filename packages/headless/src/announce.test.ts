import { describe, expect, it } from 'vitest';

import { formatSlideAnnouncement } from './announce';

const TEMPLATE = 'Image {index} of {total}';

describe('formatSlideAnnouncement', () => {
    it('fills the index and total slots', () => {
        expect(
            formatSlideAnnouncement({ template: TEMPLATE, index: 2, total: 9 }),
        ).toBe('Image 2 of 9');
    });

    it('appends the caption when present', () => {
        expect(
            formatSlideAnnouncement({
                template: TEMPLATE,
                index: 1,
                total: 3,
                caption: 'Caption A',
            }),
        ).toBe('Image 1 of 3, Caption A');
    });

    it('collapses caption whitespace to a single sentence', () => {
        expect(
            formatSlideAnnouncement({
                template: TEMPLATE,
                index: 1,
                total: 3,
                caption: '  Title\n\n   description  ',
            }),
        ).toBe('Image 1 of 3, Title description');
    });

    it('ignores empty and whitespace-only captions', () => {
        expect(
            formatSlideAnnouncement({
                template: TEMPLATE,
                index: 3,
                total: 3,
                caption: '   ',
            }),
        ).toBe('Image 3 of 3');
    });

    it('honors a localized template', () => {
        expect(
            formatSlideAnnouncement({
                template: 'Bild {index} von {total}',
                index: 4,
                total: 7,
            }),
        ).toBe('Bild 4 von 7');
    });
});
