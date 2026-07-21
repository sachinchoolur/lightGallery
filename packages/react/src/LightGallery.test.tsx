import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LightGallery } from './index';

describe('LightGallery scaffold', () => {
    it('renders children inside the root element', () => {
        render(
            <LightGallery>
                <span>hello</span>
            </LightGallery>,
        );
        const root = screen.getByText('hello').parentElement;
        expect(root).toHaveClass('lg-react-root');
    });

    it('clamps the index through the headless workspace link', () => {
        const { container } = render(<LightGallery index={99} />);
        expect(container.firstElementChild).toHaveAttribute('data-index', '0');
    });
});
