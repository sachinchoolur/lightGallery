import { autoplayDefaultIcons } from '@lightgallery/headless';
import { lGEvents, SlideItemLoadDetail } from '../../lg-events';
import { LightGallery } from '../../lightgallery';
import { AutoplaySettings, autoplaySettings } from './lg-autoplay-settings';

/**
 * Creates the autoplay plugin.
 * @param {object} element - lightGallery element
 */
export default class Autoplay {
    core: LightGallery;
    settings: AutoplaySettings;
    /** True while the slideshow runs (counting down, or waiting for the slide on screen to load). */
    running = false;
    fromAuto!: boolean;
    pausedOnTouchDrag!: boolean;
    pausedOnSlideChange!: boolean;
    private timer: ReturnType<typeof setTimeout> | null = null;
    private progressTimer: ReturnType<typeof setTimeout> | null = null;
    /** Index the countdown waits on; the slide has not loaded yet. */
    private waitingFor: number | null = null;
    private startedFromLoad = false;

    constructor(instance: LightGallery) {
        this.core = instance;

        // extend module default settings with lightGallery core settings
        this.settings = { ...autoplaySettings, ...this.core.settings };

        return this;
    }

    public init(): void {
        this.core.registerDefaultIcons(autoplayDefaultIcons);
        if (!this.settings.autoplay) {
            return;
        }

        // Identify if slide happened from autoplay
        this.fromAuto = true;

        // Identify if autoplay canceled from touch/drag
        this.pausedOnTouchDrag = false;

        this.pausedOnSlideChange = false;

        // append autoplay controls
        if (this.settings.autoplayControls) {
            this.controls();
        }

        // Create progress bar
        if (this.settings.progressBar) {
            this.core.outer.append(
                '<div class="lg-progress-bar"><div class="lg-progress"></div></div>',
            );
        }

        // Start autoplay once the first slide has loaded, and resume a
        // countdown that waits for the slide on screen to load. A slide
        // that failed to load settles the same way (vanilla fires
        // slideItemLoad on error), so a broken image never stalls the show.
        this.core.LGel.on(
            `${lGEvents.slideItemLoad}.autoplay`,
            (event: CustomEvent<SlideItemLoadDetail>) => {
                if (this.settings.slideShowAutoplay && !this.startedFromLoad) {
                    this.startedFromLoad = true;
                    this.startAutoPlay();
                    return;
                }
                if (this.running && this.waitingFor === event.detail.index) {
                    this.countdown();
                }
            },
        );

        // cancel interval on touchstart and dragstart
        this.core.LGel.on(
            `${lGEvents.dragStart}.autoplay touchstart.lg.autoplay`,
            () => {
                if (this.running) {
                    this.stopAutoPlay();
                    this.pausedOnTouchDrag = true;
                }
            },
        );

        // restore autoplay if autoplay canceled from touchstart / dragstart
        this.core.LGel.on(
            `${lGEvents.dragEnd}.autoplay touchend.lg.autoplay`,
            () => {
                if (!this.running && this.pausedOnTouchDrag) {
                    this.startAutoPlay();
                    this.pausedOnTouchDrag = false;
                }
            },
        );

        this.core.LGel.on(`${lGEvents.beforeSlide}.autoplay`, () => {
            if (!this.fromAuto && this.running) {
                this.stopAutoPlay();
                this.pausedOnSlideChange = true;
            } else {
                this.pausedOnSlideChange = false;
            }
            this.fromAuto = false;
        });

        // restore autoplay if autoplay canceled from touchstart / dragstart
        this.core.LGel.on(`${lGEvents.afterSlide}.autoplay`, () => {
            if (
                this.pausedOnSlideChange &&
                !this.running &&
                this.settings.forceSlideShowAutoplay
            ) {
                this.startAutoPlay();
                this.pausedOnSlideChange = false;
            }
        });
    }

    private cycleDuration(): number {
        return this.core.settings.speed + this.settings.slideShowInterval;
    }

