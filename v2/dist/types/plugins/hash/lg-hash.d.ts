import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}
export declare class Hash {
    core: LightGallery;
    s: {
        hash: boolean;
    };
    oldHash: string;
    constructor(instance: LightGallery);
    init(): void;
    onAfterSlide(event: CustomEvent): void;
    onCloseAfter(): void;
    onHashchange(): void;
    destroy(clear?: boolean): void;
}
