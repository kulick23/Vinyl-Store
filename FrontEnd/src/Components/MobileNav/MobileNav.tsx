import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetCurrentUserQuery } from '../../redux/auth/api';
import { useGetCartQuery } from '../../redux/cart/api';
import heart from '../../Assets/icons/heart.svg';
import cart from '../../Assets/icons/cart.svg';
import close from '../../Assets/icons/close.svg';
import './MobileNav.scss';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onChangeLanguage: (lng: 'en' | 'ru') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  isDarkTheme,
  onToggleTheme,
  onChangeLanguage,
}) => {
  const { t, i18n } = useTranslation();
  
  // Check if user is logged in
  const token = localStorage.getItem('accessToken');
  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !token,
  });

  // Get cart items from CartDto structure
  const cartItems = cartData?.items || [];

  const handleLinkClick = () => {
    onClose();
  };

  const handleLanguageChange = (lng: 'en' | 'ru') => {
    onChangeLanguage(lng);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`mobile-nav__backdrop ${isOpen ? 'mobile-nav__backdrop--open' : ''}`}
        onClick={onClose}
      />
      
      {/* Side Drawer */}
      <nav className={`mobile-nav ${isOpen ? 'mobile-nav--open' : ''}`}>
        <div className="mobile-nav__header">
          <h3 className="mobile-nav__title">{t('header.menu')}</h3>
          <button
            className="mobile-nav__close"
            onClick={onClose}
            aria-label={t('header.closeMenu')}
          >
            <img src={close} alt={t('header.closeMenu')} />
          </button>
        </div>

        <div className="mobile-nav__content">
          {/* User Section */}
          {user ? (
            <div className="mobile-nav__user">
              <Link to="/profile" className="mobile-nav__user-link" onClick={handleLinkClick}>
                <span className="mobile-nav__user-name">
                  {user.firstName} {user.lastName}
                  {user.role === "Seller" && (
                    <span className="mobile-nav__seller-badge">{t('seller.sellerDashboard')}</span>
                  )}
                </span>
                <span className="mobile-nav__user-email">{user.email}</span>
              </Link>
            </div>
          ) : (
            <div className="mobile-nav__auth">
              <Link to="/login" className="mobile-nav__auth-link" onClick={handleLinkClick}>
                {t('buttons.signIn')}
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <div className="mobile-nav__links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
              }
              onClick={handleLinkClick}
            >
              {t('header.home')}
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
              }
              onClick={handleLinkClick}
            >
              {t('header.shop')}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
              }
              onClick={handleLinkClick}
            >
              {t('header.about')}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
              }
              onClick={handleLinkClick}
            >
              {t('header.contact')}
            </NavLink>
          </div>

          {/* Quick Actions */}
          {user && (
            <div className="mobile-nav__actions">
              <Link to="/wishlist" className="mobile-nav__action" onClick={handleLinkClick}>
                <img src={heart} alt="Wishlist" />
                <span>{t('header.wishlist')}</span>
              </Link>
              <Link to="/cart" className="mobile-nav__action" onClick={handleLinkClick}>
                <div className="mobile-nav__action-icon">
                  <img src={cart} alt="Cart" />
                  {cartItems.length > 0 && (
                    <span className="mobile-nav__cart-badge">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
            </div>
          )}

          {/* Settings */}
          <div className="mobile-nav__settings">
            <div className="mobile-nav__setting">
              <span className="mobile-nav__setting-label">Language</span>
              <div className="mobile-nav__language">
                <button
                  className={`mobile-nav__language-btn ${
                    i18n.language === 'en' ? 'mobile-nav__language-btn--active' : ''
                  }`}
                  onClick={() => handleLanguageChange('en')}
                >
                  EN
                </button>
                <button
                  className={`mobile-nav__language-btn ${
                    i18n.language === 'ru' ? 'mobile-nav__language-btn--active' : ''
                  }`}
                  onClick={() => handleLanguageChange('ru')}
                >
                  RU
                </button>
              </div>
            </div>
            
            <div className="mobile-nav__setting">
              <span className="mobile-nav__setting-label">Theme</span>
              <button
                className="mobile-nav__theme-toggle"
                onClick={onToggleTheme}
              >
                {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNav; 