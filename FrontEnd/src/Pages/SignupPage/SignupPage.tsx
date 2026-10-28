import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  useRegisterMutation,
  useGoogleLoginMutation,
} from '../../redux/auth/api';
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
import './SignupPage.scss';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

export const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const { showInfo, showError } = useNotification();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
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

        showInfo('Successfully signed up with Google!');
        navigate('/');
      } catch (error: any) {
        console.error('Google signup error:', error);
        showError(error.data?.message || 'Google authentication failed');
      }
    },
    [googleLogin, dispatch, showInfo, showError, navigate]
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
            text: 'signup_with',
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

  const handleSupabaseGoogleLogin = async () => {
    setIsSupabaseLoading(true);

    try {
      const { error } = await getSupabaseClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Supabase Google signup error:', error);
      showError(error.message || 'Google authentication failed');
      setIsSupabaseLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('signup.errors.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('signup.errors.lastNameRequired');
    }

    if (!formData.email) {
      newErrors.email = t('signup.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('signup.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('signup.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('signup.errors.passwordTooShort');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('signup.errors.passwordMismatch');
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('signup.errors.agreeToTerms');
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
        const { error } = await getSupabaseClient().auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`,
            },
          },
        });

        if (error) throw error;
        navigate('/approval?email=' + encodeURIComponent(formData.email));
        return;
      }

      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Redirect to approval page after successful registration
      navigate('/approval?email=' + encodeURIComponent(formData.email));
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general:
          error.data?.message ||
          error.message ||
          t('signup.errors.registrationFailed'),
      });
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  return (
    <div className="signuppage">
      <div className="signup-container">
        <div className="vinyl-animation">
          <VinylSpinner size="large" />
        </div>

        <div className="signup-header">
          <h1 className="signup-title">{t('signup.title')}</h1>
          <p className="signup-subtitle">{t('signup.subtitle')}</p>
        </div>

        {errors.general && <div className="signup-error">{errors.general}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                {t('signup.firstNameLabel')}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={t('signup.firstNamePlaceholder')}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                disabled={isAuthLoading}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                {t('signup.lastNameLabel')}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={t('signup.lastNamePlaceholder')}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                disabled={isAuthLoading}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('signup.emailLabel')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('signup.emailPlaceholder')}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={isAuthLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('signup.passwordLabel')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('signup.passwordPlaceholder')}
              className={`form-input ${errors.password ? 'error' : ''}`}
              disabled={isAuthLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              {t('signup.confirmPasswordLabel')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t('signup.confirmPasswordPlaceholder')}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={isAuthLoading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                disabled={isAuthLoading}
              />
              <span className="checkbox-text">
                {t('signup.agreeToTerms')}{' '}
                <Link to="/policy" className="terms-link">
                  {t('signup.termsLink')}
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <span className="error-message">{errors.agreeToTerms}</span>
            )}
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={isAuthLoading}
          >
            {isLoading || isSupabaseLoading ? (
              <VinylSpinner size="small" />
            ) : (
              t('signup.signUpButton')
            )}
          </button>
        </form>

        <div className="signup-divider">
          <span>{t('signup.orContinueWith')}</span>
        </div>

        <div className="social-signup">
          {isSupabaseProvider ? (
            <button
              type="button"
              className="google-login-button"
              onClick={handleSupabaseGoogleLogin}
              disabled={isAuthLoading}
            >
              Continue with Google
            </button>
          ) : (
            <div
              ref={googleButtonRef}
              className="google-button-container"
              style={{
                opacity: isGoogleLoading ? 0.6 : 1,
                pointerEvents: isGoogleLoading ? 'none' : 'auto',
              }}
            />
          )}
          {(isGoogleLoading || isSupabaseLoading) && (
            <div className="google-loading">
              <VinylSpinner size="small" />
              <span>Signing up with Google...</span>
            </div>
          )}
        </div>

        <div className="login-link">
          {t('signup.haveAccount')}{' '}
          <Link to="/login">{t('signup.signInLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
