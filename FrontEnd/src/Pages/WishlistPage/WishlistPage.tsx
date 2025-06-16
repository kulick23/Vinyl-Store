"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} from "../../redux/auth/api"
import { useNotification } from "../../hooks/useNotification"
import VinylSpinner from "../../Components/VinylSpinner/VinylSpinner"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import { ConfirmDialog } from "../../Components/ConfirmDialog/ConfirmDialog"
import type { WishlistItem } from "../../redux/auth/types"
import "./WishlistPage.scss"

const WishlistItemComponent: React.FC<{
  item: WishlistItem
  onRemove: (releaseId: number) => void
}> = ({ item, onRemove }) => {
  const { t } = useTranslation()

  return (
    <div className="wishlist-item">
      <div className="wishlist-item__image">
        <img 
          src={item.imageUrl || "/placeholder.svg?height=200&width=200"} 
          alt={item.title}
          className="wishlist-item__cover"
        />
      </div>
      <div className="wishlist-item__details">
        <h3 className="wishlist-item__title">{item.title}</h3>
        <p className="wishlist-item__artist">{item.artist}</p>
        <p className="wishlist-item__year">
          {t("wishlist.item.year")}: {item.year}
        </p>
        <p className="wishlist-item__genre">
          {t("wishlist.item.genre")}: {item.genre}
        </p>
        <div className="wishlist-item__actions">
          <Link to={`/product/${item.id}`} className="wishlist-item__view">
            View Details
          </Link>
          <button 
            className="wishlist-item__remove"
            onClick={() => onRemove(item.id)}
          >
            {t("wishlist.item.removeFromWishlist")}
          </button>
        </div>
      </div>
    </div>
  )
}

export const WishlistPage: React.FC = () => {
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const { data: wishlistItems, isLoading } = useGetWishlistQuery()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const [clearWishlist, { isLoading: isClearingAll }] = useClearWishlistMutation()

  const handleRemoveItem = async (releaseId: number) => {
    try {
      await removeFromWishlist(releaseId).unwrap()
      showSuccess(t("wishlist.removeSuccess"))
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
      showError(t("wishlist.removeError"))
    }
  }

  const handleClearAll = async () => {
    try {
      await clearWishlist().unwrap()
      showSuccess(t("wishlist.clearSuccess"))
      setShowClearConfirm(false)
    } catch (error) {
      console.error("Failed to clear wishlist:", error)
      showError(t("wishlist.clearError"))
      setShowClearConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="wishlist-page">
          <div className="wishlist-page__loading">
            <VinylSpinner size="large" />
            <p>{t("wishlist.loading")}</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <AuthGuard>
        <div className="wishlist-page">
          <div className="wishlist-page__header">
            <h1 className="wishlist-page__title">{t("wishlist.title")}</h1>
            <p className="wishlist-page__subtitle">{t("wishlist.subtitle")}</p>
          </div>
          <div className="wishlist-page__empty">
            <div className="wishlist-page__empty-icon">💖</div>
            <h2 className="wishlist-page__empty-title">{t("wishlist.empty.title")}</h2>
            <p className="wishlist-page__empty-message">{t("wishlist.empty.message")}</p>
            <Link to="/shop" className="wishlist-page__empty-button">
              {t("wishlist.empty.shopButton")}
            </Link>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="wishlist-page">
        <div className="wishlist-page__header">
          <div className="wishlist-page__title-section">
            <h1 className="wishlist-page__title">{t("wishlist.title")}</h1>
            <p className="wishlist-page__subtitle">
              {t("wishlist.subtitle")} ({wishlistItems.length} items)
            </p>
          </div>
          <button 
            className="wishlist-page__clear-all"
            onClick={() => setShowClearConfirm(true)}
            disabled={isClearingAll}
          >
            {isClearingAll ? "Clearing..." : t("wishlist.clearAll")}
          </button>
        </div>
        
        <div className="wishlist-page__content">
          <div className="wishlist-page__grid">
            {wishlistItems.map((item) => (
              <WishlistItemComponent
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        <ConfirmDialog
          isOpen={showClearConfirm}
          title={t("wishlist.clearAll")}
          message={t("wishlist.clearAllConfirm")}
          onConfirm={handleClearAll}
          onCancel={() => setShowClearConfirm(false)}
          confirmText="Clear All"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </AuthGuard>
  )
}

export default WishlistPage 