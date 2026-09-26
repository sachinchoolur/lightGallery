import { useMemo } from 'react';
import { LightGallery, type LgPlugin } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import { THUMB_COUNTS, manyItems } from '../../../shared/media';
import {
    Choice,
    Group,
    Panel,
    Readout,
    Tile,
    Toggle,
    useSettings,
} from '../ui';

const POSITIONS = ['left', 'middle', 'right'] as const;
const WIDTHS = [60, 100, 150];
const HEIGHTS = ['60px', '80px', '120px'];
const MARGINS = [0, 5, 15];

export function ThumbnailsPage() {
    const [s, patch] = useSettings({
        count: 100,
        zoom: true,
        virtualization: false,
        animateThumb: true,
        toggleThumb: false,
        enableThumbDrag: true,
        scrubThumbnails: false,
        thumbWidth: 100,
        thumbHeight: '80px',
        thumbMargin: 5,
        alignThumbnails: 'middle' as (typeof POSITIONS)[number],
        currentPagerPosition: 'middle' as (typeof POSITIONS)[number],
    });

    const items = useMemo(() => manyItems(s.count), [s.count]);
    const plugins: LgPlugin[] = s.zoom ? [Thumbnail, Zoom] : [Thumbnail];

    return (
        <section>
            <h2>Thumbnails</h2>
            <p className="note">
                Up to 500 slides with mixed aspect ratios. Drag and fling the
                strip, scrub it, jump far through it, and check the active
                thumbnail stays in view. Compare with virtualization on.
            </p>
            <Panel>
                <Group title="Slides">
                    <Choice
                        label="Count"
                        value={s.count}
                        options={THUMB_COUNTS}
                        onChange={(value) => patch('count', value)}
                    />
                    <Toggle
                        label="virtualization"
                        checked={s.virtualization}
                        onChange={(value) => patch('virtualization', value)}
                    />
                    <Toggle
                        label="Zoom plugin"
                        checked={s.zoom}
                        onChange={(value) => patch('zoom', value)}
                    />
                </Group>
                <Group title="Strip behaviour">
                    <Toggle
                        label="animateThumb"
                        checked={s.animateThumb}
                        onChange={(value) => patch('animateThumb', value)}
                    />
                    <Toggle
                        label="toggleThumb"
                        checked={s.toggleThumb}
                        onChange={(value) => patch('toggleThumb', value)}
                    />
                    <Toggle
                        label="enableThumbDrag"
                        checked={s.enableThumbDrag}
                        onChange={(value) => patch('enableThumbDrag', value)}
                    />
                    <Toggle
                        label="scrubThumbnails"
                        checked={s.scrubThumbnails}
                        onChange={(value) => patch('scrubThumbnails', value)}
                    />
                </Group>
                <Group title="Strip layout">
                    <Choice
                        label="thumbWidth"
                        value={s.thumbWidth}
                        options={WIDTHS}
                        onChange={(value) => patch('thumbWidth', value)}
                    />
                    <Choice
                        label="thumbHeight"
                        value={s.thumbHeight}
                        options={HEIGHTS}
                        onChange={(value) => patch('thumbHeight', value)}
                    />
                    <Choice
                        label="thumbMargin"
                        value={s.thumbMargin}
                        options={MARGINS}
                        onChange={(value) => patch('thumbMargin', value)}
                    />
                    <Choice
                        label="alignThumbnails"
                        value={s.alignThumbnails}
                        options={POSITIONS}
                        onChange={(value) => patch('alignThumbnails', value)}
                    />
                    <Choice
                        label="currentPagerPosition"
                        value={s.currentPagerPosition}
                        options={POSITIONS}
                        onChange={(value) =>
                            patch('currentPagerPosition', value)
                        }
                    />
                </Group>
            </Panel>
            <Readout>
                {items.length} slides · thumbnails {s.thumbWidth}px ×{' '}
                {s.thumbHeight}
            </Readout>
            <LightGallery
                key={JSON.stringify(s)}
                plugins={plugins}
                virtualization={
                    s.virtualization ? { slides: 5, thumbs: 'auto' } : undefined
                }
                thumbnail={{
                    animateThumb: s.animateThumb,
                    toggleThumb: s.toggleThumb,
                    enableThumbDrag: s.enableThumbDrag,
                    scrubThumbnails: s.scrubThumbnails,
                    thumbWidth: s.thumbWidth,
                    thumbHeight: s.thumbHeight,
                    thumbMargin: s.thumbMargin,
                    alignThumbnails: s.alignThumbnails,
                    currentPagerPosition: s.currentPagerPosition,
                }}
            >
                <div className="grid grid-dense">
                    {items.map((item) => (
                        <Tile key={item.alt} item={item} caption={false} />
                    ))}
                </div>
            </LightGallery>
        </section>
    );
}
