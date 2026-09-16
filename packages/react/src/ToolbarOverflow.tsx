import {
    coreDefaultIcons,
    getToolbarItemPriority,
    getToolbarOverflow,
} from '@lightgallery/headless';
import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type ReactElement,
} from 'react';

import { useGallerySettings, useGalleryState } from './context';
import { cx } from './cx';
import { useIsoLayoutEffect } from './hooks';
import { useCustomIcons } from './icons';

interface MenuEntry {
    key: number;
    label: string;
    iconHtml: string;
    element: HTMLElement;
}

const schedule = (callback: () => void): number =>
    typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame(callback)
        : window.setTimeout(callback, 16);
const cancel = (handle: number): void =>
    typeof cancelAnimationFrame === 'function'
        ? cancelAnimationFrame(handle)
        : window.clearTimeout(handle);

/**
 * The toolbar's own icon buttons in DOM order: not the More button, not
 * the menu's items or the share dropdown's links, and not icons nested
 * inside another button.
 */
function toolbarButtons(toolbar: Element, more: Element): HTMLElement[] {
    return Array.from(toolbar.querySelectorAll<HTMLElement>('.lg-icon')).filter(
        (button) =>
            button !== more &&
            !button.closest('.lg-toolbar-menu, .lg-dropdown') &&
            !button.parentElement?.closest('.lg-icon'),
    );
}

/** The icon a button currently shows (state pairs render both). */
function visibleIconMarkup(button: HTMLElement): string {
    const icons = Array.from(button.querySelectorAll<HTMLElement>('.lg-ci'));
    if (!icons.length) {
        return button.querySelector('svg')?.outerHTML ?? '';
    }
    const shown =
        icons.find(
            (icon) => window.getComputedStyle(icon).display !== 'none',
        ) ?? icons[0]!;
    return shown.outerHTML;
}

function snapshot(buttons: HTMLElement[]): MenuEntry[] {
    return buttons
        .filter((button) => button.hasAttribute('data-lg-overflow'))
        .map((button, key) => ({
            key,
            label: button.getAttribute('aria-label') ?? '',
            iconHtml: visibleIconMarkup(button),
            element: button,
        }));
}

/**
 * Keeps the toolbar on one row (`toolbarOverflow`): measures the row,
 * hides the buttons that do not fit (`data-lg-overflow`, set on the
 * elements themselves so plugin buttons need no changes) and lists them
 * in a "More options" menu whose items click the hidden buttons.
 */
