import { useState, type ReactNode } from 'react';
import { LightGalleryItem, type GalleryItem } from '@lightgallery/react';

import type { DemoItem } from '../../shared/media';

/** Page settings as one object, patched a key at a time. */
export function useSettings<T extends object>(initial: T) {
    const [settings, setSettings] = useState(initial);
    const patch = <K extends keyof T>(key: K, value: T[K]) =>
        setSettings((current) => ({ ...current, [key]: value }));
    return [settings, patch] as const;
}

export function flip<T>(list: readonly T[], value: T): T[] {
    return list.includes(value)
        ? list.filter((entry) => entry !== value)
        : [...list, value];
}

export function Panel({ children }: { children: ReactNode }) {
    return (
        <details className="panel" open>
            <summary>Settings</summary>
            <div className="controls">{children}</div>
        </details>
    );
}

export function Group({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="control-group">
            <strong>{title}</strong>
            {children}
        </div>
    );
}

export function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (next: boolean) => void;
}) {
    return (
        <label>
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            {label}
        </label>
    );
}

export function Choice<T extends string | number>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: readonly T[];
    onChange: (next: T) => void;
}) {
    return (
        <label>
            {label}
            <select
                value={String(value)}
                onChange={(event) => {
                    const match = options.find(
                        (entry) => String(entry) === event.target.value,
                    );
                    if (match !== undefined) onChange(match);
                }}
            >
                {options.map((entry) => (
                    <option key={String(entry)} value={String(entry)}>
                        {String(entry)}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function Readout({ children }: { children: ReactNode }) {
    return <p className="readout">{children}</p>;
}

/** Grid trigger sized to the item's own aspect ratio. */
export function Tile({
    item,
    caption = true,
}: {
    item: DemoItem;
    caption?: boolean;
}) {
    const trigger = (
        <LightGalleryItem
            item={item as GalleryItem}
            href={item.src}
            data-lg-size={item.lgSize}
        >
            <img
                src={item.thumb}
                alt={item.alt}
                width={item.thumbWidth}
                height={item.thumbHeight}
                loading="lazy"
            />
        </LightGalleryItem>
    );
    if (!caption) return trigger;
    return (
        <figure className="tile">
            {trigger}
            <figcaption>{item.caption}</figcaption>
        </figure>
    );
}
