import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';

declare let document: any;

const defaults = {
    fullScreen: true,
};

declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}

const LG = window.LG;

export class FullScreen {
    core: LightGallery;
    s: { fullScreen: boolean };
    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, defaults);

        this.init();

        return this;
    }

    init(): void {
        let fullScreen = '';
        if (this.s.fullScreen) {
            // check for fullscreen browser support
            if (
                !document.fullscreenEnabled &&
                !document.webkitFullscreenEnabled &&
                !document.mozFullScreenEnabled &&
                !document.msFullscreenEnabled
            ) {
                return;
            } else {
                fullScreen =
                    '<button type="button aria-label="Toggle fullscreen" class="lg-fullscreen lg-icon"></button>';
                this.core.outer.find('.lg-toolbar').append(fullScreen);
                this.fullScreen();
            }
        }
    }

    isFullScreen(): boolean {
        return (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
        );
    }

    requestFullscreen(): void {
        const el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
    }

    exitFullscreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
    fullScreen(): void {
        LG(document).on(
            'fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg',
            () => {
                if (!this.core.lgOpened) return;
                this.core.outer.toggleClass('lg-fullscreen-on');
            },
        );

        this.core.outer
            .find('.lg-fullscreen')
            .first()
            .on('click.lg', () => {
                if (this.isFullScreen()) {
                    this.exitFullscreen();
                } else {
                    this.requestFullscreen();
                }
            });
    }

    destroy(clear?: boolean): void {
        // exit from fullscreen if activated
        if (this.isFullScreen()) {
            this.exitFullscreen();
        }
        if (clear) {
            LG(document).off(
                'fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg',
            );
        }
    }
}

window.lgModules = window.lgModules || {};
window.lgModules.fullscreen = FullScreen;
