import React from 'react';
import './ContactPage.scss';
import TitleWithButton from '../../Components/TitleWithButton/TitleWithButton';
import Contact from '../../Components/contact/contact';

export const ContactPage: React.FC = () => {
  return (
    <section className="contactpage">
      <TitleWithButton variant="contact" />
      <Contact />
    </section>
  );
};

export default ContactPage;
