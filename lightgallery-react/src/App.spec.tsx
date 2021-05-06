import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Should render lightGallery component', () => {
  render(<App />);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
  expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  expect(screen.getByLabelText('Close gallery')).toBeInTheDocument();
});
