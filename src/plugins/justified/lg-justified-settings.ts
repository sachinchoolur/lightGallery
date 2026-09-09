export interface JustifiedSettings {
    /**
     * Enable the justified layout for the gallery's trigger thumbnails:
     * rows of equal height and varying widths that fill the container
     * edge to edge. Inline galleries only, dynamic mode has no trigger
     * grid to lay out. Each box shows as a placeholder and its thumbnail
     * fades in once loaded; put `class="lg-justified"` on the container
     * markup so nothing shows unorganized before the script runs.
     * See <a href="/docs/justified-layout/">Justified layout</a>.
     */
    justified: boolean;
    /**
     * Row height (px) the layout aims for; actual rows land as close to
     * it as the aspect ratios allow.
     */
    justifiedRowHeight: number;
    /**
     * Gap between thumbnails and between rows (px).
     */
    justifiedGap: number;
    /**
     * Last-row policy: 'justify' scales the leftover row to fill the
     * width like every other row, 'start' keeps the row height aligned
     * to the reading start, 'hide' hides the leftover thumbnails.
     */
    justifiedLastRow: 'justify' | 'start' | 'hide';
    /**
     * Row-height clamp as a multiple of justifiedRowHeight, a sparse
     * row never renders taller than this.
     */
    justifiedMaxScale: number;
    /**
     * How thumbnails appear as they load: 'row' reveals whole rows top
     * to bottom, each once every thumbnail in it has loaded; 'image'
     * reveals each thumbnail on its own as soon as it has loaded.
     * @version V3.0.0
     */
    justifiedReveal: 'row' | 'image';
}

export const justifiedSettings: JustifiedSettings = {
    justified: true,
    justifiedRowHeight: 180,
    justifiedGap: 8,
    justifiedLastRow: 'start',
    justifiedMaxScale: 1.75,
    justifiedReveal: 'row',
};
