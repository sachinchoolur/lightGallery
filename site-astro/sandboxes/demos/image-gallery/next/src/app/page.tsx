import { photos } from '../photos';
import { Gallery } from './Gallery';

// A server component: the grid is in the HTML before any JavaScript runs.
export default function Page() {
    return (
        <main>
            <h1>lightGallery image gallery</h1>
            <Gallery photos={photos} />
        </main>
    );
}
