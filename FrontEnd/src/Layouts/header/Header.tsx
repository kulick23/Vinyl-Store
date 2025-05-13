import React from 'react';
import logo from "../../Assets/icons/logo.svg"
import cart from "../../Assets/icons/cart.svg"
import dark from "../../Assets/icons/dark.svg"
import light from "../../Assets/icons/light.svg"
import search from "../../Assets/icons/search.svg"
import "./Header.scss"

export const Header: React.FC = () => {


  return (
    <header className="header">
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
        <img src={search} alt="Logo" />
        <img src={cart} alt="Logo" />
        <img src={dark} alt="Logo" />
        <img src={light} alt="Logo" />
        <a>Sign in</a>
      </div>
    </header>
  );
};

export default Header;
