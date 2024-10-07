import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import Profile from '../views/Profile';
import Favorite from '../views/Favorite';
import NotFound from '../views/NotFound';

function RoutedPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default RoutedPage;
