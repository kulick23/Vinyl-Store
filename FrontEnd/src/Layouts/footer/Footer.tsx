import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.scss';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <small>{t('footer.copyright')}</small>
      <div className="footer__container">
        <a>{t('footer.privacyPolicy')}</a>
        <a>{t('footer.terms')}</a>
        <a>{t('footer.contactUs')}</a>
      </div>
    </footer>
  );
};

export default Footer;
