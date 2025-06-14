'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Link } from 'react-router-dom';
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
      className={`header ${scrolled ? 'scrolled' : ''} ${isHidden ? 'hide' : 'show'}`}
    >
      <div className="header__container">
        <div className="header__container--logo">
          <img src={logo || '/placeholder.svg'} alt="Logo" />
          <h4>Vinyl Haven</h4>
        </div>
        <div className="header__container--link">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
          >
            {t('header.home')}
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
          >
            {t('header.shop')}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
          >
            {t('header.about')}
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
          >
            {t('header.contact')}
          </NavLink>
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
          <img src={search || '/placeholder.svg'} alt="search" />
        </button>
        <button className="button-img">
          <img src={cart || '/placeholder.svg'} alt="cart" />
        </button>
        <button
          onClick={toggleTheme}
          className="header__widgets--theme button-img"
        >
          <img
            src={light || '/placeholder.svg'}
            alt="light theme"
            className={isDarkTheme ? 'on-top' : ''}
          />
          <img
            src={dark || '/placeholder.svg'}
            alt="dark theme"
            className={!isDarkTheme ? 'on-top' : ''}
          />
        </button>

        <Link to="/login" className="header__link">
          {t('buttons.signIn')}
        </Link>
      </div>
    </header>
  );
};

export default Header;
