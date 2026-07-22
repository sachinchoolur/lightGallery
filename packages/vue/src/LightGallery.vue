<script setup lang="ts">
/**
 * The core gallery (ADR 0001 §3): renders uncontrolled triggers via the
 * default slot and opens the lightbox through `<Teleport>`. Settings are
 * same-named camelCase props; events are kebab-case emits; `v-model:open`
 * and `v-model:index` drive controlled state; the template ref exposes the
 * imperative handle. Open/close phases, the slide-transition timeline and
 * the zoom-from-origin animation mirror the React outlet (the shared spec)
 * over the same headless state machine.
 */
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    shallowRef,
    useAttrs,
    useSlots,
    watch,
} from 'vue';
import {
    clampIndex,
    createEmitter,
    fitImageSize,
    getOriginTransform,
    getSlideIndexesInDom,
    getSlideType,
    parseImageSize,
    resolveSettings,
    type CoreSettings,
    type RectLike,
    type SlideDirection,
    type UserSettings,
} from '@lightgallery/headless';

import {
    getFocusableElements,
    useBodyLock,
    useHideBars,
} from './composables';
import { useGalleryGestures } from './gestures';
import LgCaption from './LgCaption.vue';
import LgSlide, { type OriginAnimation } from './LgSlide.vue';
import {
    createGestureSeam,
    createRegistrationList,
    LG_RUNTIME,
    LG_SLOTS,
    type LgGalleryRuntime,
} from './runtime';
import {
    createGalleryStore,
    LG_ACTIONS,
    LG_STORE,
    type LgGalleryActions,
} from './store';
import {
    dedupePlugins,
    LG_PLUGIN_CONTEXT,
    type LgMediaPosition,
    type LgPluginContext,
    type LgVuePlugin,
    type ResolvedPluginSettings,
} from './plugins/types';
import { LgTimeouts } from './timeouts';
import {
    LG_EVENT_EMIT_NAMES,
    type HasVideoDetail,
    type InitDetail,
    type LgEventMap,
    type LgGalleryItem,
    type LgGalleryProps,
    type SlideEventDetail,
    type SlideItemLoadDetail,
} from './types';

/**
 * Open/close lifecycle phases, mirroring the vanilla class timeline:
 * `pre-open` — teleport mounted (`lg-show`), backdrop still transparent
 * `opening`  — `lg-show-in` + backdrop `in`; `open` — settled/visible;
 * `closing`  — reverse animation; teleport stays until it finishes.
 */
type OpenPhase = 'closed' | 'pre-open' | 'opening' | 'open' | 'closing';

interface SlideTimeline {
    shownIndex: number;
    positions: Record<number, 'prev' | 'next'>;
    noTrans: boolean;
    progressIndex: number | null;
}

const props = withDefaults(
    defineProps<LgGalleryProps & { plugins?: LgVuePlugin[] }>(),
    {
    plugins: undefined,
    slides: undefined,
    container: 'body',
    className: undefined,
    originRect: null,
    // Boolean settings MUST default to undefined explicitly: Vue casts
    // absent Boolean props to `false`, which resolveSettings would read as
    // an explicit user value and every boolean default would invert.
    zoomFromOrigin: undefined,
    allowMediaOverlap: undefined,
    loadYouTubePoster: undefined,
    hideScrollbar: undefined,
    resetScrollPosition: undefined,
    closable: undefined,
    swipeToClose: undefined,
    closeOnTap: undefined,
    showCloseIcon: undefined,
    showMaximizeIcon: undefined,
    loop: undefined,
    escKey: undefined,
    keyPress: undefined,
    trapFocus: undefined,
    controls: undefined,
    slideEndAnimation: undefined,
    hideControlOnEnd: undefined,
    mousewheel: undefined,
    download: undefined,
    counter: undefined,
    enableSwipe: undefined,
    enableDrag: undefined,
    },
);

const open = defineModel<boolean>('open', { default: false });
const index = defineModel<number>('index', { default: 0 });

const emit = defineEmits<{
    init: [InitDetail];
    'before-open': [];
    'after-open': [];
    'slide-item-load': [SlideItemLoadDetail];
    'before-slide': [SlideEventDetail];
    'after-slide': [SlideEventDetail];
    'before-next-slide': [{ index: number }];
    'before-prev-slide': [{ index: number; fromTouch: boolean }];
    'after-append-slide': [{ index: number }];
    'after-append-sub-html': [{ index: number }];
    'container-resize': [{ index: number }];
    'before-close': [];
    'after-close': [];
    'drag-start': [];
    'drag-move': [];
    'drag-end': [];
    'poster-click': [];
    'has-video': [HasVideoDetail];
    'autoplay-start': [{ index: number }];
    autoplay: [{ index: number }];
    'autoplay-stop': [{ index: number }];
    'rotate-left': [{ rotate: number }];
    'rotate-right': [{ rotate: number }];
    'flip-horizontal': [{ flipHorizontal: number }];
    'flip-vertical': [{ flipVertical: number }];
}>();

