"use client"

import type React from "react"
import { useTranslation } from "react-i18next"
import { useGetCurrentSellerProfileQuery, useUploadSellerAvatarMutation } from "../../redux/seller/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import "./SellerProfileManagement.scss"

export const SellerProfileManagement: React.FC = () => {
  const { t } = useTranslation()
  const { data: sellerProfile, isLoading } = useGetCurrentSellerProfileQuery()
  const [uploadAvatar, { isLoading: isUploading }] = useUploadSellerAvatarMutation()
  const { showSuccess, showError } = useNotification()

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
      const result = await uploadAvatar(file).unwrap()
      console.log('Avatar upload result:', result)
      showSuccess(t("seller.profile.avatarUploadSuccess"))
      
      // Clear the file input to allow re-uploading the same file
      const input = event.target
      input.value = ''
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      showError(t("seller.profile.avatarUploadError"))
    }
  }

  if (isLoading) {
    return (
      <div className="seller-profile-management">
        <VinylSpinner size="large" />
      </div>
    )
  }

  if (!sellerProfile) {
    return (
      <div className="seller-profile-management">
        <div className="error-message">
          <p>Seller profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-profile-management">
      <h2 className="section-title">{t("seller.profile.title")}</h2>
      
      <div className="profile-sections">
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-picture-section">
              <div className="profile-picture-placeholder">
                {sellerProfile.avatarPath ? (
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
                  sellerProfile.displayName.charAt(0).toUpperCase()
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
                disabled={isUploading}
              />
              <button 
                className="upload-picture-btn"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? <VinylSpinner size="small" /> : t("seller.profile.uploadPicture")}
              </button>
            </div>
            <div className="profile-info">
              <div className="rating-section">
                <span className="rating-label">{t("seller.profile.rating")}:</span>
                <div className="rating-display">
                  <span className="rating-value">{sellerProfile.rating.toFixed(1)}</span>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${star <= Math.round(sellerProfile.rating) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Shop Information</h3>
            <p className="info-note">
              Contact admin to update shop information
            </p>
          </div>

          <div className="profile-display">
            <div className="info-item">
              <span className="info-label">{t("seller.profile.displayName")}:</span>
              <span className="info-value">{sellerProfile.displayName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t("seller.profile.description")}:</span>
              <span className="info-value">{sellerProfile.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProfileManagement 