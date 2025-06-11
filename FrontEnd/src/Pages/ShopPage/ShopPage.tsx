import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ShopPage.scss';
import TitleWithButton from '../../Components/TitleWithButton/TitleWithButton';

interface VinylRecord {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl?: string;
  isOnSale?: boolean;
  originalPrice?: number;
  genre?: string;
  releaseYear?: number;
}

export const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        console.log('Attempting to fetch records from /api/catalog/releases');
        
        const releasesResponse = await fetch('/api/catalog/releases?includePrice=true', {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log('Response status:', releasesResponse.status);
        console.log('Response headers:', {
          contentType: releasesResponse.headers.get('content-type'),
          contentLength: releasesResponse.headers.get('content-length'),
        });

        if (!releasesResponse.ok) {
          const errorText = await releasesResponse.text();
          console.error('Full error response:', errorText);
          
          let errorMessage;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.title || `Server error (${releasesResponse.status})`;
          } catch (e) {
            switch (releasesResponse.status) {
              case 500:
                errorMessage = 'Internal server error. Please try again later.';
                break;
              case 404:
                errorMessage = 'API endpoint not found.';
                break;
              case 400:
                errorMessage = 'Invalid request. Please check the parameters.';
                break;
              default:
                errorMessage = `HTTP error! status: ${releasesResponse.status}`;
            }
          }
          throw new Error(errorMessage);
        }
        
        const contentType = releasesResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await releasesResponse.text();
          console.error('Received non-JSON response:', textResponse);
          throw new TypeError("Server returned an invalid response format");
        }

        const releasesData = await releasesResponse.json();
        console.log('Received data:', releasesData);
        
        const transformedRecords: VinylRecord[] = releasesData.map((release: any) => ({
          id: release.inventoryItemId || release.id.toString(),
          title: release.title,
          artist: release.artist,
          price: release.price || 0,
          imageUrl: release.imageUrl || '/default-vinyl.jpg',
          genre: release.genre,
          releaseYear: release.year,
          isOnSale: false,
          originalPrice: null
        }));

        setRecords(transformedRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
        if (error instanceof TypeError && error.message.includes('JSON')) {
          setError(t('shop.errors.invalidResponse'));
        } else if (error instanceof Error) {
          setError(`${t('shop.errors.fetchError')}: ${error.message}`);
        } else {
          setError(t('shop.errors.unknown'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [t]);

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (record.genre && record.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-spinner">{t('shop.loading')}</div>;
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{t('shop.errors.title')}</p>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            {t('shop.errors.retry')}
          </button>
        </div>
      );
    }

    if (records.length === 0) {
      return (
        <div className="empty-state">
          <p>{t('shop.noRecords')}</p>
        </div>
      );
    }

    if (filteredRecords.length === 0) {
      return (
        <div className="no-results">
          <p>{t('shop.noResults')}</p>
        </div>
      );
    }

    return (
      <div className="records-grid">
        {filteredRecords.map((record) => (
          <div key={record.id} className="record-card">
            <div className="record-image">
              <img 
                src={record.imageUrl || '/default-vinyl.jpg'} 
                alt={`${record.title} by ${record.artist}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-vinyl.jpg';
                }}
              />
              {record.isOnSale && (
                <div className="sale-badge">{t('shop.sale')}</div>
              )}
              <button className="favorite-button">❤</button>
            </div>
            <div className="record-info">
              <h3>{record.title}</h3>
              <p className="artist">{record.artist}</p>
              {record.genre && (
                <p className="genre">{record.genre}</p>
              )}
              <div className="price-container">
                {record.isOnSale && record.originalPrice && (
                  <span className="original-price">${record.originalPrice}</span>
                )}
                <span className="current-price">${record.price}</span>
              </div>
            </div>
            <button 
              className="add-to-cart"
              onClick={() => {
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