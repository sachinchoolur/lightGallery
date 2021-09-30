import { lGEvents } from '../../lg-events';
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { rotateSettings, RotateSettings } from './lg-rotate-settings';

export default class Rotate {
    core: LightGallery;
    settings: RotateSettings;
    rotateValuesList!: {
        [key: string]: any;
    };
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;

        // extend module default settings with lightGallery core settings
        this.settings = { ...rotateSettings, ...this.core.settings };

        return this;
    }
    buildTemplates(): void {
        let rotateIcons = '';
        if (this.settings.flipVertical) {
            rotateIcons += `<button type="button" id="lg-flip-ver" aria-label="${this.settings.rotatePluginStrings['flipVertical']}" class="lg-flip-ver lg-icon"></button>`;
        }
        if (this.settings.flipHorizontal) {
            rotateIcons += `<button type="button" id="lg-flip-hor" aria-label="${this.settings.rotatePluginStrings['flipHorizontal']}" class="lg-flip-hor lg-icon"></button>`;
        }
        if (this.settings.rotateLeft) {
            rotateIcons += `<button type="button" id="lg-rotate-left" aria-label="${this.settings.rotatePluginStrings['rotateLeft']}" class="lg-rotate-left lg-icon"></button>`;
        }
        if (this.settings.rotateRight) {
            rotateIcons += `<button type="button" id="lg-rotate-right" aria-label="${this.settings.rotatePluginStrings['rotateRight']}" class="lg-rotate-right lg-icon"></button>`;
        }
        this.core.$toolbar.append(rotateIcons);
    }

    init(): void {
        if (!this.settings.rotate) {
            return;
        }
        this.buildTemplates();

        // Save rotate config for each item to persist its rotate, flip values
        // even after navigating to diferent slides
        this.rotateValuesList = {};

        // event triggered after appending slide content
        this.core.LGel.on(`${lGEvents.afterAppendSlide}.rotate`, (event) => {
            const { index } = event.detail;
            const imageWrap = this.core
                .getSlideItem(index)
                .find('.lg-img-wrap')
                .first();

            imageWrap.wrap('lg-img-rotate');
            this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .css('transition-duration', this.settings.rotateSpeed + 'ms');
        });

        this.core.outer
            .find('#lg-rotate-left')
            .first()
            .on('click.lg', this.rotateLeft.bind(this));

        this.core.outer
            .find('#lg-rotate-right')
            .first()
            .on('click.lg', this.rotateRight.bind(this));

        this.core.outer
            .find('#lg-flip-hor')
            .first()
            .on('click.lg', this.flipHorizontal.bind(this));

        this.core.outer
            .find('#lg-flip-ver')
            .first()
            .on('click.lg', this.flipVertical.bind(this));

        // Reset rotate on slide change
        this.core.LGel.on(`${lGEvents.beforeSlide}.rotate`, (event) => {
            if (!this.rotateValuesList[event.detail.index]) {
                this.rotateValuesList[event.detail.index] = {
                    rotate: 0,
                    flipHorizontal: 1,
                    flipVertical: 1,
                };
            }
        });
    }

    applyStyles(): void {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-rotate')
            .first();

        $image.css(
            'transform',
            'rotate(' +
                this.rotateValuesList[this.core.index].rotate +
                'deg)' +
                ' scale3d(' +
                this.rotateValuesList[this.core.index].flipHorizontal +
                ', ' +
                this.rotateValuesList[this.core.index].flipVertical +
                ', 1)',
        );
    }

    rotateLeft(): void {
        this.rotateValuesList[this.core.index].rotate -= 90;
        this.applyStyles();
        this.triggerEvents(lGEvents.rotateLeft, {
            rotate: this.rotateValuesList[this.core.index].rotate,
        });
    }

    rotateRight(): void {
        this.rotateValuesList[this.core.index].rotate += 90;
        this.applyStyles();
        this.triggerEvents(lGEvents.rotateRight, {
            rotate: this.rotateValuesList[this.core.index].rotate,
        });
    }

    getCurrentRotation(el: HTMLElement): number {
        if (!el) {
            return 0;
        }
        const st = this.$LG(el).style();
        const tm =
            st.getPropertyValue('-webkit-transform') ||
            st.getPropertyValue('-moz-transform') ||
            st.getPropertyValue('-ms-transform') ||
            st.getPropertyValue('-o-transform') ||
            st.getPropertyValue('transform') ||
            'none';
        if (tm !== 'none') {
            const values = tm.split('(')[1].split(')')[0].split(',') as any;
            if (values) {
                const angle = Math.round(
                    Math.atan2(values[1], values[0]) * (180 / Math.PI),
                );
                return angle < 0 ? angle + 360 : angle;
            }
        }
        return 0;
    }

    flipHorizontal(): void {
        const rotateEl = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-rotate')
            .first()
            .get();
        const currentRotation = this.getCurrentRotation(rotateEl);
        let rotateAxis = 'flipHorizontal';
        if (currentRotation === 90 || currentRotation === 270) {
            rotateAxis = 'flipVertical';
        }
        this.rotateValuesList[this.core.index][rotateAxis] *= -1;
        this.applyStyles();
        this.triggerEvents(lGEvents.flipHorizontal, {
            flipHorizontal: this.rotateValuesList[this.core.index][rotateAxis],
        });
    }

    flipVertical(): void {
        const rotateEl = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-rotate')
            .first()
            .get();
        const currentRotation = this.getCurrentRotation(rotateEl);
        let rotateAxis = 'flipVertical';
        if (currentRotation === 90 || currentRotation === 270) {
            rotateAxis = 'flipHorizontal';
        }
        this.rotateValuesList[this.core.index][rotateAxis] *= -1;

        this.applyStyles();

        this.triggerEvents(lGEvents.flipVertical, {
            flipVertical: this.rotateValuesList[this.core.index][rotateAxis],
        });
    }

    triggerEvents(event: string, detail: any): void {
        setTimeout(() => {
            this.core.LGel.trigger(event, detail);
        }, this.settings.rotateSpeed + 10);
    }

    isImageOrientationChanged(): boolean {
        const rotateValue = this.rotateValuesList[this.core.index];
        const isRotated = Math.abs(rotateValue.rotate) % 360 !== 0;
        const ifFlippedHor = rotateValue.flipHorizontal < 0;
        const ifFlippedVer = rotateValue.flipVertical < 0;
        return isRotated || ifFlippedHor || ifFlippedVer;
    }

    closeGallery(): void {
        if (this.isImageOrientationChanged()) {
            this.core.getSlideItem(this.core.index).css('opacity', 0);
        }
        this.rotateValuesList = {};
    }

    destroy(): void {
        // Unbind all events added by lightGallery rotate plugin
        this.core.LGel.off('.lg.rotate');
        this.core.LGel.off('.rotate');
    }
}
