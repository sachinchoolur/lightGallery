/**
 * Typed core settings and the non-mutating merge, ported from
 * `src/lg-settings.ts` (2.x) with the ADR 0001 §7 renames applied:
 * `appendSubHtmlTo` → `captionPosition`; DOM-scraping options
 * (`selector`, `extraProps`, `getCaptionFromTitleOrAlt`, …), HTML-string
 * options (`nextHtml`, `prevHtml`, `appendCounterTo`) and
 * `supportLegacyBrowser` are gone. `container`, `addClass`/`className` and
 * `index` are framework-layer props, not headless settings.
 */

export type GalleryMode =
    | 'lg-slide'
    | 'lg-fade'
    | 'lg-zoom-in'
    | 'lg-zoom-in-big'
    | 'lg-zoom-out'
    | 'lg-zoom-out-big'
    | 'lg-zoom-out-in'
    | 'lg-zoom-in-out'
    | 'lg-soft-zoom'
    | 'lg-scale-up'
    | 'lg-slide-circular'
    | 'lg-slide-circular-vertical'
    | 'lg-slide-vertical'
    | 'lg-slide-vertical-growth'
    | 'lg-slide-skew-only'
    | 'lg-slide-skew-only-rev'
    | 'lg-slide-skew-only-y'
    | 'lg-slide-skew-only-y-rev'
    | 'lg-slide-skew'
    | 'lg-slide-skew-rev'
    | 'lg-slide-skew-cross'
    | 'lg-slide-skew-cross-rev'
    | 'lg-slide-skew-ver'
    | 'lg-slide-skew-ver-rev'
    | 'lg-slide-skew-ver-cross'
    | 'lg-slide-skew-ver-cross-rev'
    | 'lg-lollipop'
    | 'lg-lollipop-rev'
    | 'lg-rotate'
    | 'lg-rotate-rev'
    | 'lg-tube';

/** Where slide captions render (2.x `appendSubHtmlTo`, without selectors). */
export type CaptionPosition = 'bar' | 'slide' | 'outer';

/**
 * Gallery reading direction. `'auto'` inherits the page direction —
 * resolved by the framework layer (this module is DOM-free, so `'auto'`
 * reaches the runtimes unresolved, like `isMobile`).
 */
export type GalleryDirection = 'ltr' | 'rtl' | 'auto';

/** `direction` with `'auto'` already resolved against the document. */
export type ResolvedGalleryDirection = 'ltr' | 'rtl';

/** Plan-010 virtualization knobs; the feature is off when the whole
 *  object is absent. */
export interface VirtualizationSettings {
    /** Mounted-slide pool size (overrides `numberOfSlideItemsInDom`). */
    slides?: number;
    /**
     * Thumbnail-strip windowing: overscan thumbs kept mounted on each
     * side of the visible range, or 'auto' for one extra viewport.
     */
    thumbs?: 'auto' | number;
}

export interface GalleryCoreStrings {
    closeGallery: string;
    toggleMaximize: string;
    previousSlide: string;
    nextSlide: string;
    download: string;
    playVideo: string;
    mediaLoadingFailed: string;
    /** Accessible name of the gallery dialog when `ariaLabelledby` is not set. */
    galleryLabel: string;
    /**
     * Template announced to assistive technology on every slide change.
     * `{index}` and `{total}` are replaced with the 1-based slide position
     * and the slide count; the slide caption, when present, is appended.
     */
    slideAnnouncement: string;
    /** Label of the toolbar's More options menu button. */
    moreOptions: string;

    // Plugin labels: every user-facing string lives in this
    // one contract. The legacy per-plugin `*PluginStrings` objects remain
    // as deprecated aliases — an explicitly set legacy key wins.
    /** Share plugin: share button label. */
    share: string;
    /** Thumbnail plugin: strip toggle button label. */
    toggleThumbnails: string;
    /** Autoplay plugin: slideshow toggle button label. */
    toggleAutoplay: string;
    /** Fullscreen plugin: fullscreen toggle button label. */
    toggleFullscreen: string;
    /** Zoom plugin: zoom-in button label. */
    zoomIn: string;
    /** Zoom plugin: zoom-out button label. */
    zoomOut: string;
    /** Zoom plugin: actual-size button label. */
    viewActualSize: string;
    /** Rotate plugin: rotate-left button label. */
    rotateLeft: string;
    /** Rotate plugin: rotate-right button label. */
    rotateRight: string;
    /** Rotate plugin: horizontal flip button label. */
    flipHorizontal: string;
    /** Rotate plugin: vertical flip button label. */
    flipVertical: string;
    /** Comment plugin: comments toggle button label. */
    toggleComments: string;
}

