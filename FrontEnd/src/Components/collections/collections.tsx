import React from 'react';
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

const items: CollectionItem[] = [
  {
    src: jazzImg,
    alt: 'Jazz Classics',
    title: 'Jazz Classics',
    description: 'Explore our jazz classics collection',
  },
  {
    src: rockImg,
    alt: 'Rock Legends',
    title: 'Rock Legends',
    description: 'Explore our rock legends collection',
  },
  {
    src: modernImg,
    alt: 'Modern Indie',
    title: 'Modern Indie',
    description: 'Explore our modern indie collection',
  },
];

export const Collections: React.FC = () => (
  <section className="collections">
    <div className="collections__title">
      <h2>Featured Collections</h2>
      <p>
        Explore our handpicked collections of vinyl records from various
        genres and eras.
      </p>
    </div>

    <div className="collections__container">
      {items.map(({ src, alt, title, description }) => (
        <div
          key={title}
          className="collections__container--block"
        >
          <img src={src} alt={alt} />
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      ))}
    </div>

    <button className="collections__button">
      View All Collections
    </button>
  </section>
);

export default Collections;
