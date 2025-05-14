import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../Assets/icons/logo.svg';
import cart from '../../Assets/icons/cart.svg';
import dark from '../../Assets/icons/dark.svg';
import light from '../../Assets/icons/light.svg';
import search from '../../Assets/icons/search.svg';
import './Header.scss';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [pastThreshold, setPastThreshold] = useState(false);

  const changeLanguage = (lng: 'en' | 'ru') => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkTheme ? 'dark' : 'light'
    );
  }, [isDarkTheme]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 0);
      if (y > 150) {
        setPastThreshold(true);
        setScrollDir(y > lastY ? 'down' : 'up');
      } else {
        setPastThreshold(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  const isHidden = pastThreshold && scrollDir === 'down';

  return (
    <header
      className={`header ${scrolled ? 'scrolled' : ''} ${
        isHidden ? 'hide' : 'show'
      }`}
    >
      <div className="header__container">
        <div className="header__container--logo">
          <img src={logo} alt="Logo" />
          <h4>Vinyl Haven</h4>
        </div>
        <div className="header__container--link">
          <a>{t('header.home')}</a>
          <a>{t('header.shop')}</a>
          <a>{t('header.about')}</a>
          <a>{t('header.contact')}</a>
        </div>
      </div>
      <div className="header__widgets">
        <div className="header__widgets--lang">
          <button className="empty-button" onClick={() => changeLanguage('en')}>
            EN
          </button>
          <p>|</p>
          <button className="empty-button" onClick={() => changeLanguage('ru')}>
            RU
          </button>
        </div>
        <button className="button-img">
          <img src={search} alt="search" />
        </button>
        <button className="button-img">
          <img src={cart} alt="cart" />
        </button>
        <button
          onClick={toggleTheme}
          className="header__widgets--theme button-img"
        >
          <img
            src={light}
            alt="light theme"
            className={isDarkTheme ? 'on-top' : ''}
          />
          <img
            src={dark}
            alt="dark theme"
            className={!isDarkTheme ? 'on-top' : ''}
          />
        </button>

        <a>{t('buttons.signIn')}</a>
      </div>
    </header>
  );
};

export default Header;
