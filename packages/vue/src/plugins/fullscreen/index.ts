import { computed, defineComponent, h, inject, watch } from 'vue';

import {
    LG_PLUGIN_CONTEXT,
    type LgPluginContext,
    type LgVuePlugin,
} from '../types';

/**
 * Fullscreen plugin (2.x `lg-fullscreen`): toolbar button toggling browser
 * fullscreen. Feature-detects the Fullscreen API (standard + webkit) and
 * renders nothing on unsupported browsers.
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

export const FullscreenButton = defineComponent({
    name: 'LgFullscreenButton',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const toggle = (): void => {
            if (fullscreenElement()) {
                exitFullscreen();
            } else {
                const el = document.documentElement as FullscreenElement;
                void (
                    el.requestFullscreen ?? el.webkitRequestFullscreen
                )?.call(el);
            }
        };
        return () => {
            const cfg = ctx.settings
                .value as unknown as FullscreenSettings;
            if (!cfg.fullScreen || !fullscreenSupported()) {
                return null;
            }
            return h('button', {
                type: 'button',
                class: 'lg-fullscreen lg-icon',
                'aria-label':
                    cfg.fullscreenPluginStrings.toggleFullscreen,
                onClick: toggle,
            });
        };
    },
});

function setupFullscreen(ctx: LgPluginContext): void {
    // `lg-fullscreen-on` tracks the browser fullscreen state while open.
    // Narrow boolean sources — a per-state re-run would drop the class.
    watch(
        [
            computed(
                () =>
                    (ctx.settings.value as unknown as FullscreenSettings)
                        .fullScreen && fullscreenSupported(),
            ),
            computed(() => ctx.store.isOpen.value),
        ],
        ([enabled, open], _prev, onCleanup) => {
            if (!enabled || !open) {
                return;
            }
            const onChange = (): void => {
                ctx.layout.setOuterClass(
                    'lg-fullscreen-on',
                    !!fullscreenElement(),
                );
            };
            document.addEventListener('fullscreenchange', onChange);
            document.addEventListener('webkitfullscreenchange', onChange);
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
        },
        { immediate: true },
    );
}

const Fullscreen: LgVuePlugin<FullscreenSettings> = {
    name: 'fullscreen',
    defaults: fullscreenSettings,
    slots: {
        toolbar: FullscreenButton,
    },
    setup: setupFullscreen,
};

export default Fullscreen;
