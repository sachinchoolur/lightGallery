import { autoplayDefaultIcons } from '@lightgallery/headless';
import { useEffect, useRef, useState, type ReactElement } from 'react';

import { cx } from '../../cx';
import { useGalleryInternal } from '../../context';
import { useCustomIcons } from '../../icons';
import { usePluginSettings } from '../runtime';
import type { LgPlugin, PluginContext } from '../types';

/**
 * Autoplay plugin (2.x `lg-autoplay`): slideshow timer with progress bar.
 * The toolbar button and the timer talk over the event bus; run-state is
 * mirrored to the `lg-show-autoplay` outer class (2.x parity, drives the
 * progress-bar CSS).
 */

export interface AutoplaySettings {
    /** Enable the autoplay plugin. */
    autoplay: boolean;
    /** Start the slideshow as soon as the first slide loads. */
    slideShowAutoplay: boolean;
    /**
     * Time (ms) between transitions (added to `speed`). The countdown
     * starts once the slide on screen has loaded, so a slow connection
     * never advances past an image before it is visible.
     */
    slideShowInterval: number;
    /** Show the progress bar. */
    progressBar: boolean;
    /** Keep the slideshow running after user navigation. */
    forceSlideShowAutoplay: boolean;
    /** Show the play/pause toolbar button. */
    autoplayControls: boolean;
    /**
     * @deprecated Set these labels on the core `strings` object instead —
     * an explicitly set key here still wins (alias).
     */
    autoplayPluginStrings?: { toggleAutoplay?: string };
}

export const autoplaySettings: AutoplaySettings = {
    autoplay: true,
    slideShowAutoplay: false,
    slideShowInterval: 5000,
    progressBar: true,
    forceSlideShowAutoplay: false,
    autoplayControls: true,
};

const TOGGLE_EVENT = 'lg-autoplay-toggle';
/**
 * Timer → progress bar: a countdown started (`counting`), or the timer is
 * holding at zero for the slide on screen to load.
 */
const CYCLE_EVENT = 'lg-autoplay-cycle';

interface AutoplayCycleDetail {
    counting: boolean;
}

function AutoplayButton(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<AutoplaySettings>();
    const apIcon = useCustomIcons(
        ['autoplayPlay', 'autoplayPause'],
        autoplayDefaultIcons,
    );
    if (!settings.autoplay || !settings.autoplayControls) {
        return null;
    }
    return (
        <button
            type="button"
            aria-label={
                settings.autoplayPluginStrings?.toggleAutoplay ??
                settings.strings.toggleAutoplay
            }
            className={cx('lg-autoplay-button lg-icon', apIcon.className)}
            onClick={() => internal.events.emit(TOGGLE_EVENT, undefined)}
        >
            {apIcon.content}
        </button>
    );
}

function AutoplayProgressBar(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<AutoplaySettings>();
    const [cycle, setCycle] = useState(0);
    const [running, setRunning] = useState(false);
    // False while the timer waits for the slide on screen to load: the
    // bar sits at zero until the countdown really starts.
    const [counting, setCounting] = useState(false);
    // Two-phase start: the remounted bar must PAINT at width 0 before
    // lg-start lands — a fresh element has no prior style, so flipping
    // the class in the same frame renders the bar full instead of
    // animating (2.x staged this with a 20ms timer).
    const [armed, setArmed] = useState(false);

    useEffect(() => {
        const offs = [
            internal.events.on('autoplayStart', () => setRunning(true)),
            internal.events.on('autoplayStop', () => {
                setRunning(false);
                setCounting(false);
            }),
            internal.events.on(CYCLE_EVENT, (detail) => {
                setCounting((detail as AutoplayCycleDetail).counting);
                setCycle((value) => value + 1);
            }),
        ];
        return () => offs.forEach((off) => off());
    }, [internal.events]);

    useEffect(() => {
        setArmed(false);
        if (!running || !counting) {
            return;
        }
        const id = window.setTimeout(() => setArmed(true), 20);
        return () => window.clearTimeout(id);
    }, [running, counting, cycle]);

    if (!settings.autoplay || !settings.progressBar) {
        return null;
    }
    const duration = settings.speed + settings.slideShowInterval;
    const active = running && counting;
    return (
        <div className={cx('lg-progress-bar', active && armed && 'lg-start')}>
            <div
                // Remounting restarts the width transition each cycle.
                key={cycle}
                className="lg-progress"
                style={
                    active
                        ? { transition: `width ${duration}ms ease 0s` }
                        : undefined
                }
            />
        </div>
    );
}

