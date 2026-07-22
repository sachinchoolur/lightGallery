import {
    effect,
    inject,
    Injectable,
    untracked,
} from '@angular/core';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
} from '@lightgallery/angular';

/**
 * mediumZoom feature (2.x `lg-medium-zoom`): a medium.com-like minimal
 * gallery. In 2.x this plugin mutated `core.settings` and monkey-patched
 * `getMediaContainerPosition`; here it is `presets` + the ADR §5
 * `layout.overrideMediaPosition` — non-mutating by construction.
 */

export interface MediumZoomSettings {
    /** Enable/disable the medium-like zoom experience. */
    mediumZoom: boolean;
    /** Space between the gallery outer area and the image (px). */
    margin: number;
    /** Backdrop color; per-item override via `item.lgBackgroundColor`. */
    backgroundColor: string;
}

export const mediumZoomSettings: MediumZoomSettings = {
    mediumZoom: true,
    margin: 40,
    backgroundColor: '#000',
};

@Injectable()
export class LgMediumZoomService {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);

    constructor() {
        effect((onCleanup) => {
            const settings = this.ctx.settings() as unknown as
                MediumZoomSettings;
            if (!settings.mediumZoom) {
                return;
            }
            const margin = settings.margin;
            this.ctx.layout.setOuterClass('lg-medium-zoom', true);
            this.ctx.layout.overrideMediaPosition(() => ({
                top: margin,
                bottom: margin,
            }));
            onCleanup(() => {
                this.ctx.layout.setOuterClass('lg-medium-zoom', false);
                this.ctx.layout.overrideMediaPosition(null);
            });
        });

        // Backdrop color + click-anywhere-to-close, applied on afterOpen —
        // the overlay DOM exists by then (this service runs outside it).
        effect((onCleanup) => {
            const enabled = (
                this.ctx.settings() as unknown as MediumZoomSettings
            ).mediumZoom;
            if (!enabled) {
                return;
            }
            untracked(() => {
                let outerEl: HTMLElement | null = null;
                let backdropEl: HTMLElement | null = null;
                const close = (): void =>
                    this.ctx.actions.closeGallery();
                const apply = (): void => {
                    const state = untracked(this.ctx.state);
                    const cfg = untracked(
                        this.ctx.settings,
                    ) as unknown as MediumZoomSettings;
                    outerEl = this.ctx.refs.getOuter();
                    backdropEl =
                        outerEl?.parentElement?.querySelector<HTMLElement>(
                            '.lg-backdrop',
                        ) ?? null;
                    if (backdropEl) {
                        backdropEl.style.backgroundColor =
                            untracked(this.ctx.items)[state.currentIndex]
                                ?.lgBackgroundColor ??
                            cfg.backgroundColor;
                    }
                    outerEl?.addEventListener('click', close);
                };
                const cleanup = (): void => {
                    outerEl?.removeEventListener('click', close);
                    if (backdropEl) {
                        backdropEl.style.backgroundColor = '';
                    }
                    outerEl = null;
                    backdropEl = null;
                };
                const offOpen = this.ctx.events.on('afterOpen', apply);
                const offClose = this.ctx.events.on('afterClose', cleanup);
                if (untracked(this.ctx.state).open) {
                    apply();
                }
                onCleanup(() => {
                    offOpen();
                    offClose();
                    cleanup();
                });
            });
        });
    }
}

export function withMediumZoom(
    options: Partial<MediumZoomSettings> = {},
): LgFeature<MediumZoomSettings> {
    return {
        name: 'mediumZoom',
        defaults: mediumZoomSettings,
        options,
        // 2.x reassigned core.settings with these; presets apply at merge
        // time instead, and user settings still win.
        presets: {
            controls: false,
            download: false,
            counter: false,
            showCloseIcon: false,
            closeOnTap: false,
            enableSwipe: false,
            enableDrag: false,
            swipeToClose: false,
        },
        providers: [
            LgMediumZoomService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgMediumZoomService,
                multi: true,
            },
        ],
    };
}