export interface CoreSettings {
    /** Type of transition between slides. */
    mode: GalleryMode;

    /** Slide animation CSS easing property. */
    easing: string;

    /** Transition duration in ms. */
    speed: number;

    /** Commercial license key (`0000-0000-000-0000` for testing). */
    licenseKey: string;

    /** Height of the gallery, e.g. '100%', '300px'. */
    height: string;

    /** Width of the gallery, e.g. '100%', '300px'. */
    width: string;

    /**
     * Start animation class applied to the outer element while opening when
     * no zoom-from-origin transform is available. Empty string disables.
     */
    startClass: string;

    /**
     * Animate the opening slide from the trigger thumbnail's bounding rect.
     * Needs the natural image size via the item's `lgSize` field; falls back
     * to `startClass` when unavailable.
     */
    zoomFromOrigin: boolean;

    /** Zoom-from-origin animation duration in ms. */
    startAnimationDuration: number;

    /** Backdrop fade duration in ms. */
    backdropDuration: number;

    /** Delay in ms before hiding controls on idle. 0 keeps them visible. */
    hideBarsDelay: number;

    /** Delay before the idle-hide behavior arms after opening. */
    showBarsAfter: number;

    /** Delay slide transitions in ms (`lg-slide-progress` window). */
    slideDelay: number;

    /** If true, toolbar/captions/thumbnails may overlap the media. */
    allowMediaOverlap: boolean;

    /** Default video size as `"width-height"`. */
    videoMaxSize: string;

    /** Automatically load poster images for YouTube videos. */
    loadYouTubePoster: boolean;

    /** Caption height used for media positioning when overlap is off. */
    defaultCaptionHeight: number;

    /** aria-labelledby attribute for the gallery dialog. */
    ariaLabelledby: string;

    /** aria-describedby attribute for the gallery dialog. */
    ariaDescribedby: string;

    /** Hide the page scrollbar (with padding compensation) while open. */
    hideScrollbar: boolean;

    /** Restore the previous scroll position when the gallery closes. */
    resetScrollPosition: boolean;

    /** If false the gallery cannot be closed (inline galleries). */
    closable: boolean;

    /** Allow vertical drag/swipe to close (forced off when not closable). */
    swipeToClose: boolean;

    /** Close when clicking the black area around the slide. */
    closeOnTap: boolean;

    /** Show the close button. */
    showCloseIcon: boolean;

    /** Show the maximize button (inline galleries). */
    showMaximizeIcon: boolean;

    /**
     * Keep the toolbar on one row: when its buttons do not fit beside the
     * counter, the lowest-priority ones move into a "More options" menu.
     * Set to `false` to let the buttons wrap onto a second row instead.
     */
    toolbarOverflow: boolean;

    /**
     * Show the toolbar buttons that repeat a touch gesture: zoom in, zoom
     * out and actual size (pinch and double-tap do the same). On by
     * default; `mobileSettings` turns it off on touch devices.
     */
    showGestureButtons: boolean;

    /** Loop back to the first slide from the last. */
    loop: boolean;

    /** Close on Escape. */
    escKey: boolean;

    /** Keyboard navigation (arrow keys). */
    keyPress: boolean;

    /** Trap focus within the gallery. */
    trapFocus: boolean;

    /** Show prev/next buttons. */
    controls: boolean;

    /** Bounce animation when navigating past the ends without loop. */
    slideEndAnimation: boolean;

    /**
     * Disable prev/next buttons on first/last slide. Ignored (forced false)
     * when `loop` or `slideEndAnimation` is on — 2.x parity.
     */
    hideControlOnEnd: boolean;

