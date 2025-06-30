import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type {
  SellerPageDto,
  SellerProfileCreateDto,
  SellerProfileDto,
  SellerProfileUpdateDto,
  ReviewDto,
  CreateReviewDto      // ← импортируем новый тип
} from './types'

export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: createBaseQuery({ baseUrl: '/Seller' }),
  tagTypes: ['Seller', 'Reviews'],

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
    }),

    // POST /api/reviews
    createReview: builder.mutation<void, CreateReviewDto>({
      query: payload => ({
        url: '../reviews',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: 'Reviews' as const, id: sellerId },
        { type: 'Seller', id: sellerId }
      ]
    })
  })
})

export const { 
  useGetSellerByIdQuery,
  useBecomeSellerMutation,
  useGetCurrentSellerProfileQuery,
  useUploadSellerAvatarMutation,
  useCreateReviewMutation
} = sellerApi


