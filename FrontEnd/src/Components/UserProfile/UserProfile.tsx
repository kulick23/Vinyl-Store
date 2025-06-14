"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useGetCartQuery } from "../../redux/cart/api"
import { useGetOrdersQuery } from "../../redux/orders/api"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import "./UserProfile.scss"

type ProfileSection = "overview" | "orders" | "cart" | "settings"

export const UserProfile: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<ProfileSection>("overview")

  const { data: user, isLoading } = useGetCurrentUserQuery()
  const { data: cart = [] } = useGetCartQuery()
  const { data: orders = [] } = useGetOrdersQuery()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("accessExpiresAt")
    navigate("/")
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="user-profile">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <VinylSpinner size="large" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div>
            <h2 className="section-title">Account Overview</h2>
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-number">{orders.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{cart.length}</div>
                <div className="stat-label">Items in Cart</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user.roles.length}</div>
                <div className="stat-label">Active Roles</div>
              </div>
            </div>
            <div>
              <h3>Account Information</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "Not provided"}
              </p>
              <p>
                <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Last login:</strong> {new Date(user.lastLoginAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )
      case "orders":
        return (
          <div>
            <h2 className="section-title">My Orders</h2>
            {orders.length === 0 ? (
              <p>
                No orders yet. <Link to="/shop">Start shopping!</Link>
              </p>
            ) : (
              <div>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      padding: "20px",
                      marginBottom: "16px",
                      backgroundColor: "var(--cover-color)",
                      borderRadius: "8px",
                    }}
                  >
                    <h4>Order #{order.id}</h4>
                    <p>Items: {order.items.length}</p>
                    <p>Shipping: {order.shippingAddress}</p>
                    <p>Payment: {order.paymentMethod}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case "cart":
        return (
          <div>
            <h2 className="section-title">My Cart</h2>
            {cart.length === 0 ? (
              <p>
                Your cart is empty. <Link to="/shop">Start shopping!</Link>
              </p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "20px",
                      marginBottom: "16px",
                      backgroundColor: "var(--cover-color)",
                      borderRadius: "8px",
                    }}
                  >
                    <p>Item ID: {item.inventoryItemId}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case "settings":
        return (
          <div>
            <h2 className="section-title">Account Settings</h2>
            <p>Settings functionality coming soon...</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <h1 className="profile-name">
            {user.firstName} {user.lastName}
          </h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-roles">
            {user.roles.map((role) => (
              <span key={role} className="role-badge">
                {role}
              </span>
            ))}
          </div>
        </div>
        <div className="profile-actions">
          {user.roles.includes("Admin") && (
            <Link to="/admin" className="button">
              Admin Panel
            </Link>
          )}
          {user.roles.includes("Seller") && (
            <Link to="/seller" className="button">
              Seller Dashboard
            </Link>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="sidebar-section">
            <h3>Navigation</h3>
            <div className="nav-links">
              <button
                className={`nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => setActiveSection("overview")}
              >
                Overview
              </button>
              <button
                className={`nav-link ${activeSection === "orders" ? "active" : ""}`}
                onClick={() => setActiveSection("orders")}
              >
                My Orders
              </button>
              <button
                className={`nav-link ${activeSection === "cart" ? "active" : ""}`}
                onClick={() => setActiveSection("cart")}
              >
                My Cart
              </button>
              <button
                className={`nav-link ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => setActiveSection("settings")}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="profile-main">{renderContent()}</div>
      </div>
    </div>
  )
}

export default UserProfile
