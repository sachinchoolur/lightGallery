import { useEffect, type ReactElement } from 'react';

import { usePluginSettings } from '../runtime';
import type { LgPlugin, PluginContext } from '../types';

/**
 * Fullscreen plugin (2.x `lg-fullscreen`): toolbar button toggling browser
 * fullscreen. Feature-detects the Fullscreen API (standard + webkit) and
 * renders nothing on unsupported browsers (older iOS Safari) per the plan's
 * ES2017+Safari baseline.
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

function FullscreenButton(): ReactElement | null {
    const settings = usePluginSettings<FullscreenSettings>();
    if (!settings.fullScreen || !fullscreenSupported()) {
        return null;
    }
    const toggle = () => {
        const doc = document as FullscreenDocument;
        if (fullscreenElement()) {
            void (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc);
        } else {
            const el = document.documentElement as FullscreenElement;
            void (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(
                el,
            );
        }
    };
    return (
        <button
            type="button"
            aria-label={settings.fullscreenPluginStrings.toggleFullscreen}
            className="lg-fullscreen lg-icon"
            onClick={toggle}
        />
    );
}

function useFullscreenPlugin(ctx: PluginContext): void {
    const enabled =
        (ctx.settings as unknown as FullscreenSettings).fullScreen &&
        fullscreenSupported();
    const open = ctx.state.open;
    const { layout } = ctx;

    // lg-fullscreen-on tracks the browser fullscreen state while open.
    useEffect(() => {
        if (!enabled || !open) {
            return;
        }
        const onChange = () => {
            layout.setOuterClass('lg-fullscreen-on', !!fullscreenElement());
        };
        document.addEventListener('fullscreenchange', onChange);
        document.addEventListener('webkitfullscreenchange', onChange);
        return () => {
            document.removeEventListener('fullscreenchange', onChange);
            document.removeEventListener('webkitfullscreenchange', onChange);
            layout.setOuterClass('lg-fullscreen-on', false);
            // Leave fullscreen when the gallery closes (2.x closeGallery).
            if (fullscreenElement()) {
                const doc = document as FullscreenDocument;
                void (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(
                    doc,
                );
            }
        };
    }, [enabled, open, layout]);
}

const Fullscreen: LgPlugin<FullscreenSettings> = {
    name: 'fullscreen',
    defaults: fullscreenSettings,
    slots: {
        toolbar: FullscreenButton,
    },
    usePlugin: useFullscreenPlugin,
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        fullscreen: Partial<FullscreenSettings>;
    }
}

export default Fullscreen;
