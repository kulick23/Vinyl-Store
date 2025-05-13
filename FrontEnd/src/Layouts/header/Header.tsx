import React, { useState, useEffect } from 'react';
import logo from '../../Assets/icons/logo.svg';
import cart from '../../Assets/icons/cart.svg';
import dark from '../../Assets/icons/dark.svg';
import light from '../../Assets/icons/light.svg';
import search from '../../Assets/icons/search.svg';
import './Header.scss';

export const Header: React.FC = () => {
  const [isDarkOnTop, setDarkOnTop] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [pastThreshold, setPastThreshold] = useState(false);

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

  const toggleThemeIcons = () => setDarkOnTop(prev => !prev);

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
          <a>Home</a>
          <a>Shop</a>
          <a>About</a>
          <a>Contact</a>
        </div>
      </div>
      <div className="header__widgets">
        <img src={search} alt="search" />
        <img src={cart} alt="cart" />
        <div
          className="header__widgets--theme"
          onClick={toggleThemeIcons}
        >
          <img
            src={dark}
            alt="dark theme"
            className={isDarkOnTop ? 'on-top' : ''}
          />
          <img
            src={light}
            alt="light theme"
            className={!isDarkOnTop ? 'on-top' : ''}
          />
        </div>
        <a>Sign in</a>
      </div>
    </header>
  );
};

export default Header;
