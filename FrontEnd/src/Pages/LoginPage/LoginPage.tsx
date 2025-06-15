import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../redux/auth/api';
import VinylSpinner from '../../Components/VinylSpinner/VinylSpinner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/auth/authSlice';
import { useNotification } from '../../hooks/useNotification';
import './LoginPage.scss';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { showInfo } = useNotification();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = t('login.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('login.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('login.errors.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors({});

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        general: error.data?.message || t('login.errors.loginFailed'),
      });
    }
  };

  const handleGoogleLogin = () => {
    // Here you would implement Google OAuth login
    console.log('Google login clicked');
    showInfo('notifications.googleLoginDemo');
  };

  return (
    <div className="loginpage">
      <div className="login-container">
        <div className="vinyl-animation">
          <VinylSpinner size="large" />
        </div>

        <div className="login-header">
          <h1 className="login-title">{t('login.title')}</h1>
          <p className="login-subtitle">{t('login.subtitle')}</p>
        </div>

        {errors.general && <div className="login-error">{errors.general}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('login.emailLabel')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('login.emailPlaceholder')}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('login.passwordLabel')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('login.passwordPlaceholder')}
              className={`form-input ${errors.password ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {t('login.rememberMe')}
            </label>
            <Link to="/forgot-password" className="forgot-password">
              {t('login.forgotPassword')}
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <VinylSpinner size="small" />
            ) : (
              t('login.signInButton')
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>{t('login.orContinueWith')}</span>
        </div>

        <div className="social-login">
          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {t('login.googleSignIn')}
          </button>
        </div>

        <div className="signup-link">
          {t('login.noAccount')}{' '}
          <Link to="/signup">{t('login.signUpLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
