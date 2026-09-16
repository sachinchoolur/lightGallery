import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import {
    coreDefaultIcons,
    getToolbarItemPriority,
    getToolbarOverflow,
} from '@lightgallery/headless';

import { LG_PLUGIN_CONTEXT } from './features';
import { LgCiComponent, resolveIconSlot } from './icons';
import { LightGalleryStore } from './store';

interface MenuEntry {
    key: number;
    label: string;
    iconHtml: SafeHtml;
    element: HTMLElement;
}

let menuSeq = 0;

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
 * inside another button. Feature buttons sit inside their component
 * hosts, so the search is by descendant, not by child.
 */
function toolbarButtons(toolbar: Element, more: Element): HTMLElement[] {
    return Array.from(toolbar.querySelectorAll<HTMLElement>('.lg-icon')).filter(
        (button) =>
            button !== more &&
            !button.closest('.lg-toolbar-menu, .lg-dropdown') &&
            !button.parentElement?.closest('.lg-icon'),
    );
}

/**
 * The icon a button currently shows (state pairs render both). Icons sit
 * inside `<lg-ci>` hosts, so search by descendant.
 */
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

/**
 * Keeps the toolbar on one row (`toolbarOverflow`): measures the row,
 * hides the buttons that do not fit (`data-lg-overflow`, set on the
 * elements themselves so feature buttons need no changes) and lists them
 * in a "More options" menu whose items click the hidden buttons.
 */