    /**
     * Restart the progress bar from zero. Two-phase: the bar must paint at
     * width 0 before `lg-start` lands, or a bar that was already full
     * renders full again instead of animating.
     */
    private showProgressBar() {
        if (!this.settings.progressBar) {
            return;
        }
        this.resetProgressBar();
        this.progressTimer = setTimeout(() => {
            this.progressTimer = null;
            if (!this.running || this.timer === null) {
                return;
            }
            this.core.outer
                .find('.lg-progress')
                .css(
                    'transition',
                    'width ' + this.cycleDuration() + 'ms ease 0s',
                );
            this.core.outer.find('.lg-progress-bar').addClass('lg-start');
        }, 20);
    }

    private resetProgressBar() {
        if (this.progressTimer !== null) {
            clearTimeout(this.progressTimer);
            this.progressTimer = null;
        }
        this.core.outer.find('.lg-progress').removeAttr('style');
        this.core.outer.find('.lg-progress-bar').removeClass('lg-start');
    }

    // Manage autoplay via play/stop buttons
    private controls() {
        const _html = `<button aria-label="${
            this.settings.autoplayPluginStrings?.toggleAutoplay ??
            this.core.settings.strings.toggleAutoplay
        }" type="button" class="lg-autoplay-button lg-icon"></button>`;

        // Append autoplay controls
        this.core.outer
            .find(this.settings.appendAutoplayControlsTo)
            .append(_html);

        this.core.outer
            .find('.lg-autoplay-button')
            .first()
            .on('click.lg.autoplay', () => {
                if (this.core.outer.hasClass('lg-show-autoplay')) {
                    this.stopAutoPlay();
                } else {
                    if (!this.running) {
                        this.startAutoPlay();
                    }
                }
            });
    }

    private isSlideLoaded(index: number): boolean {
        return this.core.getSlideItem(index).hasClass('lg-complete_');
    }

    private clearTimer() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.waitingFor = null;
    }

    /**
     * Arm the countdown for the slide at `index`. A slide that is still
     * loading holds the countdown (and the progress bar at zero) until its
     * slideItemLoad arrives, so a slow connection never skips past images
     * the viewer has not seen.
     */
    private schedule(index: number) {
        this.clearTimer();
        if (this.isSlideLoaded(index)) {
            this.countdown();
            return;
        }
        this.waitingFor = index;
        this.resetProgressBar();
    }

    private countdown() {
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.timer = null;
            this.advance();
        }, this.cycleDuration());
        this.showProgressBar();
    }

    private advance() {
        // Mid-transition (a tiny interval, or a long slideDelay) the core
        // ignores slide(); mutating index now would desync the counter
        // from the slide on screen. Try again after another cycle.
        if (this.core.lgBusy) {
            this.countdown();
            return;
        }
        if (this.core.index + 1 < this.core.galleryItems.length) {
            this.core.index++;
        } else {
            this.core.index = 0;
        }

        this.core.LGel.trigger(lGEvents.autoplay, {
            index: this.core.index,
        });

        this.fromAuto = true;
        this.core.slide(this.core.index, false, false, 'next');
        if (this.running) {
            this.schedule(this.core.index);
        }
    }

    // Autostart gallery
    public startAutoPlay(): void {
        if (this.running) {
            return;
        }
        this.running = true;
        this.core.outer.addClass('lg-show-autoplay');
        this.core.LGel.trigger(lGEvents.autoplayStart, {
            index: this.core.index,
        });
        this.schedule(this.core.index);
    }

    // cancel Autostart
    public stopAutoPlay(): void {
        if (this.running) {
            this.core.LGel.trigger(lGEvents.autoplayStop, {
                index: this.core.index,
            });
            this.core.outer.removeClass('lg-show-autoplay');
        }
        this.running = false;
        this.clearTimer();
        this.resetProgressBar();
    }

    public closeGallery(): void {
        this.stopAutoPlay();
    }
    public destroy(): void {
        this.stopAutoPlay();
        if (this.settings.autoplay) {
            this.core.outer.find('.lg-progress-bar').remove();
        }
        // Remove all event listeners added by autoplay plugin
        this.core.LGel.off('.lg.autoplay');
        this.core.LGel.off('.autoplay');
    }
}
