import { LightGallerySettings } from './lg-settings';
import { LightGallery } from './lightgallery';

function lightGallery(
    el: HTMLElement,
    options?: LightGallerySettings,
): LightGallery {
    return new LightGallery(el, options);
}
export default lightGallery;
