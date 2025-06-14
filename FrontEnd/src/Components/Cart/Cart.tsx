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
import { useCreateOrderMutation } from "../../redux/orders/api"
import VinylSpinner from "../VinylSpinner/VinylSpinner"
import "./Cart.scss"

interface CartItemWithDetails {
  id: number
  inventoryItemId: number
  quantity: number
  inventoryItem?: {
    id: number
    releaseId: number
    price: number
    condition: number
    notes?: string
  }
}

const CartItemComponent: React.FC<{
  item: CartItemWithDetails
  onUpdateQuantity: (itemId: number, quantity: number) => void
  onRemove: (itemId: number) => void
}> = ({ item, onUpdateQuantity, onRemove }) => {
  const { data: inventoryItem } = useGetInventoryByIdQuery(item.inventoryItemId)

  if (!inventoryItem) {
    return (
      <div className="cart-item">
        <div className="loading-spinner">
          <VinylSpinner size="small" />
        </div>
      </div>
    )
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className="cart-item">
      <img src="/placeholder.svg?height=120&width=120" alt="Vinyl Record" className="item-image" />
      <div className="item-details">
        <h3 className="item-title">Vinyl Record #{inventoryItem.releaseId}</h3>
        <p className="item-artist">Release ID: {inventoryItem.releaseId}</p>
        <p className="item-price">${inventoryItem.price}</p>
        {inventoryItem.notes && <p className="item-notes">{inventoryItem.notes}</p>}
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
          <button className="remove-button" onClick={() => onRemove(item.id)}>
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

  const { data: cartItems = [], isLoading } = useGetCartQuery()
  const [clearCart] = useClearCartMutation()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [deleteCartItem] = useDeleteCartItemMutation()
  const [createOrder] = useCreateOrderMutation()

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

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart().unwrap()
      } catch (error) {
        console.error("Failed to clear cart:", error)
      }
    }
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
      alert("Order placed successfully!")
    } catch (error) {
      console.error("Failed to create order:", error)
      alert("Failed to place order. Please try again.")
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

  // Calculate totals (simplified - in real app you'd fetch inventory details)
  const subtotal = cartItems.length * 25 // Placeholder calculation
  const shipping = 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart ({cartItems.length} items)</h1>
        <button className="clear-cart-button" onClick={handleClearCart} disabled={cartItems.length === 0}>
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItemComponent
              key={item.id}
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
              <span>${subtotal.toFixed(2)}</span>
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
