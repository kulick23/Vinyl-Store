import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { Seller } from './types'

export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: createBaseQuery({ baseUrl: '/Seller' }),
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
