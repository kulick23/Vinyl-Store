import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './collections.scss';

import jazzImg from '../../Assets/img/jazz.png';
import rockImg from '../../Assets/img/rock.png';
import modernImg from '../../Assets/img/modern.png';

interface CollectionItem {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export const Collections: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/shop');
  };

  const items: CollectionItem[] = [
    {
      src: jazzImg,
      alt: t('collections.jazzTitle'),
      title: t('collections.jazzTitle'),
      description: t('collections.jazzDescription'),
    },
    {
      src: rockImg,
      alt: t('collections.rockTitle'),
      title: t('collections.rockTitle'),
      description: t('collections.rockDescription'),
    },
    {
      src: modernImg,
      alt: t('collections.modernTitle'),
      title: t('collections.modernTitle'),
      description: t('collections.modernDescription'),
    },
  ];

  return (
    <section className="collections">
      <div className="collections__title">
        <h2>{t('collections.title')}</h2>
        <p>{t('collections.subtitle')}</p>
      </div>

      <div className="collections__container">
        {items.map(({ src, alt, title, description }) => (
          <div key={title} className="collections__container--block">
            <img src={src} alt={alt} />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>

      <button className="collections__button" onClick={handleViewAll}>
        {t('collections.viewAll')}
      </button>
    </section>
  );
};

export default Collections;
