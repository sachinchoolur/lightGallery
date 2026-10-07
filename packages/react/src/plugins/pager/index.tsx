import { useRef, useState, type ReactElement } from 'react';

import { cx } from '../../cx';
import {
    useGalleryActions,
    useGalleryInternal,
    useGalleryState,
} from '../../context';
import { usePluginSettings } from '../runtime';
import type { LgPlugin } from '../types';

/** Pager plugin (2.x `lg-pager`): dot navigation with thumb popovers. */

export interface PagerSettings {
    /** Enable the pager. */
    pager: boolean;
}

export const pagerSettings: PagerSettings = {
    pager: true,
};

function PagerList(): ReactElement | null {
    const state = useGalleryState();
    const actions = useGalleryActions();
    const internal = useGalleryInternal();
    const settings = usePluginSettings<PagerSettings>();
    const [hover, setHover] = useState(false);
    const hoverTimerRef = useRef<number | undefined>(undefined);

    if (!settings.pager) {
        return null;
    }

    return (
        <div
            className={cx('lg-pager-outer', hover && 'lg-pager-hover')}
            onMouseOver={() => {
                window.clearTimeout(hoverTimerRef.current);
                setHover(true);
            }}
            onMouseOut={() => {
                hoverTimerRef.current = window.setTimeout(
                    () => setHover(false),
                    0,
                );
            }}
        >
            {internal.items.map((item, index) => (
                <span
                    key={index}
                    data-lg-item-id={index}
                    className={cx(
                        'lg-pager-cont',
                        index === state.currentIndex && 'lg-pager-active',
                    )}
                    onClick={() => actions.goToSlide(index)}
                >
                    <span className="lg-pager" />
                    <div className="lg-pager-thumb-cont">
                        <span className="lg-caret" />
                        <img src={item.thumb} alt={item.alt ?? ''} />
                    </div>
                </span>
            ))}
        </div>
    );
}

const Pager: LgPlugin<PagerSettings> = {
    name: 'pager',
    defaults: pagerSettings,
    slots: {
        components: PagerList,
    },
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        pager: Partial<PagerSettings>;
    }
}

export default Pager;
