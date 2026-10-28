import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useGoogleLoginMutation } from '../../redux/auth/api';
import VinylSpinner from '../../Components/VinylSpinner/VinylSpinner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/auth/authSlice';
import { useNotification } from '../../hooks/useNotification';
import { isSupabaseProvider } from '../../config/dataProvider';
import { getSupabaseClient } from '../../lib/supabase';
import {
  loadGoogleScript,
  initializeGoogleAuth,
  renderGoogleButton,
  GOOGLE_CLIENT_ID,
  type GoogleUser,
} from '../../utils/googleAuth';
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
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const { showInfo, showError } = useNotification();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const isAuthLoading = isLoading || isGoogleLoading || isSupabaseLoading;

  const handleGoogleResponse = useCallback(
    async (response: GoogleUser) => {
      try {
        const result = await googleLogin({
          idToken: response.credential,
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

        showInfo('Successfully logged in with Google!');
        navigate('/');
      } catch (error: any) {
        console.error('Google login error:', error);
        showError(error.data?.message || 'Google authentication failed');
      }
    },
    [googleLogin, dispatch, formData.rememberMe, showInfo, showError, navigate]
  );

  useEffect(() => {
    if (isSupabaseProvider) return;

    const initGoogleAuth = async () => {
      try {
        await loadGoogleScript();

        initializeGoogleAuth({
          clientId: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        if (googleButtonRef.current) {
          renderGoogleButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: '300',
          });
        }
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        showError('Failed to load Google authentication');
      }
    };

    initGoogleAuth();
  }, [handleGoogleResponse, showError]);

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
      if (isSupabaseProvider) {
        setIsSupabaseLoading(true);
        const { data, error } =
          await getSupabaseClient().auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

        if (error) throw error;
        if (!data.session)
          throw new Error('No authentication session returned');

        dispatch(
          setCredentials({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
          })
        );
        navigate('/');
        return;
      }

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
        general:
          error.data?.message || error.message || t('login.errors.loginFailed'),
      });
    } finally {
      setIsSupabaseLoading(false);
    }
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
              disabled={isAuthLoading}
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
              disabled={isAuthLoading}
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
                disabled={isAuthLoading}
              />
              {t('login.rememberMe')}
            </label>
            <Link to="/forgot-password" className="forgot-password">
              {t('login.forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isAuthLoading}
          >
            {isLoading || isSupabaseLoading ? (
              <VinylSpinner size="small" />
            ) : (
              t('login.signInButton')
            )}
          </button>
        </form>

        {!isSupabaseProvider && (
          <>
            <div className="login-divider">
              <span>{t('login.orContinueWith')}</span>
            </div>

            <div className="social-login">
              <div
                ref={googleButtonRef}
                className="google-button-container"
                style={{
                  opacity: isGoogleLoading ? 0.6 : 1,
                  pointerEvents: isGoogleLoading ? 'none' : 'auto',
                }}
              />
              {isGoogleLoading && (
                <div className="google-loading">
                  <VinylSpinner size="small" />
                  <span>Authenticating with Google...</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="signup-link">
          {t('login.noAccount')}{' '}
          <Link to="/signup">{t('login.signUpLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
