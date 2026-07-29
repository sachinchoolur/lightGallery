/**
 * Resurrection ratchet: the math these files once implemented locally now
 * lives in @lightgallery/headless. Each pattern is a distinctive fragment
 * of a deleted local implementation — if one reappears, someone forked the
 * shared behavior again instead of importing it.
 */
import '@testing-library/jest-dom';

// ts-jest compiles with the DOM-only root tsconfig (`types: []`) —
// declare the node bits instead of adding @types/node to the program.
declare const require: (id: string) => {
    readFileSync(p: string, enc: string): string;
    resolve(...parts: string[]): string;
};
declare const __dirname: string;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const FORBIDDEN: Record<string, string[]> = {
    'src/plugins/zoom/lg-zoom.ts': [
        'endDist / startDist', // pinch distance-ratio scale
        'speedX', // pan-release momentum speeds
        '/ touchDuration + 1',
        'Math.max(0.5,', // elastic pinch floor
        '(point.x - startPan.x)', // focal projection
    ],
    'src/lg-utils.ts': [
        'be-nocookie', // provider regexes
        'wi\\.st',
        'maxWidth / width', // fit-image ratio
        'px, 0) scale3d(', // origin transform template
    ],
    'src/plugins/video/lg-video.ts': [
        'player.vimeo.com', // embed URL assembly
        'fast.wistia.net/embed',
        'wmode', // YouTube default params
        'youtube-nocookie.com/', // base-host selection
    ],
    'src/plugins/thumbnail/lg-thumbnail.ts': [
        'thumbWidth + this.settings.thumbMargin', // strip total width
        'thumbOuterWidth / 2', // pager-position math
    ],
    'src/lightgallery.ts': [
        '* 15) / 100', // horizontal drag gutter
        '* 10) / 100',
        'innerWidth * 2', // vertical drag scale
        'distanceAbs > this.settings.swipeThreshold', // release verdict
    ],
};

describe('headless math stays imported', () => {
    Object.entries(FORBIDDEN).forEach(([file, fragments]) => {
        it(`keeps ${file} free of local reimplementations`, () => {
            const src: string = fs.readFileSync(
                path.resolve(__dirname, '..', file),
                'utf8',
            );
            for (const fragment of fragments) {
                expect(src).not.toContain(fragment);
            }
        });
    });
});