defineSlots<{
    default?: () => unknown;
    caption?: (props: {
        item: LgGalleryItem | undefined;
        index: number;
    }) => unknown;
    counter?: (props: { current: number; total: number }) => unknown;
    'prev-button'?: () => unknown;
    'next-button'?: () => unknown;
    /** Comment plugin panel body (`#comments="{ item, index }"`). */
    comments?: (props: {
        item: LgGalleryItem | undefined;
        index: number;
    }) => unknown;
}>();

// ── Store + settings ─────────────────────────────────────────────────────

const store = createGalleryStore();
provide(LG_STORE, store);
const slots = useSlots();
provide(LG_SLOTS, slots);

const SETTING_KEYS = [
    'mode', 'easing', 'speed', 'licenseKey', 'height', 'width',
    'startClass', 'zoomFromOrigin', 'startAnimationDuration',
    'backdropDuration', 'hideBarsDelay', 'showBarsAfter', 'slideDelay',
    'allowMediaOverlap', 'videoMaxSize', 'loadYouTubePoster',
    'defaultCaptionHeight', 'ariaLabelledby', 'ariaDescribedby',
    'hideScrollbar', 'resetScrollPosition', 'closable', 'swipeToClose',
    'closeOnTap', 'showCloseIcon', 'showMaximizeIcon', 'loop', 'escKey',
    'keyPress', 'trapFocus', 'controls', 'slideEndAnimation',
    'hideControlOnEnd', 'mousewheel', 'captionPosition', 'preload',
    'numberOfSlideItemsInDom', 'iframeWidth', 'iframeHeight',
    'iframeMaxWidth', 'iframeMaxHeight', 'download', 'counter',
    'swipeThreshold', 'enableSwipe', 'enableDrag', 'strings', 'isMobile',
    'mobileSettings',
] as const satisfies readonly (keyof UserSettings)[];

function defaultIsMobile(): boolean {
    return (
        typeof navigator !== 'undefined' &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    );
}

// prefers-reduced-motion collapses every animation to 0ms and disables the
// zoom-from-origin/bounce effects (a11y; checked once per instance).
const reducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isMobileCache: boolean | null = null;
const attrs = useAttrs();
const plugins = computed(() => dedupePlugins(props.plugins ?? []));
const settings = computed<ResolvedPluginSettings>(() => {
    // ADR §5 merge order (identical across the tracks; headless owns the
    // merge): core defaults < plugin presets < plugin defaults < user
    // settings (core props + per-plugin attr objects) < mobile overrides.
    const user: Record<string, unknown> = {};
    for (const key of SETTING_KEYS) {
        user[key] = props[key];
    }
    const registered = plugins.value;
    registered.forEach((plugin) => {
        const own = attrs[plugin.name];
        if (own && typeof own === 'object') {
            Object.assign(user, own);
        }
    });
    if (isMobileCache === null) {
        isMobileCache = props.isMobile ? props.isMobile() : defaultIsMobile();
    }
    const resolved = resolveSettings(user as UserSettings, {
        isMobile: isMobileCache,
        pluginDefaults: [
            ...registered.map((plugin) => plugin.presets ?? {}),
            ...registered.map(
                (plugin) =>
                    (plugin.defaults ?? {}) as Partial<CoreSettings>,
            ),
        ],
    }) as ResolvedPluginSettings;
    if (!reducedMotion) {
        return resolved;
    }
    return {
        ...resolved,
        speed: 0,
        backdropDuration: 0,
        startAnimationDuration: 0,
        zoomFromOrigin: false,
        slideEndAnimation: false,
    };
});

// ── Items (slides prop or trigger registry) ──────────────────────────────

const registry = createRegistrationList();
const baseItems = computed<readonly LgGalleryItem[]>(
    () =>
        props.slides ??
        registry.registrations.value.map((entry) => entry.item()),
);
/** Plugin `transformItems` results (vimeoThumbnail-style, abortable). */
const transformedItems = shallowRef<readonly LgGalleryItem[] | null>(null);
let transformAbort: AbortController | null = null;
watch(
    [plugins, baseItems],
    ([registered, base]) => {
        transformAbort?.abort();
        transformAbort = null;
        if (!registered.some((plugin) => plugin.transformItems)) {
            transformedItems.value = null;
            return;
        }
        const controller = new AbortController();
        transformAbort = controller;
        void (async () => {
            let result = [...base];
            for (const plugin of registered) {
                if (plugin.transformItems) {
                    try {
                        result = await plugin.transformItems(
                            result,
                            controller.signal,
                            settings.value,
                        );
                    } catch {
                        // Aborted/failed transforms keep the previous list.
                    }
                }
            }
            if (!controller.signal.aborted) {
                transformedItems.value = result;
            }
        })();
    },
    { immediate: true },
);
const items = computed<readonly LgGalleryItem[]>(
    () => transformedItems.value ?? baseItems.value,
);
watch(
    () => items.value.length,
    (count) => store.setSlidesCount(count),
    // Sync flush: a trigger can be clicked in the same tick its `<LgItem>`
    // registered (before a microtask flush) — the reducer would otherwise
    // clamp the open index against a stale slidesCount of 0.
    { immediate: true, flush: 'sync' },
);
watch(
    () => settings.value.loop,
    (loop) => store.setLoop(loop),
    { immediate: true },
);

