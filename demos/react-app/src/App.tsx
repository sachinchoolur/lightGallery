/**
 * Standalone consumer app for `@lightgallery/react`.
 *
 * Resolves the package through its published `exports` map rather than
 * a source alias, and splits the feature surface into hash-routed pages
 * shared with the Vue and Angular apps, so the same page can be opened
 * in all three on any device.
 */

import { useEffect, useState, type ComponentType } from 'react';

import {
    PAGES,
    isPageHash,
    pageFromHash,
    type PageId,
} from '../../shared/media';
import { CombinationsPage } from './pages/Combinations';
import { JustifiedPage } from './pages/Justified';
import { MixedPage } from './pages/Mixed';
import { SizesPage } from './pages/Sizes';
import { ThumbnailsPage } from './pages/Thumbnails';
import { VideoPage } from './pages/Video';

// CSS stays a consumer import (ADR 0001 §8) — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-rtl.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-pager.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-comments.css';
import 'lightgallery/css/lg-medium-zoom.css';
import 'lightgallery/css/lg-justified.css';

const PAGE_COMPONENTS: Record<PageId, ComponentType> = {
    combinations: CombinationsPage,
    sizes: SizesPage,
    thumbnails: ThumbnailsPage,
    video: VideoPage,
    justified: JustifiedPage,
    mixed: MixedPage,
};

export function App() {
    const [page, setPage] = useState<PageId>(() =>
        pageFromHash(window.location.hash),
    );

    useEffect(() => {
        const onHashChange = () => {
            if (isPageHash(window.location.hash)) {
                setPage(pageFromHash(window.location.hash));
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const Page = PAGE_COMPONENTS[page];

    return (
        <main className="demo">
            <h1>@lightgallery/react — consumer app</h1>
            <p className="note">
                Resolved through the package <code>exports</code> map, not a
                source alias. The same pages exist in the Vue and Angular apps.
            </p>
            <nav className="demo-nav">
                {PAGES.map((entry) => (
                    <a
                        key={entry.id}
                        href={`#${entry.id}`}
                        className={entry.id === page ? 'active' : undefined}
                    >
                        {entry.title}
                    </a>
                ))}
            </nav>
            <Page key={page} />
        </main>
    );
}
