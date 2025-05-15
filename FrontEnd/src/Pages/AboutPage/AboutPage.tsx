import React from 'react';
import './AboutPage.scss';
import TitleWithButton from '../../Components/TitleWithButton/TitleWithButton';
import Cover from '../../Components/cover/cover';
import OurTeam from '../../Components/ourTeam/ourTeam';
import OurValues from '../../Components/ourValues/ourValues';

export const AboutPage: React.FC = () => {
  return (
    <section className="aboutpage">
      <TitleWithButton />
      <Cover variant="about" />
      <OurValues />
      <OurTeam />
    </section>
  );
};

export default AboutPage;
