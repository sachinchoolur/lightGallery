import { computed, effect, inject, Injectable, untracked } from '@angular/core';
import {
    clampIndex,
    createHashDriver,
    type HashDriver,
    type HashDriverPreference,
    type HashNavigationWindow,
} from '@lightgallery/headless';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';

/**
 * Hash feature (2.x `lg-hash`): syncs the gallery to the URL hash
 * (`#lg=<galleryId>&slide=<index|slideName>`), opens from a deep link, and
 * follows back/forward navigation. Runs while the gallery is closed — the
 * `LG_FEATURE_INIT` eager service is exactly the runtime seam the ADR made
 * for it. Uses `history` directly, mirroring the React port (documented; an
 * Angular `Location` variant would route through the same URLs).
 *
 * Deviation fixed on purpose (shared with React): out-of-range `slide=`
 * values are clamped via headless `clampIndex` (2.x passed them through).
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
    // Clamp out-of-range indexes (known 2.x bug, fixed here).
    return clampIndex(Number.isNaN(index) ? 0 : index, items.length, false);
}

@Injectable()
export class LgHashService {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    private oldHash = '';

    constructor() {
        // Narrow computeds: a re-run mid-session would re-capture the
        // gallery's own hash as `oldHash` and tear down the listeners.
        const enabled = computed(
            () =>
                (this.ctx.settings() as unknown as HashSettings).hash &&
                typeof window !== 'undefined',
        );
        const galleryId = computed(
            () => (this.ctx.settings() as unknown as HashSettings).galleryId,
        );
        const customSlideName = computed(
            () =>
                (this.ctx.settings() as unknown as HashSettings)
                    .customSlideName,
        );
        const hashDriver = computed(
            () => (this.ctx.settings() as unknown as HashSettings).hashDriver,
        );
        effect((onCleanup) => {
            if (!enabled()) {
                return;
            }
            const id = galleryId();
            const custom = customSlideName();
            const preference = hashDriver();
            untracked(() => this.bind(id, custom, preference, onCleanup));
        });
    }

    private bind(
        galleryId: string,
        customSlideName: boolean,
        preference: HashDriverPreference,
        onCleanup: (fn: () => void) => void,
    ): void {
        const ctx = this.ctx;
        const marker = `lg=${galleryId}`;
        // URL engine (plan 012): History API today, Navigation API where
        // the browser has it — same URLs either way.
        const driver: HashDriver = createHashDriver(
            window as unknown as HashNavigationWindow,
            preference,
        );
        this.oldHash = driver.getHash();

        // Deep link: open the gallery when the URL carries this gallery id.
        const openTimer = setTimeout(() => {
            const hash = driver.getHash();
            if (hash.indexOf(marker) > 0 && !untracked(ctx.state).open) {
                document.body.classList.add('lg-from-hash');
                ctx.actions.openGallery(
                    getIndexFromHash(
                        hash,
                        untracked(ctx.items),
                        customSlideName,
                    ),
                );
            }
        }, 100);

        const writeHash = (index: number): void => {
            const item = untracked(ctx.items)[index];
            const slideName =
                customSlideName && item?.slideName
                    ? item.slideName
                    : `${index}`;
            driver.replaceHash(`#${marker}&slide=${slideName}`);
        };
        const offAfterSlide = ctx.events.on('afterSlide', (detail) =>
            writeHash(detail.index),
        );
        // 2.x writes the hash for the first slide too (its open path fires
        // afterSlide); mirror that on afterOpen.
        const offAfterOpen = ctx.events.on('afterOpen', () =>
            writeHash(untracked(ctx.state).currentIndex),
        );

        const offAfterClose = ctx.events.on('afterClose', () => {
            document.body.classList.remove('lg-from-hash');
            const oldHash = this.oldHash;
            if (oldHash && oldHash.indexOf(marker) < 0) {
                driver.replaceHash(oldHash);
            } else {
                driver.clearHash();
            }
        });

        // Back/forward: follow the hash while open.
        const onHashChange = (): void => {
            if (!untracked(ctx.state).open) {
                return;
            }
            const hash = driver.getHash();
            if (hash.indexOf(marker) > -1) {
                ctx.actions.goToSlide(
                    getIndexFromHash(
                        hash,
                        untracked(ctx.items),
                        customSlideName,
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
    }
}

export function withHash(
    options: Partial<HashSettings> = {},
): LgFeature<HashSettings> {
    return {
        name: 'hash',
        defaults: hashSettings,
        options,
        providers: [
            LgHashService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgHashService,
                multi: true,
            },
        ],
    };
}
