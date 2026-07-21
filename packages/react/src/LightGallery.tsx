import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react';
import {
    clampIndex,
    createGalleryState,
    galleryReducer,
    resolveSettings,
    type CoreSettings,
    type RectLike,
    type SlideDirection,
    type UserSettings,
} from '@lightgallery/headless';

import { createEmitter, type LgEventEmitter } from './events';
import { PluginRunners } from './plugins/runtime';
import type {
    LgPlugin,
    MediaPosition,
    PluginLayout,
    PluginRefs,
} from './plugins/types';

import {
    ActionsContext,
    InternalContext,
    SettingsContext,
    SlotContext,
    StateContext,
    type EmitFn,
    type GalleryActions,
    type GalleryInternal,
    type GestureSeam,
    type ItemRegistration,
} from './context';
import { GalleryOutlet } from './GalleryOutlet';
import { useEventCallback, useShallowStable, useTimeouts } from './hooks';
import type {
    GalleryItem,
    LightGalleryCallbacks,
    LightGalleryProps,
    LightGalleryRefHandle,
} from './types';

function defaultIsMobile(): boolean {
    return (
        typeof navigator !== 'undefined' &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    );
}

const EMPTY_SLOTS = {};
const EMPTY_PLUGINS: LgPlugin[] = [];

export const LightGallery = forwardRef<
    LightGalleryRefHandle,
    LightGalleryProps
