/** Public API surface of @lightgallery/angular. */
export { LgGalleryComponent } from './lib/gallery.component';
export { LgGalleryItemDirective } from './lib/item.directive';
export { LgGesturesDirective } from './lib/gestures.directive';
export {
    LgCaptionComponent,
    LgCaptionContentComponent,
} from './lib/caption.component';
export { LgImageSlideComponent } from './lib/image-slide.component';
export { LgSlideComponent, type OriginAnimation } from './lib/slide.component';
export {
    LgCaptionDirective,
    LgCounterDirective,
    LgNextButtonDirective,
    LgPrevButtonDirective,
    type LgCaptionContext,
    type LgCounterContext,
} from './lib/slots';
export { LightGalleryStore } from './lib/store';
export {
    LgGalleryRuntime,
    type LgGestureHooks,
    type LgGestureSeam,
    type LgItemRegistration,
} from './lib/runtime';
export type {
    HasVideoDetail,
    InitDetail,
    LgEventMap,
    LgGalleryHandle,
    LgGalleryItem,
    SlideEventDetail,
    SlideItemLoadDetail,
} from './lib/types';