@Component({
    selector: 'lg-toolbar-overflow',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LgCiComponent],
    template: `
        <button
            #more
            type="button"
            class="lg-more lg-icon lg-icon-custom"
            [hidden]="!hasOverflow()"
            [attr.aria-label]="label()"
            aria-haspopup="menu"
            [attr.aria-expanded]="entries() ? 'true' : 'false'"
            [attr.aria-controls]="entries() ? menuId : null"
            (click)="toggle()"
        >
            <lg-ci [slot]="iconSlot()" [names]="['more']" [icons]="icons" />
        </button>
        @if (entries(); as list) {
        <div
            #menu
            [id]="menuId"
            class="lg-toolbar-menu"
            role="menu"
            [attr.aria-label]="label()"
            (keydown)="onMenuKeydown($event)"
        >
            @for (entry of list; track entry.key) {
            <button
                type="button"
                role="menuitem"
                class="lg-toolbar-menu-item"
                (click)="choose(entry)"
            >
                <span
                    class="lg-toolbar-menu-icon"
                    aria-hidden="true"
                    [innerHTML]="entry.iconHtml"
                ></span>
                <span>{{ entry.label }}</span>
            </button>
            }
        </div>
        }
    `,
})
export class LgToolbarOverflowComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    private readonly store = inject(LightGalleryStore);
    private readonly sanitizer = inject(DomSanitizer);

    protected readonly icons = coreDefaultIcons;
    protected readonly menuId = `lg-toolbar-menu-${++menuSeq}`;
    protected readonly label = computed(
        () => this.ctx.settings().strings.moreOptions,
    );
    protected readonly iconSlot = computed(() =>
        resolveIconSlot(this.ctx.icons?.(), ['more']),
    );
    protected readonly hasOverflow = signal(false);
    protected readonly entries = signal<MenuEntry[] | null>(null);

    private readonly moreRef =
        viewChild.required<ElementRef<HTMLButtonElement>>('more');
    private readonly menuRef = viewChild<ElementRef<HTMLElement>>('menu');
    private readonly widths = new WeakMap<HTMLElement, number>();
    private frame = 0;
    private focusFirst = false;
    private listening = false;
    private movedSignature = '';

    constructor() {
        const destroyRef = inject(DestroyRef);
        let resizeObserver: ResizeObserver | undefined;
        let mutationObserver: MutationObserver | undefined;

        afterNextRender(() => {
            const toolbar = this.toolbar();
            if (!toolbar) {
                return;
            }
            this.update();
            if (typeof ResizeObserver === 'function') {
                resizeObserver = new ResizeObserver(this.requestUpdate);
                resizeObserver.observe(toolbar);
            }
            if (typeof MutationObserver === 'function') {
                mutationObserver = new MutationObserver((records) => {
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
                mutationObserver.observe(toolbar, {
                    childList: true,
                    subtree: true,
                });
            }
        });

        // The row can change with the slide (per-slide download) or on open.
        effect(() => {
            this.store.currentIndex();
            const open = this.store.isOpen();
            untracked(() => {
                if (!open) {
                    this.close(false);
                }
                this.requestUpdate();
            });
        });

        effect(() => {
            const menu = this.menuRef()?.nativeElement;
            if (!menu || !this.focusFirst) {
                return;
            }
            this.focusFirst = false;
            menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
        });

        destroyRef.onDestroy(() => {
            cancel(this.frame);
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            this.listenOutside(false);
            const toolbar = this.toolbar();
            if (toolbar) {
                toolbarButtons(toolbar, this.moreRef().nativeElement).forEach(
                    (button) => button.removeAttribute('data-lg-overflow'),
                );
            }
        });
    }

    private toolbar(): Element | null {
        return this.moreRef().nativeElement.closest('.lg-toolbar');
    }

    private listenOutside(on: boolean): void {
        if (on === this.listening) {
            return;
        }
        this.listening = on;
        if (on) {
            document.addEventListener('pointerdown', this.onPointerDown, true);
        } else {
            document.removeEventListener(
                'pointerdown',
                this.onPointerDown,
                true,
            );
        }
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

    private snapshot(buttons: HTMLElement[]): MenuEntry[] {
        return buttons
            .filter((button) => button.hasAttribute('data-lg-overflow'))
            .map((button, key) => ({
                key,
                label: button.getAttribute('aria-label') ?? '',
                // Markup copied from the gallery's own button, trusted.
                iconHtml: this.sanitizer.bypassSecurityTrustHtml(
                    visibleIconMarkup(button),
                ),
                element: button,
            }));
    }

    /** Re-measure the row and move buttons in or out of the menu. */
    update(): void {
        const more = this.moreRef().nativeElement;
        const toolbar = this.toolbar();
        if (!toolbar) {
            return;
        }
        const buttons = toolbarButtons(toolbar, more);
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
        const counter = toolbar.querySelector<HTMLElement>('.lg-counter');
        const moved = getToolbarOverflow({
            available: toolbar.clientWidth,
            reserved: counter ? counter.offsetWidth : 0,
            moreWidth: this.widths.get(more) ?? fallback,
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
        this.hasOverflow.set(overflow.size > 0);
        if (overflow.size && more.offsetWidth) {
            this.widths.set(more, more.offsetWidth);
        }
        const signature = `${buttons.length}:${moved.join(',')}`;
        const changed = signature !== this.movedSignature;
        this.movedSignature = signature;
        if (!overflow.size) {
            this.close(false);
        } else if (this.entries() && changed) {
            this.entries.set(this.snapshot(buttons));
        }
    }

    protected toggle(): void {
        if (this.entries()) {
            this.close(true);
            return;
        }
        const toolbar = this.toolbar();
        if (!toolbar) {
            return;
        }
        this.focusFirst = true;
        this.entries.set(
            this.snapshot(
                toolbarButtons(toolbar, this.moreRef().nativeElement),
            ),
        );
        this.listenOutside(true);
    }

    protected choose(entry: MenuEntry): void {
        this.close(true);
        entry.element.click();
    }

    /** Close the menu; optionally hand focus back to the More button. */
    close(returnFocus: boolean): void {
        if (!this.entries()) {
            return;
        }
        this.entries.set(null);
        this.listenOutside(false);
        if (returnFocus) {
            this.moreRef().nativeElement.focus();
        }
    }

    protected onMenuKeydown(event: KeyboardEvent): void {
        const menu = this.menuRef()?.nativeElement;
        const list = menu
            ? Array.from(
                  menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
              )
            : [];
        const index = list.indexOf(document.activeElement as HTMLElement);
        switch (event.key) {
            case 'Escape':
                this.close(true);
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
                this.close(false);
                return;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
    }

    private readonly onPointerDown = (event: Event): void => {
        const target = event.target as Node | null;
        const menu = this.menuRef()?.nativeElement;
        if (
            target &&
            (menu?.contains(target) ||
                this.moreRef().nativeElement.contains(target))
        ) {
            return;
        }
        this.close(false);
    };
}
