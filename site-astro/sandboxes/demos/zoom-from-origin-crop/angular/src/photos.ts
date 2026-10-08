/**
 * Sample photos, portrait and landscape, so the square tiles crop them.
 * Replace them with your own.
 */
export interface Photo {
    /** Full-size image, shown in the gallery. */
    src: string;
    /** Small image, shown on the page. */
    thumb: string;
    alt: string;
    /** "WIDTH-HEIGHT" of the full-size image; lets it open from its thumbnail. */
    lgSize: string;
    /** The tile's `object-position`: the part of the photo it shows. */
    position: string;
}

const landscape = (id: number, alt: string, position: string): Photo => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/480/320`,
    alt,
    lgSize: '1600-1067',
    position,
});

const portrait = (id: number, alt: string, position: string): Photo => ({
    src: `https://picsum.photos/id/${id}/1067/1600`,
    thumb: `https://picsum.photos/id/${id}/320/480`,
    alt,
    lgSize: '1067-1600',
    position,
});

export const photos: Photo[] = [
    landscape(10, 'Sample photo 1', '0% 50%'),
    portrait(11, 'Sample photo 2', '50% 0%'),
    landscape(15, 'Sample photo 3', '50% 50%'),
    portrait(16, 'Sample photo 4', '50% 100%'),
    landscape(28, 'Sample photo 5', '100% 50%'),
    portrait(29, 'Sample photo 6', '50% 50%'),
    landscape(37, 'Sample photo 7', '50% 50%'),
    portrait(110, 'Sample photo 8', '50% 0%'),
];
