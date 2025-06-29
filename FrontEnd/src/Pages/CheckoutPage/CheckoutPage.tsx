import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetCartQuery, useClearCartMutation } from '../../redux/cart/api'
import { useCreatePaymentIntentMutation } from '../../redux/checkout/api'
import { useConfirmOrderMutation } from '../../redux/orders/api'
import { useNotification } from '../../hooks/useNotification'
import { STRIPE_CONFIG } from '../../config/stripe'
import VinylSpinner from '../../Components/VinylSpinner/VinylSpinner'
import './CheckoutPage.scss'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey)

interface CheckoutFormProps {
  clientSecret: string
  intentId: string
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, intentId }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  
  const [clearCart] = useClearCartMutation()
  const [confirmOrder] = useConfirmOrderMutation()
  const { data: cartData } = useGetCartQuery()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setPaymentError(t('checkout.cardElementNotFound'))
      setIsProcessing(false)
      return
    }

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      })

      if (stripeError) {
        setPaymentError(stripeError.message || t('checkout.unexpectedError'))
        setIsProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          // Confirm the order on the backend using the payment intent ID
          await confirmOrder({ intentId: paymentIntent.id }).unwrap()
          
          // Clear the cart
          await clearCart().unwrap()
          
          showSuccess(t('checkout.paymentSuccessful'))
          navigate('/profile') // Navigate to profile or order confirmation page
        } catch (orderError) {
          console.error('Order confirmation failed:', orderError)
          showError(t('checkout.orderConfirmationFailed'))
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError(t('checkout.unexpectedError'))
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'var(--text-color)',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: 'var(--text-color-secondary)',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  }

  const cartTotal = cartData?.items?.reduce((total, item) => 
    total + (item.quantity * item.unitPrice), 0) || 0
  const shipping = 5.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  return (
    <div className="checkout-form">
      <div className="checkout-content">
        <div className="order-summary">
          <h2>{t('checkout.orderSummary')}</h2>
          <div className="summary-items">
            {cartData?.items?.map((item) => (
              <div key={item.cartItemId} className="summary-item">
                <span className="item-name">
                  {item.releaseTitle}
                </span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">${item.lineTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>{t('checkout.subtotal')}:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{t('checkout.shipping')}:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{t('checkout.tax')}:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>{t('checkout.total')}:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-form">
          <h2>{t('checkout.paymentInformation')}</h2>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="test-card-info">
              <h4>{t('checkout.testCardInfo')}</h4>
              <p><strong>{t('checkout.testCard')}</strong></p>
              <p><strong>{t('checkout.testExpiry')}</strong> | <strong>{t('checkout.testCvc')}</strong></p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="card-element-container">
              <label htmlFor="card-element">{t('checkout.creditDebitCard')}</label>
              <CardElement id="card-element" options={cardElementOptions} />
            </div>

            {paymentError && (
              <div className="error-message" role="alert">
                {paymentError}
              </div>
            )}

            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="pay-button"
            >
              {isProcessing ? (
                <>
                  <VinylSpinner size="small" />
                  {t('checkout.processing')}
                </>
              ) : (
                t('checkout.payButton', { amount: `$${total.toFixed(2)}` })
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showError } = useNotification()
  
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentId, setIntentId] = useState<string | null>(null)
  
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery()
  const [createPaymentIntent, { isLoading: creatingIntent }] = useCreatePaymentIntentMutation()

  useEffect(() => {
    const initializePayment = async () => {
      try {
        if (!cartData?.items?.length) {
          showError(t('checkout.cartEmpty'))
          navigate('/cart')
          return
        }

        const response = await createPaymentIntent().unwrap()
        setClientSecret(response.clientSecret)
        setIntentId(response.intentId)
      } catch (error) {
        console.error('Failed to create payment intent:', error)
        showError(t('checkout.failedToLoad'))
        navigate('/cart')
      }
    }

    if (cartData && !cartLoading) {
      initializePayment()
    }
  }, [cartData, cartLoading, createPaymentIntent, navigate, showError, t])

  if (cartLoading || creatingIntent) {
    return (
      <div className="checkout-page">
        <div className="loading">
          <VinylSpinner size="large" />
          <p>{t('checkout.loadingCheckout')}</p>
        </div>
      </div>
    )
  }

  if (!clientSecret || !intentId) {
    return (
      <div className="checkout-page">
        <div className="error">
          <p>{t('checkout.failedToLoad')}</p>
          <button onClick={() => navigate('/cart')} className="back-button">
            {t('checkout.backToCart')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>{t('checkout.title')}</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} intentId={intentId} />
        </Elements>
      </div>
    </div>
  )
}

export default CheckoutPage 