import { LightGallery, type LgPlugin } from '@lightgallery/react';
import Rotate from '@lightgallery/react/plugins/rotate';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import {
    SHAPES,
    SIZE_CLASSES,
    SIZE_ITEMS,
    type Shape,
    type SizeClass,
} from '../../../shared/media';
import {
    Choice,
    Group,
    Panel,
    Readout,
    Tile,
    Toggle,
    flip,
    useSettings,
} from '../ui';

const SCALES = [0.5, 1, 2];

export function SizesPage() {
    const [s, patch] = useSettings({
        sizes: [...SIZE_CLASSES] as SizeClass[],
        shapes: [...SHAPES] as Shape[],
        thumbnail: true,
        zoom: true,
        rotate: false,
        actualSize: true,
        infiniteZoom: true,
        showZoomInOutIcons: true,
        zoomFromOrigin: true,
        scale: 1,
    });

    const items = SIZE_ITEMS.filter(
        (item) =>
            s.sizes.some((tag) => item.tags.includes(tag)) &&
            s.shapes.some((tag) => item.tags.includes(tag)),
    );
    const plugins = [
        s.thumbnail && Thumbnail,
        s.zoom && Zoom,
        s.rotate && Rotate,
    ].filter(Boolean) as LgPlugin[];

    return (
        <section>
            <h2>Image sizes</h2>
            <p className="note">
                Every size class, from 60&nbsp;px up to 5000&nbsp;px, in every
                shape. Tiny and small images are below the stage, so actual-size
                zoom should leave them at their natural size; huge ones test
                fitting, pan bounds and decode time.
            </p>
            <Panel>
                <Group title="Size">
                    {SIZE_CLASSES.map((entry) => (
                        <Toggle
                            key={entry}
                            label={entry}
                            checked={s.sizes.includes(entry)}
                            onChange={() => patch('sizes', flip(s.sizes, entry))}
                        />
                    ))}
                </Group>
                <Group title="Shape">
                    {SHAPES.map((entry) => (
                        <Toggle
                            key={entry}
                            label={entry}
                            checked={s.shapes.includes(entry)}
                            onChange={() =>
                                patch('shapes', flip(s.shapes, entry))
                            }
                        />
                    ))}
                </Group>
                <Group title="Plugins">
                    <Toggle
                        label="Thumbnail"
                        checked={s.thumbnail}
                        onChange={(value) => patch('thumbnail', value)}
                    />
                    <Toggle
                        label="Zoom"
                        checked={s.zoom}
                        onChange={(value) => patch('zoom', value)}
                    />
                    <Toggle
                        label="Rotate"
                        checked={s.rotate}
                        onChange={(value) => patch('rotate', value)}
                    />
                </Group>
                <Group title="Zoom">
                    <Toggle
                        label="actualSize"
                        checked={s.actualSize}
                        onChange={(value) => patch('actualSize', value)}
                    />
                    <Toggle
                        label="infiniteZoom"
                        checked={s.infiniteZoom}
                        onChange={(value) => patch('infiniteZoom', value)}
                    />
                    <Toggle
                        label="showZoomInOutIcons"
                        checked={s.showZoomInOutIcons}
                        onChange={(value) => patch('showZoomInOutIcons', value)}
                    />
                    <Toggle
                        label="zoomFromOrigin"
                        checked={s.zoomFromOrigin}
                        onChange={(value) => patch('zoomFromOrigin', value)}
                    />
                    <Choice
                        label="scale"
                        value={s.scale}
                        options={SCALES}
                        onChange={(value) => patch('scale', value)}
                    />
                </Group>
            </Panel>
            <Readout>{items.length} images</Readout>
            <LightGallery
                key={JSON.stringify(s)}
                plugins={plugins}
                zoomFromOrigin={s.zoomFromOrigin}
                zoom={{
                    actualSize: s.actualSize,
                    infiniteZoom: s.infiniteZoom,
                    showZoomInOutIcons: s.showZoomInOutIcons,
                    scale: s.scale,
                }}
            >
                <div className="grid">
                    {items.map((item) => (
                        <Tile key={item.alt} item={item} />
                    ))}
                </div>
            </LightGallery>
        </section>
    );
}
