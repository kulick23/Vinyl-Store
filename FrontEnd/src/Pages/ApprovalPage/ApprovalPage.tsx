import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConfirmEmailMutation } from '../../redux/auth/api';
import './ApprovalPage.scss';

type ConfirmationState = 'loading' | 'success' | 'error' | 'invalid';

export const ApprovalPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [confirmEmail] = useConfirmEmailMutation();
  const [state, setState] = useState<ConfirmationState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleConfirmEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');
      
      // If there's no token but there's an email, user just registered
      if (!token && email) {
        setState('success');
        return;
      }
      
      if (!token) {
        setState('invalid');
        return;
      }

      try {
        await confirmEmail(token).unwrap();
        setState('success');
      } catch (error: any) {
        console.error('Email confirmation error:', error);
        setErrorMessage(error.data?.message || t('approval.error.confirmationFailed'));
        setState('error');
      }
    };

    handleConfirmEmail();
  }, [searchParams, t, confirmEmail]);

  const handleGoToMainPage = () => {
    navigate('/');
  };

  const handleRetry = async () => {
    setState('loading');
    const token = searchParams.get('token');
    
    if (token) {
      try {
        await confirmEmail(token).unwrap();
        setState('success');
      } catch (error: any) {
        console.error('Email confirmation retry error:', error);
        setErrorMessage(error.data?.message || t('approval.error.confirmationFailed'));
        setState('error');
      }
    }
  };

  const renderIcon = () => {
    if (state === 'loading') {
      return (
        <div className="approval-icon loading">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="40" 
              cy="40" 
              r="36" 
              stroke="var(--orange-color)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="56.5"
              className="loading-spinner"
            />
          </svg>
        </div>
      );
    }

    if (state === 'success') {
      return (
        <div className="approval-icon success">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="40" 
              cy="40" 
              r="40" 
              fill="var(--orange-color)"
            />
            <path
              d="M25 40L35 50L55 30"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }

    // Error or invalid state
    return (
      <div className="approval-icon error">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="40" 
            cy="40" 
            r="40" 
            fill="#e74c3c"
          />
          <path
            d="M30 30L50 50M50 30L30 50"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <h1 className="approval-title">
              {t('approval.loading.title')}
            </h1>
            <p className="approval-message">
              {t('approval.loading.message')}
            </p>
          </>
        );

      case 'success':
        const email = searchParams.get('email');
        const token = searchParams.get('token');
        
        return (
          <>
            <h1 className="approval-title">
              {token ? t('approval.success.title') : t('approval.registration.title')}
            </h1>
            <p className="approval-message">
              {token 
                ? t('approval.success.message') 
                : t('approval.registration.message', { email: email || 'your email' })
              }
            </p>
            <button 
              className="approval-button"
              onClick={handleGoToMainPage}
            >
              {t('approval.goToMainPage')}
            </button>
          </>
        );

      case 'error':
        return (
          <>
            <h1 className="approval-title error">
              {t('approval.error.title')}
            </h1>
            <p className="approval-message">
              {errorMessage || t('approval.error.message')}
            </p>
            <div className="approval-buttons">
              <button 
                className="approval-button retry"
                onClick={handleRetry}
              >
                {t('approval.error.retry')}
              </button>
              <button 
                className="approval-button secondary"
                onClick={handleGoToMainPage}
              >
                {t('approval.goToMainPage')}
              </button>
            </div>
          </>
        );

      case 'invalid':
        return (
          <>
            <h1 className="approval-title error">
              {t('approval.invalid.title')}
            </h1>
            <p className="approval-message">
              {t('approval.invalid.message')}
            </p>
            <button 
              className="approval-button secondary"
              onClick={handleGoToMainPage}
            >
              {t('approval.goToMainPage')}
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section className="approval-page">
      <div className="approval-container">
        <div className="approval-content">
          {renderIcon()}
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default ApprovalPage; 