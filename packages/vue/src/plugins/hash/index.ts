import { computed, watch } from 'vue';
import {
    clampIndex,
    createHashDriver,
    type HashDriverPreference,
    type HashNavigationWindow,
} from '@lightgallery/headless';

import type { LgPluginContext, LgVuePlugin } from '../types';
import type { LgGalleryItem } from '../../types';

/**
 * Hash plugin (2.x `lg-hash`): syncs the gallery to the URL hash
 * (`#lg=<galleryId>&slide=<index|slideName>`), opens from a deep link, and
 * follows back/forward navigation. `setup(ctx)` runs while the gallery is
 * closed — no extra eager mechanism needed in Vue. Uses `history`
 * directly, mirroring the sibling ports.
 *
 * Deviation fixed on purpose (shared): out-of-range `slide=` values are
 * clamped via headless `clampIndex` (2.x passed them through).
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
    /** Unique id per gallery — mandatory with multiple galleries. */
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
    items: readonly LgGalleryItem[],
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
    return clampIndex(Number.isNaN(index) ? 0 : index, items.length, false);
}

function setupHash(ctx: LgPluginContext): void {
    let oldHash = '';
    const cfg = (): HashSettings =>
        ctx.settings.value as unknown as HashSettings;

    watch(
        [
            computed(() => cfg().hash && typeof window !== 'undefined'),
            computed(() => cfg().galleryId),
            computed(() => cfg().customSlideName),
            computed(() => cfg().hashDriver),
        ],
        (
            [enabled, galleryId, customSlideName, hashDriver],
            _prev,
            onCleanup,
        ) => {
            if (!enabled) {
                return;
            }
            const marker = `lg=${galleryId}`;
            // URL engine (plan 012): History API today, Navigation API
            // where the browser has it — same URLs either way.
            const driver = createHashDriver(
                window as unknown as HashNavigationWindow,
                hashDriver as HashDriverPreference,
            );
            oldHash = driver.getHash();

            // Deep link: open when the URL carries this gallery id.
            const openTimer = setTimeout(() => {
                const hash = driver.getHash();
                if (hash.indexOf(marker) > 0 && !ctx.store.isOpen.value) {
                    document.body.classList.add('lg-from-hash');
                    ctx.actions.openGallery(
                        getIndexFromHash(
                            hash,
                            ctx.items.value,
                            customSlideName as boolean,
                        ),
                    );
                }
            }, 100);

            const writeHash = (index: number): void => {
                const item = ctx.items.value[index];
                const slideName =
                    customSlideName && item?.slideName
                        ? item.slideName
                        : `${index}`;
                driver.replaceHash(`#${marker}&slide=${slideName}`);
            };
            const offAfterSlide = ctx.events.on('afterSlide', (detail) =>
                writeHash(detail.index),
            );
            // 2.x writes the hash for the first slide too; mirror on
            // afterOpen.
            const offAfterOpen = ctx.events.on('afterOpen', () =>
                writeHash(ctx.store.currentIndex.value),
            );
            const offAfterClose = ctx.events.on('afterClose', () => {
                document.body.classList.remove('lg-from-hash');
                if (oldHash && oldHash.indexOf(marker) < 0) {
                    driver.replaceHash(oldHash);
                } else {
                    driver.clearHash();
                }
            });

            // Back/forward: follow the hash while open.
            const onHashChange = (): void => {
                if (!ctx.store.isOpen.value) {
                    return;
                }
                const hash = driver.getHash();
                if (hash.indexOf(marker) > -1) {
                    ctx.actions.goToSlide(
                        getIndexFromHash(
                            hash,
                            ctx.items.value,
                            customSlideName as boolean,
                        ),
                    );
                } else {
                    ctx.actions.closeGallery();
                }
            };
            const unsubscribe = driver.subscribe(onHashChange);

            onCleanup(() => {
                clearTimeout(openTimer);
                offAfterSlide();
                offAfterOpen();
                offAfterClose();
                unsubscribe();
                document.body.classList.remove('lg-from-hash');
            });
        },
        { immediate: true },
    );
}

const Hash: LgVuePlugin<HashSettings> = {
    name: 'hash',
    defaults: hashSettings,
    setup: setupHash,
};

export default Hash;
