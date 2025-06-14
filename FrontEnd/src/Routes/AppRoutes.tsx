import type React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage/HomePage';
import AboutPage from '../Pages/AboutPage/AboutPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import PolicyPage from '../Pages/PolicyPage/PolicyPage';
import ShopPage from '../Pages/ShopPage/ShopPage';
import ProductPage from '../Pages/ProductPage/ProductPage';
import LoginPage from '../Pages/LoginPage/LoginPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};
