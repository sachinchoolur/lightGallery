import {
    ChangeDetectionStrategy,
    Component,
    computed,
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
 * Fullscreen feature (2.x `lg-fullscreen`): toolbar button toggling browser
 * fullscreen. Feature-detects the Fullscreen API (standard + webkit) and
 * renders nothing on unsupported browsers (older iOS Safari) — the plan's
 * no-op rule for unsupported platforms.
 */

export interface FullscreenSettings {
    /** Enable the fullscreen button. */
    fullScreen: boolean;
    fullscreenPluginStrings: {
        toggleFullscreen: string;
    };
}

export const fullscreenSettings: FullscreenSettings = {
    fullScreen: true,
    fullscreenPluginStrings: {
        toggleFullscreen: 'Toggle Fullscreen',
    },
};

interface FullscreenDocument extends Document {
    webkitFullscreenEnabled?: boolean;
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => void;
}

interface FullscreenElement extends HTMLElement {
    webkitRequestFullscreen?: () => void;
}

function fullscreenSupported(): boolean {
    if (typeof document === 'undefined') {
        return false;
    }
    const doc = document as FullscreenDocument;
    return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

function fullscreenElement(): Element | null {
    const doc = document as FullscreenDocument;
    return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function exitFullscreen(): void {
    const doc = document as FullscreenDocument;
    void (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc);
}

@Component({
    selector: 'lg-fullscreen-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (visible()) {
            <button
                type="button"
                class="lg-fullscreen lg-icon"
                [attr.aria-label]="
                    settings().fullscreenPluginStrings.toggleFullscreen
                "
                (click)="toggle()"
            ></button>
        }
    `,
})
export class LgFullscreenButtonComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as FullscreenSettings,
    );
    protected readonly visible = computed(
        () => this.settings().fullScreen && fullscreenSupported(),
    );

    protected toggle(): void {
        if (fullscreenElement()) {
            exitFullscreen();
        } else {
            const el = document.documentElement as FullscreenElement;
            void (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(
                el,
            );
        }
    }
}

/** `lg-fullscreen-on` tracking while open (React `usePlugin` twin). */
@Injectable()
export class LgFullscreenService {
    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        // Narrow computeds so the effect re-runs only on boolean flips —
        // a per-state re-run would drop lg-fullscreen-on mid-session.
        const enabledSignal = computed(
            () =>
                (ctx.settings() as unknown as FullscreenSettings)
                    .fullScreen && fullscreenSupported(),
        );
        const openSignal = computed(() => ctx.state().open);
        effect((onCleanup) => {
            const enabled = enabledSignal();
            const open = openSignal();
            if (!enabled || !open) {
                return;
            }
            untracked(() => {
                const onChange = (): void => {
                    ctx.layout.setOuterClass(
                        'lg-fullscreen-on',
                        !!fullscreenElement(),
                    );
                };
                document.addEventListener('fullscreenchange', onChange);
                document.addEventListener(
                    'webkitfullscreenchange',
                    onChange,
                );
                onCleanup(() => {
                    document.removeEventListener(
                        'fullscreenchange',
                        onChange,
                    );
                    document.removeEventListener(
                        'webkitfullscreenchange',
                        onChange,
                    );
                    ctx.layout.setOuterClass('lg-fullscreen-on', false);
                    // Leave fullscreen when the gallery closes (2.x).
                    if (fullscreenElement()) {
                        exitFullscreen();
                    }
                });
            });
        });
    }
}

export function withFullscreen(
    options: Partial<FullscreenSettings> = {},
): LgFeature<FullscreenSettings> {
    return {
        name: 'fullscreen',
        defaults: fullscreenSettings,
        options,
        slots: {
            toolbar: LgFullscreenButtonComponent,
        },
        providers: [
            LgFullscreenService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgFullscreenService,
                multi: true,
            },
        ],
    };
}
