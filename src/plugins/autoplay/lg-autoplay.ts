import { lGEvents } from '../../lg-events';
import { LightGallery } from '../../lightgallery';
import { AutoplaySettings, autoplaySettings } from './lg-autoplay-settings';

/**
 * Creates the autoplay plugin.
 * @param {object} element - lightGallery element
 */
export default class Autoplay {
    core: LightGallery;
    settings: AutoplaySettings;
    interval!: any;
    fromAuto!: boolean;
    pausedOnTouchDrag!: boolean;
    pausedOnSlideChange!: boolean;

    constructor(instance: LightGallery) {
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.settings = { ...autoplaySettings, ...this.core.settings };

        return this;
    }

    public init(): void {
        if (!this.settings.autoplay) {
            return;
        }

        this.interval = false;

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

        // Start autoplay
        if (this.settings.slideShowAutoplay) {
            this.core.LGel.once(`${lGEvents.slideItemLoad}.autoplay`, () => {
                this.startAuto();
            });
        }

        // cancel interval on touchstart and dragstart
        this.core.LGel.on(
            `${lGEvents.dragStart}.autoplay touchstart.lg.autoplay`,
            () => {
                if (this.interval) {
                    this.cancelAuto();
                    this.pausedOnTouchDrag = true;
                }
            },
        );

        // restore autoplay if autoplay canceled from touchstart / dragstart
        this.core.LGel.on(
            `${lGEvents.dragEnd}.autoplay touchend.lg.autoplay`,
            () => {
                if (!this.interval && this.pausedOnTouchDrag) {
                    this.startAuto();
                    this.pausedOnTouchDrag = false;
                }
            },
        );

        this.core.LGel.on(`${lGEvents.beforeSlide}.autoplay`, () => {
            this.showProgressBar();
            if (!this.fromAuto && this.interval) {
                this.cancelAuto();
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
                !this.interval &&
                this.settings.forceSlideShowAutoplay
            ) {
                this.startAuto();
                this.pausedOnSlideChange = false;
            }
        });

        // set progress
        this.showProgressBar();
    }

    private showProgressBar() {
        if (this.settings.progressBar && this.fromAuto) {
            const _$progressBar = this.core.outer.find('.lg-progress-bar');
            const _$progress = this.core.outer.find('.lg-progress');
            if (this.interval) {
                _$progress.removeAttr('style');
                _$progressBar.removeClass('lg-start');
                setTimeout(() => {
                    _$progress.css(
                        'transition',
                        'width ' +
                            (this.core.settings.speed +
                                this.settings.slideShowInterval) +
                            'ms ease 0s',
                    );
                    _$progressBar.addClass('lg-start');
                }, 20);
            }
        }
    }

    // Manage autoplay via play/stop buttons
    private controls() {
        const _html =
            '<button aria-label="Toggle autoplay" type="button" class="lg-autoplay-button lg-icon"></button>';

        // Append autoplay controls
        this.core.outer
            .find(this.settings.appendAutoplayControlsTo)
            .append(_html);

        this.core.outer
            .find('.lg-autoplay-button')
            .first()
            .on('click.lg.autoplay', () => {
                if (this.core.outer.hasClass('lg-show-autoplay')) {
                    this.cancelAuto();
                } else {
                    if (!this.interval) {
                        this.startAuto();
                    }
                }
            });
    }

    // Autostart gallery
    public startAuto(): void {
        this.core.outer
            .find('.lg-progress')
            .css(
                'transition',
                'width ' +
                    (this.core.settings.speed +
                        this.settings.slideShowInterval) +
                    'ms ease 0s',
            );
        this.core.outer.addClass('lg-show-autoplay');
        this.core.outer.find('.lg-progress-bar').addClass('lg-start');

        this.interval = setInterval(() => {
            if (this.core.index + 1 < this.core.galleryItems.length) {
                this.core.index++;
            } else {
                this.core.index = 0;
            }

            this.fromAuto = true;
            this.core.slide(this.core.index, false, false, 'next');
        }, this.core.settings.speed + this.settings.slideShowInterval);
    }

    // cancel Autostart
    public cancelAuto(): void {
        if (this.interval) {
            this.core.outer.find('.lg-progress').removeAttr('style');
            this.core.outer.removeClass('lg-show-autoplay');
            this.core.outer.find('.lg-progress-bar').removeClass('lg-start');
        }
        clearInterval(this.interval);
        this.interval = false;
    }

    public closeGallery(): void {
        this.cancelAuto();
    }
    public destroy(): void {
        if (this.settings.autoplay) {
            this.core.outer.find('.lg-progress-bar').remove();
        }
        // Remove all event listeners added by autoplay plugin
        this.core.LGel.off('.lg.autoplay');
        this.core.LGel.off('.autoplay');
    }
}
