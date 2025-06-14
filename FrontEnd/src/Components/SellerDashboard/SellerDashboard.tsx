"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useGetInventoryQuery } from "../../redux/inventory/api"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import SellerInventory from "./SellerInventory"
import SellerOrders from "./SellerOrders"
import "./SellerDashboard.scss"

type SellerSection = "overview" | "inventory" | "orders" | "profile"

const SellerOverview: React.FC = () => {
  const { data: inventory = [] } = useGetInventoryQuery()

  const activeItems = inventory.filter((item) => item.isActive)
  const totalValue = inventory.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      <h2 className="section-title">Seller Overview</h2>
      <div className="seller-stats">
        <div className="stat-card">
          <div className="stat-number">{inventory.length}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeItems.length}</div>
          <div className="stat-label">Active Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${totalValue.toFixed(2)}</div>
          <div className="stat-label">Total Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">Pending Orders</div>
        </div>
      </div>
      <div>
        <h3>Welcome to your seller dashboard!</h3>
        <p>Here you can manage your inventory, track orders, and update your seller profile.</p>
        <p>Use the sidebar to navigate between different sections of your dashboard.</p>
      </div>
    </div>
  )
}

export const SellerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user, isLoading } = useGetCurrentUserQuery()

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

  if (!user || !user.roles.includes("Seller")) {
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
          <h1 className="seller-title">Seller Dashboard</h1>
          <p className="seller-subtitle">Manage your vinyl inventory and sales</p>
        </div>
        <div>
          <p>Welcome, {user.firstName}!</p>
        </div>
      </div>

      <div className="seller-content">
        <div className="seller-sidebar">
          <div className="sidebar-section">
            <h3>Navigation</h3>
            <div className="nav-links">
              <button
                className={`nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => handleSectionChange("overview")}
              >
                📊 Overview
              </button>
              <button
                className={`nav-link ${activeSection === "inventory" ? "active" : ""}`}
                onClick={() => handleSectionChange("inventory")}
              >
                📦 Inventory
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
                👤 Profile
              </button>
            </div>
          </div>
        </div>

        <div className="seller-main">
          <Routes>
            <Route path="/" element={<SellerOverview />} />
            <Route path="/inventory" element={<SellerInventory />} />
            <Route path="/orders" element={<SellerOrders />} />
            <Route
              path="/profile"
              element={
                <div>
                  <h2 className="section-title">Seller Profile</h2>
                  <p>Profile management coming soon...</p>
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
