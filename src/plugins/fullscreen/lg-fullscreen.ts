import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import {
    FullscreenSettings,
    fullscreenSettings,
} from './lg-fullscreen-settings';

declare let document: any;

export default class FullScreen {
    core: LightGallery;
    settings: FullscreenSettings;
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;

        // extend module default settings with lightGallery core settings
        this.settings = { ...fullscreenSettings, ...this.core.settings };

        return this;
    }

    public init(): void {
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
                fullScreen = `<button type="button" aria-label="${this.settings.fullscreenPluginStrings['toggleFullscreen']}" class="lg-fullscreen lg-icon"></button>`;
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
        this.$LG(document).on(
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
        this.$LG(document).off(
            `fullscreenchange.lg.global${this.core.lgId} 
            webkitfullscreenchange.lg.global${this.core.lgId} 
            mozfullscreenchange.lg.global${this.core.lgId} 
            MSFullscreenChange.lg.global${this.core.lgId}`,
        );
    }
}
