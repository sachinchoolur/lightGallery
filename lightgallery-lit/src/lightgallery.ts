/**
 * lightGallery component for lit
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import lightGallery from 'lightgallery';
import { LightGallerySettings } from 'lightgallery/lg-settings';
import { TemplateResult } from 'lit';
import { LightGallery } from 'lightgallery/lightgallery';

@customElement('light-gallery')
export class LightGalleryLit extends LitElement {
    private galleryInstance?: LightGallery;

    private getSelector(el: HTMLElement): HTMLCollection[] {
        const childNodes = (el as HTMLSlotElement).assignedNodes({
            flatten: true,
        });
        const selector = Array.prototype.filter.call(
            childNodes,
            (node) => node.nodeType == Node.ELEMENT_NODE,
        );
        return selector;
    }
    firstUpdated(): void {
        if (!this.shadowRoot) return;
        const slot = this.shadowRoot.querySelector('slot');
        const selector = this.getSelector(slot as HTMLElement);
        const litSettings = {
            selector: selector as any,
        };
        const lgSettings = { ...this.settings, ...litSettings };
        this.galleryInstance = lightGallery(
            (this as unknown) as HTMLElement,
            lgSettings,
        );
    }

    @property({
        type: Object,
    })
    settings: LightGallerySettings = {} as LightGallerySettings;

    handleSlotchange(e: any): void {
        const selector = this.getSelector(e.target);

        if (!this.galleryInstance) {
            return;
        }
        if (this.galleryInstance?.galleryItems.length !== selector.length) {
            this.galleryInstance.settings.selector = selector;
            this.galleryInstance?.refresh();
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.galleryInstance) {
            this.galleryInstance.destroy();
        }
    }

    render(): TemplateResult {
        return html`
            <div id="container">
                <slot @slotchange=${this.handleSlotchange}></slot>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'light-gallery': LightGalleryLit;
    }
}
