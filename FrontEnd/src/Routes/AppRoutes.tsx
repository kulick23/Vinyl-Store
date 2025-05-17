import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/HomePage/HomePage';
import AboutPage from '../Pages/AboutPage/AboutPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import PolicyPage from '../Pages/PolicyPage/PolicyPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/policy" element={<PolicyPage />} />
    </Routes>
  );
};
