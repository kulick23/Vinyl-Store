import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useForgotPasswordMutation } from "../../redux/auth/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"
import "./ForgotPasswordPage.scss"

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const { showSuccess, showError } = useNotification()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email.trim()) {
      setErrors({ email: t('forgotPassword.errors.emailRequired') })
      return
    }

    if (!validateEmail(email)) {
      setErrors({ email: t('forgotPassword.errors.emailInvalid') })
      return
    }

    try {
      await forgotPassword({ email }).unwrap()
      setIsEmailSent(true)
      showSuccess(t('forgotPassword.emailSent'))
    } catch (error: any) {
      console.error('Forgot password error:', error)
      showError(t('forgotPassword.errors.sendFailed'))
    }
  }

  if (isEmailSent) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-content">
            <div className="success-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="var(--orange-color)" fillOpacity="0.1"/>
                <path d="m9 12 2 2 4-4" stroke="var(--orange-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 className="forgot-password-title">{t('forgotPassword.emailSent')}</h1>
            <p className="forgot-password-message">{t('forgotPassword.emailSentMessage')}</p>
            
            <Link to="/login" className="back-to-login-button">
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <h1 className="forgot-password-title">{t('forgotPassword.title')}</h1>
          <p className="forgot-password-subtitle">{t('forgotPassword.subtitle')}</p>
          
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('forgotPassword.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('forgotPassword.emailPlaceholder')}
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                disabled={isLoading}
                autoFocus
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="forgot-password-submit-button"
            >
              {isLoading ? (
                <>
                  <VinylSpinner size="small" />
                  <span>{t('forgotPassword.sendResetLink')}</span>
                </>
              ) : (
                t('forgotPassword.sendResetLink')
              )}
            </button>
          </form>
          
          <Link to="/login" className="back-to-login-link">
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage 