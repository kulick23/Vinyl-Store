// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rf11HBXQdkZ1P9mJZNDGOE2KekEdjbnZLF7CCkRrjz4BHaZcx4YxM4A9jLC6WDLf6TQYhPp4HlMgnEtO2OBG3yo000gDAsufq'
}

// Test card numbers for development
export const TEST_CARDS = {
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  mastercard: '5555555555554444',
  amex: '378282246310005',
  declined: '4000000000000002'
} 