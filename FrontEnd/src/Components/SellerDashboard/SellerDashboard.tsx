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
    <div>
      <h2 className="section-title">{t("seller.overview.title")}</h2>
      <div className="seller-stats">
        <div className="stat-card">
          <div className="stat-number">{inventory.length}</div>
          <div className="stat-label">{t("seller.overview.totalItems")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeItems.length}</div>
          <div className="stat-label">{t("seller.overview.activeListings")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${totalValue.toFixed(2)}</div>
          <div className="stat-label">{t("seller.overview.totalValue")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">{t("seller.overview.pendingOrders")}</div>
        </div>
      </div>
      <div className="welcome-section">
        <h3>{t("seller.dashboard.welcome", { name: sellerProfile?.displayName || "Seller" })}</h3>
        <p>{t("seller.overview.welcomeMessage")}</p>
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
