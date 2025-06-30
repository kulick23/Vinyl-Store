import type React from "react"
import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useGetSellerByIdQuery, useCreateReviewMutation } from "../../redux/seller/api"
import { useGetReleaseByIdQuery } from "../../redux/catalog/api"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"
import "./SellerShopPage.scss"

// Enhanced inventory item component that fetches release data
const InventoryItemCard: React.FC<{ item: any }> = ({ item }) => {
  const { t } = useTranslation()
  
  const { data: releaseData, isLoading: releaseLoading } = useGetReleaseByIdQuery(item.releaseId)
  
  const getConditionText = (condition: number) => {
    const conditionMap = {
      1: t("sellerShop.condition.poor"),
      2: t("sellerShop.condition.fair"), 
      3: t("sellerShop.condition.good"),
      4: t("sellerShop.condition.veryGood"),
      5: t("sellerShop.condition.nearMint"),
      6: t("sellerShop.condition.mint")
    }
    return conditionMap[condition as keyof typeof conditionMap] || `Condition ${condition}`
  }

  if (releaseLoading) {
    return (
      <div className="inventory-item loading">
        <div className="loading-content">
          <VinylSpinner size="small" />
        </div>
      </div>
    )
  }

  const release = releaseData?.release

  return (
    <div className="inventory-item">
      <Link to={`/product/${item.releaseId}`} className="item-link">
        <div className="item-image">
          <img 
            src={release?.imageUrl || '/placeholder.svg?height=200&width=200'} 
            alt={release ? `${release.title} by ${release.artist}` : `Release ${item.releaseId}`}
            onError={(e) => {
              e.currentTarget.src = '/default/stub.png'
            }}
          />
        </div>
        
        <div className="item-details">
          {release && (
            <>
              <h3 className="item-title">{release.title}</h3>
              <p className="item-artist">{release.artist}</p>
              {release.year && <p className="item-year">{release.year}</p>}
            </>
          )}
          <p className="item-price">${item.price.toFixed(2)}</p>
          <p className="item-condition">{getConditionText(item.condition)}</p>
          <p className="item-quantity">{t("sellerShop.inventory.quantity")}: {item.quantity}</p>
          {item.notes && (
            <p className="item-notes">{item.notes}</p>
          )}
        </div>
      </Link>
    </div>
  )
}

const SellerShopPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const sellerId = id ? Number(id) : Number.NaN
  const skip = isNaN(sellerId)
  const { t } = useTranslation()

  const { data: sellerData, isLoading, error, refetch } = useGetSellerByIdQuery(sellerId, { skip })
  
  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !localStorage.getItem("accessToken"),
  })

  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation()
  const { showSuccess, showError, showWarning } = useNotification()

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  })

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      showWarning(t("sellerShop.reviews.loginRequired"))
      return
    }

    if (!reviewForm.comment.trim()) {
      showError(t("sellerShop.reviews.commentRequired"))
      return
    }

    try {
      await createReview({
        sellerId: sellerId,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      }).unwrap()

      showSuccess(t("sellerShop.reviews.submitSuccess"))
      setShowReviewForm(false)
      setReviewForm({ rating: 5, comment: "" })
      refetch() // Refresh seller data to show new review
    } catch (error: any) {
      console.error("Failed to submit review:", error)
      showError(error?.data?.message || t("sellerShop.reviews.submitError"))
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  if (skip) {
    return (
      <div className="seller-shop-page">
        <Link to="/shop" className="back-button">
          {t("sellerShop.backToShop")}
        </Link>
        <div className="error-message">
          <p>{t("sellerShop.notFound")}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="seller-shop-page">
        <Link to="/shop" className="back-button">
          {t("sellerShop.backToShop")}
        </Link>
        <div className="loading-spinner">
          <VinylSpinner size="large" />
          <p>{t("sellerShop.loading")}</p>
        </div>
      </div>
    )
  }

  if (error || !sellerData) {
    return (
      <div className="seller-shop-page">
        <Link to="/shop" className="back-button">
          {t("sellerShop.backToShop")}
        </Link>
        <div className="error-message">
          <p>{t("sellerShop.loadError")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-shop-page">
      <Link to="/shop" className="back-button">
        {t("sellerShop.backToShop")}
      </Link>

      <div className="seller-header">
        <div className="seller-info">
          <div className="seller-avatar">
            <div className="avatar-placeholder">
              {sellerData.displayName.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="seller-details">
            <h1 className="seller-name">{sellerData.displayName}</h1>
            
            <div className="seller-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`star ${star <= Math.round(sellerData.rating) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-value">
                {sellerData.rating.toFixed(1)} ({sellerData.reviews.length} {t("sellerShop.reviewsCount")})
              </span>
            </div>

            {sellerData.description && (
              <p className="seller-description">{sellerData.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="shop-inventory">
          <h2>{t("sellerShop.inventory.title")}</h2>
          
          {sellerData.listings && sellerData.listings.length > 0 ? (
            <div className="inventory-grid">
              {sellerData.listings.map((item) => (
                <InventoryItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="no-inventory">
              <p>{t("sellerShop.inventory.noItems")}</p>
            </div>
          )}
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>{t("sellerShop.reviews.title")}</h2>
            
            {user && (
              <button 
                className="leave-review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {t("sellerShop.reviews.leaveReview")}
              </button>
            )}
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>{t("sellerShop.reviews.rating")}</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= reviewForm.rating ? 'filled' : ''}`}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-text">({reviewForm.rating}/5)</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">{t("sellerShop.reviews.comment")}</label>
                <textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder={t("sellerShop.reviews.commentPlaceholder")}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? t("sellerShop.reviews.submitting") : t("sellerShop.reviews.submit")}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowReviewForm(false)}
                >
                  {t("sellerShop.reviews.cancel")}
                </button>
              </div>
            </form>
          )}

          <div className="reviews-list">
            {sellerData.reviews && sellerData.reviews.length > 0 ? (
              sellerData.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">
                        {review.customer ? 
                          `${review.customer.firstName} ${review.customer.lastName}` : 
                          t("sellerShop.reviews.anonymousUser")
                        }
                      </span>
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`star ${star <= review.rating ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="review-date">{formatDate(review.created)}</span>
                  </div>
                  
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>{t("sellerShop.reviews.noReviews")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerShopPage 