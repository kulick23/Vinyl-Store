import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './TitleWithButton.scss';

export interface TitleWithButtonProps {
  variant?: 'about' | 'contact';
}

const TitleWithButton: React.FC<TitleWithButtonProps> = ({
  variant = 'about',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/shop');
  };

  const titleKey =
    variant === 'contact'
      ? 'titleWithButton.contactTitle'
      : 'titleWithButton.aboutTitle';
  const descKey =
    variant === 'contact'
      ? 'titleWithButton.contactDescription'
      : 'titleWithButton.aboutDescription';

  return (
    <section className="TitleWithButton">
      <h2 className="TitleWithButton__title">{t(titleKey)}</h2>
      <p className="TitleWithButton__description">{t(descKey)}</p>
      {variant === 'about' && (
        <button className="TitleWithButton__button" onClick={handleButtonClick}>
          {t('titleWithButton.button')}
        </button>
      )}
    </section>
  );
};

export default TitleWithButton;
