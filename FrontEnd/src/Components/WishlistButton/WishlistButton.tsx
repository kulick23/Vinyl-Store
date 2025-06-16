"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../redux/auth/api"
import { useNotification } from "../../hooks/useNotification"
import heart from "../../Assets/icons/heart.svg"
import "./WishlistButton.scss"

interface WishlistButtonProps {
  releaseId: number
  variant?: "icon" | "button"
  className?: string
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  releaseId,
  variant = "icon",
  className = "",
}) => {
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  const [isInWishlist, setIsInWishlist] = useState(false)

  // Check if user is logged in
  const token = localStorage.getItem("accessToken")
  const skip = !token

  const { data: wishlistItems } = useGetWishlistQuery(undefined, { skip })
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation()
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation()

  // Check if item is in wishlist
  useEffect(() => {
    if (wishlistItems) {
      setIsInWishlist(wishlistItems.some(item => item.id === releaseId))
    }
  }, [wishlistItems, releaseId])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
      showError("Please log in to use wishlist")
      return
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(releaseId).unwrap()
        showSuccess(t("wishlist.removeSuccess"))
      } else {
        await addToWishlist(releaseId).unwrap()
        showSuccess(t("wishlist.addSuccess"))
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error)
      if (isInWishlist) {
        showError(t("wishlist.removeError"))
      } else {
        showError(t("wishlist.addError"))
      }
    }
  }

  if (!token) {
    return null // Don't show wishlist button for non-logged-in users
  }

  const isLoading = isAdding || isRemoving

  if (variant === "button") {
    return (
      <button
        className={`wishlist-button wishlist-button--text ${className} ${
          isInWishlist ? "wishlist-button--active" : ""
        }`}
        onClick={handleToggleWishlist}
        disabled={isLoading}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <img 
          src={heart} 
          alt="wishlist" 
          className={`wishlist-button__icon ${isInWishlist ? "wishlist-button__icon--filled" : ""}`}
        />
        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    )
  }

  return (
    <button
      className={`wishlist-button wishlist-button--icon ${className} ${
        isInWishlist ? "wishlist-button--active" : ""
      }`}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <img 
        src={heart} 
        alt="wishlist" 
        className={`wishlist-button__icon ${isInWishlist ? "wishlist-button__icon--filled" : ""}`}
      />
    </button>
  )
}

export default WishlistButton 