/** Sample photos. Replace them with your own. */
export interface Photo {
    /** Full-size image, shown in the gallery. */
    src: string;
    /** Small image, shown on the page and in the thumbnail strip. */
    thumb: string;
    alt: string;
    /** "WIDTH-HEIGHT" of the full-size image; lets it open from its thumbnail. */
    lgSize: string;
}

const photo = (id: number, alt: string): Photo => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/360/240`,
    alt,
    lgSize: '1600-1067',
});

export const photos: Photo[] = [
    photo(10, 'Sample photo 1'),
    photo(11, 'Sample photo 2'),
    photo(15, 'Sample photo 3'),
    photo(16, 'Sample photo 4'),
    photo(28, 'Sample photo 5'),
    photo(29, 'Sample photo 6'),
    photo(37, 'Sample photo 7'),
    photo(110, 'Sample photo 8'),
];
