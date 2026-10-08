import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import './page.css';
import App from './App.tsx';

// StrictMode mounts, unmounts and remounts every effect in development.
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
