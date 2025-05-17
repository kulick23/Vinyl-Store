import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';
import './contact.scss';

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <section className="contact">
      <input
        className="email"
        type="email"
        placeholder={t('contact.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="name"
        type="text"
        placeholder={t('contact.namePlaceholder')}
      />
      <input
        className="compani"
        type="text"
        placeholder={t('contact.companyPlaceholder')}
      />
      <PhoneInput
        country={'us'}
        value={phone}
        onChange={setPhone}
        inputProps={{
          name: 'phone',
          required: true,
          placeholder: t('contact.phonePlaceholder'),
        }}
      />
      <textarea
        className="message"
        placeholder={t('contact.messagePlaceholder')}
      />
      <button className="button">{t('contact.sendButton')}</button>
    </section>
  );
};

export default Contact;
