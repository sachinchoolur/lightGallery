import {
    createEmitter as createTypedEmitter,
    type TypedEmitter,
} from '@lightgallery/headless';

import type {
    SlideEventDetail,
    SlideItemLoadDetail,
} from './types';

/**
 * The internal event bus (ADR 0001 §5): core lifecycle events fan out to it
 * (alongside the public `onXxx` callback props), and plugins use it to talk
 * to each other (rotate → zoom) and to the core-adjacent components
 * (toolbar buttons → slide wrappers). The emitter implementation lives in
 * `@lightgallery/headless` and is shared by every framework runtime; this
 * module binds it to the React event map.
 */

export interface HasVideoDetail {
    index: number;
    src?: string;
    html5Video?: unknown;
    hasPoster: boolean;
}

/** Known event payloads; plugin-private events may use any other name. */
export interface LgEventMap {
    beforeOpen: undefined;
    afterOpen: undefined;
    beforeClose: undefined;
    afterClose: undefined;
    beforeSlide: SlideEventDetail;
    afterSlide: SlideEventDetail;
    slideItemLoad: SlideItemLoadDetail;
    posterClick: undefined;
    hasVideo: HasVideoDetail;
    dragStart: undefined;
    dragMove: undefined;
    dragEnd: undefined;
    init: unknown;
}

export type LgEventEmitter = TypedEmitter<LgEventMap>;

export function createEmitter(): LgEventEmitter {
    return createTypedEmitter<LgEventMap>();
}
