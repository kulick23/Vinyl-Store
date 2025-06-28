import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { Seller, SellerProfileCreateDto, SellerProfileUpdateDto } from './types'

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
    }),

    /**
     * POST /api/Seller/becomeSeller
     * Body: SellerProfileCreateDto
     * Response: Seller
     */
    becomeSeller: builder.mutation<Seller, SellerProfileCreateDto>({
      query: (data) => ({
        url: 'becomeSeller',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),

    /**
     * GET /api/Seller/profile
     * Response: Seller | null
     */
    getCurrentSellerProfile: builder.query<Seller | null, void>({
      query: () => 'profile',
      providesTags: ['Seller']
    }),

    /**
     * PUT /api/Seller/profile
     * Body: SellerProfileUpdateDto
     * Response: void
     */
    updateSellerProfile: builder.mutation<void, SellerProfileUpdateDto>({
      query: (data) => ({
        url: 'profile',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Seller']
    })
  })
})

export const { 
  useGetSellerByIdQuery,
  useBecomeSellerMutation,
  useGetCurrentSellerProfileQuery,
  useUpdateSellerProfileMutation
} = sellerApi
