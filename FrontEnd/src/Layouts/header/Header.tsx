"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { NavLink, Link } from "react-router-dom"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useGetCartQuery } from "../../redux/cart/api"
import { MobileNav } from "../../Components/MobileNav/MobileNav"
import logo from "../../Assets/icons/logo.svg"
import cart from "../../Assets/icons/cart.svg"
import dark from "../../Assets/icons/dark.svg"
import light from "../../Assets/icons/light.svg"
import heart from "../../Assets/icons/heart.svg"
import hamburger from "../../Assets/icons/hamburger.svg"
import "./Header.scss"

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up")
  const [pastThreshold, setPastThreshold] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Check if user is logged in
  const token = localStorage.getItem("accessToken")
  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  })
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !token,
  })

  // Get cart items from CartDto structure
  const cartItems = cartData?.items || []

  const changeLanguage = (lng: "en" | "ru") => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  const closeMobileNav = () => {
    setIsMobileNavOpen(false)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkTheme ? "dark" : "light")
    localStorage.setItem('theme', isDarkTheme ? "dark" : "light")
  }, [isDarkTheme])

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedLanguage = localStorage.getItem('language')
    
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark')
    }
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.classList.add('mobile-nav-open')
    } else {
      document.body.classList.remove('mobile-nav-open')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-nav-open')
    }
  }, [isMobileNavOpen])

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 0)
      if (y > 150) {
        setPastThreshold(true)
        setScrollDir(y > lastY ? "down" : "up")
      } else {
        setPastThreshold(false)
      }
      lastY = y
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleTheme = () => setIsDarkTheme((prev) => !prev)

  const isHidden = pastThreshold && scrollDir === "down"

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""} ${isHidden ? "hide" : "show"}`}>
        <div className="header__container">
          <div className="header__container--logo">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
            <h4>Vinyl Haven</h4>
          </div>
          
          {/* Desktop Navigation */}
          <div className="header__container--link">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "header__link header__link--active" : "header__link")}
            >
              {t("header.home")}
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => (isActive ? "header__link header__link--active" : "header__link")}
            >
              {t("header.shop")}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "header__link header__link--active" : "header__link")}
            >
              {t("header.about")}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "header__link header__link--active" : "header__link")}
            >
              {t("header.contact")}
            </NavLink>
          </div>
        </div>

        <div className="header__widgets">
          {/* Desktop Language Switcher */}
          <div className="header__widgets--lang">
            <button className="empty-button" onClick={() => changeLanguage("en")}>
              EN
            </button>
            <p>|</p>
            <button className="empty-button" onClick={() => changeLanguage("ru")}>
              RU
            </button>
          </div>

          {/* Desktop Actions */}
          {user && (
            <Link to="/wishlist" className="button-img">
              <img src={heart || "/placeholder.svg"} alt="wishlist" />
            </Link>
          )}

          {user && (
            <Link to="/cart" className="button-img cart-icon" style={{ position: "relative" }}>
              <img src={cart || "/placeholder.svg"} alt="cart" />
              {cartItems.length > 0 && (
                <span className="cart-badge">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {/* Desktop Theme Toggle */}
          <button onClick={toggleTheme} className="header__widgets--theme button-img">
            <img src={light || "/placeholder.svg"} alt="light theme" className={isDarkTheme ? "on-top" : ""} />
            <img src={dark || "/placeholder.svg"} alt="dark theme" className={!isDarkTheme ? "on-top" : ""} />
          </button>

          {/* Desktop User/Login */}
          {user ? (
            <Link to="/profile" className="header__link header__user">
              <span className="header__user-name">{user.firstName}</span>
              {user.role === "Seller" && (
                <span className="header__seller-badge">{t('seller.sellerDashboard')}</span>
              )}
            </Link>
          ) : (
            <Link to="/login" className="header__link">
              {t("buttons.signIn")}
            </Link>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            className="header__mobile-menu-toggle"
            onClick={toggleMobileNav}
            aria-label="Open mobile menu"
          >
            <img src={hamburger || "/placeholder.svg"} alt="Menu" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        isDarkTheme={isDarkTheme}
        onToggleTheme={toggleTheme}
        onChangeLanguage={changeLanguage}
      />
    </>
  )
}

export default Header
