import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useGetSellerByIdQuery, useGetSellerInventoryQuery } from "../../redux/seller/api"
import { useGetSellerReviewsQuery, useCreateReviewMutation } from "../../redux/reviews/api"
import { useGetCurrentUserQuery } from "../../redux/auth/api"
import { useGetReleasesQuery } from "../../redux/catalog/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"
import { WishlistButton } from "../../Components/WishlistButton"
import type { ReviewCreateDto } from "../../redux/reviews/types"
import "./SellerShopPage.scss"

const SellerShopPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>()
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const sellerIdNum = Number(sellerId)
  
  const { data: seller, isLoading: isLoadingSeller, error: sellerError } = useGetSellerByIdQuery(sellerIdNum, {
    skip: !sellerId || isNaN(sellerIdNum)
  })
  
  const { data: sellerInventory = [], isLoading: isLoadingInventory, error: inventoryError } = useGetSellerInventoryQuery(sellerIdNum, {
    skip: !sellerId || isNaN(sellerIdNum)
  })
  
  const { data: reviews = [], isLoading: isLoadingReviews } = useGetSellerReviewsQuery(sellerIdNum, {
    skip: !sellerId || isNaN(sellerIdNum)
  })
  
  const { data: user } = useGetCurrentUserQuery()
  const { data: allReleases = [] } = useGetReleasesQuery({})
  const [createReview] = useCreateReviewMutation()

  // Helper function to get release information by ID
  const getReleaseInfo = (releaseId: number) => {
    return allReleases.find(release => release.id === releaseId)
  }

  const getConditionText = (condition: number) => {
    const conditions = {
      1: "Poor (P)",
      2: "Fair (F)", 
      3: "Good (G)",
      4: "Very Good (VG)",
      5: "Near Mint (NM)",
      6: "Mint (M)",
    }
    return conditions[condition as keyof typeof conditions] || "Unknown"
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      showError(t("sellerShop.reviews.loginRequired"))
      return
    }

    if (!reviewComment.trim()) {
      showError(t("sellerShop.reviews.commentRequired"))
      return
    }

    // Check if token exists and is not expired
    const token = localStorage.getItem('accessToken')
    if (!token) {
      showError(t("sellerShop.reviews.sessionExpired"))
      return
    }

    // Check token expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      
      if (payload.exp && payload.exp < now) {
        showError(t("sellerShop.reviews.sessionExpired"))
        return
      }
    } catch (error) {
      showError(t("sellerShop.reviews.invalidSession"))
      return
    }

    setIsSubmittingReview(true)
    
    try {
      const reviewData: ReviewCreateDto = {
        sellerId: sellerIdNum,
        rating: reviewRating,
        comment: reviewComment.trim()
      }
      
      await createReview(reviewData).unwrap()
      
      showSuccess(t("sellerShop.reviews.submitSuccess"))
      setReviewComment("")
      setReviewRating(5)
    } catch (error: any) {
      console.error("Review submission error:", error)
      
      // Enhanced error handling based on backend business rules
      if (error?.status === 401) {
        showError(t("sellerShop.reviews.authenticationError"))
        // Clear invalid credentials and redirect
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else if (error?.status === 500) {
        if (error?.data?.includes?.("no orders") || error?.originalStatus === 400) {
          showError(t("sellerShop.reviews.noPurchaseError"))
        } else {
          showError(t("sellerShop.reviews.serverError"))
        }
      } else if (error?.status === 400) {
        const errorMessage = error?.data?.message || error?.data || ''
        
        if (errorMessage.includes("no orders") || errorMessage.includes("You have no orders")) {
          showError(t("sellerShop.reviews.noPurchaseError"))
        } else if (errorMessage.includes("yourself") || errorMessage.includes("cannot review yourself")) {
          showError(t("sellerShop.reviews.selfReviewError"))
        } else {
          showError(errorMessage || t("sellerShop.reviews.submitError"))
        }
      } else if (error?.status === 404) {
        showError(t("sellerShop.notFound"))
      } else if (error?.data?.message?.includes("no orders")) {
        showError(t("sellerShop.reviews.noPurchaseError"))
      } else if (error?.data?.message?.includes("yourself")) {
        showError(t("sellerShop.reviews.selfReviewError"))
      } else if (error?.data?.message) {
        showError(error.data.message)
      } else {
        showError(t("sellerShop.reviews.submitError"))
      }
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStarRating = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (interactive ? (hoveredStar || rating) : rating) ? 'filled' : ''}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  if (!sellerId || isNaN(sellerIdNum)) {
    return (
      <div className="seller-shop-page">
        <div className="error-message">
          <h2>{t("sellerShop.invalidSeller")}</h2>
          <Link to="/shop" className="back-button">
            {t("sellerShop.backToShop")}
          </Link>
        </div>
      </div>
    )
  }

  if (isLoadingSeller) {
    return (
      <div className="seller-shop-page">
        <div className="loading-container">
          <VinylSpinner size="large" />
          <p>{t("sellerShop.loading")}</p>
        </div>
      </div>
    )
  }

  if (sellerError || !seller) {
    return (
      <div className="seller-shop-page">
        <div className="error-message">
          <h2>{t("sellerShop.notFound")}</h2>
          <Link to="/shop" className="back-button">
            {t("sellerShop.backToShop")}
          </Link>
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
              {seller.displayName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="seller-details">
            <h1 className="seller-name">{seller.displayName}</h1>
            <div className="seller-rating">
              {renderStarRating(Math.round(seller.rating))}
              <span className="rating-text">
                {seller.rating.toFixed(1)} ({reviews.length} {t("sellerShop.reviews.count")})
              </span>
            </div>
            <p className="seller-description">{seller.description}</p>
          </div>
        </div>
      </div>

      <div className="seller-content">
        <div className="seller-items">
          <h2>{t("sellerShop.items.title")}</h2>
          
          {isLoadingInventory ? (
            <div className="loading-inventory">
              <VinylSpinner size="small" />
              <p>{t("sellerShop.items.loading")}</p>
            </div>
          ) : inventoryError ? (
            <div className="inventory-error">
              <p>{t("sellerShop.items.loadError")}</p>
            </div>
          ) : sellerInventory.length > 0 ? (
            <div className="inventory-grid">
              {sellerInventory.map((item) => {
                const release = getReleaseInfo(item.releaseId)
                return (
                  <div key={item.id} className="inventory-item">
                    <div className="item-header">
                      {release ? (
                        <Link 
                          to={`/product/${item.releaseId}`}
                          className="item-title"
                        >
                          {release.artist} - {release.title}
                        </Link>
                      ) : (
                        <span className="item-title">Release #{item.releaseId}</span>
                      )}
                      <div className="item-year">
                        {release?.year && `(${release.year})`}
                      </div>
                    </div>
                    
                    <div className="item-details">
                      <div className="item-price">
                        <span className="price-label">{t("sellerShop.items.price")}:</span>
                        <span className="price-value">${item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="item-condition">
                        <span className="condition-label">{t("sellerShop.items.condition")}:</span>
                        <span className="condition-value">{getConditionText(item.condition)}</span>
                      </div>
                      
                      <div className="item-quantity">
                        <span className="quantity-label">{t("sellerShop.items.quantity")}:</span>
                        <span className="quantity-value">{item.quantity}</span>
                      </div>
                      
                      {item.notes && (
                        <div className="item-notes">
                          <span className="notes-label">{t("sellerShop.items.notes")}:</span>
                          <span className="notes-value">{item.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="item-actions">
                      {release && (
                        <WishlistButton 
                          releaseId={item.releaseId}
                          variant="icon"
                        />
                      )}
                      {release && (
                        <Link 
                          to={`/product/${item.releaseId}`}
                          className="view-item-button"
                        >
                          {t("sellerShop.items.viewItem")}
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="no-items">
              <div className="empty-icon">📦</div>
              <h3>{t("sellerShop.items.noItems")}</h3>
              <p>{t("sellerShop.items.noItemsDescription")}</p>
            </div>
          )}
        </div>

        <div className="seller-reviews">
          <h2>{t("sellerShop.reviews.title")}</h2>
          
          {user && (
            <div className="review-form">
              <h3>{t("sellerShop.reviews.leaveReview")}</h3>
              <div className="review-requirements">
                <p className="requirement-note">
                  {t("sellerShop.reviews.requirementNote")}
                </p>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label>{t("sellerShop.reviews.rating")}:</label>
                  {renderStarRating(reviewRating, true, setReviewRating)}
                </div>
                
                <div className="form-group">
                  <label htmlFor="reviewComment">{t("sellerShop.reviews.comment")}:</label>
                  <textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t("sellerShop.reviews.commentPlaceholder")}
                    rows={4}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="submit-review-button"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                >
                  {isSubmittingReview ? t("sellerShop.reviews.submitting") : t("sellerShop.reviews.submit")}
                </button>
              </form>
            </div>
          )}

          <div className="reviews-list">
            {isLoadingReviews ? (
              <div className="loading-reviews">
                <VinylSpinner size="small" />
                <p>{t("sellerShop.reviews.loading")}</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="reviews">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">
                          {review.customer 
                            ? `${review.customer.firstName} ${review.customer.lastName}`
                            : t("sellerShop.reviews.anonymousUser")}
                        </span>
                        <div className="review-rating">
                          {renderStarRating(review.rating)}
                        </div>
                      </div>
                      <span className="review-date">{formatDate(review.created)}</span>
                    </div>
                    <div className="review-content">
                      <p>{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
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