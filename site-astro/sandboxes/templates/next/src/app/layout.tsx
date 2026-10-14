import type { ReactNode } from 'react';

import '../demo.css';

export const metadata = { title: 'lightGallery Next.js example' };

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
