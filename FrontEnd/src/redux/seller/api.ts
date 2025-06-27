import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { Seller, BecomeSellerRequest, SellerProfile, UpdateSellerProfileRequest } from './types'

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
     * Request: BecomeSellerRequest
     * Response: void (or success response)
     */
    becomeSeller: builder.mutation<void, BecomeSellerRequest>({
      query: data => ({
        url: 'becomeSeller',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),

    /**
     * GET /api/Seller/profile
     * Response: SellerProfile
     */
    getSellerProfile: builder.query<SellerProfile, void>({
      query: () => 'profile',
      providesTags: ['Seller']
    }),

    /**
     * PUT /api/Seller/profile
     * Request: UpdateSellerProfileRequest
     * Response: void
     */
    updateSellerProfile: builder.mutation<void, UpdateSellerProfileRequest>({
      query: data => ({
        url: 'profile',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),

    /**
     * PUT /api/Seller/avatar
     * Request: FormData with avatar file
     * Response: void
     */
    updateSellerAvatar: builder.mutation<void, FormData>({
      query: formData => ({
        url: 'avatar',
        method: 'PUT',
        body: formData
      }),
      invalidatesTags: ['Seller']
    })
  })
})

export const { 
  useGetSellerByIdQuery,
  useBecomeSellerMutation,
  useGetSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useUpdateSellerAvatarMutation
} = sellerApi
