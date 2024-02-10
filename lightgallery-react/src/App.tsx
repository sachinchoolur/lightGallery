import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import InlineGallery from './InlineGallery/InlineGallery';
import Thumbnails from './Thumbnails/Thumbnails';
import UpdateSlides from './UpdateSlides/UpdateSlides';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lightgallery-bundle.css';

function App() {
    return (
        <div className="App">
              <header className="nav">
                    <NavLink to={'/inline-gallery'}>Inline Gallery</NavLink>
                    <NavLink to={'/thumbnails'}>Thumbnails</NavLink>
                    <NavLink to={'/update-slides'}>Update Slides</NavLink>
                </header>
            <div className='content'>

                <Routes>
                    <Route path="/inline-gallery" element={<InlineGallery />} />
                    <Route path="/Thumbnails" element={<Thumbnails />} />
                    <Route path="/update-slides" element={<UpdateSlides />} />
                    <Route
                        path="/"
                        element={<Navigate to={'/inline-gallery'} />}
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