// ── Event fan-out: kebab emit + shared bus (ADR §5) ──────────────────────

const events = createEmitter<LgEventMap>();
function emitEvent<K extends keyof LgEventMap>(
    name: K,
    detail: LgEventMap[K],
): void {
    (emit as (event: string, ...args: unknown[]) => void)(
        LG_EVENT_EMIT_NAMES[name],
        detail,
    );
    events.emit(name, detail);
}

// ── Presentation state (phases, timeline, origin) ────────────────────────

const timers = new LgTimeouts();
const phase = ref<OpenPhase>('closed');
/**
 * SSR/hydration guard: the overlay is client-only (React portal parity),
 * but `<Teleport>` itself must not render during SSR/hydration — the
 * server puts its content in a teleport buffer the page never injects,
 * so hydrating the anchors mismatches. Rendered only after mount.
 */
const isClientMounted = ref(false);
const visible = ref(false);
const componentsOpen = ref(false);
const useStartClass = ref(false);
const zoomFromImage = ref(false);
const maximized = ref(false);
const edgeBounce = ref<'left' | 'right' | null>(null);
const originAnim = shallowRef<OriginAnimation | null>(null);
const contentOffsets = shallowRef<{ top: number; bottom: number } | null>(
    null,
);
const timeline = shallowRef<SlideTimeline>({
    shownIndex: 0,
    positions: {},
    noTrans: false,
    progressIndex: null,
});
let usedZoom = false;
let prevShown: number | null = null;
/** fromTouch commit path (gestures): drags animate as lg-slide. */
const touchSlideMode = ref(false);
let fromTouch = false;
const gestureSeam = createGestureSeam();
let returnFocus: HTMLElement | null = null;
let mouseDownOnSlide = false;

const containerEl = ref<HTMLDivElement | null>(null);
const outerEl = ref<HTMLDivElement | null>(null);
const innerEl = ref<HTMLDivElement | null>(null);
const toolbarEl = ref<HTMLDivElement | null>(null);

/** Classes plugins toggled onto `.lg-outer` via `layout.setOuterClass`. */
const pluginOuterClasses = ref<Record<string, boolean>>({});
/** mediumZoom's media-position override, read by measureOffsets. */
let mediaPositionOverride: (() => LgMediaPosition) | null = null;

const isBodyContainer = computed(
    () =>
        props.container === 'body' ||
        (typeof document !== 'undefined' &&
            props.container === document.body),
);
const bodyLockActive = computed(
    () =>
        phase.value === 'pre-open' ||
        phase.value === 'opening' ||
        phase.value === 'open',
);
useBodyLock(
    bodyLockActive,
    isBodyContainer,
    computed(() => settings.value.hideScrollbar),
    computed(() => settings.value.resetScrollPosition),
);
const barsHidden = useHideBars(
    bodyLockActive,
    computed(() => settings.value.hideBarsDelay),
    computed(() => settings.value.showBarsAfter),
    outerEl,
);

const currentItem = computed<LgGalleryItem | undefined>(
    () => items.value[store.currentIndex.value],
);
const currentSlideType = computed(() =>
    currentItem.value ? getSlideType(currentItem.value) : undefined,
);
const slideIndexes = computed(() =>
    getSlideIndexesInDom(
        store.currentIndex.value,
        store.previousIndex.value,
        store.slidesCount.value,
        settings.value.numberOfSlideItemsInDom,
        store.loop.value,
    ).sort((a, b) => a - b),
);
const disablePrev = computed(
    () =>
        !store.loop.value &&
        settings.value.hideControlOnEnd &&
        store.currentIndex.value === 0,
);
const disableNext = computed(
    () =>
        !store.loop.value &&
        settings.value.hideControlOnEnd &&
        store.currentIndex.value === store.slidesCount.value - 1,
);
const showDownload = computed(() => {
    const item = currentItem.value;
    return settings.value.download && !!item && item.downloadUrl !== false;
});
const downloadHref = computed(() => {
    const item = currentItem.value;
    if (!item) {
        return undefined;
    }
    return typeof item.downloadUrl === 'string'
        ? item.downloadUrl
        : item.src;
});
const downloadName = computed(() => {
    const item = currentItem.value;
    return typeof item?.download === 'string' ? item.download : '';
});