>(function LightGallery(props, ref) {
    const {
        slides,
        open,
        onClose,
        index,
        onIndexChange,
        defaultIndex = 0,
        className,
        container = null,
        originRect,
        render,
        plugins = EMPTY_PLUGINS,
        children,
        onInit,
        onBeforeOpen,
        onAfterOpen,
        onSlideItemLoad,
        onBeforeSlide,
        onAfterSlide,
        onBeforeClose,
        onAfterClose,
        onDragStart,
        onDragMove,
        onDragEnd,
        onPosterClick,
        onHasVideo,
        onAutoplayStart,
        onAutoplay,
        onAutoplayStop,
        onRotateLeft,
        onRotateRight,
        onFlipHorizontal,
        onFlipVertical,
        ...userSettings
    } = props;

    const stableUserSettings = useShallowStable(userSettings);
    const [isMobile] = useState(() =>
        stableUserSettings.isMobile
            ? stableUserSettings.isMobile()
            : defaultIsMobile(),
    );
    // ADR §5 merge order: core defaults < plugin presets < plugin defaults <
    // user settings (core + per-plugin props, flattened) < mobile overrides.
    // Non-mutating throughout — every input object is left untouched.
    const settings = useMemo(() => {
        const userBag = stableUserSettings as Record<string, unknown>;
        const pluginNames = new Set(plugins.map((plugin) => plugin.name));
        const flatUser: Record<string, unknown> = {};
        Object.keys(userBag).forEach((key) => {
            if (!pluginNames.has(key)) {
                flatUser[key] = userBag[key];
            }
        });
        plugins.forEach((plugin) => {
            const own = userBag[plugin.name];
            if (own && typeof own === 'object') {
                Object.assign(flatUser, own);
            }
        });
        const pluginDefaults = [
            ...plugins.map((plugin) => plugin.presets ?? {}),
            ...plugins.map(
                (plugin) => (plugin.defaults ?? {}) as Partial<CoreSettings>,
            ),
        ];
        return resolveSettings(flatUser as UserSettings, {
            isMobile,
            pluginDefaults,
        });
    }, [stableUserSettings, isMobile, plugins]);

    // Uncontrolled `<LightGalleryItem>` registry — mount order defines slide
    // order. Item data is read at registration time; galleries with changing
    // data should use the `slides` prop.
    const [registrations, setRegistrations] = useState<ItemRegistration[]>([]);
    const registerItem = useCallback((registration: ItemRegistration) => {
        setRegistrations((prev) => [...prev, registration]);
        return () => {
            setRegistrations((prev) =>
                prev.filter((entry) => entry !== registration),
            );
        };
    }, []);

    const baseItems = useMemo(
        () => slides ?? registrations.map((registration) => registration.item),
        [slides, registrations],
    );

    // Plugin item transforms (`transformItems`, possibly async).
    const [transformedItems, setTransformedItems] = useState<
        GalleryItem[] | null
    >(null);
    useEffect(() => {
        if (!plugins.some((plugin) => plugin.transformItems)) {
            setTransformedItems(null);
            return;
        }
        const controller = new AbortController();
        void (async () => {
            let result = baseItems;
            for (const plugin of plugins) {
                if (plugin.transformItems) {
                    try {
                        result = await plugin.transformItems(
                            result,
                            controller.signal,
                            settingsRef.current as Parameters<
                                NonNullable<LgPlugin['transformItems']>
                            >[2],
                        );
                    } catch {
                        // Aborted or failed transforms keep the previous list.
                    }
                }
            }
            if (!controller.signal.aborted) {
                setTransformedItems(result);
            }
        })();
        return () => controller.abort();
    }, [baseItems, plugins]);
    const items = transformedItems ?? baseItems;

    const [state, dispatch] = useReducer(
        galleryReducer,
        {
            slidesCount: items.length,
            loop: settings.loop,
            index: index ?? defaultIndex,
        },
        createGalleryState,
    );

    useEffect(() => {
        dispatch({ type: 'SET_SLIDES_COUNT', count: items.length });
    }, [items.length]);
    useEffect(() => {
        dispatch({ type: 'SET_LOOP', loop: settings.loop });
    }, [settings.loop]);

    // Latest-value refs so the action callbacks can stay referentially stable.
    const stateRef = useRef(state);
    stateRef.current = state;
    const settingsRef = useRef(settings);
    settingsRef.current = settings;
    const callbacksRef = useRef<LightGalleryCallbacks>({});
    callbacksRef.current = {
        onInit,
        onBeforeOpen,
        onAfterOpen,
        onSlideItemLoad,
        onBeforeSlide,
        onAfterSlide,
        onBeforeClose,
        onAfterClose,
        onDragStart,
        onDragMove,
        onDragEnd,
        onPosterClick,
        onHasVideo,
        onAutoplayStart,
        onAutoplay,
        onAutoplayStop,
        onRotateLeft,
        onRotateRight,
        onFlipHorizontal,
        onFlipVertical,
    };
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    const onIndexChangeRef = useRef(onIndexChange);
    onIndexChangeRef.current = onIndexChange;
    const openControlled = open !== undefined;
    const openControlledRef = useRef(openControlled);
    openControlledRef.current = openControlled;
    const indexControlledRef = useRef(index !== undefined);
    indexControlledRef.current = index !== undefined;
    const registrationsRef = useRef(registrations);
    registrationsRef.current = registrations;
    const originRectRef = useRef(originRect);
    originRectRef.current = originRect;

    // Controlled/uncontrolled mode switching warns, like React inputs.
    const prevOpenControlledRef = useRef(openControlled);
    useEffect(() => {
        if (prevOpenControlledRef.current !== openControlled) {
            console.error(
                'lightGallery: <LightGallery> is changing between controlled ' +
                    'and uncontrolled `open`. Decide between controlled and ' +
                    'uncontrolled for the lifetime of the component.',
            );
        }
        prevOpenControlledRef.current = openControlled;
    }, [openControlled]);

    // The plugin event bus; core lifecycle callbacks fan out to it too
    // (`onBeforeSlide` → `beforeSlide`), backing plugin↔plugin events.
    const eventsRef = useRef<LgEventEmitter | null>(null);
    if (eventsRef.current === null) {
        eventsRef.current = createEmitter();
    }
    const events = eventsRef.current;

    const emit = useMemo<EmitFn>(
        () =>
            (name, ...args) => {
                const callback = callbacksRef.current[name] as
                    | ((...callbackArgs: unknown[]) => void)
                    | undefined;
                callback?.(...args);
                const eventName =
                    (name as string).charAt(2).toLowerCase() +
                    (name as string).slice(3);
                events.emit(eventName, args[0]);
            },
        [events],
    );

    // Plugin layout capabilities: declarative outer classes and the
    // components-open toggle (React owns className; plugins must not
    // mutate it directly the way vanilla plugins did).
    const [pluginOuterClasses, setPluginOuterClasses] = useState<
        Record<string, boolean>
    >({});
    const componentsToggleRef = useRef<() => void>(() => undefined);
    const mediaPositionOverrideRef = useRef<(() => MediaPosition) | null>(
        null,
    );
    const layout = useMemo<PluginLayout>(
        () => ({
            setOuterClass(cls, active) {
                setPluginOuterClasses((prev) =>
                    !!prev[cls] === active ? prev : { ...prev, [cls]: active },
                );
            },
            toggleComponents() {
                componentsToggleRef.current();
            },
            overrideMediaPosition(fn) {
                mediaPositionOverrideRef.current = fn;
            },
        }),
        [],
    );
    const pluginOuterClassNames = useMemo(
        () =>
            Object.keys(pluginOuterClasses)
                .filter((cls) => pluginOuterClasses[cls])
                .join(' '),
        [pluginOuterClasses],
    );

    // Plugin-emitted bus events surface as public onXxx callbacks (the
    // reverse of `emit`, which fans callbacks out to the bus).
    useEffect(() => {
        const bridged: Array<[string, keyof LightGalleryCallbacks]> = [
            ['autoplayStart', 'onAutoplayStart'],
            ['autoplay', 'onAutoplay'],
            ['autoplayStop', 'onAutoplayStop'],
            ['rotateLeft', 'onRotateLeft'],
            ['rotateRight', 'onRotateRight'],
            ['flipHorizontal', 'onFlipHorizontal'],
            ['flipVertical', 'onFlipVertical'],
        ];
        const offs = bridged.map(([eventName, callbackName]) =>
            events.on(eventName, (detail: unknown) => {
                const callback = callbacksRef.current[callbackName] as
                    | ((d: unknown) => void)
                    | undefined;
                callback?.(detail);
            }),
        );
        return () => offs.forEach((off) => off());
    }, [events]);

    // Read-only element refs for plugin effects (ADR §5 `refs`).
    const elementStoreRef = useRef<{
        outer: HTMLElement | null;
        inner: HTMLElement | null;
    }>({ outer: null, inner: null });
    const pluginRefs = useMemo<PluginRefs>(
        () => ({
            getOuter: () => elementStoreRef.current.outer,
            getInner: () => elementStoreRef.current.inner,
            getCurrentSlide: () =>
                elementStoreRef.current.outer?.querySelector<HTMLElement>(
                    '.lg-item.lg-current',
                ) ?? null,
        }),
        [],
    );
    const registerElements = useCallback(
        (elements: {
            outer?: HTMLElement | null;
            inner?: HTMLElement | null;
        }) => {
            if (elements.outer !== undefined) {
                elementStoreRef.current.outer = elements.outer;
            }
            if (elements.inner !== undefined) {
                elementStoreRef.current.inner = elements.inner;
            }
        },
        [],
    );

    // Slide-end bounce (lg-left-end / lg-right-end) — 400ms, 2.x parity.
    const timers = useTimeouts();
    const [edgeBounce, setEdgeBounce] = useState<'left' | 'right' | null>(
        null,
    );
    const bounce = useCallback(
        (side: 'left' | 'right') => {
            setEdgeBounce(side);
            timers.set(() => setEdgeBounce(null), 400);
        },
        [timers],
    );

    const getOriginRect = useCallback((slideIndex: number): RectLike | null => {
        if (originRectRef.current) {
            return originRectRef.current;
        }
        const registration = registrationsRef.current[slideIndex];
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
    }, []);

    const doOpen = useCallback(
        (slideIndex?: number) => {
            emit('onBeforeOpen');
            dispatch({ type: 'OPEN', index: slideIndex });
        },
        [emit],
    );

    const openGallery = useCallback(
        (slideIndex?: number) => {
            if (stateRef.current.open || openControlledRef.current) {
                return;
            }
            doOpen(slideIndex);
        },
        [doOpen],
    );

    const closeGallery = useCallback(() => {
        if (!settingsRef.current.closable || !stateRef.current.open) {
            return;
        }
        onCloseRef.current?.();
        if (!openControlledRef.current) {
            dispatch({ type: 'CLOSE' });
        }
    }, []);

    const goTo = useCallback(
        (slideIndex: number, direction?: SlideDirection) => {
            const current = stateRef.current;
            if (!current.open || current.transitioning) {
                return;
            }
            const target = clampIndex(
                slideIndex,
                current.slidesCount,
                current.loop,
            );
            if (target === current.currentIndex) {
                return;
            }
            if (indexControlledRef.current) {
                // Controlled index wins: request the change and let the prop
                // flow back through the sync effect.
                onIndexChangeRef.current?.(target);
                return;
            }
            dispatch({ type: 'GO_TO', index: slideIndex, direction });
            onIndexChangeRef.current?.(target);
        },
        [],
    );

    const nextSlide = useCallback(() => {
        const current = stateRef.current;
        if (!current.open || current.transitioning) {
            return;
        }
        if (current.currentIndex + 1 < current.slidesCount) {
            goTo(current.currentIndex + 1, 'next');
        } else if (current.loop) {
            goTo(0, 'next');
        } else if (settingsRef.current.slideEndAnimation) {
            bounce('right');
        }
    }, [goTo, bounce]);

    const prevSlide = useCallback(() => {
        const current = stateRef.current;
        if (!current.open || current.transitioning) {
            return;
        }
        if (current.currentIndex > 0) {
            goTo(current.currentIndex - 1, 'prev');
        } else if (current.loop) {
            goTo(current.slidesCount - 1, 'prev');
        } else if (settingsRef.current.slideEndAnimation) {
            bounce('left');
        }
    }, [goTo, bounce]);

    const goToSlide = useCallback(
        (slideIndex: number) => goTo(slideIndex),
        [goTo],
    );
    const refresh = useCallback(() => {
        // Vanilla API parity only — in React, changing `slides` is the update.
    }, []);

    const actions = useMemo<GalleryActions>(
        () => ({
            openGallery,
            closeGallery,
            goToSlide,
            nextSlide,
            prevSlide,
            refresh,
            navigate: goTo,
            dispatch,
        }),
        [
            openGallery,
            closeGallery,
            goToSlide,
            nextSlide,
            prevSlide,
            refresh,
            goTo,
        ],
    );

    // Controlled `open` → reducer.
    useEffect(() => {
        if (open === undefined) {
            return;
        }
        if (open && !state.open) {
            doOpen(index);
        } else if (!open && state.open) {
            dispatch({ type: 'CLOSE' });
        }
        // `index` is only read at the moment of opening.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, state.open, doOpen]);

    // Controlled `index` → reducer (waits out a running transition).
    useEffect(() => {
        if (index === undefined || !state.open) {
            return;
        }
        if (!state.transitioning && index !== state.currentIndex) {
            dispatch({ type: 'GO_TO', index });
        }
    }, [index, state.open, state.currentIndex, state.transitioning]);

    const handle = useMemo<LightGalleryRefHandle>(
        () => ({
            openGallery,
            closeGallery,
            goToSlide,
            nextSlide,
            prevSlide,
            refresh,
        }),
        [openGallery, closeGallery, goToSlide, nextSlide, prevSlide, refresh],
    );
    useImperativeHandle(ref, () => handle, [handle]);

    const emitInit = useEventCallback(() =>
        emit('onInit', { instance: handle }),
    );
    useEffect(() => {
        emitInit();
    }, [emitInit]);

    const getItemIndex = useCallback(
        (registration: ItemRegistration) =>
            registrationsRef.current.indexOf(registration),
        [],
    );

    // Mutable on purpose (never triggers renders) — see GestureSeam docs.
    const gestureSeamRef = useRef<GestureSeam | null>(null);
    if (gestureSeamRef.current === null) {
        const seam: GestureSeam = {
            lockOwner: null,
            claim(owner) {
                seam.lockOwner = owner;
            },
            pointers: [],
        };
        gestureSeamRef.current = seam;
    }
    const gestureSeam = gestureSeamRef.current;

    const internal = useMemo<GalleryInternal>(
        () => ({
            items,
            emit,
            registerItem,
            getItemIndex,
            getOriginRect,
            edgeBounce,
            gestureSeam,
            plugins,
            events,
            layout,
            refs: pluginRefs,
            registerElements,
            pluginOuterClassNames,
            componentsToggleRef,
            mediaPositionOverrideRef,
        }),
        [
            items,
            emit,
            registerItem,
            getItemIndex,
            getOriginRect,
            edgeBounce,
            gestureSeam,
            plugins,
            events,
            layout,
            pluginRefs,
            registerElements,
            pluginOuterClassNames,
        ],
    );

    return (
        <InternalContext.Provider value={internal}>
            <SettingsContext.Provider value={settings}>
                <SlotContext.Provider value={render ?? EMPTY_SLOTS}>
                    <ActionsContext.Provider value={actions}>
                        <StateContext.Provider value={state}>
                            {children}
                            {/* Runners live outside the portal so plugins
                                like hash can act while the gallery is
                                closed (open-from-URL). */}
                            <PluginRunners />
                            <GalleryOutlet
                                className={className}
                                container={container}
                            />
                        </StateContext.Provider>
                    </ActionsContext.Provider>
                </SlotContext.Provider>
            </SettingsContext.Provider>
        </InternalContext.Provider>
    );
});
