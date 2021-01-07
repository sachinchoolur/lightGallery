import { DynamicItem } from '../../lg-utils';
import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}
export declare class Pager {
    core: LightGallery;
    s: {
        pager: boolean;
    };
    constructor(instance: LightGallery);
    getPagerHtml(items: DynamicItem[]): string;
    init(): void;
    manageActiveClass(index: number): void;
    addNewPagers(items: DynamicItem[]): void;
    destroy(clear?: boolean): void;
}
