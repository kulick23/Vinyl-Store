import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './ApprovalPage.scss';

export const ApprovalPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToMainPage = () => {
    navigate('/');
  };

  return (
    <section className="approval-page">
      <div className="approval-container">
        <div className="approval-content">
          <div className="approval-icon">
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
          
          <h1 className="approval-title">
            {t('approval.title')}
          </h1>
          
          <p className="approval-message">
            {t('approval.message')}
          </p>
          
          <button 
            className="approval-button"
            onClick={handleGoToMainPage}
          >
            {t('approval.goToMainPage')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ApprovalPage; 