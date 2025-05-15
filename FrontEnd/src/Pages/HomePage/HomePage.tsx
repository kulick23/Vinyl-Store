import React from 'react';
import './HomePage.scss';
import Cover from '../../Components/cover/cover';
import Collections from '../../Components/collections/collections';

export const HomePage: React.FC = () => {
  return (
    <section className="homepage">
      <Cover variant="home" />
      <Collections />
    </section>
  );
};

export default HomePage;
