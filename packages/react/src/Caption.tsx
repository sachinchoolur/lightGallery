import { useEffect, type ReactElement, type ReactNode } from 'react';

import { cx } from './cx';
import {
    useGalleryInternal,
    useGallerySlots,
    useGalleryState,
} from './context';
import type { GalleryItem } from './types';

/**
 * Caption content resolution (ADR 0001 §4/§7): the `render.caption` slot
 * wins, then the item's `caption` ReactNode; raw HTML only via the explicit
 * `captionHtml` opt-in, rendered with `dangerouslySetInnerHTML`.
 */
export function CaptionContent({
    item,
    index,
}: {
    item: GalleryItem;
    index: number;
}): ReactElement | null {
    const slots = useGallerySlots();
    let content: ReactNode = null;
    if (slots.caption) {
        content = slots.caption(item, index);
    } else if (item.caption != null) {
        content = item.caption;
    } else if (item.captionHtml) {
        return <div dangerouslySetInnerHTML={{ __html: item.captionHtml }} />;
    }
    return content == null ? null : <>{content}</>;
}

function hasCaption(item: GalleryItem | undefined): boolean {
    return !!item && (item.caption != null || !!item.captionHtml);
}

/** The shared caption bar (`.lg-sub-html`) for 'bar' and 'outer' positions. */
export function Caption(): ReactElement {
    const state = useGalleryState();
    const internal = useGalleryInternal();
    const slots = useGallerySlots();
    const item = internal.items[state.currentIndex];

    // 2.x afterAppendSubHtml: fired whenever the caption is (re)written.
    const currentIndex = state.currentIndex;
    useEffect(() => {
        internal.emit('onAfterAppendSubHtml', { index: currentIndex });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);
    const empty = !slots.caption && !hasCaption(item);
    return (
        <div
            className={cx('lg-sub-html', empty && 'lg-empty-html')}
            role="status"
            aria-live="polite"
        >
            {item && !empty && (
                <CaptionContent item={item} index={state.currentIndex} />
            )}
        </div>
    );
}
