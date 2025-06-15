import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ApprovalPage.scss';

type ConfirmationState = 'loading' | 'success' | 'error' | 'invalid';

export const ApprovalPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<ConfirmationState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setState('invalid');
        return;
      }

      try {
        const response = await fetch('/api/auth/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setState('success');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || t('approval.error.confirmationFailed'));
          setState('error');
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setErrorMessage(t('approval.error.networkError'));
        setState('error');
      }
    };

    confirmEmail();
  }, [searchParams, t]);

  const handleGoToMainPage = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setState('loading');
    // Re-trigger the confirmation
    const token = searchParams.get('token');
    if (token) {
      fetch('/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(response => {
          if (response.ok) {
            setState('success');
          } else {
            setState('error');
          }
        })
        .catch(() => {
          setState('error');
        });
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
        return (
          <>
            <h1 className="approval-title">
              {t('approval.success.title')}
            </h1>
            <p className="approval-message">
              {t('approval.success.message')}
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