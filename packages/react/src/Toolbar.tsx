import { coreDefaultIcons } from '@lightgallery/headless';
import type { ReactElement, RefObject } from 'react';

import { Counter } from './Counter';
import {
    useGalleryActions,
    useGalleryInternal,
    useGallerySettings,
    useGalleryState,
} from './context';
import { cx } from './cx';
import { useCustomIcons } from './icons';
import { PluginSlots } from './plugins/runtime';
import { ToolbarOverflow } from './ToolbarOverflow';

export interface ToolbarProps {
    toolbarRef: RefObject<HTMLDivElement>;
    onToggleMaximize: () => void;
}

/** `.lg-toolbar`: maximize/close buttons, download link, counter. */
export function Toolbar({
    toolbarRef,
    onToggleMaximize,
}: ToolbarProps): ReactElement {
    const state = useGalleryState();
    const settings = useGallerySettings();
    const actions = useGalleryActions();
    const internal = useGalleryInternal();

    const item = internal.items[state.currentIndex];
    const showDownload =
        settings.download && !!item && item.downloadUrl !== false;
    const maximizeIcon = useCustomIcons(['maximize', 'minimize'], coreDefaultIcons);
    const closeIcon = useCustomIcons(['close'], coreDefaultIcons);
    const downloadIcon = useCustomIcons(['download'], coreDefaultIcons);

    return (
        <div ref={toolbarRef} className="lg-toolbar lg-group">
            {settings.showMaximizeIcon && (
                <button
                    type="button"
                    aria-label={settings.strings.toggleMaximize}
                    className={cx(
                        'lg-maximize lg-icon',
                        maximizeIcon.className,
                    )}
                    onClick={onToggleMaximize}
                >
                    {maximizeIcon.content}
                </button>
            )}
            {settings.closable && settings.showCloseIcon && (
                <button
                    type="button"
                    aria-label={settings.strings.closeGallery}
                    className={cx('lg-close lg-icon', closeIcon.className)}
                    onClick={actions.closeGallery}
                >
                    {closeIcon.content}
                </button>
            )}
            {settings.toolbarOverflow && <ToolbarOverflow />}
            {showDownload && (
                <a
                    target="_blank"
                    rel="noopener"
                    aria-label={settings.strings.download}
                    className={cx(
                        'lg-download lg-icon',
                        downloadIcon.className,
                    )}
                    href={
                        typeof item.downloadUrl === 'string'
                            ? item.downloadUrl
                            : item.src
                    }
                    download={
                        typeof item.download === 'string'
                            ? item.download
                            : true
                    }
                >
                    {downloadIcon.content}
                </a>
            )}
            <PluginSlots kind="toolbar" />
            <Counter />
        </div>
    );
}
