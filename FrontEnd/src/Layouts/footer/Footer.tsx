import React from 'react';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <small>© 2024 Vinyl Haven. All rights reserved.</small>
      <div className="footer__container">
        <a>Privacy Policy</a>
        <a>Terms of Service</a>
        <a>Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
