import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { SellerPageDto, SellerProfileCreateDto, SellerProfileDto, SellerProfileUpdateDto } from './types'

export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: createBaseQuery({ baseUrl: '/Seller' }),
  tagTypes: ['Seller'],
  endpoints: builder => ({
    /**
     * GET /api/Seller/{sellerId}
     * Path param: sellerId
     * Response: SellerPageDto
     */
    getSellerById: builder.query<SellerPageDto, number>({
      query: sellerId => `${sellerId}`,
      providesTags: (seller, error, sellerId) => [{ type: 'Seller', id: sellerId }]
    }),

    /**
     * POST /api/Seller/becomeSeller
     * Body: SellerProfileCreateDto
     * Response: SellerProfileDto
     */
    becomeSeller: builder.mutation<SellerProfileDto, SellerProfileCreateDto>({
      query: (data) => ({
        url: 'becomeSeller',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),

    /**
     * GET /api/Seller/my-profile
     * Response: SellerProfileDto
     */
    getCurrentSellerProfile: builder.query<SellerProfileDto | null, void>({
      query: () => 'my-profile',
      providesTags: ['Seller'],
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return null
        }
        return response
      }
    }),

    /**
     * PUT /api/Seller/my-profile
     * Body: SellerProfileUpdateDto
     * Response: void
     */
    updateSellerProfile: builder.mutation<void, SellerProfileUpdateDto>({
      query: (data) => ({
        url: 'my-profile',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),

    /**
     * PUT /api/Seller/avatar
     * Body: FormData with image file
     * Response: { avatarPath: string }
     */
    uploadSellerAvatar: builder.mutation<{ avatarPath: string }, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: 'avatar',
          method: 'PUT',
          body: formData,
        }
      },
      invalidatesTags: ['Seller']
    })
  })
})

export const { 
  useGetSellerByIdQuery,
  useBecomeSellerMutation,
  useGetCurrentSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useUploadSellerAvatarMutation
} = sellerApi
