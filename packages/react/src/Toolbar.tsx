import type { ReactElement, RefObject } from 'react';

import { Counter } from './Counter';
import {
    useGalleryActions,
    useGalleryInternal,
    useGallerySettings,
    useGalleryState,
} from './context';

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

    return (
        <div ref={toolbarRef} className="lg-toolbar lg-group">
            {settings.showMaximizeIcon && (
                <button
                    type="button"
                    aria-label={settings.strings.toggleMaximize}
                    className="lg-maximize lg-icon"
                    onClick={onToggleMaximize}
                />
            )}
            {settings.closable && settings.showCloseIcon && (
                <button
                    type="button"
                    aria-label={settings.strings.closeGallery}
                    className="lg-close lg-icon"
                    onClick={actions.closeGallery}
                />
            )}
            {showDownload && (
                <a
                    target="_blank"
                    rel="noopener"
                    aria-label={settings.strings.download}
                    className="lg-download lg-icon"
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
                />
            )}
            <Counter />
        </div>
    );
}
