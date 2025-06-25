"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  useGetCartQuery,
  useClearCartMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../../redux/cart/api"
import { useGetInventoryByIdQuery } from "../../redux/inventory/api"
import { useGetReleaseByIdQuery } from "../../redux/catalog/api"
import { useCreateOrderMutation } from "../../redux/orders/api"
import { useNotification } from "../../hooks/useNotification"
import { ConfirmDialog } from "../ConfirmDialog"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import type { CartItemDto } from "../../redux/cart/types"
import "./Cart.scss"

const CartItemComponent: React.FC<{
  item: CartItemDto
  onUpdateQuantity: (itemId: number, quantity: number) => void
  onRemove: (itemId: number) => void
}> = ({ item, onUpdateQuantity, onRemove }) => {
  const { data: inventoryItem, error: inventoryError } = useGetInventoryByIdQuery(item.inventoryItemId, {
    skip: !item.inventoryItemId
  })
  const { data: releaseData, error: releaseError } = useGetReleaseByIdQuery(inventoryItem?.releaseId || 0, {
    skip: !inventoryItem?.releaseId
  })

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(item.cartItemId, newQuantity)
    }
  }

  // Get the product image from release data with fallbacks
  const productImage = releaseData?.release?.imageUrl || "/placeholder.svg?height=120&width=120"
  const productTitle = item.releaseTitle || releaseData?.release?.title || "Product"
  const artistName = releaseData?.release?.artist || "Unknown Artist"

  // Show a simplified version if we can't load full details due to auth issues
  if (inventoryError || releaseError) {
    return (
      <div className="cart-item">
        <img 
          src="/placeholder.svg?height=120&width=120" 
          alt={productTitle}
          className="item-image"
        />
        <div className="item-details">
          <h3 className="item-title">{productTitle}</h3>
          <p className="item-artist">{artistName}</p>
          <p className="item-price">${item.unitPrice}</p>
          <div className="item-controls">
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
                −
              </button>
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
              />
              <button onClick={() => handleQuantityChange(item.quantity + 1)}>+</button>
            </div>
            <button className="remove-button" onClick={() => onRemove(item.cartItemId)}>
              Remove
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-item">
      <img 
        src={productImage} 
        alt={productTitle}
        className="item-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg?height=120&width=120";
        }}
      />
      <div className="item-details">
        <h3 className="item-title">{productTitle}</h3>
        <p className="item-artist">{artistName}</p>
        <p className="item-price">${item.unitPrice}</p>
        <div className="item-controls">
          <div className="quantity-controls">
            <button onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
              −
            </button>
            <input
              type="number"
              value={item.quantity}
              min={1}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
            />
            <button onClick={() => handleQuantityChange(item.quantity + 1)}>+</button>
          </div>
          <button className="remove-button" onClick={() => onRemove(item.cartItemId)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export const Cart: React.FC = () => {
  const { t } = useTranslation()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { showSuccess, showError } = useNotification()

  const { data: cartData, isLoading } = useGetCartQuery()
  const [clearCart] = useClearCartMutation()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [deleteCartItem] = useDeleteCartItemMutation()
  const [createOrder] = useCreateOrderMutation()

  // Get cart items and total from CartDto structure
  const cartItems = cartData?.items || []
  const cartTotal = cartData?.grandTotal || 0

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem({ itemId, quantity }).unwrap()
    } catch (error) {
      console.error("Failed to update cart item:", error)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await deleteCartItem(itemId).unwrap()
    } catch (error) {
      console.error("Failed to remove cart item:", error)
    }
  }

  const handleClearCartClick = () => {
    setShowClearConfirm(true)
  }

  const handleClearCartConfirm = async () => {
    setShowClearConfirm(false)
    try {
      await clearCart().unwrap()
      showSuccess("notifications.cartCleared")
    } catch (error) {
      console.error("Failed to clear cart:", error)
      showError("notifications.cartClearFailed")
    }
  }

  const handleClearCartCancel = () => {
    setShowClearConfirm(false)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setIsCheckingOut(true)
    try {
      const orderItems = cartItems.map((item) => ({
        inventoryItemId: item.inventoryItemId,
        quantity: item.quantity,
      }))

      await createOrder({
        items: orderItems,
        shippingAddress: "123 Main St, City, State 12345", // This should come from a form
        paymentMethod: "Credit Card", // This should come from a form
      }).unwrap()

      await clearCart().unwrap()
      showSuccess("notifications.orderPlaced")
    } catch (error) {
      console.error("Failed to create order:", error)
      showError("notifications.orderFailed")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="loading-spinner">
          <VinylSpinner size="large" />
          <p>Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h1 className="empty-cart-title">Your cart is empty</h1>
          <p className="empty-cart-text">Looks like you haven't added any vinyl records to your cart yet.</p>
          <Link to="/shop" className="shop-button">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Use the actual cart total from backend or calculate simple totals
  const shipping = 5.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart ({cartItems.length} items)</h1>
        <button className="clear-cart-button" onClick={handleClearCartClick} disabled={cartItems.length === 0}>
          Clear Cart
        </button>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title={t("confirmDialog.clearCart.title")}
        message={t("confirmDialog.clearCart.message")}
        confirmText={t("common.clear")}
        cancelText={t("common.cancel")}
        onConfirm={handleClearCartConfirm}
        onCancel={handleClearCartCancel}
        type="warning"
      />

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItemComponent
              key={item.cartItemId}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={isCheckingOut || cartItems.length === 0}
          >
            {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
