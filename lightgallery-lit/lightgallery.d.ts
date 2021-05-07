import { LitElement } from 'lit';
import { LightGallerySettings } from 'lightgallery/lg-settings';
export declare class LightGallery extends LitElement {
    private container;
    firstUpdated(): void;
    settings: Partial<LightGallerySettings>;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'light-gallery': LightGallery;
    }
}
//# sourceMappingURL=lightgallery.d.ts.map