export function ToolbarOverflow(): ReactElement {
    const settings = useGallerySettings();
    const state = useGalleryState();
    const icon = useCustomIcons(['more'], coreDefaultIcons);
    const menuId = useId();
    const moreRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const widths = useRef(new WeakMap<HTMLElement, number>());
    const openRef = useRef(false);
    const focusFirstRef = useRef(false);
    const signatureRef = useRef('');
    const [hasOverflow, setHasOverflow] = useState(false);
    const [entries, setEntries] = useState<MenuEntry[] | null>(null);

    const close = useCallback((returnFocus: boolean) => {
        if (!openRef.current) {
            return;
        }
        openRef.current = false;
        setEntries(null);
        if (returnFocus) {
            moreRef.current?.focus();
        }
    }, []);

    const openMenu = useCallback(() => {
        const more = moreRef.current;
        const toolbar = more?.closest('.lg-toolbar');
        if (!more || !toolbar) {
            return;
        }
        openRef.current = true;
        focusFirstRef.current = true;
        setEntries(snapshot(toolbarButtons(toolbar, more)));
    }, []);

    const update = useCallback(() => {
        const more = moreRef.current;
        const toolbar = more?.closest('.lg-toolbar');
        if (!more || !toolbar) {
            return;
        }
        const buttons = toolbarButtons(toolbar, more);
        buttons.forEach((button) => {
            if (!button.hasAttribute('data-lg-overflow')) {
                const width = button.offsetWidth;
                if (width) {
                    widths.current.set(button, width);
                }
            }
        });
        const fallback =
            buttons
                .map((button) => widths.current.get(button))
                .find((width) => !!width) ?? 0;
        const counter = toolbar.querySelector<HTMLElement>('.lg-counter');
        const moved = getToolbarOverflow({
            available: toolbar.clientWidth,
            reserved: counter ? counter.offsetWidth : 0,
            moreWidth: widths.current.get(more) ?? fallback,
            items: buttons.map((button) => ({
                width: widths.current.get(button) ?? fallback,
                priority: getToolbarItemPriority(Array.from(button.classList)),
            })),
        });
        const overflow = new Set(moved);
        buttons.forEach((button, index) => {
            if (overflow.has(index)) {
                button.setAttribute('data-lg-overflow', '');
            } else {
                button.removeAttribute('data-lg-overflow');
            }
        });
        setHasOverflow(overflow.size > 0);
        const signature = `${buttons.length}:${moved.join(',')}`;
        const changed = signature !== signatureRef.current;
        signatureRef.current = signature;
        if (!overflow.size) {
            close(false);
        } else if (openRef.current && changed) {
            setEntries(snapshot(buttons));
        }
    }, [close]);

    useIsoLayoutEffect(() => {
        const more = moreRef.current;
        const toolbar = more?.closest('.lg-toolbar');
        if (!more || !toolbar) {
            return;
        }
        let frame = 0;
        const request = () => {
            if (frame) {
                return;
            }
            frame = schedule(() => {
                frame = 0;
                update();
            });
        };
        update();
        const resize =
            typeof ResizeObserver === 'function'
                ? new ResizeObserver(request)
                : undefined;
        resize?.observe(toolbar);
        const mutation =
            typeof MutationObserver === 'function'
                ? new MutationObserver((records) => {
                      // The menu's own re-renders do not change the row.
                      if (
                          records.some(
                              (record) =>
                                  !(record.target as Element).closest?.(
                                      '.lg-toolbar-menu',
                                  ),
                          )
                      ) {
                          request();
                      }
                  })
                : undefined;
        mutation?.observe(toolbar, { childList: true, subtree: true });
        return () => {
            cancel(frame);
            resize?.disconnect();
            mutation?.disconnect();
            toolbarButtons(toolbar, more).forEach((button) =>
                button.removeAttribute('data-lg-overflow'),
            );
        };
    }, [update]);

    // The row can change with the slide (per-slide download) or on open.
    useEffect(() => {
        update();
    }, [update, state.currentIndex, state.open]);

    useEffect(() => {
        if (!state.open) {
            close(false);
        }
    }, [state.open, close]);

    useIsoLayoutEffect(() => {
        if (hasOverflow && moreRef.current?.offsetWidth) {
            widths.current.set(moreRef.current, moreRef.current.offsetWidth);
        }
    }, [hasOverflow]);

    useEffect(() => {
        const more = moreRef.current;
        if (!more) {
            return;
        }
        const onClick = () => {
            if (openRef.current) {
                close(true);
            } else {
                openMenu();
            }
        };
        more.addEventListener('click', onClick);
        return () => more.removeEventListener('click', onClick);
    }, [close, openMenu]);

    useEffect(() => {
        const menu = menuRef.current;
        if (!entries || !menu) {
            return;
        }
        const items = () =>
            Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
        if (focusFirstRef.current) {
            focusFirstRef.current = false;
            items()[0]?.focus();
        }
        const onKeyDown = (event: KeyboardEvent) => {
            const list = items();
            const index = list.indexOf(document.activeElement as HTMLElement);
            switch (event.key) {
                case 'Escape':
                    close(true);
                    break;
                case 'ArrowDown':
                    list[(index + 1) % list.length]?.focus();
                    break;
                case 'ArrowUp':
                    list[(index - 1 + list.length) % list.length]?.focus();
                    break;
                case 'Home':
                    list[0]?.focus();
                    break;
                case 'End':
                    list[list.length - 1]?.focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    // Keep the gallery from changing slides behind the menu.
                    break;
                case 'Tab':
                    close(false);
                    return;
                default:
                    return;
            }
            event.preventDefault();
            event.stopPropagation();
        };
        const onClick = (event: MouseEvent) => {
            const item = (event.target as Element | null)?.closest<HTMLElement>(
                '[role="menuitem"]',
            );
            const entry = item
                ? entries[Number(item.dataset.index)]
                : undefined;
            if (!entry) {
                return;
            }
            close(true);
            entry.element.click();
        };
        const onPointerDown = (event: Event) => {
            const target = event.target as Node | null;
            if (
                target &&
                (menu.contains(target) || moreRef.current?.contains(target))
            ) {
                return;
            }
            close(false);
        };
        menu.addEventListener('keydown', onKeyDown);
        menu.addEventListener('click', onClick);
        document.addEventListener('pointerdown', onPointerDown, true);
        return () => {
            menu.removeEventListener('keydown', onKeyDown);
            menu.removeEventListener('click', onClick);
            document.removeEventListener('pointerdown', onPointerDown, true);
        };
    }, [entries, close]);

    return (
        <>
            <button
                ref={moreRef}
                type="button"
                className={cx('lg-more lg-icon', icon.className)}
                hidden={!hasOverflow}
                aria-label={settings.strings.moreOptions}
                aria-haspopup="menu"
                aria-expanded={!!entries}
                aria-controls={entries ? menuId : undefined}
            >
                {icon.content}
            </button>
            {entries && (
                <div
                    ref={menuRef}
                    id={menuId}
                    className="lg-toolbar-menu"
                    role="menu"
                    aria-label={settings.strings.moreOptions}
                >
                    {entries.map((entry) => (
                        <button
                            key={entry.key}
                            type="button"
                            role="menuitem"
                            className="lg-toolbar-menu-item"
                            data-index={entry.key}
                        >
                            <span
                                className="lg-toolbar-menu-icon"
                                aria-hidden="true"
                                dangerouslySetInnerHTML={{
                                    __html: entry.iconHtml,
                                }}
                            />
                            <span>{entry.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
