import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'

export interface CheckoutResponse {
  clientSecret: string
  intentId: string
}

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: createBaseQuery({ baseUrl: '/checkout' }),
  tagTypes: ['Checkout'],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<CheckoutResponse, void>({
      query: () => ({
        url: '',
        method: 'POST',
      }),
    }),
  }),
})

export const { 
  useCreatePaymentIntentMutation 
} = checkoutApi 