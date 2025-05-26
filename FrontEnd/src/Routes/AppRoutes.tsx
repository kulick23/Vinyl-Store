import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage/HomePage';
import AboutPage from '../Pages/AboutPage/AboutPage';
import ShopPage from '../Pages/ShopPage/ShopPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};
