"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { 
  useGetCurrentUserQuery, 
  useEditProfileMutation, 
  useUploadUserAvatarMutation
} from "../../redux/auth/api"
import type { User } from "../../redux/auth/types"
import { clearCredentials } from "../../redux/auth/authSlice"
import { useGetCartQuery } from "../../redux/cart/api"
import { useGetOrdersQuery } from "../../redux/orders/api"
import type { OrderDto } from "../../redux/orders/types"
import { useGetCurrentSellerProfileQuery } from "../../redux/seller/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import { BecomeSellerModal } from "../BecomeSellerModal/BecomeSellerModal"
import i18n from "../../i18n"
import "./UserProfile.scss"

type ProfileSection = "overview" | "orders" | "cart" | "settings"

export const UserProfile: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeSection, setActiveSection] = useState<ProfileSection>("overview")
  const [isBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  })

  const { data: user, isLoading } = useGetCurrentUserQuery()
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !user,
  })
  const { data: orders = [] } = useGetOrdersQuery(undefined, {
    skip: !user,
  })
  const { data: sellerProfile, refetch: refetchSellerProfile } = useGetCurrentSellerProfileQuery(undefined, {
    skip: !user,
  })
  const [editProfile, { isLoading: isUpdating }] = useEditProfileMutation()
  const [uploadUserAvatar, { isLoading: isUploadingAvatar }] = useUploadUserAvatarMutation()
  const { showSuccess, showError } = useNotification()

  // Get cart items from CartDto structure
  const cart = cartData?.items || []

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || ""
      })
    }
  }, [user])

  const handleLogout = () => {
    dispatch(clearCredentials())
    navigate("/")
    window.location.reload()
  }

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      // Prepare the complete profile data as expected by backend (CustomerUpdateDto)
      const updateData: Record<string, string> = {
        email: user?.email || "", // Backend requires email
        firstName: formData.firstName.trim() || user?.firstName || "",
        lastName: formData.lastName.trim() || user?.lastName || "",
        phone: formData.phone.trim() || user?.phone || ""
      }
      
      // Validate required fields
      if (!updateData.email) {
        showError("Email is required.")
        return
      }
      
      if (!updateData.firstName) {
        showError("First name is required.")
        return
      }
      
      if (!updateData.lastName) {
        showError("Last name is required.")
        return
      }

      console.log('Sending profile update:', updateData)
      await editProfile(updateData).unwrap()
      showSuccess("Profile updated successfully!")
    } catch (error) {
      console.error('Failed to update profile:', error)
      showError("Failed to update profile. Please check your input and try again.")
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image must be smaller than 5MB')
      return
    }

    try {
      const result = await uploadUserAvatar(file).unwrap()
      console.log('User avatar upload result:', result)
      showSuccess("Profile picture updated successfully!")
      
      // Clear the file input
      const input = event.target
      input.value = ''
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      showError("Failed to upload profile picture. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="user-profile">
        <div className="loading-container">
          <VinylSpinner size="large" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Helper function to get user roles as array for backward compatibility
  const getUserRoles = () => {
    if (user.role) {
      // If user has a seller profile, show "Seller" instead of "User"
      if (user.role === 'User' && sellerProfile) {
        return ['Seller']
      }
      return [user.role]
    }
    // Default fallback - check if user has seller profile
    return sellerProfile ? ['Seller'] : ['User']
  }

  const userRoles = getUserRoles()

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="overview-content">
            <h2 className="section-title">{t('profile.accountOverview')}</h2>
            
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-number">{orders?.length || 0}</div>
                <div className="stat-label">{t('profile.totalOrders')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{cart?.length || 0}</div>
                <div className="stat-label">{t('profile.itemsInCart')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userRoles.length}</div>
                <div className="stat-label">{t('profile.activeRoles')}</div>
              </div>
            </div>

            <div className="info-sections">
              <div className="info-card">
                <h3>{t('profile.personalInformation')}</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">{t('profile.firstName')}:</span>
                    <span className="info-value">{user.firstName || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('profile.lastName')}:</span>
                    <span className="info-value">{user.lastName || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('profile.email')}:</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('profile.phone')}:</span>
                    <span className="info-value">{user.phone || t('profile.notProvided')}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>{t('profile.accountStatus')}</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">{t('profile.memberSince')}:</span>
                    <span className="info-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('profile.lastLogin')}:</span>
                    <span className="info-value">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Status:</span>
                    <div className="email-status-container">
                      <span className={`info-value status-badge ${user.isEmailConfirmed ? 'confirmed' : 'pending'}`}>
                        {user.isEmailConfirmed ? '✅ ' + t('profile.emailConfirmed') : '❌ ' + t('profile.emailNotConfirmed')}
                      </span>
                      {!user.isEmailConfirmed && (
                        <button 
                          className="resend-confirmation-btn"
                          onClick={() => showSuccess("Confirmation email sent! Please check your inbox.")}
                        >
                          Resend Confirmation
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('profile.roles')}:</span>
                    <div className="roles-container">
                      {userRoles.map((role) => (
                        <span key={role} className="role-badge">{role}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "orders":
        return (
          <div className="orders-content">
            <h2 className="section-title">{t('profile.orders')}</h2>
            {!orders || orders.length === 0 ? (
              <div className="empty-state">
                <p>{t('profile.noOrders')} <Link to="/shop" className="link">{t('profile.startShopping')}</Link></p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((order: OrderDto) => (
                  <div key={order.orderId} className="order-card">
                    <div className="order-header">
                      <h4>{t('profile.orderNumber', { number: order.orderId })}</h4>
                      <span className="order-total">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="order-meta">
                      <p><strong>{t('profile.orderDate')}:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                      <p><strong>{t('profile.orderItems')}:</strong> {order.items?.length || 0} item(s)</p>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="order-items">
                        <h5>{t('profile.items')}:</h5>
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-details">
                              <span className="item-title">{item.title}</span>
                              <span className="item-quantity">x{item.quantity}</span>
                            </div>
                            <div className="item-pricing">
                              <span className="item-unit-price">${item.unitPrice.toFixed(2)}</span>
                              <span className="item-subtotal">${item.subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "cart":
        return (
          <div className="cart-content">
            <h2 className="section-title">{t('profile.cart')}</h2>
            {!cart || cart.length === 0 ? (
              <div className="empty-state">
                <p>{t('profile.cartEmpty')} <Link to="/shop" className="link">{t('profile.startShopping')}</Link></p>
              </div>
            ) : (
              <div className="cart-grid">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="cart-item-card">
                    <p><strong>{t('profile.releaseTitle')}:</strong> {item.releaseTitle}</p>
                    <p><strong>{t('profile.quantity')}:</strong> {item.quantity}</p>
                    <p><strong>{t('profile.unitPrice')}:</strong> ${item.unitPrice}</p>
                    <p><strong>{t('profile.lineTotal')}:</strong> ${item.lineTotal}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "settings":
        return (
          <div className="settings-content">
            <h2 className="section-title">{t('profile.settings')}</h2>
            
            <div className="settings-sections">
              <div className="settings-section">
                <h3>Profile Information</h3>
                <div className="profile-edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">{t('profile.firstName')}</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">{t('profile.lastName')}</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">{t('profile.phone')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="save-button"
                    >
                      {isUpdating ? <VinylSpinner size="small" /> : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Profile Picture</h3>
                <div className="avatar-settings">
                  <div className="current-avatar">
                    <div className="avatar-display">
                      {user.avatarPath ? (
                        <img 
                          src={`${user.avatarPath}?t=${Date.now()}`} 
                          alt={`${user.firstName} ${user.lastName}`}
                          style={{ 
                            width: "100px", 
                            height: "100px", 
                            objectFit: "cover", 
                            borderRadius: "50%" 
                          }}
                        />
                      ) : sellerProfile?.avatarPath ? (
                        <img 
                          src={`${sellerProfile.avatarPath}?t=${Date.now()}`} 
                          alt={`${user.firstName} ${user.lastName}`}
                          style={{ 
                            width: "100px", 
                            height: "100px", 
                            objectFit: "cover", 
                            borderRadius: "50%" 
                          }}
                        />
                      ) : (
                        <div className="avatar-placeholder-large">
                          {user.firstName?.charAt(0) || '?'}{user.lastName?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="avatar-actions">
                    <input
                      type="file"
                      id="settings-avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      style={{ display: "none" }}
                      disabled={isUploadingAvatar}
                    />
                    <button 
                      className="upload-avatar-button"
                      onClick={() => document.getElementById('settings-avatar-upload')?.click()}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? <VinylSpinner size="small" /> : "Change Picture"}
                    </button>
                    <p className="upload-info">
                      Upload a new profile picture (max 5MB, JPEG/PNG only)
                    </p>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="preferences-content">
                  <div className="preference-item">
                    <label>Language</label>
                    <div className="language-buttons">
                      <button 
                        onClick={() => changeLanguage('en')}
                        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => changeLanguage('ru')}
                        className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}
                      >
                        Русский
                      </button>
                    </div>
                  </div>
                  
                  <div className="preference-item">
                    <label>Theme</label>
                    <button onClick={toggleTheme} className="theme-toggle-btn">
                      Toggle Dark/Light Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user.avatarPath ? (
                <img 
                  src={`${user.avatarPath}?t=${Date.now()}`} 
                  alt={`${user.firstName} ${user.lastName}`}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    borderRadius: "50%" 
                  }}
                />
              ) : sellerProfile?.avatarPath ? (
                <img 
                  src={`${sellerProfile.avatarPath}?t=${Date.now()}`} 
                  alt={`${user.firstName} ${user.lastName}`}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    borderRadius: "50%" 
                  }}
                />
              ) : (
                <>
                  {user.firstName?.charAt(0) || '?'}{user.lastName?.charAt(0) || '?'}
                </>
              )}
            </div>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {user.firstName || ''} {user.lastName || ''}
            </h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-roles">
              {userRoles.map((role) => (
                <span key={role} className="role-badge">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="profile-actions">
          {userRoles.includes("Admin") && (
            <Link to="/admin" className="action-button admin-button">
              {t('profile.adminPanel')}
            </Link>
          )}
          {sellerProfile ? (
            <Link to="/seller" className="action-button seller-button">
              {t('profile.sellerDashboard')}
            </Link>
          ) : (
            <button 
              onClick={() => setIsBecomeSellerModalOpen(true)} 
              className="action-button seller-button"
            >
              {t('profile.becomeSeller')}
            </button>
          )}
          <button onClick={handleLogout} className="action-button logout-button">
            {t('profile.logout')}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="sidebar-section">
            <h3>{t('profile.navigation')}</h3>
            <div className="nav-links">
              <button
                className={`nav-link ${activeSection === "overview" ? "active" : ""}`}
                onClick={() => setActiveSection("overview")}
              >
                <span className="nav-icon">📊</span>
                {t('profile.overview')}
              </button>
              <button
                className={`nav-link ${activeSection === "orders" ? "active" : ""}`}
                onClick={() => setActiveSection("orders")}
              >
                <span className="nav-icon">📦</span>
                {t('profile.orders')}
              </button>
              <button
                className={`nav-link ${activeSection === "cart" ? "active" : ""}`}
                onClick={() => setActiveSection("cart")}
              >
                <span className="nav-icon">🛒</span>
                {t('profile.cart')}
              </button>
              <button
                className={`nav-link ${activeSection === "settings" ? "active" : ""}`}
                onClick={() => setActiveSection("settings")}
              >
                <span className="nav-icon">⚙️</span>
                {t('profile.settings')}
              </button>
            </div>
          </div>
        </div>

        <div className="profile-main">{renderContent()}</div>
      </div>

      <BecomeSellerModal
        isOpen={isBecomeSellerModalOpen}
        onClose={() => setIsBecomeSellerModalOpen(false)}
        onSuccess={() => {
          refetchSellerProfile()
        }}
      />
    </div>
  )
}

export default UserProfile
