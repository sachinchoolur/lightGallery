import { lGEvents } from '../../lg-events';
import { GalleryItem } from '../../lg-utils';
import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { PagerSettings, pagerSettings } from './lg-pager-settings';

export default class Pager {
    core: LightGallery;
    settings: PagerSettings;
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;
        // extend module default settings with lightGallery core settings
        this.settings = { ...pagerSettings, ...this.core.settings };

        return this;
    }

    private getPagerHtml(items: GalleryItem[]): string {
        let pagerList = '';
        for (let i = 0; i < items.length; i++) {
            pagerList += `<span  data-lg-item-id="${i}" class="lg-pager-cont"> 
                    <span data-lg-item-id="${i}" class="lg-pager"></span>
                    <div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="${items[i].thumb}" /></div>
                    </span>`;
        }
        return pagerList;
    }

    public init(): void {
        if (!this.settings.pager) {
            return;
        }
        let timeout: any;
        this.core.$lgComponents.prepend('<div class="lg-pager-outer"></div>');

        const $pagerOuter = this.core.outer.find('.lg-pager-outer');

        $pagerOuter.html(this.getPagerHtml(this.core.galleryItems));

        // @todo enable click
        $pagerOuter.first().on('click.lg touchend.lg', (event: MouseEvent) => {
            const $target = this.$LG(event.target);
            if (!$target.hasAttribute('data-lg-item-id')) {
                return;
            }
            const index = parseInt($target.attr('data-lg-item-id'));
            this.core.slide(index, false, true, false);
        });

        $pagerOuter.first().on('mouseover.lg', () => {
            clearTimeout(timeout);
            $pagerOuter.addClass('lg-pager-hover');
        });

        $pagerOuter.first().on('mouseout.lg', () => {
            timeout = setTimeout(() => {
                $pagerOuter.removeClass('lg-pager-hover');
            });
        });

        this.core.LGel.on(`${lGEvents.beforeSlide}.pager`, (event) => {
            const { index } = event.detail;
            this.manageActiveClass.call(this, index);
        });

        this.core.LGel.on(`${lGEvents.updateSlides}.pager`, () => {
            $pagerOuter.empty();
            $pagerOuter.html(this.getPagerHtml(this.core.galleryItems));
            this.manageActiveClass(this.core.index);
        });
    }

    private manageActiveClass(index: number): void {
        const $pagerCont = this.core.outer.find('.lg-pager-cont');
        $pagerCont.removeClass('lg-pager-active');
        $pagerCont.eq(index).addClass('lg-pager-active');
    }

    destroy(): void {
        this.core.outer.find('.lg-pager-outer').remove();
        this.core.LGel.off('.lg.pager');
        this.core.LGel.off('.pager');
    }
}
