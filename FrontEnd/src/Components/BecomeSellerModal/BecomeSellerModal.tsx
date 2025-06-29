"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useBecomeSellerMutation } from "../../redux/seller/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import "./BecomeSellerModal.scss"

interface BecomeSellerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const BecomeSellerModal: React.FC<BecomeSellerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    displayName: "",
    description: ""
  })
  const [becomeSeller, { isLoading }] = useBecomeSellerMutation()
  const { showSuccess, showError } = useNotification()

  // Debug authentication when modal opens
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('accessToken')
      console.log('=== SELLER MODAL DEBUG ===')
      console.log('Token exists:', !!token)
      console.log('Token length:', token?.length || 0)
      console.log('API Base URL:', import.meta.env.VITE_API_URL || 'Using proxy')
      console.log('========================')
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.displayName.trim()) {
      showError("Shop name is required")
      return
    }

    if (!formData.description.trim()) {
      showError("Shop description is required")
      return
    }

    try {
      console.log('=== SELLER CREATION ATTEMPT ===')
      console.log('Data being sent:', formData)
      console.log('Backend URL:', `${import.meta.env.VITE_API_URL || 'proxy'}/api/Seller/becomeSeller`)
      console.log('Token present:', !!localStorage.getItem('accessToken'))
      console.log('===========================')
      
      const result = await becomeSeller(formData).unwrap()
      console.log('Seller creation result:', result)
      
      showSuccess(t("seller.profile.createSuccess"))
      setFormData({ displayName: "", description: "" })
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('=== SELLER CREATION ERROR ===')
      console.error('Full error object:', error)
      console.error('Error status:', error.status)
      console.error('Error data:', error.data)
      console.error('Error message:', error.message)
      console.error('========================')
      
      // Handle specific error cases
      if (error.status === 401) {
        showError("Authentication required. Please log in again.")
      } else if (error.status === 400) {
        showError("Invalid data provided. Please check your input.")
      } else if (error.status === 409) {
        showError("You already have a seller profile.")
      } else if (error.status === 500) {
        showError("Server error. Please try again later.")
      } else if (error.status === 302) {
        // Backend sends redirect - treat as success for now
        console.log('Received redirect response - treating as success')
        showSuccess(t("seller.profile.createSuccess"))
        setFormData({ displayName: "", description: "" })
        onSuccess?.()
        onClose()
      } else if (error.data?.message) {
        showError(error.data.message)
      } else if (error.message) {
        showError(error.message)
      } else {
        showError(t("seller.profile.createError"))
      }
    }
  }

  const handleClose = () => {
    setFormData({ displayName: "", description: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="become-seller-modal-overlay" onClick={handleClose}>
      <div className="become-seller-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("seller.becomeSellerModal.title")}</h2>
          <p>{t("seller.becomeSellerModal.subtitle")}</p>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="displayName">
              {t("seller.becomeSellerModal.shopNameLabel")}
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder={t("seller.becomeSellerModal.shopNamePlaceholder")}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              {t("seller.becomeSellerModal.descriptionLabel")}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t("seller.becomeSellerModal.descriptionPlaceholder")}
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
              disabled={isLoading}
            >
              {t("seller.becomeSellerModal.cancelButton")}
            </button>
            <button
              type="submit"
              className="create-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <VinylSpinner size="small" />
              ) : (
                t("seller.becomeSellerModal.createButton")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BecomeSellerModal 