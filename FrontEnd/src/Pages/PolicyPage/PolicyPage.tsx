import React from 'react';
import { useTranslation } from 'react-i18next';
import { policyContentsEng } from './policyContentsEn';
import { policyContentsRus } from './policyContentsRus';
import './PolicyPage.scss';

export const PrivacyPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const content = language.startsWith('ru')
    ? policyContentsRus[1]
    : policyContentsEng[1];

  return (
    <section className="PrivacyPage">
      <h2>{t('policy.title')}</h2>
      <p>{t('policy.update')}</p>
      <div
        className="PrivacyPage__content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
};

export default PrivacyPage;
