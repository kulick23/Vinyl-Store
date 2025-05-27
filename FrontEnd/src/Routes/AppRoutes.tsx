import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage/HomePage';
import AboutPage from '../Pages/AboutPage/AboutPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import PolicyPage from '../Pages/PolicyPage/PolicyPage';
import ShopPage from '../Pages/ShopPage/ShopPage';


export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};
