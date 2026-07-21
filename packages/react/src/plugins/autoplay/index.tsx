import { useEffect, useRef, useState, type ReactElement } from 'react';

import { cx } from '../../cx';
import { useGalleryInternal } from '../../context';
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
    /** Time (ms) between transitions (added to `speed`). */
    slideShowInterval: number;
    /** Show the progress bar. */
    progressBar: boolean;
    /** Keep the slideshow running after user navigation. */
    forceSlideShowAutoplay: boolean;
    /** Show the play/pause toolbar button. */
    autoplayControls: boolean;
    autoplayPluginStrings: { toggleAutoplay: string };
}

export const autoplaySettings: AutoplaySettings = {
    autoplay: true,
    slideShowAutoplay: false,
    slideShowInterval: 5000,
    progressBar: true,
    forceSlideShowAutoplay: false,
    autoplayControls: true,
    autoplayPluginStrings: { toggleAutoplay: 'Toggle Autoplay' },
};

const TOGGLE_EVENT = 'lg-autoplay-toggle';

function AutoplayButton(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<AutoplaySettings>();
    if (!settings.autoplay || !settings.autoplayControls) {
        return null;
    }
    return (
        <button
            type="button"
            aria-label={settings.autoplayPluginStrings.toggleAutoplay}
            className="lg-autoplay-button lg-icon"
            onClick={() => internal.events.emit(TOGGLE_EVENT, undefined)}
        />
    );
}

function AutoplayProgressBar(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<AutoplaySettings>();
    const [cycle, setCycle] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const offs = [
            internal.events.on('autoplayStart', () => {
                setRunning(true);
                setCycle((value) => value + 1);
            }),
            internal.events.on('autoplayStop', () => setRunning(false)),
            internal.events.on('beforeSlide', () =>
                setCycle((value) => value + 1),
            ),
        ];
        return () => offs.forEach((off) => off());
    }, [internal.events]);

    if (!settings.autoplay || !settings.progressBar) {
        return null;
    }
    const duration = settings.speed + settings.slideShowInterval;
    return (
        <div className={cx('lg-progress-bar', running && 'lg-start')}>
            <div
                // Remounting restarts the width transition each cycle.
                key={cycle}
                className="lg-progress"
                style={
                    running
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
    const intervalRef = useRef<number | null>(null);
    const fromAutoRef = useRef(false);
    const pausedOnDragRef = useRef(false);
    const pausedOnSlideChangeRef = useRef(false);

    useEffect(() => {
        if (!enabled || !open) {
            return;
        }
        const { events, layout } = ctxRef.current;

        const stop = () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
                layout.setOuterClass('lg-show-autoplay', false);
                events.emit('autoplayStop', {
                    index: ctxRef.current.state.currentIndex,
                });
            }
        };
        const start = () => {
            if (intervalRef.current !== null) {
                return;
            }
            const cfg = settingsRef.current;
            layout.setOuterClass('lg-show-autoplay', true);
            events.emit('autoplayStart', {
                index: ctxRef.current.state.currentIndex,
            });
            intervalRef.current = window.setInterval(() => {
                const { state, actions } = ctxRef.current;
                const next =
                    state.currentIndex + 1 < state.slidesCount
                        ? state.currentIndex + 1
                        : 0;
                fromAutoRef.current = true;
                events.emit('autoplay', { index: next });
                actions.navigate(next, 'next');
            }, cfg.speed + cfg.slideShowInterval);
        };

        const offs = [
            events.on(TOGGLE_EVENT, () => {
                if (intervalRef.current !== null) {
                    stop();
                } else {
                    start();
                }
            }),
            // Pause during drags; resume after (2.x behavior).
            events.on('dragStart', () => {
                if (intervalRef.current !== null) {
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
                if (!fromAutoRef.current && intervalRef.current !== null) {
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
                    intervalRef.current === null &&
                    settingsRef.current.forceSlideShowAutoplay
                ) {
                    pausedOnSlideChangeRef.current = false;
                    start();
                }
            }),
        ];

        let startedFromLoad: (() => void) | null = null;
        if (settingsRef.current.slideShowAutoplay) {
            startedFromLoad = events.on('slideItemLoad', () => {
                startedFromLoad?.();
                startedFromLoad = null;
                start();
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
