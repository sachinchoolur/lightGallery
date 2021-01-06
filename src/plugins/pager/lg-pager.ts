import { DynamicItem } from '../../lg-utils';
import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';

declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}

const LG = window.LG;

const defaults = {
    pager: true,
};

export class Pager {
    core: LightGallery;
    s: { pager: boolean };
    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, defaults);

        if (this.s.pager && this.core.galleryItems.length > 1) {
            this.init();
        }

        return this;
    }

    getPagerHtml(items: DynamicItem[]): string {
        let pagerList = '';
        for (let i = 0; i < items.length; i++) {
            pagerList += `<span  data-lg-item-id="${i}" class="lg-pager-cont"> 
                    <span data-lg-item-id="${i}" class="lg-pager"></span>
                    <div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="${items[i].thumb}" /></div>
                    </span>`;
        }
        return pagerList;
    }

    init() {
        let timeout: any;
        this.core.outer
            .find('.lg')
            .append('<div class="lg-pager-outer"></div>');

        const $pagerOuter = this.core.outer.find('.lg-pager-outer');

        $pagerOuter.html(this.getPagerHtml(this.core.galleryItems));

        // @todo enable click
        $pagerOuter.first().on('click.lg touchend.lg', (event: MouseEvent) => {
            const $target = LG(event.target);
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

        this.core.LGel.on('onBeforeSlide.lg.pager', (event) => {
            const { index } = event.detail;
            this.manageActiveClass.call(this, index);
        });

        this.core.LGel.on('appendSlides.lg.pager', (event) => {
            const { items } = event.detail;
            this.addNewPagers.call(this, items);
        });
    }

    manageActiveClass(index: number) {
        const $pagerCont = this.core.outer.find('.lg-pager-cont');
        $pagerCont.removeClass('lg-pager-active');
        $pagerCont.eq(index).addClass('lg-pager-active');
    }

    addNewPagers(items: DynamicItem[]): void {
        this.core.outer
            .find('.lg-pager-outer')
            .append(this.getPagerHtml(items));
    }
    destroy(clear?: boolean): void {
        if (clear) {
            this.core.outer.find('.lg-pager-outer').remove();
            this.core.LGel.off('.lg.pager');
        }
    }
}

window.lgModules = window.lgModules || {};
window.lgModules.pager = Pager;
