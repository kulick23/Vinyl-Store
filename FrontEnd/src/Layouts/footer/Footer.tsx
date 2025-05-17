import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <small>{t('footer.copyright')}</small>
      <div className="footer__container">
        <NavLink to="/policy">{t('footer.privacyPolicy')}</NavLink>
        <NavLink to="/contact">{t('footer.contactUs')}</NavLink>
      </div>
    </footer>
  );
};

export default Footer;
