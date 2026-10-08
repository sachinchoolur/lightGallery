import { useMemo } from 'react';
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import { JustifiedGrid } from '@lightgallery/react/plugins/justified';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import { SIZE_ITEMS, manyItems } from '../../../shared/media';
import { Choice, Group, Panel, Readout, useSettings } from '../ui';

const SOURCES = ['mixed ratios', 'size catalog'] as const;
const COUNTS = [12, 40, 100, 200];
const ROW_HEIGHTS = [80, 120, 180, 260];
const GAPS = [0, 4, 8, 16];
const LAST_ROWS = ['start', 'justify', 'hide'] as const;
const MAX_SCALES = [1, 1.5, 1.75, 2.5];
const REVEALS = ['row', 'image'] as const;
const DIRECTIONS = ['auto', 'ltr', 'rtl'] as const;
const PLUGINS = [Thumbnail, Zoom];

export function JustifiedPage() {
    const [s, patch] = useSettings({
        source: 'mixed ratios' as (typeof SOURCES)[number],
        count: 40,
        rowHeight: 180,
        gap: 8,
        lastRow: 'start' as (typeof LAST_ROWS)[number],
        maxScale: 1.75,
        reveal: 'row' as (typeof REVEALS)[number],
        direction: 'auto' as (typeof DIRECTIONS)[number],
    });

    const items = useMemo(
        () => (s.source === 'size catalog' ? SIZE_ITEMS : manyItems(s.count)),
        [s.source, s.count],
    );

    return (
        <section>
            <h2>Justified</h2>
            <p className="note">
                Row-justified trigger grid. Resize the window or rotate the
                device and the rows should re-flow. The size catalog feeds it
                extreme strips and tiny images; reload with a slow network to
                watch the placeholders and reveal order.
            </p>
            <Panel>
                <Group title="Content">
                    <Choice
                        label="Images"
                        value={s.source}
                        options={SOURCES}
                        onChange={(value) => patch('source', value)}
                    />
                    <Choice
                        label="Count"
                        value={s.count}
                        options={COUNTS}
                        onChange={(value) => patch('count', value)}
                    />
                </Group>
                <Group title="Layout">
                    <Choice
                        label="rowHeight"
                        value={s.rowHeight}
                        options={ROW_HEIGHTS}
                        onChange={(value) => patch('rowHeight', value)}
                    />
                    <Choice
                        label="gap"
                        value={s.gap}
                        options={GAPS}
                        onChange={(value) => patch('gap', value)}
                    />
                    <Choice
                        label="lastRow"
                        value={s.lastRow}
                        options={LAST_ROWS}
                        onChange={(value) => patch('lastRow', value)}
                    />
                    <Choice
                        label="maxScale"
                        value={s.maxScale}
                        options={MAX_SCALES}
                        onChange={(value) => patch('maxScale', value)}
                    />
                    <Choice
                        label="reveal"
                        value={s.reveal}
                        options={REVEALS}
                        onChange={(value) => patch('reveal', value)}
                    />
                    <Choice
                        label="direction"
                        value={s.direction}
                        options={DIRECTIONS}
                        onChange={(value) => patch('direction', value)}
                    />
                </Group>
            </Panel>
            <Readout>{items.length} images</Readout>
            <LightGallery key={JSON.stringify(s)} plugins={PLUGINS}>
                <JustifiedGrid
                    rowHeight={s.rowHeight}
                    gap={s.gap}
                    lastRow={s.lastRow}
                    maxScale={s.maxScale}
                    reveal={s.reveal}
                    direction={s.direction}
                >
                    {items.map((item) => (
                        <LightGalleryItem
                            key={item.alt}
                            item={item as GalleryItem}
                            href={item.src}
                            data-lg-size={item.lgSize}
                        >
                            <img src={item.thumb} alt={item.alt} />
                        </LightGalleryItem>
                    ))}
                </JustifiedGrid>
            </LightGallery>
        </section>
    );
}
