<script lang="ts">
// Module scope, so each mounted menu gets its own id.
let menuSeq = 0;
</script>

<script setup lang="ts">
/**
 * Keeps the toolbar on one row (`toolbarOverflow`): measures the row,
 * hides the buttons that do not fit (`data-lg-overflow`, set on the
 * elements themselves so plugin buttons need no changes) and lists them
 * in a "More options" menu whose items click the hidden buttons.
 */
import {
    coreDefaultIcons,
    getToolbarItemPriority,
    getToolbarOverflow,
} from '@lightgallery/headless';
import {
    computed,
    inject,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    shallowRef,
    watch,
} from 'vue';

import { LG_ICONS, LgCi, resolveCustomIcons } from './icons';
import { LG_RUNTIME } from './runtime';
import { LG_STORE } from './store';

interface MenuEntry {
    key: number;
    label: string;
    iconHtml: string;
    element: HTMLElement;
}

const menuId = `lg-toolbar-menu-${++menuSeq}`;

const runtime = inject(LG_RUNTIME)!;
const store = inject(LG_STORE)!;
const icons = inject(LG_ICONS, undefined);

const settings = runtime.pluginContext.settings;
const label = computed(() => settings.value.strings.moreOptions);
const iconCls = computed(
    () =>
        resolveCustomIcons(icons?.value, ['more'], coreDefaultIcons)?.cls ?? '',
);

const moreEl = ref<HTMLButtonElement | null>(null);
const menuEl = ref<HTMLElement | null>(null);
const hasOverflow = ref(false);
const entries = shallowRef<MenuEntry[] | null>(null);
const widths = new WeakMap<HTMLElement, number>();
let movedSignature = '';

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
    const found = Array.from(button.querySelectorAll<HTMLElement>('.lg-ci'));
    if (!found.length) {
        return button.querySelector('svg')?.outerHTML ?? '';
    }
    const shown =
        found.find(
            (icon) => window.getComputedStyle(icon).display !== 'none',
        ) ?? found[0]!;
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

let listening = false;
function listenOutside(on: boolean): void {
    if (on === listening) {
        return;
    }
    listening = on;
    if (on) {
        document.addEventListener('pointerdown', onPointerDown, true);
    } else {
        document.removeEventListener('pointerdown', onPointerDown, true);
    }
}

function close(returnFocus: boolean): void {
    if (!entries.value) {
        return;
    }
    entries.value = null;
    listenOutside(false);
    if (returnFocus) {
        moreEl.value?.focus();
    }
}

function update(): void {
    const more = moreEl.value;
    const toolbar = more?.closest('.lg-toolbar');
    if (!more || !toolbar) {
        return;
    }
    const buttons = toolbarButtons(toolbar, more);
    buttons.forEach((button) => {
        if (!button.hasAttribute('data-lg-overflow')) {
            const width = button.offsetWidth;
            if (width) {
                widths.set(button, width);
            }
        }
    });
    const fallback =
        buttons.map((button) => widths.get(button)).find((width) => !!width) ??
        0;
    const counter = toolbar.querySelector<HTMLElement>('.lg-counter');
    const moved = getToolbarOverflow({
        available: toolbar.clientWidth,
        reserved: counter ? counter.offsetWidth : 0,
        moreWidth: widths.get(more) ?? fallback,
        items: buttons.map((button) => ({
            width: widths.get(button) ?? fallback,
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
    hasOverflow.value = overflow.size > 0;
    const signature = `${buttons.length}:${moved.join(',')}`;
    const changed = signature !== movedSignature;
    movedSignature = signature;
    if (!overflow.size) {
        close(false);
    } else if (entries.value && changed) {
        entries.value = snapshot(buttons);
    }
}

let frame = 0;
let resizeObserver: ResizeObserver | undefined;
let mutationObserver: MutationObserver | undefined;

function requestUpdate(): void {
    if (frame) {
        return;
    }
    frame = schedule(() => {
        frame = 0;
        update();
    });
}

onMounted(() => {
    const toolbar = moreEl.value?.closest('.lg-toolbar');
    if (!toolbar) {
        return;
    }
    update();
    if (typeof ResizeObserver === 'function') {
        resizeObserver = new ResizeObserver(requestUpdate);
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
                requestUpdate();
            }
        });
        mutationObserver.observe(toolbar, { childList: true, subtree: true });
    }
});

onBeforeUnmount(() => {
    cancel(frame);
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    listenOutside(false);
    const more = moreEl.value;
    const toolbar = more?.closest('.lg-toolbar');
    if (more && toolbar) {
        toolbarButtons(toolbar, more).forEach((button) =>
            button.removeAttribute('data-lg-overflow'),
        );
    }
});

// The row can change with the slide (per-slide download) or on open.
watch([store.currentIndex, store.isOpen], ([, isOpen]) => {
    if (!isOpen) {
        close(false);
    }
    void nextTick(update);
});

watch(hasOverflow, async (value) => {
    await nextTick();
    const more = moreEl.value;
    if (value && more?.offsetWidth) {
        widths.set(more, more.offsetWidth);
    }
});

async function open(): Promise<void> {
    const more = moreEl.value;
    const toolbar = more?.closest('.lg-toolbar');
    if (!more || !toolbar) {
        return;
    }
    entries.value = snapshot(toolbarButtons(toolbar, more));
    listenOutside(true);
    await nextTick();
    items()[0]?.focus();
}

function toggle(): void {
    if (entries.value) {
        close(true);
    } else {
        void open();
    }
}

function choose(entry: MenuEntry): void {
    close(true);
    entry.element.click();
}

function items(): HTMLElement[] {
    return menuEl.value
        ? Array.from(
              menuEl.value.querySelectorAll<HTMLElement>('[role="menuitem"]'),
          )
        : [];
}

function onMenuKeydown(event: KeyboardEvent): void {
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
}

function onPointerDown(event: Event): void {
    const target = event.target as Node | null;
    if (
        target &&
        (menuEl.value?.contains(target) || moreEl.value?.contains(target))
    ) {
        return;
    }
    close(false);
}
</script>

<template>
    <button
        ref="moreEl"
        type="button"
        :class="['lg-more lg-icon', iconCls]"
        :hidden="!hasOverflow"
        :aria-label="label"
        aria-haspopup="menu"
        :aria-expanded="entries ? 'true' : 'false'"
        :aria-controls="entries ? menuId : undefined"
        @click="toggle"
    >
        <LgCi :names="['more']" :defaults="coreDefaultIcons" />
    </button>
    <div
        v-if="entries"
        :id="menuId"
        ref="menuEl"
        class="lg-toolbar-menu"
        role="menu"
        :aria-label="label"
        @keydown="onMenuKeydown"
    >
        <button
            v-for="entry of entries"
            :key="entry.key"
            type="button"
            role="menuitem"
            class="lg-toolbar-menu-item"
            @click="choose(entry)"
        >
            <span
                class="lg-toolbar-menu-icon"
                aria-hidden="true"
                v-html="entry.iconHtml"
            ></span>
            <span>{{ entry.label }}</span>
        </button>
    </div>
</template>
