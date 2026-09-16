import {
    getToolbarItemPriority,
    getToolbarOverflow,
} from '@lightgallery/headless';

export interface ToolbarOverflowOptions {
    /** Id of the More options button; the menu id derives from it. */
    id: string;
    /** Accessible name of the More options button and its menu. */
    label: string;
}

const schedule: (callback: () => void) => number =
    typeof requestAnimationFrame === 'function'
        ? (callback) => requestAnimationFrame(callback)
        : (callback) => window.setTimeout(callback, 16);
const cancel: (handle: number) => void =
    typeof cancelAnimationFrame === 'function'
        ? (handle) => cancelAnimationFrame(handle)
        : (handle) => window.clearTimeout(handle);

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
        ) ?? icons[0];
    return shown.outerHTML;
}

/**
 * Keeps the toolbar on one row: measures it, hides the buttons that do
 * not fit (`data-lg-overflow`) and lists them in a "More options" menu
 * whose items trigger the hidden buttons, so every plugin's handlers keep
 * working unchanged.
 */
export class ToolbarOverflow {
    private readonly more: HTMLButtonElement;
    private menu: HTMLElement | null = null;
    private frame = 0;
    private movedSignature = '';
    private readonly widths = new WeakMap<HTMLElement, number>();
    private readonly resizeObserver?: ResizeObserver;
    private readonly mutationObserver?: MutationObserver;

    constructor(
        private readonly toolbar: HTMLElement,
        private readonly options: ToolbarOverflowOptions,
    ) {
        const more = document.createElement('button');
        more.type = 'button';
        more.id = options.id;
        more.className = 'lg-more lg-icon';
        more.hidden = true;
        more.setAttribute('aria-label', options.label);
        more.setAttribute('aria-haspopup', 'menu');
        more.setAttribute('aria-expanded', 'false');
        more.addEventListener('click', this.onMoreClick);
        // Right after the close button, so it sits beside it in the row.
        const close = toolbar.querySelector('.lg-close');
        if (close) {
            close.insertAdjacentElement('afterend', more);
        } else {
            toolbar.insertBefore(more, toolbar.firstChild);
        }
        this.more = more;

        if (typeof ResizeObserver === 'function') {
            this.resizeObserver = new ResizeObserver(this.requestUpdate);
            this.resizeObserver.observe(toolbar);
        }
        if (typeof MutationObserver === 'function') {
            this.mutationObserver = new MutationObserver((records) => {
                // The menu's own re-renders do not change the row.
                if (
                    records.some(
                        (record) =>
                            !(record.target as Element).closest?.(
                                '.lg-toolbar-menu',
                            ),
                    )
                ) {
                    this.requestUpdate();
                }
            });
            this.mutationObserver.observe(toolbar, {
                childList: true,
                subtree: true,
            });
        }
    }

    /** Re-measure the row and move buttons in or out of the menu. */
    update(): void {
        const buttons = toolbarButtons(this.toolbar, this.more);
        buttons.forEach((button) => {
            if (!button.hasAttribute('data-lg-overflow')) {
                const width = button.offsetWidth;
                if (width) {
                    this.widths.set(button, width);
                }
            }
        });
        const fallback =
            buttons
                .map((button) => this.widths.get(button))
                .find((width) => !!width) ?? 0;
        const counter = this.toolbar.querySelector<HTMLElement>('.lg-counter');

        const moved = getToolbarOverflow({
            available: this.toolbar.clientWidth,
            reserved: counter ? counter.offsetWidth : 0,
            moreWidth: this.widths.get(this.more) ?? fallback,
            items: buttons.map((button) => ({
                width: this.widths.get(button) ?? fallback,
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
        this.more.hidden = overflow.size === 0;
        if (!this.more.hidden && this.more.offsetWidth) {
            this.widths.set(this.more, this.more.offsetWidth);
        }
        const signature = `${buttons.length}:${moved.join(',')}`;
        const changed = signature !== this.movedSignature;
        this.movedSignature = signature;
        if (!overflow.size) {
            this.close(false);
        } else if (this.menu && changed) {
            this.renderMenu();
        }
    }

    /** Close the menu; optionally hand focus back to the More button. */
    close(returnFocus: boolean): void {
        if (!this.menu) {
            return;
        }
        this.menu.removeEventListener('keydown', this.onMenuKeydown);
        this.menu.remove();
        this.menu = null;
        document.removeEventListener(
            'pointerdown',
            this.onDocumentPointerDown,
            true,
        );
        this.more.setAttribute('aria-expanded', 'false');
        this.more.removeAttribute('aria-controls');
        if (returnFocus) {
            this.more.focus();
        }
    }

    destroy(): void {
        this.close(false);
        cancel(this.frame);
        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
        toolbarButtons(this.toolbar, this.more).forEach((button) =>
            button.removeAttribute('data-lg-overflow'),
        );
        this.more.remove();
    }

    private readonly requestUpdate = (): void => {
        if (this.frame) {
            return;
        }
        this.frame = schedule(() => {
            this.frame = 0;
            this.update();
        });
    };

    private readonly onMoreClick = (): void => {
        if (this.menu) {
            this.close(true);
        } else {
            this.open();
        }
    };

    private open(): void {
        const menu = document.createElement('div');
        menu.id = `${this.options.id}-menu`;
        menu.className = 'lg-toolbar-menu';
        menu.setAttribute('role', 'menu');
        menu.setAttribute('aria-label', this.options.label);
        menu.addEventListener('keydown', this.onMenuKeydown);
        this.menu = menu;
        this.renderMenu();
        this.toolbar.appendChild(menu);
        this.more.setAttribute('aria-expanded', 'true');
        this.more.setAttribute('aria-controls', menu.id);
        document.addEventListener(
            'pointerdown',
            this.onDocumentPointerDown,
            true,
        );
        this.items()[0]?.focus();
    }

    private renderMenu(): void {
        const menu = this.menu;
        if (!menu) {
            return;
        }
        menu.textContent = '';
        toolbarButtons(this.toolbar, this.more)
            .filter((button) => button.hasAttribute('data-lg-overflow'))
            .forEach((button) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'lg-toolbar-menu-item';
                item.setAttribute('role', 'menuitem');
                const icon = document.createElement('span');
                icon.className = 'lg-toolbar-menu-icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.innerHTML = visibleIconMarkup(button);
                const label = document.createElement('span');
                label.textContent = button.getAttribute('aria-label') ?? '';
                item.append(icon, label);
                item.addEventListener('click', () => {
                    this.close(true);
                    button.click();
                });
                menu.appendChild(item);
            });
    }

    private items(): HTMLElement[] {
        return this.menu
            ? Array.from(
                  this.menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
              )
            : [];
    }

    private readonly onMenuKeydown = (event: KeyboardEvent): void => {
        const items = this.items();
        const index = items.indexOf(document.activeElement as HTMLElement);
        switch (event.key) {
            case 'Escape':
                this.close(true);
                break;
            case 'ArrowDown':
                items[(index + 1) % items.length]?.focus();
                break;
            case 'ArrowUp':
                items[(index - 1 + items.length) % items.length]?.focus();
                break;
            case 'Home':
                items[0]?.focus();
                break;
            case 'End':
                items[items.length - 1]?.focus();
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                // Keep the gallery from changing slides behind the menu.
                break;
            case 'Tab':
                this.close(false);
                return;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
    };

    private readonly onDocumentPointerDown = (event: Event): void => {
        const target = event.target as Node | null;
        if (
            target &&
            (this.menu?.contains(target) || this.more.contains(target))
        ) {
            return;
        }
        this.close(false);
    };
}
