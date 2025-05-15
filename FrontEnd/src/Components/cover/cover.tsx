import React from 'react';
import './cover.scss';
import coverImg from '../../Assets/img/cover.png';
import coverAboutImg from '../../Assets/img/cover-about.png';
import { useTranslation } from 'react-i18next';

interface CoverProps {
  variant?: 'home' | 'about';
}

export const Cover: React.FC<CoverProps> = ({ variant = 'home' }) => {
  const { t } = useTranslation();

  const titleKey = variant === 'about' ? 'cover.aboutTitle' : 'cover.title';
  const subtitleKey =
    variant === 'about' ? 'cover.aboutSubtitle' : 'cover.subtitle';
  const imgSrc = variant === 'about' ? coverAboutImg : coverImg;

  return (
    <section className="cover">
      <div className="cover__container">
        <h1>{t(titleKey)}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: t(subtitleKey),
          }}
        />
        {variant === 'home' && (
          <div className="cover__container--buttons">
            <button>{t('buttons.shopNow')}</button>
            <button className="button-white">{t('buttons.signIn')}</button>
          </div>
        )}
      </div>

      <img
        src={imgSrc}
        alt={variant === 'about' ? 'About cover' : 'Home cover'}
        className={variant === 'about' ? 'cover__Aboutimg' : 'cover__img'}
      />
    </section>
  );
};

export default Cover;
