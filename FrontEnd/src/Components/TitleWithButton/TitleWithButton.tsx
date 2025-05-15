import React from 'react';
import { useTranslation } from 'react-i18next';
import './TitleWithButton.scss';

const TitleWithButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="TitleWithButton">
      <h2 className="TitleWithButton__title">{t('titleWithButton.title')}</h2>
      <p className="TitleWithButton__description">
        {t('titleWithButton.description')}
      </p>
      <button className="TitleWithButton__button">
        {t('titleWithButton.button')}
      </button>
    </section>
  );
};

export default TitleWithButton;
