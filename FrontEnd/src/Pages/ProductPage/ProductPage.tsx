import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useGetReleaseByIdQuery,
  useGetReleaseListingsQuery,
} from '../../redux/catalog/api';
import './ProductPage.scss';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const releaseId = id ? Number(id) : NaN;
  const skip = isNaN(releaseId);
  const { t } = useTranslation();

  // RTK Query для релиза
  const {
    data: release,
    isLoading,
    isError,
  } = useGetReleaseByIdQuery(releaseId, { skip });

  // RTK Query для листингов
  const {
    data: listings = [],
    isLoading: isLoadingListings,
    isError: listingsError,
  } = useGetReleaseListingsQuery({ id: releaseId }, { skip });

  // ВСЕ хуки ДО любых условных return
  const [quantity, setQuantity] = useState(1);
  const product = useMemo(() => {
    if (!release || release.id == null) {
      return null;
    }
    return {
      id: release.id.toString(),
      title: release.title,
      artist: release.artist,
      price: release.price,
      originalPrice: (release as any).originalPrice ?? undefined,
      imageUrl:
        (release as any).imageUrl || '/placeholder.svg?height=500&width=500',
      isOnSale: (release as any).isOnSale,
      genre: (release as any).genre,
      releaseYear: (release as any).releaseYear,
      inStock: true,
      stockQuantity: 10,
      listings, // добавляем листинги в продукт для отображения
    };
  }, [release, listings]);

  const changeQty = (n: number) =>
    setQuantity(Math.max(1, Math.min(n, product?.stockQuantity ?? 1)));

  // Ранние return по состояниям
  if (skip) {
    return (
      <div className="productpage">
        <p>{t('product.notFound')}</p>
      </div>
    );
  }
  if (isLoading || isLoadingListings) {
    return (
      <div className="productpage">
        <div className="loading-spinner">{t('product.loading')}</div>
      </div>
    );
  }
  if (isError || listingsError || !product) {
    return (
      <div className="productpage">
        <Link to="/shop" className="back-button">
          {t('product.backToShop')}
        </Link>
        <div className="not-found">
          <p>{t('product.notFound')}</p>
        </div>
      </div>
    );
  }

  // Теперь product и listings точно загружены
  return (
    <div className="productpage">
      <Link to="/shop" className="back-button">
        {t('product.backToShop')}
      </Link>
      <div className="product-container">
        <div className="product-image-section">
          {product.isOnSale && (
            <div className="sale-badge">{t('product.sale')}</div>
          )}
          <img
            src={product.imageUrl}
            alt={`${product.title} by ${product.artist}`}
            onError={(e) =>
              (e.currentTarget.src = '/placeholder.svg?height=500&width=500')
            }
          />
        </div>
        <div className="product-info-section">
          <h1>{product.title}</h1>
          <p className="artist">{product.artist}</p>
          <div className="price-section">
            {product.originalPrice != null && product.isOnSale && (
              <span className="original-price">${product.originalPrice}</span>
            )}
            <span className="current-price">${product.price}</span>
          </div>
          <div
            className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}
          >
            {product.inStock ? t('product.inStock') : t('product.outOfStock')}
          </div>
          {product.inStock && (
            <div className="quantity-section">
              <label>{t('product.quantity')}</label>
              <div className="quantity-controls">
                <button
                  onClick={() => changeQty(quantity - 1)}
                  disabled={quantity === 1}
                >
                  –
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={product.stockQuantity}
                  onChange={(e) => changeQty(Number(e.target.value))}
                />
                <button
                  onClick={() => changeQty(quantity + 1)}
                  disabled={quantity === product.stockQuantity}
                >
                  +
                </button>
              </div>
              <button
                className="add-to-cart"
                onClick={() =>
                  alert(
                    t('product.added', {
                      count: quantity,
                      title: product.title,
                    })
                  )
                }
              >
                {t('product.addToCart')}
              </button>
            </div>
          )}
          <div className="product-details">
            <h3>{t('product.details')}</h3>
            <div className="details-grid">
              <div>
                <strong>{t('product.artist')}:</strong> {product.artist}
              </div>
              {product.genre && (
                <div>
                  <strong>{t('product.genre')}:</strong> {product.genre}
                </div>
              )}
              {product.releaseYear && (
                <div>
                  <strong>{t('product.releaseYear')}:</strong>{' '}
                  {product.releaseYear}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="listings-section">
          <h3>{t('product.listings')}</h3>
          {product.listings.length === 0 ? (
            <p>{t('product.noListings')}</p>
          ) : (
            <ul>
              {product.listings.map((lst) => (
                <li key={lst.id}>
                  ${lst.price} —{' '}
                  {t('product.condition', { cond: lst.condition })}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