const showIn = computed(
    () => phase.value === 'opening' || phase.value === 'open',
);
const zoomClosing = computed(
    () => phase.value === 'closing' && originAnim.value?.closing === true,
);
const containerClasses = computed(() => [
    'lg-container',
    'lg-show',
    props.className,
    { 'lg-show-in': showIn.value },
    { 'lg-inline': !isBodyContainer.value && !maximized.value },
]);
const outerClasses = computed(() => [
    'lg-outer',
    'lg-use-css3',
    'lg-css3',
    settings.value.mode,
    {
        'lg-grab': settings.value.enableDrag,
        'lg-single-item': items.value.length < 2,
        'lg-media-overlap': settings.value.allowMediaOverlap,
        [settings.value.startClass]:
            useStartClass.value && !!settings.value.startClass,
        'lg-zoom-from-image': zoomFromImage.value,
        'lg-visible': visible.value,
        'lg-components-open': componentsOpen.value,
        'lg-hide-items':
            barsHidden.value ||
            (phase.value === 'closing' && !zoomClosing.value),
        'lg-closing': zoomClosing.value,
        'lg-no-trans': timeline.value.noTrans,
        'lg-slide':
            touchSlideMode.value && settings.value.mode !== 'lg-slide',
        ...pluginOuterClasses.value,
        'lg-right-end': edgeBounce.value === 'right',
        'lg-left-end': edgeBounce.value === 'left',
        'lg-hide-download':
            settings.value.download &&
            currentItem.value?.downloadUrl === false,
    },
]);
const contentStyle = computed(() => {
    const offsets = contentOffsets.value;
    if (settings.value.allowMediaOverlap || !offsets) {
        return undefined;
    }
    return { top: `${offsets.top}px`, bottom: `${offsets.bottom}px` };
});

// ── Measurements (zoom-from-origin + media position) ─────────────────────

function measureOffsets(): { top: number; bottom: number } {
    // mediumZoom overrides the measurement entirely (ADR §5 layout).
    if (mediaPositionOverride) {
        return mediaPositionOverride();
    }
    if (settings.value.allowMediaOverlap) {
        return { top: 0, bottom: 0 };
    }
    const top = toolbarEl.value?.clientHeight ?? 0;
    const caption = outerEl.value?.querySelector<HTMLElement>(
        '.lg-components .lg-sub-html',
    );
    const bottom =
        settings.value.defaultCaptionHeight || caption?.clientHeight || 0;
    return { top, bottom };
}

function getOriginRect(slideIndex: number): RectLike | null {
    if (props.originRect) {
        return props.originRect;
    }
    const registration = registry.registrations.value[slideIndex];
    const element = registration?.element;
    if (!element) {
        return null;
    }
    const target = element.querySelector('img') ?? element;
    const rect = target.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
    };
}

function computeOrigin(slideIndex: number): string | null {
    const cfg = settings.value;
    if (!cfg.zoomFromOrigin) {
        return null;
    }
    const item = items.value[slideIndex];
    const outer = outerEl.value;
    if (!item?.lgSize || !outer) {
        return null;
    }
    const triggerRect = getOriginRect(slideIndex);
    if (!triggerRect) {
        return null;
    }
    const natural = parseImageSize(item.lgSize, window.innerWidth);
    if (!natural) {
        return null;
    }
    const rect = outer.getBoundingClientRect();
    const containerRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
    };
    const { top, bottom } = measureOffsets();
    const imageSize = fitImageSize(
        natural,
        containerRect.width,
        containerRect.height - (top + bottom),
    );
    return getOriginTransform({
        triggerRect,
        containerRect,
        top,
        bottom,
        imageSize,
    });
}

// ── Open/close machinery (React GalleryOutlet phase machine twin) ────────

watch(store.isOpen, (isOpen) => {
    if (isOpen) {
        if (phase.value === 'closed' || phase.value === 'closing') {
            timers.clearAll();
            originAnim.value = null;
            phase.value = 'pre-open';
            // Entrance measurements need the teleported DOM.
            void nextTick(() => runEntrance());
        }
    } else if (phase.value !== 'closed' && phase.value !== 'closing') {
        beginClose();
    }
});

function runEntrance(): void {
    const cfg = settings.value;
    contentOffsets.value = measureOffsets();

    const current = store.currentIndex.value;
    const transform = computeOrigin(current);
    usedZoom = transform !== null;
    useStartClass.value = transform === null;
    if (transform !== null) {
        originAnim.value = { index: current, transform, stage: 'init' };
        timers.set(() => {
            zoomFromImage.value = true;
            originAnim.value = originAnim.value && {
                ...originAnim.value,
                stage: 'armed',
            };
        }, 10);
        timers.set(() => {
            originAnim.value = originAnim.value && {
                ...originAnim.value,
                stage: 'run',
            };
        }, 110);
        timers.set(
            () => (originAnim.value = null),
            cfg.startAnimationDuration + 110,
        );
    }

    timers.set(() => (phase.value = 'opening'), 10);
    timers.set(() => {
        phase.value = 'open';
        if (!usedZoom) {
            visible.value = true;
        }
    }, 10 + cfg.backdropDuration);
    timers.set(
        () => (componentsOpen.value = true),
        cfg.zoomFromOrigin ? 100 : cfg.backdropDuration,
    );

    bindOpenListeners();
    if (cfg.trapFocus && isBodyContainer.value) {
        // Focus in on open; returned on close. Tab-cycling trap is the 007
        // a11y pass (hand-rolled per the ADR).
        returnFocus =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        containerEl.value?.focus({ preventScroll: true });
    }
    emitEvent('afterOpen', undefined);
}

