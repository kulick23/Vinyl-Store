import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useBecomeSellerMutation } from "../../redux/seller/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import "./BecomeSellerModal.scss"

interface BecomeSellerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const BecomeSellerModal: React.FC<BecomeSellerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  const [becomeSeller, { isLoading }] = useBecomeSellerMutation()

  const [formData, setFormData] = useState({
    displayName: "",
    description: ""
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Direct API test function
  const testApiDirectly = async () => {
    console.log('=== DIRECT API TEST ===')
    try {
      const token = localStorage.getItem('accessToken')
      console.log('Token for direct test:', token ? 'Present' : 'Missing')
      
      const response = await fetch('/api/Seller/becomeSeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          displayName: "Direct Test Shop",
          description: "Direct test description"
        })
      })
      
      console.log('Direct API response status:', response.status)
      console.log('Direct API response headers:', Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log('Direct API response body:', responseText)
      
      if (!response.ok) {
        console.error('Direct API failed with status:', response.status)
      } else {
        console.log('Direct API succeeded!')
      }
    } catch (error) {
      console.error('Direct API test error:', error)
    }
    console.log('=== END DIRECT API TEST ===')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.displayName.trim()) {
      newErrors.displayName = t('seller.errors.shopNameRequired')
    }

    if (!formData.description.trim()) {
      newErrors.description = t('seller.errors.shopDescriptionRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const requestData = {
        DisplayName: formData.displayName.trim(),
        Description: formData.description.trim()
      }
      
      // Check authentication
      const token = localStorage.getItem('accessToken')
      console.log('Authentication token present:', !!token)
      console.log('Token length:', token?.length || 0)
      
      console.log('Sending becomeSeller request:', requestData)
      console.log('Expected endpoint: POST /api/Seller/becomeSeller')
      
      const result = await becomeSeller(requestData).unwrap()
      console.log('becomeSeller success result:', result)

      showSuccess(t('seller.shopCreated'))
      setFormData({ displayName: "", description: "" })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to become seller:', error)
      console.log('Full error object:', error)
      
      // More detailed error logging
      if (error && typeof error === 'object' && 'data' in error) {
        console.log('Error response data:', error.data)
      }
      if (error && typeof error === 'object' && 'status' in error) {
        console.log('Error status:', error.status)
      }
      
      showError(t('seller.errors.createFailed'))
    }
  }

  const handleClose = () => {
    setFormData({ displayName: "", description: "" })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('seller.becomeSeller')}</h2>
          <button className="modal-close" onClick={handleClose} disabled={isLoading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="seller-form">
          <div className="form-group">
            <label htmlFor="displayName">{t('seller.shopName')}</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder={t('seller.shopNamePlaceholder')}
              className={`form-input ${errors.displayName ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.displayName && (
              <span className="error-message">{errors.displayName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">{t('seller.shopDescription')}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('seller.shopDescriptionPlaceholder')}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows={4}
              disabled={isLoading}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={testApiDirectly}
              className="test-button"
              style={{ backgroundColor: '#ff9800', color: 'white', marginRight: '10px' }}
              disabled={isLoading}
            >
              Test API
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? <VinylSpinner size="small" /> : t('seller.createShop')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BecomeSellerModal 