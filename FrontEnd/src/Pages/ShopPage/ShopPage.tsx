'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetReleasesQuery } from '../../redux/catalog/api';
import TitleWithButton from '../../Components/TitleWithButton/TitleWithButton';
import { Link } from 'react-router-dom';
import './ShopPage.scss';

export const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: records = [],
    error,
    isLoading,
  } = useGetReleasesQuery({
    keyword: searchQuery,
    includePrice: true,
  });

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.genre?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading)
      return <div className="loading-spinner">{t('shop.loading')}</div>;
    if (error)
      return (
        <div className="error-message">
          <p>{t('shop.errors.title')}</p>
          <p>{(error as any).data?.message ?? t('shop.errors.fetchError')}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            {t('shop.errors.retry')}
          </button>
        </div>
      );
    if (records.length === 0)
      return (
        <div className="empty-state">
          <p>{t('shop.noRecords')}</p>
        </div>
      );
    if (filteredRecords.length === 0)
      return (
        <div className="no-results">
          <p>{t('shop.noResults')}</p>
        </div>
      );
    return (
      <div className="records-grid">
        {filteredRecords.map((record) => (
          <div key={record.id} className="record-card">
            <Link to={`/product/${record.id}`} className="record-link">
              <div className="record-image">
                <img
                  src={
                    record.imageUrl ||
                    '/placeholder.svg?height=250&width=250&query=vinyl record'
                  }
                  alt={`${record.title} by ${record.artist}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg?height=250&width=250';
                  }}
                />
                {record.isOnSale && (
                  <div className="sale-badge">{t('shop.sale')}</div>
                )}
                <button
                  className="favorite-button"
                  onClick={(e) => e.preventDefault()}
                >
                  ❤
                </button>
              </div>
              <div className="record-info">
                <h3>{record.title}</h3>
                <p className="artist">{record.artist}</p>
                {record.genre && <p className="genre">{record.genre}</p>}
                <div className="price-container">
                  {record.isOnSale && record.originalPrice && (
                    <span className="original-price">
                      ${record.originalPrice}
                    </span>
                  )}
                  <span className="current-price">${record.price}</span>
                </div>
              </div>
            </Link>
            <button
              className="add-to-cart"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic here
              }}
            >
              {t('shop.addToCart')}
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="shoppage">
      <TitleWithButton />
      <div className="shop-container">
        <div className="shop-header">
          <h1>{t('shop.title')}</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder={t('shop.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        {renderContent()}
      </div>
    </section>
  );
};

export default ShopPage;
