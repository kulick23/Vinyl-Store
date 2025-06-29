"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useGetCurrentSellerProfileQuery } from "../../redux/seller/api"
import { useGetInventoryQuery } from "../../redux/inventory/api"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import SellerInventory from "./SellerInventory"
import SellerOrders from "./SellerOrders"
import SellerProfileManagement from "./SellerProfileManagement"
import "./SellerDashboard.scss"

type SellerSection = "overview" | "inventory" | "orders" | "profile" | "reviews"

const SellerOverview: React.FC<{ sellerProfile: any }> = ({ sellerProfile }) => {
  const { t } = useTranslation()
  const { data: inventory = [] } = useGetInventoryQuery()

  const activeItems = inventory.filter((item) => item.isActive)
  const totalValue = inventory.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="seller-overview">
      <div className="seller-profile-showcase">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {sellerProfile?.avatarPath ? (
                <img 
                  src={`${sellerProfile.avatarPath}?t=${Date.now()}`} 
                  alt={sellerProfile.displayName}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    borderRadius: "50%" 
                  }}
                />
              ) : (
                sellerProfile?.displayName ? sellerProfile.displayName.charAt(0).toUpperCase() : 'S'
              )}
            </div>
          </div>
          <div className="profile-details">
            <h2 className="shop-name">{sellerProfile?.displayName || t("seller.profile.title")}</h2>
            <div className="rating-section">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`star ${star <= Math.round(sellerProfile?.rating || 0) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-value">{(sellerProfile?.rating || 0).toFixed(1)}</span>
            </div>
            <p className="shop-description">{sellerProfile?.description || t("seller.overview.welcomeMessage")}</p>
          </div>
        </div>
      </div>

      <div className="seller-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-number">{inventory.length}</div>
          <div className="stat-label">{t("seller.overview.totalItems")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{activeItems.length}</div>
          <div className="stat-label">{t("seller.overview.activeListings")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-number">${totalValue.toFixed(2)}</div>
          <div className="stat-label">{t("seller.overview.totalValue")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-number">0</div>
          <div className="stat-label">{t("seller.overview.pendingOrders")}</div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>{t("seller.overview.quickActions")}</h3>
        <div className="action-buttons">
          <button 
            className="action-btn primary" 
            onClick={() => window.location.href = '/seller/inventory'}
          >
            📦 {t("seller.overview.manageInventory")}
          </button>
          <button 
            className="action-btn secondary" 
            onClick={() => window.location.href = '/seller/profile'}
          >
            👤 {t("seller.overview.editProfile")}
          </button>
        </div>
      </div>
    </div>
  )
}

export const SellerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery()
  const { data: sellerProfile, isLoading: isSellerLoading } = useGetCurrentSellerProfileQuery()

  const getCurrentSection = (): SellerSection => {
    const path = location.pathname.split("/seller/")[1] || "overview"
    return path as SellerSection
  }

  const [activeSection, setActiveSection] = useState<SellerSection>(getCurrentSection())

  const handleSectionChange = (section: SellerSection) => {
    setActiveSection(section)
    if (section === "overview") {
      navigate("/seller")
    } else {
      navigate(`/seller/${section}`)
    }
  }

  const isLoading = isUserLoading || isSellerLoading

  if (isLoading) {
    return (
      <div className="seller-dashboard">
        <div className="loading-spinner">
          <VinylSpinner size="large" />
          <p>Loading seller dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !sellerProfile) {
    return (
      <div className="seller-dashboard">
        <div className="error-message">
          <p>Access denied. Seller privileges required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-dashboard">
      <div className="seller-header">
        <div>
          <h1 className="seller-title">{t("seller.dashboard.title")}</h1>
          <p className="seller-subtitle">{t("seller.dashboard.subtitle")}</p>
        </div>
        <div>
          <p>{t("seller.dashboard.welcome", { name: user.firstName })}</p>
        </div>
      </div>

      <div className="seller-content">
        <div className="seller-sidebar">
          <div className="sidebar-section">
            <h3>{t("seller.dashboard.navigation")}</h3>
            <div className="nav-links">
              <button
                className={`nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => handleSectionChange("overview")}
              >
                📊 {t("seller.dashboard.overview")}
              </button>
              <button
                className={`nav-link ${activeSection === "inventory" ? "active" : ""}`}
                onClick={() => handleSectionChange("inventory")}
              >
                📦 {t("seller.dashboard.inventory")}
              </button>
              <button
                className={`nav-link ${activeSection === "orders" ? "active" : ""}`}
                onClick={() => handleSectionChange("orders")}
              >
                📋 Orders
              </button>
              <button
                className={`nav-link ${activeSection === "profile" ? "active" : ""}`}
                onClick={() => handleSectionChange("profile")}
              >
                👤 {t("seller.dashboard.profile")}
              </button>
              <button
                className={`nav-link ${activeSection === "reviews" ? "active" : ""}`}
                onClick={() => handleSectionChange("reviews")}
              >
                ⭐ {t("seller.dashboard.reviews")}
              </button>
            </div>
          </div>
        </div>

        <div className="seller-main">
          <Routes>
            <Route path="/" element={<SellerOverview sellerProfile={sellerProfile} />} />
            <Route path="/inventory" element={<SellerInventory />} />
            <Route path="/orders" element={<SellerOrders />} />
            <Route path="/profile" element={<SellerProfileManagement />} />
            <Route 
              path="/reviews" 
              element={
                <div>
                  <h2 className="section-title">{t("seller.reviews.title")}</h2>
                  <div className="no-reviews">
                    <p>{t("seller.reviews.noReviews")}</p>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
