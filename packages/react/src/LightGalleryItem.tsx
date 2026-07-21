import {
    useEffect,
    useRef,
    type ComponentPropsWithoutRef,
    type ElementType,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
} from 'react';

import {
    useGalleryActions,
    useGalleryInternal,
    type ItemRegistration,
} from './context';
import type { GalleryItem } from './types';

export interface LightGalleryItemProps
    extends Omit<ComponentPropsWithoutRef<'a'>, 'onClick'> {
    /** The slide this trigger opens (also the item data in uncontrolled mode). */
    item: GalleryItem;
    /** Element to render; defaults to an anchor. */
    as?: ElementType;
    onClick?: (event: MouseEvent) => void;
    children?: ReactNode;
}

/**
 * Uncontrolled-mode trigger (ADR 0001 §3): renders the thumbnail markup and
 * opens the gallery at its slide on click. Mount order defines slide order.
 * The rendered element doubles as the zoom-from-origin measurement target
 * (the first `<img>` inside it, falling back to the element itself).
 */
export function LightGalleryItem({
    item,
    as: Component = 'a',
    onClick,
    children,
    ...rest
}: LightGalleryItemProps): ReactElement {
    const internal = useGalleryInternal();
    const actions = useGalleryActions();

    const registrationRef = useRef<ItemRegistration | null>(null);
    if (registrationRef.current === null) {
        registrationRef.current = { item, element: null };
    }
    // Keep the latest data for open-time reads (origin rect, item fields).
    registrationRef.current.item = item;

    const { registerItem } = internal;
    useEffect(
        () => registerItem(registrationRef.current!),
        [registerItem],
    );

    const handleClick = (event: MouseEvent) => {
        onClick?.(event);
        if (event.defaultPrevented) {
            return;
        }
        event.preventDefault();
        const index = internal.getItemIndex(registrationRef.current!);
        if (index >= 0) {
            actions.openGallery(index);
        }
    };

    return (
        <Component
            {...rest}
            ref={(element: HTMLElement | null) => {
                registrationRef.current!.element = element;
            }}
            onClick={handleClick}
        >
            {children}
        </Component>
    );
}
