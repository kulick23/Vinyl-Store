import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
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

    try {
      // First, submit the elements to validate the form
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setPaymentError(submitError.message || t('checkout.unexpectedError'))
        setIsProcessing(false)
        return
      }

      // Then confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/profile`,
        },
        redirect: 'if_required'
      })

      if (stripeError) {
        setPaymentError(stripeError.message || t('checkout.unexpectedError'))
        setIsProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          await confirmOrder({ intentId: paymentIntent.id }).unwrap()
          await clearCart().unwrap()
          
          showSuccess(t('checkout.paymentSuccessful'))
          navigate('/profile')
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
            <div className="payment-element-container">
              <PaymentElement 
                options={{
                  layout: 'tabs'
                }}
              />
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
  const [elementsOptions, setElementsOptions] = useState<{
    clientSecret: string;
    appearance: {
      theme: 'stripe';
      variables: {
        colorPrimary: string;
        colorBackground: string;
        colorText: string;
        colorDanger: string;
        fontFamily: string;
        spacingUnit: string;
        borderRadius: string;
      };
    };
  } | null>(null)
  
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

  useEffect(() => {
    if (!clientSecret) return

    const updateTheme = () => {
      setElementsOptions({
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: getComputedStyle(document.documentElement).getPropertyValue('--orange-color').trim() || '#FF6B35',
            colorBackground: getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim() || '#ffffff',
            colorText: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      })
    }

    updateTheme()
    
    const observer = new MutationObserver(() => {
      updateTheme()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })

    return () => observer.disconnect()
  }, [clientSecret])

  if (cartLoading || creatingIntent || !elementsOptions) {
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
        <Elements stripe={stripePromise} options={elementsOptions}>
          <CheckoutForm clientSecret={clientSecret} intentId={intentId} />
        </Elements>
      </div>
    </div>
  )
}

export default CheckoutPage 