function beginClose(): void {
    const cfg = settings.value;
    emitEvent('beforeClose', undefined);
    unbindOpenListeners();
    phase.value = 'closing';
    visible.value = false;
    componentsOpen.value = false;

    let closeDuration = cfg.backdropDuration;
    const transform = usedZoom
        ? computeOrigin(store.currentIndex.value)
        : null;
    if (transform) {
        originAnim.value = {
            index: store.currentIndex.value,
            transform,
            stage: 'run',
            closing: true,
        };
        closeDuration = Math.max(
            cfg.startAnimationDuration,
            cfg.backdropDuration,
        );
    } else {
        originAnim.value = null;
        zoomFromImage.value = false;
    }
    timers.set(() => finishClose(), closeDuration + 100);
}

function finishClose(): void {
    phase.value = 'closed';
    originAnim.value = null;
    zoomFromImage.value = false;
    useStartClass.value = false;
    contentOffsets.value = null;
    usedZoom = false;
    if (returnFocus?.isConnected) {
        returnFocus.focus({ preventScroll: true });
    }
    returnFocus = null;
    emitEvent('afterClose', undefined);
}

// ── Document/window listeners while open ─────────────────────────────────

function onKeydown(event: KeyboardEvent): void {
    // ESC close (2.x escKey) + arrow navigation (2.x keyPress).
    if (settings.value.escKey && event.key === 'Escape') {
        event.preventDefault();
        closeGallery();
    }
    if (settings.value.keyPress && store.slidesCount.value > 1) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevSlide();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextSlide();
        }
    }
    // Hand-rolled focus trap (2.x trapFocus): Tab cycles inside the
    // dialog while it is open over the page.
    if (
        settings.value.trapFocus &&
        isBodyContainer.value &&
        event.key === 'Tab'
    ) {
        const container = containerEl.value;
        if (!container) {
            return;
        }
        const focusable = getFocusableElements(container);
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        const active = document.activeElement;
        const inside = active instanceof Node && container.contains(active);
        if (event.shiftKey) {
            if (!inside || active === first) {
                event.preventDefault();
                last.focus();
            }
        } else if (!inside || active === last) {
            event.preventDefault();
            first.focus();
        }
    }
}
function onResize(): void {
    contentOffsets.value = measureOffsets();
    emitEvent('containerResize', { index: store.currentIndex.value });
}
let listenersBound = false;
let lastWheelAt = 0;
let wheelTarget: HTMLElement | null = null;
// Mousewheel navigation, throttled to one slide per second (2.x parity).
// Non-passive on purpose: the gallery owns the wheel while open; the page
// behind must not scroll.
function onWheel(event: WheelEvent): void {
    if (
        !settings.value.mousewheel ||
        store.slidesCount.value < 2 ||
        !event.deltaY
    ) {
        return;
    }
    event.preventDefault();
    const now = Date.now();
    if (now - lastWheelAt < 1000) {
        return;
    }
    lastWheelAt = now;
    if (event.deltaY > 0) {
        nextSlide();
    } else {
        prevSlide();
    }
}
function bindOpenListeners(): void {
    if (listenersBound || typeof document === 'undefined') {
        return;
    }
    listenersBound = true;
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);
    wheelTarget = outerEl.value;
    wheelTarget?.addEventListener('wheel', onWheel, { passive: false });
}
function unbindOpenListeners(): void {
    if (!listenersBound) {
        return;
    }
    listenersBound = false;
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
    wheelTarget?.removeEventListener('wheel', onWheel);
    wheelTarget = null;
}

// Close on tap of the black area around the slide (2.x closeOnTap).
function isSlideElement(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) {
        return false;
    }
    return ['lg-outer', 'lg-item', 'lg-img-wrap', 'lg-img-rotate'].some(
        (name) => target.classList.contains(name),
    );
}
function onOuterMouseDown(event: MouseEvent): void {
    mouseDownOnSlide = isSlideElement(event.target);
}
function onOuterMouseMove(): void {
    mouseDownOnSlide = false;
}
function onOuterMouseUp(event: MouseEvent): void {
    if (
        settings.value.closeOnTap &&
        mouseDownOnSlide &&
        isSlideElement(event.target)
    ) {
        closeGallery();
    }
}

