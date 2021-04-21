import { GalleryItem } from '../../lg-utils';
export interface ShareOption {
    selector: string;
    dropdownHTML: string;
    generateLink: (galleryItem: GalleryItem) => string;
}
