import type React from 'react';
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useGetReleaseByIdQuery,
  useGetReleaseListingsQuery,
} from '../../redux/catalog/api';
import { useAddCartItemMutation } from '../../redux/cart/api';
import { useGetCurrentUserQuery } from '../../redux/auth/api';
import { useNotification } from '../../hooks/useNotification';
import VinylSpinner from '../../Components/VinylSpinner/VinylSpinner';
import { WishlistButton } from '../../Components/WishlistButton';
import './ProductPage.scss';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const releaseId = id ? Number(id) : Number.NaN;
  const skip = isNaN(releaseId);
  const { t } = useTranslation();

  const {
    data: releaseData,
    isLoading,
    isError,
  } = useGetReleaseByIdQuery(releaseId, { skip });

  const {
    data: listings = [],
    isLoading: isLoadingListings,
    isError: listingsError,
  } = useGetReleaseListingsQuery({ id: releaseId }, { skip });

  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !localStorage.getItem("accessToken"),
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const { showSuccess, showError, showWarning } = useNotification();
  const [addToCart, { isLoading: isAddingToCart }] = useAddCartItemMutation();

  const product = useMemo(() => {
    if (!releaseData?.release) {
      return null;
    }

    const release = releaseData.release;
    const cheapestListing =
      listings.length > 0
        ? listings.reduce((min, listing) =>
            listing.price < min.price ? listing : min
          )
        : null;

    return {
      id: release.id.toString(),
      title: release.title,
      artist: release.artist,
      price: cheapestListing?.price || release.price || 0,
      originalPrice: release.originalPrice,
      imageUrl: release.imageUrl || '/placeholder.svg?height=500&width=500',
      isOnSale: release.isOnSale || false,
      genre: release.genre,
      releaseYear: release.year || release.releaseYear,
      inStock: listings.some((listing) => listing.quantity > 0),
      stockQuantity: listings.reduce(
        (total, listing) => total + listing.quantity,
        0
      ),
      listings,
      description: `Experience the authentic sound of ${release.title} by ${release.artist}. This vinyl record captures the essence of the original recording with all the warmth and depth that only analog can provide.`,
    };
  }, [releaseData, listings]);

  const changeQty = (n: number) =>
    setQuantity(Math.max(1, Math.min(n, product?.stockQuantity ?? 1)));

  const handleAddToCart = async () => {
    if (!user) {
      showWarning("notifications.loginRequired");
      return;
    }

    if (!product?.inStock) {
      showError("notifications.outOfStock");
      return;
    }

    try {
      // Use the selected listing or the first available one
      const targetListing = selectedListingId 
        ? listings.find(l => l.id === selectedListingId)
        : listings.find(l => l.quantity > 0);

      if (!targetListing) {
        showError("notifications.noAvailableListings");
        return;
      }

      await addToCart({
        inventoryItemId: targetListing.id,
        quantity: quantity,
      }).unwrap();

      showSuccess("notifications.itemAdded");
      setQuantity(1); // Reset quantity after successful add
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      showError("notifications.itemAddFailed");
    }
  };

  const getConditionText = (condition: number) => {
    const conditions = {
      1: 'Poor (P)',
      2: 'Fair (F)',
      3: 'Good (G)',
      4: 'Very Good (VG)',
      5: 'Near Mint (NM)',
      6: 'Mint (M)',
    };
    return conditions[condition as keyof typeof conditions] || 'Unknown';
  };

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
        <div className="loading-spinner">
          <VinylSpinner size="large" />
          <p>{t('product.loading')}</p>
        </div>
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
            src={product.imageUrl || '/placeholder.svg'}
            alt={`${product.title} by ${product.artist}`}
            className="product-image"
            onError={(e) =>
              (e.currentTarget.src = '/placeholder.svg?height=500&width=500')
            }
          />
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-artist">{product.artist}</p>
          </div>

          <div className="price-section">
            {product.originalPrice && product.isOnSale && (
              <span className="original-price">${product.originalPrice}</span>
            )}
            <span className="current-price">${product.price}</span>
          </div>

          <div
            className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}
          >
            {product.inStock
              ? `${t('product.inStock')} (${product.stockQuantity} ${t('product.available')})`
              : t('product.outOfStock')}
          </div>

          {product.inStock && (
            <div className="quantity-section">
              <label className="quantity-label">{t('product.quantity')}</label>
              <div className="quantity-controls">
                <div className="quantity-input">
                  <button
                    onClick={() => changeQty(quantity - 1)}
                    disabled={quantity === 1}
                  >
                    −
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
              </div>
            </div>
          )}

          <div className="add-to-cart-section">
            <button
              className="add-to-cart-button"
              disabled={!product.inStock || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart
                ? t('product.addingToCart')
                : product.inStock
                ? t('product.addToCart')
                : t('product.outOfStock')}
            </button>
            <WishlistButton 
              releaseId={releaseId} 
              variant="button" 
              className="product-wishlist-button"
            />
          </div>

          <div className="product-details">
            <h3 className="details-title">{t('product.details')}</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">{t('product.artist')}</span>
                <span className="detail-value">{product.artist}</span>
              </div>
              {product.genre && (
                <div className="detail-item">
                  <span className="detail-label">{t('product.genre')}</span>
                  <span className="detail-value">{product.genre}</span>
                </div>
              )}
              {product.releaseYear && (
                <div className="detail-item">
                  <span className="detail-label">
                    {t('product.releaseYear')}
                  </span>
                  <span className="detail-value">{product.releaseYear}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">{t('product.format')}</span>
                <span className="detail-value">Vinyl LP</span>
              </div>
            </div>
          </div>

          <div className="product-description">
            <h3 className="description-title">{t('product.description')}</h3>
            <p className="description-text">{product.description}</p>
          </div>

          {product.listings.length > 0 && (
            <div className="listings-section">
              <h3>{t('product.availableListings')}</h3>
              <div className="listings-grid">
                {product.listings.map((listing) => (
                  <div key={listing.id} className="listing-card">
                    <div className="listing-header">
                      <span className="listing-price">${listing.price}</span>
                      <span className="listing-condition">
                        {getConditionText(listing.condition)}
                      </span>
                    </div>
                    <div className="listing-details">
                      <p className="seller-name">{listing.sellerDisplayName}</p>
                      <p className="seller-rating">
                        ⭐ {listing.sellerRating}/5.0
                      </p>
                      <p className="quantity">
                        {t('product.quantity')}: {listing.quantity}
                      </p>
                      {listing.notes && (
                        <p className="listing-notes">{listing.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
