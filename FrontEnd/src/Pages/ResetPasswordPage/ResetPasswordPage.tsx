import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useResetPasswordMutation } from "../../redux/auth/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"
import "./ResetPasswordPage.scss"

export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    if (!token) {
      showError(t('resetPassword.errors.invalidToken'))
      navigate('/login')
    }
  }, [token, navigate, showError, t])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.password.trim()) {
      newErrors.password = t('resetPassword.errors.passwordRequired')
    } else if (formData.password.length < 8) {
      newErrors.password = t('resetPassword.errors.passwordTooShort')
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('resetPassword.errors.passwordRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('resetPassword.errors.passwordMismatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !token) {
      return
    }

    try {
      await resetPassword({ 
        token, 
        newPassword: formData.password 
      }).unwrap()
      
      setIsSuccess(true)
      showSuccess(t('resetPassword.success'))
    } catch (error: any) {
      console.error('Reset password error:', error)
      if (error.status === 400) {
        showError(t('resetPassword.errors.invalidToken'))
      } else {
        showError(t('resetPassword.errors.resetFailed'))
      }
    }
  }

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-content">
            <div className="success-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="var(--orange-color)" fillOpacity="0.1"/>
                <path d="m9 12 2 2 4-4" stroke="var(--orange-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 className="reset-password-title">{t('resetPassword.success')}</h1>
            <p className="reset-password-message">{t('resetPassword.successMessage')}</p>
            
            <Link to="/login" className="back-to-login-button">
              {t('resetPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-content">
          <h1 className="reset-password-title">{t('resetPassword.title')}</h1>
          <p className="reset-password-subtitle">{t('resetPassword.subtitle')}</p>
          
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t('resetPassword.passwordLabel')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('resetPassword.passwordPlaceholder')}
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                disabled={isLoading}
                autoFocus
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                {t('resetPassword.confirmPasswordLabel')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="reset-password-submit-button"
            >
              {isLoading ? (
                <>
                  <VinylSpinner size="small" />
                  <span>{t('resetPassword.resetPassword')}</span>
                </>
              ) : (
                t('resetPassword.resetPassword')
              )}
            </button>
          </form>
          
          <Link to="/login" className="back-to-login-link">
            {t('resetPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage 