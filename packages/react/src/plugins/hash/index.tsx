import { useEffect, useRef } from 'react';
import { clampIndex } from '@lightgallery/headless';

import type { GalleryItem } from '../../types';
import type { LgPlugin, PluginContext } from '../types';

/**
 * Hash plugin (2.x `lg-hash`): syncs the gallery to the URL hash
 * (`#lg=<galleryId>&slide=<index|slideName>`), opens from a deep link, and
 * follows back/forward navigation. Runs while the gallery is closed (the
 * runtime mounts plugin hooks outside the portal for exactly this).
 *
 * Deviation fixed on purpose (noted in the plan): out-of-range `slide=`
 * values are clamped instead of trusted (2.x passed them through).
 */

export interface HashSettings {
    /** Enable/disable URL hash syncing. */
    hash: boolean;
    /** Unique id per gallery — mandatory with multiple galleries per page. */
    galleryId: string;
    /** Use `item.slideName` instead of the index in the URL. */
    customSlideName: boolean;
}

export const hashSettings: HashSettings = {
    hash: true,
    galleryId: '1',
    customSlideName: false,
};

function getIndexFromHash(
    hash: string,
    items: GalleryItem[],
    customSlideName: boolean,
): number {
    const slideName = hash.split('&slide=')[1] ?? '';
    if (customSlideName) {
        const named = items.findIndex((item) => item.slideName === slideName);
        if (named !== -1) {
            return named;
        }
    }
    const index = parseInt(slideName, 10);
    // Clamp out-of-range indexes (known 2.x bug, fixed here).
    return clampIndex(Number.isNaN(index) ? 0 : index, items.length, false);
}

function useHashPlugin(ctx: PluginContext): void {
    const settings = ctx.settings as unknown as HashSettings;
    const enabled = settings.hash && typeof window !== 'undefined';
    const { galleryId, customSlideName } = settings;
    const { events, actions } = ctx;
    const itemsRef = useRef(ctx.items);
    itemsRef.current = ctx.items;
    const actionsRef = useRef(actions);
    actionsRef.current = actions;
    const openRef = useRef(ctx.state.open);
    openRef.current = ctx.state.open;
    const currentIndexRef = useRef(ctx.state.currentIndex);
    currentIndexRef.current = ctx.state.currentIndex;
    const oldHashRef = useRef<string>('');

    useEffect(() => {
        if (!enabled) {
            return;
        }
        const marker = `lg=${galleryId}`;
        oldHashRef.current = window.location.hash;

        // Deep link: open the gallery when the URL carries this gallery id.
        const openTimer = window.setTimeout(() => {
            const hash = window.location.hash;
            if (hash.indexOf(marker) > 0 && !openRef.current) {
                document.body.classList.add('lg-from-hash');
                actionsRef.current.openGallery(
                    getIndexFromHash(hash, itemsRef.current, customSlideName),
                );
            }
        }, 100);

        const writeHash = (index: number) => {
            const item = itemsRef.current[index];
            const slideName =
                customSlideName && item?.slideName
                    ? item.slideName
                    : `${index}`;
            history.replaceState(
                null,
                '',
                `${window.location.pathname}${window.location.search}#${marker}&slide=${slideName}`,
            );
        };
        const offAfterSlide = events.on(
            'afterSlide',
            (detail: { index: number }) => writeHash(detail.index),
        );
        // 2.x writes the hash for the first slide too (its open path fires
        // afterSlide); mirror that on afterOpen.
        const offAfterOpen = events.on('afterOpen', () =>
            writeHash(currentIndexRef.current),
        );

        const offAfterClose = events.on('afterClose', () => {
            document.body.classList.remove('lg-from-hash');
            const oldHash = oldHashRef.current;
            if (oldHash && oldHash.indexOf(marker) < 0) {
                history.replaceState(null, '', oldHash);
            } else {
                history.replaceState(
                    null,
                    '',
                    window.location.pathname + window.location.search,
                );
            }
        });

        // Back/forward: follow the hash while open.
        const onHashChange = () => {
            if (!openRef.current) {
                return;
            }
            const hash = window.location.hash;
            if (hash.indexOf(marker) > -1) {
                actionsRef.current.goToSlide(
                    getIndexFromHash(hash, itemsRef.current, customSlideName),
                );
            } else {
                actionsRef.current.closeGallery();
            }
        };
        window.addEventListener('hashchange', onHashChange);

        return () => {
            window.clearTimeout(openTimer);
            offAfterSlide();
            offAfterOpen();
            offAfterClose();
            window.removeEventListener('hashchange', onHashChange);
            document.body.classList.remove('lg-from-hash');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, galleryId, customSlideName]);
}

const Hash: LgPlugin<HashSettings> = {
    name: 'hash',
    defaults: hashSettings,
    usePlugin: useHashPlugin,
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        hash: Partial<HashSettings>;
    }
}

export default Hash;
