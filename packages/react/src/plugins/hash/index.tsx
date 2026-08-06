import { useEffect, useRef } from 'react';
import {
    clampIndex,
    createHashDriver,
    type HashDriverPreference,
    type HashNavigationWindow,
} from '@lightgallery/headless';

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
    /**
     * URL engine: 'auto' uses the Navigation API where supported and
     * falls back to the History API; 'history'/'navigation' force an
     * engine (unsupported 'navigation' quietly falls back). The
     * deep-link URL format is identical either way.
     */
    hashDriver: HashDriverPreference;
    /** Unique id per gallery — mandatory with multiple galleries per page. */
    galleryId: string;
    /** Use `item.slideName` instead of the index in the URL. */
    customSlideName: boolean;
}

export const hashSettings: HashSettings = {
    hash: true,
    hashDriver: 'auto',
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
    const { galleryId, customSlideName, hashDriver } = settings;
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
        // URL engine (plan 012): History API today, Navigation API where
        // the browser has it — same URLs either way.
        const driver = createHashDriver(
            window as unknown as HashNavigationWindow,
            hashDriver,
        );
        oldHashRef.current = driver.getHash();

        // Deep link: open the gallery when the URL carries this gallery id.
        const openTimer = window.setTimeout(() => {
            const hash = driver.getHash();
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
            driver.replaceHash(`#${marker}&slide=${slideName}`);
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
                driver.replaceHash(oldHash);
            } else {
                driver.clearHash();
            }
        });

        // Back/forward: follow the hash while open.
        const onHashChange = () => {
            if (!openRef.current) {
                return;
            }
            const hash = driver.getHash();
            if (hash.indexOf(marker) > -1) {
                actionsRef.current.goToSlide(
                    getIndexFromHash(hash, itemsRef.current, customSlideName),
                );
            } else {
                actionsRef.current.closeGallery();
            }
        };
        const unsubscribe = driver.subscribe(onHashChange);

        return () => {
            window.clearTimeout(openTimer);
            offAfterSlide();
            offAfterOpen();
            offAfterClose();
            unsubscribe();
            document.body.classList.remove('lg-from-hash');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, galleryId, customSlideName, hashDriver]);
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
