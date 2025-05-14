import React from 'react';
import './cover.scss';
import coverImg from '../../Assets/img/cover.png';
import { useTranslation } from 'react-i18next';

export const Cover: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="cover">
      <div className="cover__container">
        <h1>{t('cover.title')}</h1>
        <p>{t('cover.subtitle')}</p>
        <div className="cover__container--buttons">
          <button>{t('buttons.shopNow')}</button>
          <button className="button-white">{t('buttons.signIn')}</button>
        </div>
      </div>
      <img src={coverImg} alt="Cover" className="cover__img" />
    </section>
  );
};

export default Cover;
