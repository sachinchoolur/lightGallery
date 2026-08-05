/**
 * Slide-change announcement formatting for the shared `aria-live` region.
 * All four runtimes build their announcer text through this helper so the
 * wording (and its localization surface, `strings.slideAnnouncement`) stays
 * identical everywhere.
 */

export interface SlideAnnouncementOptions {
    /** `strings.slideAnnouncement` template with `{index}`/`{total}` slots. */
    template: string;
    /** 1-based position of the shown slide. */
    index: number;
    /** Total slide count. */
    total: number;
    /** Plain-text caption of the shown slide, if any. */
    caption?: string;
}

/**
 * Build the text announced on a slide change: the filled template, then the
 * caption (comma-separated) when one exists. Whitespace in the caption is
 * collapsed so multi-line/rich captions read as one sentence.
 */
export function formatSlideAnnouncement(
    options: SlideAnnouncementOptions,
): string {
    const base = options.template
        .replace('{index}', String(options.index))
        .replace('{total}', String(options.total));
    const caption = (options.caption || '').replace(/\s+/g, ' ').trim();
    return caption ? `${base}, ${caption}` : base;
}
