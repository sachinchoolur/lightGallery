import { describe, expect, it } from 'vitest';

import {
    TOOLBAR_DEFAULT_PRIORITY,
    TOOLBAR_PINNED,
    getToolbarItemPriority,
    getToolbarOverflow,
    isToolbarEventPath,
} from './toolbar-overflow';

const item = (priority: number, width = 50) => ({ width, priority });

describe('getToolbarItemPriority', () => {
    it('pins the close button and ranks the rest by class', () => {
        expect(getToolbarItemPriority(['lg-close', 'lg-icon'])).toBe(
            TOOLBAR_PINNED,
        );
        expect(getToolbarItemPriority(['lg-share', 'lg-icon'])).toBe(30);
        expect(getToolbarItemPriority(['lg-rotate-left', 'lg-icon'])).toBe(10);
        expect(getToolbarItemPriority(['lg-actual-size', 'lg-icon'])).toBe(0);
    });

    it('ranks the vanilla actual-size button by its zoom class', () => {
        expect(getToolbarItemPriority(['lg-zoom-in', 'lg-icon'])).toBe(0);
    });

    it('gives unknown buttons the default priority', () => {
        expect(getToolbarItemPriority(['my-button', 'lg-icon'])).toBe(
            TOOLBAR_DEFAULT_PRIORITY,
        );
    });
});

describe('getToolbarOverflow', () => {
    it('moves nothing when every button fits beside the counter', () => {
        expect(
            getToolbarOverflow({
                available: 400,
                reserved: 80,
                moreWidth: 50,
                items: [item(30), item(10), item(0)],
            }),
        ).toEqual([]);
    });

    it('moves nothing before the toolbar has been laid out', () => {
        expect(
            getToolbarOverflow({
                available: 0,
                reserved: 0,
                moreWidth: 50,
                items: [item(10), item(10)],
            }),
        ).toEqual([]);
    });

    it('moves the lowest priority first and pays for the More button', () => {
        // 80 + 6 * 50 = 380 > 300; with More (50) the row must shed 130,
        // so three buttons go, lowest priority first.
        const items = [
            item(TOOLBAR_PINNED),
            item(30),
            item(10),
            item(0),
            item(10),
            item(0),
        ];
        expect(
            getToolbarOverflow({
                available: 300,
                reserved: 80,
                moreWidth: 50,
                items,
            }),
        ).toEqual([3, 4, 5]);
    });

    it('moves the button later in DOM order first among equals', () => {
        // 5 * 50 = 250 > 200; with More (50) the row sheds 100: the last two.
        expect(
            getToolbarOverflow({
                available: 200,
                reserved: 0,
                moreWidth: 50,
                items: [item(10), item(10), item(10), item(10), item(10)],
            }),
        ).toEqual([3, 4]);
    });

    it('never moves a pinned button, even when the row cannot fit', () => {
        expect(
            getToolbarOverflow({
                available: 60,
                reserved: 40,
                moreWidth: 50,
                items: [item(TOOLBAR_PINNED), item(10), item(0)],
            }),
        ).toEqual([1, 2]);
    });
});

describe('isToolbarEventPath', () => {
    const node = (...classes: string[]) => ({
        classList: { contains: (name: string) => classes.includes(name) },
    });

    it('is true when the path runs through the toolbar', () => {
        expect(
            isToolbarEventPath([
                node('lg-icon'),
                node('lg-toolbar'),
                node('lg-outer'),
            ]),
        ).toBe(true);
    });

    it('is false for the slide, the backdrop and nodes without classes', () => {
        expect(
            isToolbarEventPath([node('lg-image'), node('lg-outer'), {}]),
        ).toBe(false);
    });
});
