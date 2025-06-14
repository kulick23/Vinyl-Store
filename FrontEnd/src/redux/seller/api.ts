import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Seller } from './types'

export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/Seller',
    credentials: 'include'
  }),
  tagTypes: ['Seller'],
  endpoints: builder => ({
    /**
     * GET /api/Seller/{sellerId}
     * Path param: sellerId
     * Response: Seller
     */
    getSellerById: builder.query<Seller, number>({
      query: sellerId => `${sellerId}`,
      providesTags: (seller, error, sellerId) => [{ type: 'Seller', id: sellerId }]
    })
  })
})

export const { useGetSellerByIdQuery } = sellerApi