// ── Slide transition timeline (2.x makeSlideAnimation) ───────────────────

watch([store.isOpen, store.currentIndex], ([isOpen, current]) => {
    const wasFromTouch = fromTouch;
    fromTouch = false;
    if (!isOpen) {
        prevShown = null;
        timeline.value = {
            shownIndex: current,
            positions: {},
            noTrans: false,
            progressIndex: null,
        };
        return;
    }
    const previous = prevShown;
    prevShown = current;
    if (previous === null || previous === current) {
        timeline.value = { ...timeline.value, shownIndex: current };
        return;
    }
    if (!store.transitioning.value) {
        // Index changed without animation (e.g. slides prop shrank).
        timeline.value = {
            shownIndex: current,
            positions: {},
            noTrans: false,
            progressIndex: null,
        };
        return;
    }
    const direction =
        store.slideDirection.value ??
        (current > previous ? 'next' : 'prev');
    if (wasFromTouch) {
        runTouchTransition(previous, current, direction);
        return;
    }
    runTransition(previous, current, direction);
});

/**
 * 2.x fromTouch path (sibling `runTouchTransition` twin): slides are
 * already positioned by the drag — switch lg-current immediately (no
 * lg-no-trans / 50ms phase) and keep only the incoming-side neighbor
 * positioned.
 */
function runTouchTransition(
    from: number,
    to: number,
    direction: SlideDirection,
): void {
    emitEvent('beforeSlide', {
        index: to,
        prevIndex: from,
        fromTouch: true,
        fromThumb: false,
    });
    const count = store.slidesCount.value;
    const loop = store.loop.value;
    const positions: Record<number, 'prev' | 'next'> = {};
    if (direction === 'prev') {
        let neighbor = to + 1;
        if (neighbor >= count) {
            neighbor = loop && count > 2 ? 0 : -1;
        }
        if (neighbor >= 0 && neighbor !== to) {
            positions[neighbor] = 'next';
        }
    } else {
        let neighbor = to - 1;
        if (neighbor < 0) {
            neighbor = loop && count > 2 ? count - 1 : -1;
        }
        if (neighbor >= 0 && neighbor !== to) {
            positions[neighbor] = 'prev';
        }
    }
    timeline.value = {
        shownIndex: to,
        positions,
        noTrans: false,
        progressIndex: null,
    };
    timers.set(() => {
        store.dispatch({ type: 'TRANSITION_END' });
        emitEvent('afterSlide', {
            index: to,
            prevIndex: from,
            fromTouch: true,
            fromThumb: false,
        });
    }, settings.value.speed + 100);
}

/** React counterpart: GalleryOutlet's prepareDrag (one render at start). */
function prepareDrag(): void {
    const count = store.slidesCount.value;
    const current = store.currentIndex.value;
    let prevN = current - 1;
    let nextN = current + 1;
    if (store.loop.value && count > 2) {
        if (current === 0) {
            prevN = count - 1;
        } else if (current === count - 1) {
            nextN = 0;
        }
    }
    const positions: Record<number, 'prev' | 'next'> = {};
    if (prevN >= 0 && prevN < count && prevN !== current) {
        positions[prevN] = 'prev';
    }
    if (
        nextN >= 0 &&
        nextN < count &&
        nextN !== current &&
        nextN !== prevN
    ) {
        positions[nextN] = 'next';
    }
    timeline.value = { ...timeline.value, positions };
}

/** Sibling `commitTouchNavigation` twin. */
function commitTouchNavigation(
    target: number,
    direction: SlideDirection,
): void {
    fromTouch = true;
    // Drags animate as slide whatever the mode (2.x adds lg-slide for the
    // release animation, then removes it).
    if (settings.value.mode !== 'lg-slide') {
        touchSlideMode.value = true;
        timers.set(
            () => (touchSlideMode.value = false),
            settings.value.speed + 100,
        );
    }
    navigate(target, direction);
}

function runTransition(
    from: number,
    to: number,
    direction: SlideDirection,
): void {
    const cfg = settings.value;
    const start = (): void => {
        timeline.value = {
            shownIndex: from,
            positions: {
                [to]: direction === 'next' ? 'next' : 'prev',
                [from]: direction === 'next' ? 'prev' : 'next',
            },
            noTrans: true,
            progressIndex: from,
        };
        timers.set(() => {
            timeline.value = {
                ...timeline.value,
                shownIndex: to,
                noTrans: false,
            };
        }, 50);
        timers.set(() => {
            timeline.value = { ...timeline.value, progressIndex: null };
            store.dispatch({ type: 'TRANSITION_END' });
            emitEvent('afterSlide', {
                index: to,
                prevIndex: from,
                fromTouch: false,
                fromThumb: false,
            });
        }, cfg.speed + 100 + cfg.slideDelay);
    };
    emitEvent('beforeSlide', {
        index: to,
        prevIndex: from,
        fromTouch: false,
        fromThumb: false,
    });
    if (cfg.slideDelay > 0) {
        timeline.value = { ...timeline.value, progressIndex: from };
        timers.set(start, cfg.slideDelay);
    } else {
        start();
    }
}

