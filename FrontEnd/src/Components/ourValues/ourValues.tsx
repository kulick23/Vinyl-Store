import React from 'react';
import { useTranslation } from 'react-i18next';
import miroIcon from '../../Assets/icons/micro.svg';
import authIcon from '../../Assets/icons/auth.svg';
import curationIcon from '../../Assets/icons/curation.svg';
import './ourValues.scss';

const blocks = [
  { key: 'quality', icon: miroIcon },
  { key: 'authenticity', icon: authIcon },
  { key: 'curation', icon: curationIcon },
] as const;

const OurValues: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="ourValues">
      <h2 className="ourValues__title">{t('ourValues.title')}</h2>
      <div className="ourValues__container">
        {blocks.map(({ key, icon }) => (
          <div className="ourValues__container--block" key={key}>
            <div className="ourValues__container--block--icon">
              <img src={icon} alt={t(`ourValues.blocks.${key}.title`)} />
            </div>
            <h3>{t(`ourValues.blocks.${key}.title`)}</h3>
            <p>{t(`ourValues.blocks.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurValues;
