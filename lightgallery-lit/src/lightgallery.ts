/**
 * lightGallery component for lit
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import lightGallery from 'lightgallery';
import { LightGallerySettings } from 'lightgallery/lg-settings';
import { TemplateResult } from 'lit';

@customElement('light-gallery')
export class LightGallery extends LitElement {
    firstUpdated() {
        const slot = (this.shadowRoot as ShadowRoot).querySelector('slot');
        const childNodes = (slot as HTMLSlotElement).assignedNodes({
            flatten: true,
        });
        const s = Array.prototype.filter.call(
            childNodes,
            (node) => node.nodeType == Node.ELEMENT_NODE,
        );
        const litSettings = {
            selector: s as any,
        };
        const lgSettings = { ...this.settings, ...litSettings };
        lightGallery((this as unknown) as HTMLElement, lgSettings);
    }

    @property({
        type: Object,
        converter: (value: string | null) => {
            const convertedVal = JSON.parse(value as string);
            return convertedVal;
        },
    })
    settings: LightGallerySettings = {} as LightGallerySettings;

    render(): TemplateResult {
        return html`
            <div id="container">
                <slot></slot>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'light-gallery': LightGallery;
    }
}
