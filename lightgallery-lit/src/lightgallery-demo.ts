/**
 * lightGallery component for lit
 */

import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import lgZoom from 'lightgallery/plugins/zoom';
import { TemplateResult } from 'lit';
const settings = { speed: 200, download: false, plugins: [lgZoom] };
@customElement('light-gallery-demo')
export class LightGalleryDemo extends LitElement {
    @query('#lit-gallery')
    gallery: any;

    @property({ type: Array })
    list = [
        {
            id: '1',
            size: '1400-933',
            src:
                'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
            thumb:
                'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
            subHtml: `<div class="lightGallery-captions">
            <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
            <p>Published on November 13, 2018</p>
        </div>`,
        },
        {
            id: '2',
            size: '1400-933',
            src:
                'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
            thumb:
                'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
            subHtml: `<div class="lightGallery-captions">
            <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
            <p>Published on September 14, 2016</p>
        </div>`,
        },
    ];
    addNewSlide(): void {
        this.list = [
            ...this.list,
            {
                id: '3',
                size: '1400-932',
                src:
                    'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                thumb:
                    'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
            <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
            <p>Published on May 8, 2020</p>
        </div>`,
            },
        ];
    }
    getItems(): TemplateResult[] {
        return this.list.map(
            (item) => html` <a
                data-lg-size="${item.size}"
                class="gallery-item"
                data-src="${item.src}"
                data-html="${item.subHtml}"
            >
                <img class="img-responsive" src="${item.thumb}" />
            </a>`,
        );
    }
    render(): TemplateResult {
        return html`
            <button @click=${this.addNewSlide}>Add slide</button>
            <light-gallery id="lit-gallery" .settings=${settings}>
                ${this.getItems()}
            </light-gallery>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'light-gallery-demo': LightGalleryDemo;
    }
}