function useAutoplayPlugin(ctx: PluginContext): void {
    const settings = ctx.settings as unknown as AutoplaySettings & {
        speed: number;
    };
    const enabled = settings.autoplay;
    const open = ctx.state.open;
    const ctxRef = useRef(ctx);
    ctxRef.current = ctx;
    const settingsRef = useRef(settings);
    settingsRef.current = settings;
    const timerRef = useRef<number | null>(null);
    const runningRef = useRef(false);
    /** Index the countdown waits on; its slide has not loaded yet. */
    const waitingForRef = useRef<number | null>(null);
    const fromAutoRef = useRef(false);
    const pausedOnDragRef = useRef(false);
    const pausedOnSlideChangeRef = useRef(false);

    useEffect(() => {
        if (!enabled || !open) {
            return;
        }
        const { events, layout } = ctxRef.current;

        const clearTimer = () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            waitingForRef.current = null;
        };
        const countdown = () => {
            clearTimer();
            const cfg = settingsRef.current;
            timerRef.current = window.setTimeout(() => {
                timerRef.current = null;
                advance();
            }, cfg.speed + cfg.slideShowInterval);
            events.emit(CYCLE_EVENT, { counting: true });
        };
        // Arm the countdown for the slide at `index`. A slide still
        // loading holds it (and the bar at zero) until its slideItemLoad
        // arrives, so a slow connection never skips past images the
        // viewer has not seen.
        // `settledIndex` is a slide whose slideItemLoad is being handled
        // right now: its SLIDE_LOADED dispatch has not rendered yet, so
        // the state snapshot in the ref still reports it unloaded.
        const schedule = (index: number, settledIndex?: number) => {
            clearTimer();
            if (
                index === settledIndex ||
                ctxRef.current.state.loadedSlides.has(index)
            ) {
                countdown();
                return;
            }
            waitingForRef.current = index;
            events.emit(CYCLE_EVENT, { counting: false });
        };
        const advance = () => {
            const { state, actions } = ctxRef.current;
            // Mid-transition (a tiny interval, or a long slideDelay) the
            // core ignores navigation; try again after another cycle.
            if (state.transitioning) {
                countdown();
                return;
            }
            const next =
                state.currentIndex + 1 < state.slidesCount
                    ? state.currentIndex + 1
                    : 0;
            fromAutoRef.current = true;
            events.emit('autoplay', { index: next });
            actions.navigate(next, 'next');
            if (runningRef.current) {
                schedule(next);
            }
        };
        const stop = () => {
            if (!runningRef.current) {
                return;
            }
            runningRef.current = false;
            clearTimer();
            layout.setOuterClass('lg-show-autoplay', false);
            events.emit('autoplayStop', {
                index: ctxRef.current.state.currentIndex,
            });
        };
        const start = (settledIndex?: number) => {
            if (runningRef.current) {
                return;
            }
            runningRef.current = true;
            layout.setOuterClass('lg-show-autoplay', true);
            const { currentIndex } = ctxRef.current.state;
            events.emit('autoplayStart', { index: currentIndex });
            schedule(currentIndex, settledIndex);
        };

        const offs = [
            events.on(TOGGLE_EVENT, () => {
                if (runningRef.current) {
                    stop();
                } else {
                    start();
                }
            }),
            // Pause during drags; resume after (2.x behavior).
            events.on('dragStart', () => {
                if (runningRef.current) {
                    stop();
                    pausedOnDragRef.current = true;
                }
            }),
            events.on('dragEnd', () => {
                if (pausedOnDragRef.current) {
                    pausedOnDragRef.current = false;
                    start();
                }
            }),
            // User-initiated navigation stops the show unless forced.
            events.on('beforeSlide', () => {
                if (!fromAutoRef.current && runningRef.current) {
                    stop();
                    pausedOnSlideChangeRef.current = true;
                } else {
                    pausedOnSlideChangeRef.current = false;
                }
                fromAutoRef.current = false;
            }),
            events.on('afterSlide', () => {
                if (
                    pausedOnSlideChangeRef.current &&
                    !runningRef.current &&
                    settingsRef.current.forceSlideShowAutoplay
                ) {
                    pausedOnSlideChangeRef.current = false;
                    start();
                }
            }),
            // The awaited slide settled (loaded, or failed and shows its
            // error message): start its countdown.
            events.on('slideItemLoad', (detail) => {
                if (
                    runningRef.current &&
                    waitingForRef.current === detail.index
                ) {
                    countdown();
                }
            }),
        ];

        let startedFromLoad: (() => void) | null = null;
        if (settingsRef.current.slideShowAutoplay) {
            startedFromLoad = events.on('slideItemLoad', (detail) => {
                startedFromLoad?.();
                startedFromLoad = null;
                start(detail.index);
            });
        }

        return () => {
            offs.forEach((off) => off());
            startedFromLoad?.();
            stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, open]);
}

const Autoplay: LgPlugin<AutoplaySettings> = {
    name: 'autoplay',
    defaults: autoplaySettings,
    slots: {
        toolbar: AutoplayButton,
        outer: AutoplayProgressBar,
    },
    usePlugin: useAutoplayPlugin,
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        autoplay: Partial<AutoplaySettings>;
    }
}

export default Autoplay;
