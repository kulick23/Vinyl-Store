import React from 'react';
import { useTranslation } from 'react-i18next';
import './ourTeam.scss';

const memberKeys = ['sarah', 'michael', 'emily', 'david'] as const;

const OurTeam: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="OurTeam">
      <h2 className="OurTeam__title">{t('ourTeam.title')}</h2>
      <div className="OurTeam__container">
        {memberKeys.map((key) => (
          <div className="OurTeam__container--card" key={key}>
            <h3>{t(`ourTeam.members.${key}.name`)}</h3>
            <p className="text-orange">{t(`ourTeam.members.${key}.role`)}</p>
            <p>{t(`ourTeam.members.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurTeam;
