import { LightGallerySettings } from './lg-settings';
import { LightGallery } from './lightgallery';

function lightGallery(
    el: undefined,
    options: Partial<LightGallerySettings>,
): undefined;
function lightGallery(
    el: HTMLElement,
    options: Partial<LightGallerySettings>,
): LightGallery;
function lightGallery(
    el: HTMLElement | undefined,
    options: Partial<LightGallerySettings>,
): LightGallery | undefined {
    if (!el) {
        return;
    }
    try {
        return new LightGallery(el, options);
    } catch (err) {
        console.error('lightGallery has not initiated properly', err);
    }
}
export default lightGallery;
