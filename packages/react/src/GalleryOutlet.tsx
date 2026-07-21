import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type MouseEvent,
    type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import {
    fitImageSize,
    getOriginTransform,
    getSlideType,
    parseImageSize,
    type SlideDirection,
} from '@lightgallery/headless';

import { Caption } from './Caption';
import { Controls } from './Controls';
import { cx } from './cx';
import {
    useGalleryActions,
    useGalleryInternal,
    useGallerySettings,
    useGalleryState,
} from './context';
import {
    useBodyLock,
    useEventCallback,
    useHideBars,
    useIsoLayoutEffect,
    useTimeouts,
} from './hooks';
import { Slides } from './Slides';
import { Toolbar } from './Toolbar';
import { useGalleryGestures } from './useGalleryGestures';

/**
 * Open/close lifecycle phases, mirroring the vanilla class timeline:
 * `pre-open`  — portal mounted (`lg-show`), backdrop still transparent
 * `opening`   — `lg-show-in` + backdrop `in` (fading in)
 * `open`      — backdrop settled, outer `lg-visible`
 * `closing`   — reverse animation; portal stays mounted until it finishes
 */
type OpenPhase = 'closed' | 'pre-open' | 'opening' | 'open' | 'closing';

export interface OriginAnimation {
    index: number;
    transform: string;
    /**
     * `init`  — slide parked on the trigger rect, no transition classes yet
     * `armed` — transition classes + duration applied, still on the rect
     * `run`   — animating to identity (or back to the rect when closing)
     */
    stage: 'init' | 'armed' | 'run';
    closing?: boolean;
}

export interface SlideTimeline {
    /** Which slide carries `lg-current` right now. */
    shownIndex: number;
    /** `lg-prev-slide` / `lg-next-slide` assignments. */
    positions: Record<number, 'prev' | 'next'>;
    /** Outer `lg-no-trans` while slides are re-positioned. */
    noTrans: boolean;
    /** Slide carrying `lg-slide-progress` (outgoing slide). */
    progressIndex: number | null;
}

export interface GalleryOutletProps {
    className?: string;
    container?: HTMLElement | null;
}