// ── Actions (v-model sync; gating identical to the siblings) ─────────────

function doOpen(at?: number): void {
    emitEvent('beforeOpen', undefined);
    store.open(at);
    index.value = store.currentIndex.value;
    open.value = true;
}

function openGallery(at?: number): void {
    if (store.isOpen.value) {
        return;
    }
    doOpen(at ?? index.value);
}

function closeGallery(): void {
    if (!settings.value.closable || !store.isOpen.value) {
        return;
    }
    store.close();
    open.value = false;
}

function navigate(rawIndex: number, direction?: SlideDirection): void {
    const state = store.state.value;
    if (!state.open || state.transitioning) {
        return;
    }
    const target = clampIndex(rawIndex, state.slidesCount, state.loop);
    if (target === state.currentIndex) {
        return;
    }
    store.goTo(rawIndex, direction);
    index.value = store.currentIndex.value;
}

function goToSlide(at: number): void {
    navigate(at);
}

function bounce(side: 'left' | 'right'): void {
    edgeBounce.value = side;
    timers.set(() => (edgeBounce.value = null), 400);
}

function nextSlide(): void {
    const state = store.state.value;
    if (!state.open || state.transitioning) {
        return;
    }
    const target =
        state.currentIndex + 1 < state.slidesCount
            ? state.currentIndex + 1
            : state.loop
              ? 0
              : null;
    if (target !== null) {
        emitEvent('beforeNextSlide', { index: target });
        navigate(target, 'next');
    } else if (settings.value.slideEndAnimation) {
        bounce('right');
    }
}

function prevSlide(): void {
    const state = store.state.value;
    if (!state.open || state.transitioning) {
        return;
    }
    const target =
        state.currentIndex > 0
            ? state.currentIndex - 1
            : state.loop
              ? state.slidesCount - 1
              : null;
    if (target !== null) {
        emitEvent('beforePrevSlide', { index: target, fromTouch: false });
        navigate(target, 'prev');
    } else if (settings.value.slideEndAnimation) {
        bounce('left');
    }
}

function refresh(): void {}

// v-model:open → store (controlled open; index read at open time).
watch(open, (value) => {
    if (value && !store.isOpen.value) {
        doOpen(index.value);
    } else if (!value && store.isOpen.value) {
        store.close();
    }
});
// v-model:index → store (waits out a running transition).
watch([index, store.transitioning], ([value]) => {
    if (!store.isOpen.value || store.transitioning.value) {
        return;
    }
    if (value !== store.currentIndex.value) {
        store.goTo(value);
        index.value = store.currentIndex.value;
    }
});

const actions: LgGalleryActions = {
    openGallery,
    closeGallery,
    goToSlide,
    nextSlide,
    prevSlide,
    refresh,
};
provide(LG_ACTIONS, actions);
defineExpose(actions);

const pluginContext: LgPluginContext = {
    store,
    actions: {
        ...actions,
        navigate,
        dispatch: (action) => store.dispatch(action),
    } as LgPluginContext['actions'],
    settings,
    items,
    events,
    gestureLock: gestureSeam,
    layout: {
        setOuterClass(className, active) {
            const current = !!pluginOuterClasses.value[className];
            if (current !== active) {
                pluginOuterClasses.value = {
                    ...pluginOuterClasses.value,
                    [className]: active,
                };
            }
        },
        toggleComponents() {
            componentsOpen.value = !componentsOpen.value;
        },
        overrideMediaPosition(fn) {
            mediaPositionOverride = fn;
        },
    },
    refs: {
        getOuter: () => outerEl.value,
        getInner: () => innerEl.value,
        getCurrentSlide: () =>
            outerEl.value?.querySelector<HTMLElement>(
                '.lg-item.lg-current',
            ) ?? null,
    },
    emit: emitEvent,
};
provide(LG_PLUGIN_CONTEXT, pluginContext);

const runtime: LgGalleryRuntime = {
    items,
    settings,
    events,
    emit: emitEvent,
    registrations: registry.registrations,
    registerItem: registry.register,
    getItemIndex: registry.indexOf,
    getOriginRect,
    gestureSeam,
    plugins,
    pluginContext,
};
provide(LG_RUNTIME, runtime);

// Run every plugin's setup inside this component's effect scope — their
// watchers/listeners/timers are torn down with the gallery automatically.
plugins.value.forEach((plugin) => plugin.setup?.(pluginContext));

// Gesture bindings: swipe/drag over the shared headless math.
useGalleryGestures({
    outer: outerEl,
    active: bodyLockActive,
    store,
    settings: () => settings.value,
    seam: gestureSeam,
    emit: emitEvent,
    closeGallery,
    prepareDrag,
    commitTouchNavigation,
});

