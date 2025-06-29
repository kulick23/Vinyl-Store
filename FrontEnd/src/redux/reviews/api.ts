import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { ReviewDto, ReviewCreateDto } from './types'

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: createBaseQuery({ baseUrl: '/reviews' }),
  tagTypes: ['Review'],
  endpoints: builder => ({
    /**
     * GET /api/reviews/seller/{sellerId}
     * Path param: sellerId
     * Response: ReviewDto[]
     */
    getSellerReviews: builder.query<ReviewDto[], number>({
      query: sellerId => `seller/${sellerId}`,
      providesTags: (reviews, error, sellerId) => [
        { type: 'Review', id: `seller-${sellerId}` },
        ...((reviews || []).map(review => ({ type: 'Review' as const, id: review.id })))
      ]
    }),

    /**
     * POST /api/reviews
     * Body: ReviewCreateDto
     * Response: ReviewDto
     */
    createReview: builder.mutation<ReviewDto, ReviewCreateDto>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data
      }),
      invalidatesTags: (review, error, data) => [
        { type: 'Review', id: `seller-${data.sellerId}` }
      ]
    })
  })
})

export const { 
  useGetSellerReviewsQuery,
  useCreateReviewMutation
} = reviewsApi 