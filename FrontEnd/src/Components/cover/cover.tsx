import React from 'react';
import './cover.scss';
import coverImg from '../../Assets/img/cover.png';

export const Cover: React.FC = () => {
  return (
    <section className="cover">
      <div className="cover__container">
        <h1>Discover the Magic of Vinyl</h1>
        <p>
          Explore our curated collection of premium vinyl records. From classic
          jazz to modern indie, we have something for every music lover.
        </p>
        <div className="cover__container--buttons">
          <button>Shop now</button>
          <button className="button-white">Sign In</button>
        </div>
      </div>
      <img src={coverImg} alt="Cover" className="cover__img" />
    </section>
  );
};

export default Cover;