    /** Navigate on mousewheel. */
    mousewheel: boolean;

    /**
     * Gallery reading direction: keyboard arrows, swipe advance and the
     * slide/thumbnail transforms follow it. Visual mirroring is the
     * opt-in `lg-rtl.css` layer — load it whenever this resolves to
     * `'rtl'`. `'auto'` inherits the page direction; the default stays
     * `'ltr'` so upgrades never change behavior on existing pages.
     */
    direction: GalleryDirection;

    /** Where slide captions render. */
    captionPosition: CaptionPosition;

    /** Number of slides to preload around the current slide. */
    preload: number;

    /** How many slide elements are kept mounted at a time (minimum 3). */
    numberOfSlideItemsInDom: number;

    /** iframe slide width. */
    iframeWidth: string;

    /** iframe slide height. */
    iframeHeight: string;

    /** iframe slide max width. */
    iframeMaxWidth: string;

    /** iframe slide max height. */
    iframeMaxHeight: string;

    /** Show the download button. */
    download: boolean;

    /** Show the slide counter. */
    counter: boolean;

    /** Minimum swipe distance in px to change slides. */
    swipeThreshold: number;

    /**
     * Release velocity (px/ms, measured over the gesture's final
     * ~100ms) at which a short swipe still changes slides — a flick.
     */
    flickVelocity: number;

    /**
     * Pinching down on an un-zoomed image and releasing closes the
     * gallery (iOS Photos). Guarded: a pinch that went past fit zoom
     * at any point is a zoom correction and never closes. Requires
     * `closable`.
     */
    pinchToClose: boolean;

    /** Enable touch swipe. */
    enableSwipe: boolean;

    /** Enable desktop mouse drag. */
    enableDrag: boolean;

    /**
     * Large-gallery virtualization (plan 010). Off when undefined — the
     * 2.x behavior: every thumbnail renders and the mounted-slide window
     * is `numberOfSlideItemsInDom`. `slides` overrides the mounted-slide
     * pool size; `thumbs` turns on thumbnail-strip windowing (only the
     * visible thumbs plus an overscan render, with spacers preserving the
     * strip geometry) — a number is the overscan thumb count per side,
     * 'auto' derives one extra viewport per side. The window advances at
     * commit points (release, slide change, resize), never per
     * pointermove — interaction stays zero-reactivity.
     */
    virtualization?: VirtualizationSettings;

    /**
     * Announce slide changes to assistive technology through a dedicated
     * polite live region (`strings.slideAnnouncement` + the slide caption).
     * While enabled, the counter and caption bar are not separate live
     * regions — the announcer is the single source of slide-change
     * announcements. Set to `false` to restore the 2.x behavior (live
     * counter and caption, no announcer).
     */
    ariaAnnouncements: boolean;

    /** Localizable UI strings. */
    strings: GalleryCoreStrings;

    /** Detect mobile devices; defaults to a UA sniff in the framework layer. */
    isMobile?: () => boolean;

    /** Settings overrides applied when a mobile device is detected. */
    mobileSettings: MobileSettings;
}

export type MobileSettings = Partial<
    Omit<CoreSettings, 'mobileSettings' | 'isMobile'>
>;

/** User-facing shape: everything optional, strings mergeable per-key. */
export type UserSettings = Partial<Omit<CoreSettings, 'strings'>> & {
    strings?: Partial<GalleryCoreStrings>;
};

