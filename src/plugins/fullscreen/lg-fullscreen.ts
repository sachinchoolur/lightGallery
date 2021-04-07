import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import {
    FullscreenSettings,
    fullscreenSettings,
} from './lg-fullscreen-settings';

declare let document: any;

declare global {
    interface Window {
        $LG: (selector: any) => lgQuery;
    }
}

const $LG = window.$LG;

export class FullScreen {
    core: LightGallery;
    settings: FullscreenSettings;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.settings = { ...fullscreenSettings, ...this.core.settings };

        this.init();

        return this;
    }

    private init(): void {
        let fullScreen = '';
        if (this.settings.fullScreen) {
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
                this.core.$toolbar.append(fullScreen);
                this.fullScreen();
            }
        }
    }

    private isFullScreen(): boolean {
        return (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
        );
    }

    private requestFullscreen(): void {
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

    private exitFullscreen(): void {
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
    private fullScreen(): void {
        $LG(document).on(
            `fullscreenchange.lg.global${this.core.lgId} 
            webkitfullscreenchange.lg.global${this.core.lgId} 
            mozfullscreenchange.lg.global${this.core.lgId} 
            MSFullscreenChange.lg.global${this.core.lgId}`,
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

    closeGallery(): void {
        // exit from fullscreen if activated
        if (this.isFullScreen()) {
            this.exitFullscreen();
        }
    }

    destroy(): void {
        $LG(document).off(
            `fullscreenchange.lg.global${this.core.lgId} 
            webkitfullscreenchange.lg.global${this.core.lgId} 
            mozfullscreenchange.lg.global${this.core.lgId} 
            MSFullscreenChange.lg.global${this.core.lgId}`,
        );
    }
}

window.lgModules = window.lgModules || {};
window.lgModules.fullscreen = FullScreen;
