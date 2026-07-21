import type { ReactElement, ReactNode } from 'react';
import { clampIndex } from '@lightgallery/headless';

export interface LightGalleryProps {
    /** Placeholder scaffold prop — the real API is defined by the plan-002 ADR. */
    index?: number;
    children?: ReactNode;
}

/**
 * Placeholder component proving the scaffold end to end: TSX, jsx-runtime,
 * and the workspace link to @lightgallery/headless. Replaced by the real
 * implementation in plans 002/003.
 */
export function LightGallery({
    index = 0,
    children,
}: LightGalleryProps): ReactElement {
    const safeIndex = clampIndex(index, 1, false);
    return (
        <div className="lg-react-root" data-index={safeIndex}>
            {children}
        </div>
    );
}
