import { LightGallery } from '../../lightgallery';
import { AutoplaySettings, autoplaySettings } from './lg-autoplay-settings';

/**
 * Creates the autoplay plugin.
 * @param {object} element - lightGallery element
 */
export class Autoplay {
    core: LightGallery;
    s: AutoplaySettings;
    interval!: any;
    fromAuto!: boolean;
    canceledOnTouch!: boolean;
    fourceAutoplayTemp!: boolean;

    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, autoplaySettings);

        // Execute only if items are above 1
        if (this.core.items.length < 2) {
            return this;
        }
        this.interval = false;

        // Identify if slide happened from autoplay
        this.fromAuto = true;

        // Identify if autoplay canceled from touch/drag
        this.canceledOnTouch = false;

        // save fourceautoplay value
        this.fourceAutoplayTemp = this.s.fourceAutoplay;

        // do not allow progress bar if browser does not support css3 transitions
        if (!this.core.doCss()) {
            this.s.progressBar = false;
        }

        this.init();

        return this;
    }

    init() {
        // append autoplay controls
        if (this.s.autoplayControls) {
            this.controls();
        }

        // Create progress bar
        if (this.s.progressBar) {
            this.core.outer
                .find('.lg')
                .append(
                    '<div class="lg-progress-bar"><div class="lg-progress"></div></div>',
                );
        }

        // set progress
        this.progress();

        // Start autoplay
        if (this.s.autoplay) {
            this.core.LGel.once('onSlideItemLoad.lg.tm', () => {
                this.startAuto();
            });
        }

        // cancel interval on touchstart and dragstart
        this.core.LGel.on('onDragstart.lg.tm touchstart.lg.tm', () => {
            if (this.interval) {
                this.cancelAuto();
                this.canceledOnTouch = true;
            }
        });

        // restore autoplay if autoplay canceled from touchstart / dragstart
        this.core.LGel.on(
            'onDragend.lg.tm touchend.lg.tm onSlideClick.lg.tm',
            () => {
                if (!this.interval && this.canceledOnTouch) {
                    this.startAuto();
                    this.canceledOnTouch = false;
                }
            },
        );
    }

    progress() {
        this.core.LGel.on('onBeforeSlide.lg.tm', () => {
            // start progress bar animation
            if (this.s.progressBar && this.fromAuto) {
                const _$progressBar = this.core.outer.find('.lg-progress-bar');
                const _$progress = this.core.outer.find('.lg-progress');
                if (this.interval) {
                    _$progress.removeAttr('style');
                    _$progressBar.removeClass('lg-start');
                    setTimeout(() => {
                        _$progress.css(
                            'transition',
                            'width ' +
                                (this.core.s.speed + this.s.pause) +
                                'ms ease 0s',
                        );
                        _$progressBar.addClass('lg-start');
                    }, 20);
                }
            }

            // Remove setinterval if slide is triggered manually and fourceautoplay is false
            if (!this.fromAuto && !this.s.fourceAutoplay) {
                this.cancelAuto();
            }

            this.fromAuto = false;
        });
    }

    // Manage autoplay via play/stop buttons
    controls() {
        const _html =
            '<button type="button" class="lg-autoplay-button lg-icon"></button>';

        // Append autoplay controls
        this.core.outer.find(this.s.appendAutoplayControlsTo).append(_html);

        this.core.outer
            .find('.lg-autoplay-button')
            .first()
            .on('click.lg', () => {
                if (this.core.outer.hasClass('lg-show-autoplay')) {
                    this.cancelAuto();
                    this.s.fourceAutoplay = false;
                } else {
                    if (!this.interval) {
                        this.startAuto();
                        this.s.fourceAutoplay = this.fourceAutoplayTemp;
                    }
                }
            });
    }

    // Autostart gallery
    startAuto() {
        this.core.outer
            .find('.lg-progress')
            .css(
                'transition',
                'width ' + (this.core.s.speed + this.s.pause) + 'ms ease 0s',
            );
        this.core.outer.addClass('lg-show-autoplay');
        this.core.outer.find('.lg-progress-bar').addClass('lg-start');

        this.interval = setInterval(() => {
            if (this.core.index + 1 < this.core.items.length) {
                this.core.index++;
            } else {
                this.core.index = 0;
            }

            this.fromAuto = true;
            this.core.slide(this.core.index, false, false, 'next');
        }, this.core.s.speed + this.s.pause);
    }

    // cancel Autostart
    cancelAuto() {
        clearInterval(this.interval);
        this.interval = false;
        this.core.outer.find('.lg-progress').removeAttr('style');
        this.core.outer.removeClass('lg-show-autoplay');
        this.core.outer.find('.lg-progress-bar').removeClass('lg-start');
    }

    destroy() {
        this.cancelAuto();
        this.core.outer.find('.lg-progress-bar').remove();
    }
}

window.lgModules = window.lgModules || {};
window.lgModules.autoplay = Autoplay;