onMounted(() => {
    isClientMounted.value = true;
    emitEvent('init', { instance: actions });
});
onBeforeUnmount(() => {
    timers.clearAll();
    unbindOpenListeners();
    transformAbort?.abort();
});
</script>

<template>
    <slot />
    <Teleport v-if="isClientMounted" :to="props.container">
        <div
            v-if="phase !== 'closed'"
            ref="containerEl"
            :class="containerClasses"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            :aria-label="settings.ariaLabelledby ? undefined : 'Gallery'"
            :aria-labelledby="settings.ariaLabelledby || undefined"
            :aria-describedby="settings.ariaDescribedby || undefined"
        >
            <div
                class="lg-backdrop"
                :class="{ in: showIn }"
                :style="{
                    transitionDuration: `${settings.backdropDuration}ms`,
                }"
            ></div>
            <div
                ref="outerEl"
                :class="outerClasses"
                :data-lg-slide-type="currentSlideType"
                @mousedown="onOuterMouseDown"
                @mousemove="onOuterMouseMove"
                @mouseup="onOuterMouseUp"
            >
                <div class="lg-content" :style="contentStyle">
                    <div
                        ref="innerEl"
                        class="lg-inner"
                        :style="{
                            transitionTimingFunction: settings.easing,
                            transitionDuration: `${settings.speed}ms`,
                            touchAction: 'none',
                        }"
                    >
                        <LgSlide
                            v-for="idx of slideIndexes"
                            :key="idx"
                            :index="idx"
                            :item="items[idx]"
                            :is-shown="timeline.shownIndex === idx"
                            :position="timeline.positions[idx]"
                            :in-progress="timeline.progressIndex === idx"
                            :origin-anim="
                                originAnim?.index === idx ? originAnim : null
                            "
                        />
                    </div>
                    <template v-if="settings.controls">
                        <button
                            type="button"
                            class="lg-prev lg-icon"
                            :class="{ disabled: disablePrev }"
                            :disabled="disablePrev"
                            :aria-label="settings.strings.previousSlide"
                            @click="prevSlide"
                        >
                            <slot name="prev-button" />
                        </button>
                        <button
                            type="button"
                            class="lg-next lg-icon"
                            :class="{ disabled: disableNext }"
                            :disabled="disableNext"
                            :aria-label="settings.strings.nextSlide"
                            @click="nextSlide"
                        >
                            <slot name="next-button" />
                        </button>
                    </template>
                </div>
                <div ref="toolbarEl" class="lg-toolbar lg-group">
                    <button
                        v-if="settings.showMaximizeIcon"
                        type="button"
                        class="lg-maximize lg-icon"
                        :aria-label="settings.strings.toggleMaximize"
                        @click="maximized = !maximized"
                    ></button>
                    <button
                        v-if="settings.closable && settings.showCloseIcon"
                        type="button"
                        class="lg-close lg-icon"
                        :aria-label="settings.strings.closeGallery"
                        @click="closeGallery"
                    ></button>
                    <a
                        v-if="showDownload"
                        target="_blank"
                        rel="noopener"
                        class="lg-download lg-icon"
                        :aria-label="settings.strings.download"
                        :href="downloadHref"
                        :download="downloadName || true"
                    ></a>
                    <template
                        v-for="plugin of plugins"
                        :key="plugin.name"
                    >
                        <component
                            :is="plugin.slots!.toolbar!"
                            v-if="plugin.slots?.toolbar"
                        />
                    </template>
                    <div
                        v-if="settings.counter"
                        class="lg-counter"
                        role="status"
                        aria-live="polite"
                    >
                        <slot
                            name="counter"
                            :current="store.currentIndex.value + 1"
                            :total="store.slidesCount.value"
                        >
                            <span class="lg-counter-current">{{
                                store.currentIndex.value + 1
                            }}</span
                            >{{ ' / '
                            }}<span class="lg-counter-all">{{
                                store.slidesCount.value
                            }}</span>
                        </slot>
                    </div>
                </div>
                <LgCaption
                    v-if="settings.captionPosition === 'outer'"
                    :item="currentItem"
                    :index="store.currentIndex.value"
                />
                <template v-for="plugin of plugins" :key="plugin.name">
                    <component
                        :is="plugin.slots!.outer!"
                        v-if="plugin.slots?.outer"
                    />
                </template>
                <div class="lg-components">
                    <LgCaption
                        v-if="settings.captionPosition === 'bar'"
                        :item="currentItem"
                        :index="store.currentIndex.value"
                    />
                    <template
                        v-for="plugin of plugins"
                        :key="plugin.name"
                    >
                        <component
                            :is="plugin.slots!.components!"
                            v-if="plugin.slots?.components"
                        />
                    </template>
                </div>
            </div>
        </div>
    </Teleport>
</template>