export const coreSettingsDefaults: CoreSettings = {
    mode: 'lg-slide',
    easing: 'ease',
    speed: 400,
    licenseKey: '0000-0000-000-0000',
    height: '100%',
    width: '100%',
    startClass: 'lg-start-zoom',
    zoomFromOrigin: true,
    startAnimationDuration: 400,
    backdropDuration: 300,
    hideBarsDelay: 0,
    showBarsAfter: 10000,
    slideDelay: 0,
    allowMediaOverlap: false,
    videoMaxSize: '1280-720',
    loadYouTubePoster: true,
    defaultCaptionHeight: 0,
    ariaLabelledby: '',
    ariaDescribedby: '',
    hideScrollbar: false,
    resetScrollPosition: true,
    closable: true,
    swipeToClose: true,
    closeOnTap: true,
    showCloseIcon: true,
    showMaximizeIcon: false,
    toolbarOverflow: true,
    showGestureButtons: true,
    loop: true,
    escKey: true,
    keyPress: true,
    trapFocus: true,
    controls: true,
    slideEndAnimation: true,
    hideControlOnEnd: false,
    mousewheel: false,
    direction: 'ltr',
    captionPosition: 'bar',
    preload: 2,
    numberOfSlideItemsInDom: 10,
    iframeWidth: '100%',
    iframeHeight: '100%',
    iframeMaxWidth: '100%',
    iframeMaxHeight: '100%',
    download: true,
    counter: true,
    swipeThreshold: 50,
    flickVelocity: 0.5,
    pinchToClose: true,
    enableSwipe: true,
    enableDrag: true,
    isMobile: undefined,
    ariaAnnouncements: true,
    mobileSettings: {
        controls: false,
        showCloseIcon: false,
        download: false,
        showGestureButtons: false,
    },
    strings: {
        closeGallery: 'Close gallery',
        toggleMaximize: 'Toggle maximize',
        previousSlide: 'Previous slide',
        nextSlide: 'Next slide',
        download: 'Download',
        playVideo: 'Play video',
        mediaLoadingFailed: 'Oops... Failed to load content...',
        galleryLabel: 'Gallery',
        slideAnnouncement: 'Image {index} of {total}',
        moreOptions: 'More options',
        share: 'Share',
        toggleThumbnails: 'Toggle thumbnails',
        toggleAutoplay: 'Toggle Autoplay',
        toggleFullscreen: 'Toggle Fullscreen',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        viewActualSize: 'View actual size',
        rotateLeft: 'Rotate left',
        rotateRight: 'Rotate right',
        flipHorizontal: 'Flip horizontal',
        flipVertical: 'Flip vertical',
        toggleComments: 'Toggle Comments',
    },
};

export interface ResolveSettingsOptions {
    /**
     * Whether the current device is mobile — decided by the framework layer
     * (headless cannot touch `navigator`). Applies `mobileSettings`.
     */
    isMobile?: boolean;

    /**
     * Plugin default settings merged below user settings (plugin runtime). Merged
     * left-to-right, never mutating any input.
     */
    pluginDefaults?: ReadonlyArray<Partial<CoreSettings>>;
}

/** Drop `undefined` values so optional framework props never shadow defaults. */
function definedEntries<T extends object>(source: T): Partial<T> {
    const target: Record<string, unknown> = {};
    (Object.keys(source) as Array<keyof T>).forEach((key) => {
        if (source[key] !== undefined) {
            target[key as string] = source[key];
        }
    });
    return target as Partial<T>;
}

/**
 * Merge defaults + plugin defaults + user settings + mobile overrides into a
 * resolved settings object. Non-mutating by construction: every input object
 * is left untouched (2.x mutated `settings` in place; 3.x never does).
 */
export function resolveSettings(
    user: UserSettings = {},
    options: ResolveSettingsOptions = {},
): CoreSettings {
    let merged: CoreSettings = {
        ...coreSettingsDefaults,
        ...(options.pluginDefaults ?? []).reduce<Partial<CoreSettings>>(
            (acc, defaults) => ({ ...acc, ...definedEntries(defaults) }),
            {},
        ),
        ...definedEntries(user),
        strings: {
            ...coreSettingsDefaults.strings,
            ...definedEntries(user.strings ?? {}),
        },
    };

    if (options.isMobile) {
        const mobile = definedEntries(merged.mobileSettings);
        merged = {
            ...merged,
            ...mobile,
            strings: { ...merged.strings, ...(mobile.strings ?? {}) },
        };
    }

    // 2.x normalization rules (normalizeSettings).
    if (merged.slideEndAnimation) {
        merged.hideControlOnEnd = false;
    }
    if (!merged.closable) {
        merged.swipeToClose = false;
    }

    return merged;
}