export function GalleryOutlet({
    className,
    container = null,
}: GalleryOutletProps): ReactElement | null {
    const state = useGalleryState();
    const settings = useGallerySettings();
    const actions = useGalleryActions();
    const internal = useGalleryInternal();

    // Portal targets exist only in the browser; render nothing during SSR.
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const timers = useTimeouts();
    const containerElRef = useRef<HTMLDivElement>(null);
    const outerRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    const [phase, setPhase] = useState<OpenPhase>('closed');
    const [visible, setVisible] = useState(false);
    const [componentsOpen, setComponentsOpen] = useState(false);
    const [useStartClass, setUseStartClass] = useState(false);
    const [zoomFromImage, setZoomFromImage] = useState(false);
    const [maximized, setMaximized] = useState(false);
    const [originAnim, setOriginAnim] = useState<OriginAnimation | null>(null);
    const [contentOffsets, setContentOffsets] = useState<{
        top: number;
        bottom: number;
    } | null>(null);
    const usedZoomRef = useRef(false);

    const isBodyContainer =
        typeof document !== 'undefined' &&
        (container ?? document.body) === document.body;

    /** Toolbar/caption offsets for media positioning (2.x parity). */
    const measureOffsets = useEventCallback(() => {
        if (settings.allowMediaOverlap) {
            return { top: 0, bottom: 0 };
        }
        const top = toolbarRef.current?.clientHeight ?? 0;
        const caption = outerRef.current?.querySelector<HTMLElement>(
            '.lg-components .lg-sub-html',
        );
        const bottom =
            settings.defaultCaptionHeight || caption?.clientHeight || 0;
        return { top, bottom };
    });

    const computeOrigin = useEventCallback(
        (index: number): string | null => {
            if (!settings.zoomFromOrigin) {
                return null;
            }
            const item = internal.items[index];
            const outerEl = outerRef.current;
            if (!item?.lgSize || !outerEl) {
                return null;
            }
            const triggerRect = internal.getOriginRect(index);
            if (!triggerRect) {
                return null;
            }
            const natural = parseImageSize(item.lgSize, window.innerWidth);
            if (!natural) {
                return null;
            }
            const rect = outerEl.getBoundingClientRect();
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
        },
    );

    const beginClose = useEventCallback(() => {
        internal.emit('onBeforeClose');
        setPhase('closing');
        setVisible(false);
        setComponentsOpen(false);

        let closeDuration = settings.backdropDuration;
        const transform = usedZoomRef.current
            ? computeOrigin(state.currentIndex)
            : null;
        if (transform) {
            setOriginAnim({
                index: state.currentIndex,
                transform,
                stage: 'run',
                closing: true,
            });
            closeDuration = Math.max(
                settings.startAnimationDuration,
                settings.backdropDuration,
            );
        } else {
            setOriginAnim(null);
            setZoomFromImage(false);
        }

        timers.set(() => {
            setPhase('closed');
            setOriginAnim(null);
            setZoomFromImage(false);
            setUseStartClass(false);
            setContentOffsets(null);
            usedZoomRef.current = false;
            internal.emit('onAfterClose');
        }, closeDuration + 100);
    });

    // state.open → phase machine.
    useIsoLayoutEffect(() => {
        if (state.open) {
            if (phase === 'closed' || phase === 'closing') {
                timers.clearAll();
                setOriginAnim(null);
                setPhase('pre-open');
            }
        } else if (phase !== 'closed' && phase !== 'closing') {
            beginClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.open]);

    // Entrance timeline, once the portal is in the DOM.
    useIsoLayoutEffect(() => {
        if (phase !== 'pre-open') {
            return;
        }
        setContentOffsets(measureOffsets());

        const transform = computeOrigin(state.currentIndex);
        usedZoomRef.current = transform !== null;
        setUseStartClass(transform === null);
        if (transform !== null) {
            const index = state.currentIndex;
            setOriginAnim({ index, transform, stage: 'init' });
            timers.set(() => {
                setZoomFromImage(true);
                setOriginAnim(
                    (anim) => anim && { ...anim, stage: 'armed' },
                );
            }, 10);
            timers.set(
                () =>
                    setOriginAnim(
                        (anim) => anim && { ...anim, stage: 'run' },
                    ),
                110,
            );
            timers.set(
                () => setOriginAnim(null),
                settings.startAnimationDuration + 110,
            );
        }

        timers.set(() => setPhase('opening'), 10);
        timers.set(() => {
            setPhase('open');
            if (!usedZoomRef.current) {
                setVisible(true);
            }
        }, 10 + settings.backdropDuration);
        timers.set(
            () => setComponentsOpen(true),
            settings.zoomFromOrigin ? 100 : settings.backdropDuration,
        );

        if (settings.trapFocus && isBodyContainer) {
            containerElRef.current?.focus({ preventScroll: true });
        }
        internal.emit('onAfterOpen');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    const bodyLockActive =
        phase === 'pre-open' || phase === 'opening' || phase === 'open';

    useBodyLock(
        bodyLockActive,
        isBodyContainer,
        settings.hideScrollbar,
        settings.resetScrollPosition,
    );

    // Keyboard: ESC close (escKey) and arrow navigation (keyPress) —
    // listener removed on close/unmount.
    const slidesCount = internal.items.length;
    useEffect(() => {
        if (!bodyLockActive || (!settings.escKey && !settings.keyPress)) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (settings.escKey && event.key === 'Escape') {
                event.preventDefault();
                actions.closeGallery();
            }
            if (settings.keyPress && slidesCount > 1) {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    actions.prevSlide();
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    actions.nextSlide();
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [bodyLockActive, settings.escKey, settings.keyPress, slidesCount, actions]);

    // Mousewheel navigation, throttled to one slide per second (2.x parity).
    useEffect(() => {
        if (!bodyLockActive || !settings.mousewheel || slidesCount < 2) {
            return;
        }
        const outerEl = outerRef.current;
        if (!outerEl) {
            return;
        }
        let lastCall = 0;
        // Non-passive on purpose: the gallery owns the wheel while open; the
        // page behind must not scroll.
        const onWheel = (event: WheelEvent) => {
            if (!event.deltaY) {
                return;
            }
            event.preventDefault();
            const now = Date.now();
            if (now - lastCall < 1000) {
                return;
            }
            lastCall = now;
            if (event.deltaY > 0) {
                actions.nextSlide();
            } else {
                actions.prevSlide();
            }
        };
        outerEl.addEventListener('wheel', onWheel, { passive: false });
        return () => outerEl.removeEventListener('wheel', onWheel);
    }, [bodyLockActive, settings.mousewheel, slidesCount, actions]);

    const barsHidden = useHideBars(
        bodyLockActive,
        settings.hideBarsDelay,
        settings.showBarsAfter,
        outerRef,
    );

    // Slide transition timeline (2.x makeSlideAnimation).
    const [timeline, setTimeline] = useState<SlideTimeline>({
        shownIndex: state.currentIndex,
        positions: {},
        noTrans: false,
        progressIndex: null,
    });
    const prevShownRef = useRef<number | null>(null);
    const runTransition = useEventCallback(
        (from: number, to: number, direction: SlideDirection) => {
            const start = () => {
                setTimeline({
                    shownIndex: from,
                    positions: {
                        [to]: direction === 'next' ? 'next' : 'prev',
                        [from]: direction === 'next' ? 'prev' : 'next',
                    },
                    noTrans: true,
                    progressIndex: from,
                });
                timers.set(() => {
                    setTimeline((tl) => ({
                        ...tl,
                        shownIndex: to,
                        noTrans: false,
                    }));
                }, 50);
                timers.set(() => {
                    setTimeline((tl) => ({ ...tl, progressIndex: null }));
                    actions.dispatch({ type: 'TRANSITION_END' });
                    internal.emit('onAfterSlide', {
                        index: to,
                        prevIndex: from,
                        fromTouch: false,
                        fromThumb: false,
                    });
                }, settings.speed + 100 + settings.slideDelay);
            };
            internal.emit('onBeforeSlide', {
                index: to,
                prevIndex: from,
                fromTouch: false,
                fromThumb: false,
            });
            if (settings.slideDelay > 0) {
                setTimeline((tl) => ({ ...tl, progressIndex: from }));
                timers.set(start, settings.slideDelay);
            } else {
                start();
            }
        },
    );
    const fromTouchRef = useRef(false);
    const [touchSlideMode, setTouchSlideMode] = useState(false);
    const runTouchTransition = useEventCallback(
        (from: number, to: number, direction: SlideDirection) => {
            internal.emit('onBeforeSlide', {
                index: to,
                prevIndex: from,
                fromTouch: true,
                fromThumb: false,
            });
            // 2.x fromTouch path: slides are already positioned by the drag —
            // switch lg-current immediately (no lg-no-trans / 50ms phase) and
            // keep only the incoming-side neighbor positioned.
            const count = state.slidesCount;
            const positions: Record<number, 'prev' | 'next'> = {};
            if (direction === 'prev') {
                let neighbor = to + 1;
                if (neighbor >= count) {
                    neighbor = state.loop && count > 2 ? 0 : -1;
                }
                if (neighbor >= 0 && neighbor !== to) {
                    positions[neighbor] = 'next';
                }
            } else {
                let neighbor = to - 1;
                if (neighbor < 0) {
                    neighbor = state.loop && count > 2 ? count - 1 : -1;
                }
                if (neighbor >= 0 && neighbor !== to) {
                    positions[neighbor] = 'prev';
                }
            }
            setTimeline({
                shownIndex: to,
                positions,
                noTrans: false,
                progressIndex: null,
            });
            timers.set(() => {
                actions.dispatch({ type: 'TRANSITION_END' });
                internal.emit('onAfterSlide', {
                    index: to,
                    prevIndex: from,
                    fromTouch: true,
                    fromThumb: false,
                });
            }, settings.speed + 100);
        },
    );
    useEffect(() => {
        const fromTouch = fromTouchRef.current;
        fromTouchRef.current = false;
        if (!state.open) {
            prevShownRef.current = null;
            setTimeline({
                shownIndex: state.currentIndex,
                positions: {},
                noTrans: false,
                progressIndex: null,
            });
            return;
        }
        const current = state.currentIndex;
        const previous = prevShownRef.current;
        prevShownRef.current = current;
        if (previous === null || previous === current) {
            setTimeline((tl) => ({ ...tl, shownIndex: current }));
            return;
        }
        if (!state.transitioning) {
            // Index changed without animation (e.g. slides prop shrank).
            setTimeline({
                shownIndex: current,
                positions: {},
                noTrans: false,
                progressIndex: null,
            });
            return;
        }
        const direction =
            state.slideDirection ?? (current > previous ? 'next' : 'prev');
        if (fromTouch) {
            runTouchTransition(previous, current, direction);
            return;
        }
        runTransition(previous, current, direction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.open, state.currentIndex]);

    // Gesture wiring: position classes at drag start, commit at release.
    const prepareDrag = useEventCallback(() => {
        const count = state.slidesCount;
        const index = state.currentIndex;
        let prevN = index - 1;
        let nextN = index + 1;
        if (state.loop && count > 2) {
            if (index === 0) {
                prevN = count - 1;
            } else if (index === count - 1) {
                nextN = 0;
            }
        }
        const positions: Record<number, 'prev' | 'next'> = {};
        if (prevN >= 0 && prevN < count && prevN !== index) {
            positions[prevN] = 'prev';
        }
        if (
            nextN >= 0 &&
            nextN < count &&
            nextN !== index &&
            nextN !== prevN
        ) {
            positions[nextN] = 'next';
        }
        setTimeline((tl) => ({ ...tl, positions }));
    });
    const commitTouchNavigation = useEventCallback(
        (target: number, direction: SlideDirection) => {
            fromTouchRef.current = true;
            // Drags animate as slide whatever the mode (2.x adds lg-slide
            // for the release animation, then removes it).
            if (settings.mode !== 'lg-slide') {
                setTouchSlideMode(true);
                timers.set(
                    () => setTouchSlideMode(false),
                    settings.speed + 100,
                );
            }
            actions.navigate(target, direction);
        },
    );
    const gestures = useGalleryGestures({
        outerRef,
        active: bodyLockActive,
        prepareDrag,
        commitTouchNavigation,
    });

    // Close on tap of the black area around the slide (2.x closeOnTap).
    const mouseDownOnSlideRef = useRef(false);
    const isSlideElement = (target: EventTarget | null): boolean => {
        if (!(target instanceof Element)) {
            return false;
        }
        return ['lg-outer', 'lg-item', 'lg-img-wrap', 'lg-img-rotate'].some(
            (name) => target.classList.contains(name),
        );
    };
    const onOuterMouseDown = (event: MouseEvent) => {
        mouseDownOnSlideRef.current = isSlideElement(event.target);
    };
    const onOuterMouseMove = () => {
        mouseDownOnSlideRef.current = false;
    };
    const onOuterMouseUp = (event: MouseEvent) => {
        if (
            settings.closeOnTap &&
            mouseDownOnSlideRef.current &&
            isSlideElement(event.target)
        ) {
            actions.closeGallery();
        }
    };

    if (!mounted || phase === 'closed') {
        return null;
    }

    const portalTarget = container ?? document.body;
    const currentItem = internal.items[state.currentIndex];
    const showIn = phase === 'opening' || phase === 'open';
    const zoomClosing = phase === 'closing' && originAnim?.closing === true;

    const containerClasses = cx(
        'lg-container',
        'lg-show',
        className,
        showIn && 'lg-show-in',
        !isBodyContainer && !maximized && 'lg-inline',
    );

    const outerClasses = cx(
        'lg-outer',
        'lg-use-css3',
        'lg-css3',
        settings.mode,
        settings.enableDrag && 'lg-grab',
        internal.items.length < 2 && 'lg-single-item',
        settings.allowMediaOverlap && 'lg-media-overlap',
        useStartClass && settings.startClass,
        zoomFromImage && 'lg-zoom-from-image',
        visible && 'lg-visible',
        componentsOpen && 'lg-components-open',
        (barsHidden || (phase === 'closing' && !zoomClosing)) &&
            'lg-hide-items',
        zoomClosing && 'lg-closing',
        timeline.noTrans && 'lg-no-trans',
        touchSlideMode && settings.mode !== 'lg-slide' && 'lg-slide',
        internal.edgeBounce === 'right' && 'lg-right-end',
        internal.edgeBounce === 'left' && 'lg-left-end',
        settings.download &&
            currentItem?.downloadUrl === false &&
            'lg-hide-download',
    );

    const contentStyle: CSSProperties | undefined =
        !settings.allowMediaOverlap && contentOffsets
            ? {
                  top: `${contentOffsets.top}px`,
                  bottom: `${contentOffsets.bottom}px`,
              }
            : undefined;

    return createPortal(
        <div
            ref={containerElRef}
            className={containerClasses}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={settings.ariaLabelledby || undefined}
            aria-describedby={settings.ariaDescribedby || undefined}
        >
            <div
                className={cx('lg-backdrop', showIn && 'in')}
                style={{
                    transitionDuration: `${settings.backdropDuration}ms`,
                }}
            />
            <div
                ref={outerRef}
                className={outerClasses}
                data-lg-slide-type={
                    currentItem ? getSlideType(currentItem) : undefined
                }
                onMouseDown={onOuterMouseDown}
                onMouseMove={onOuterMouseMove}
                onMouseUp={onOuterMouseUp}
                onPointerDown={gestures.onPointerDown}
            >
                <div className="lg-content" style={contentStyle}>
                    <Slides timeline={timeline} originAnim={originAnim} />
                    <Controls />
                </div>
                <Toolbar
                    toolbarRef={toolbarRef}
                    onToggleMaximize={() => setMaximized((value) => !value)}
                />
                {settings.captionPosition === 'outer' && <Caption />}
                <div className="lg-components">
                    {settings.captionPosition === 'bar' && <Caption />}
                </div>
            </div>
        </div>,
        portalTarget,
    );
}
