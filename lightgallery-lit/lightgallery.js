var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (
            typeof Reflect === 'object' &&
            typeof Reflect.decorate === 'function'
        )
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r =
                        (c < 3
                            ? d(r)
                            : c > 3
                            ? d(target, key, r)
                            : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import lightGallery from 'lightgallery';
let LightGallery = class LightGallery extends LitElement {
    constructor() {
        super(...arguments);
        this.settings = {};
    }
    firstUpdated() {
        this.container = this.renderRoot.querySelector('#container');
        console.log(this.container.children);
        const slot = this.shadowRoot.querySelector('slot');
        const childNodes = slot.assignedNodes({
            flatten: true,
        });
        const s = Array.prototype.filter.call(
            childNodes,
            (node) => node.nodeType == Node.ELEMENT_NODE,
        );
        const vueSettings = {
            selector: s,
        };
        const lgSettings = { ...this.settings, ...vueSettings };
        lightGallery(this, lgSettings);
        console.log(this);
    }
    render() {
        return html`
            <div id="container">
                <slot></slot>
            </div>
        `;
    }
};
__decorate(
    [
        property({
            type: Object,
            converter: (value, type) => {
                // `value` is a string
                console.log(value);
                console.log(type);
                const convertedVal = JSON.parse(value);
                console.log('convertedVal', convertedVal);
                return convertedVal;
                // Convert it to a value of type `type` and return it
            },
        }),
    ],
    LightGallery.prototype,
    'settings',
    void 0,
);
LightGallery = __decorate([customElement('light-gallery')], LightGallery);
export { LightGallery };
//# sourceMappingURL=lightgallery.js.map
