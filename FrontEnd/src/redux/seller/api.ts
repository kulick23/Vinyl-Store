import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { SellerPageDto, SellerProfileCreateDto, SellerProfileDto } from './types'

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
      // Handle the redirect response from backend until it's fixed
      transformResponse: (response: any, meta) => {
        // If backend returns redirect, treat as success and return minimal data
        if (meta?.response?.status === 302 || meta?.response?.type === 'opaqueredirect') {
          return {
            customerId: 0, // Will be updated on next profile fetch
            displayName: '',
            description: '',
            rating: 0
          }
        }
        return response
      },
      invalidatesTags: ['Seller']
    }),

    /**
     * GET current user's seller profile
     * Tries profile endpoint first, falls back to admin/sellers lookup
     */
    getCurrentSellerProfile: builder.query<SellerProfileDto | null, void>({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        try {
          // Try the profile endpoint first (when backend is fixed)
          const profileResult = await baseQuery('profile')
          if (profileResult.data && !profileResult.error) {
            return { data: profileResult.data as SellerProfileDto }
          }

          // Fallback: Get current user and search in admin sellers
          const userResult = await baseQuery('/auth/myAccount')
          if (userResult.error) {
            return { data: null }
          }
          
          const user = userResult.data as any
          if (!user?.id) {
            return { data: null }
          }

          // Try to get all sellers and find the one with matching customerId
          const sellersResult = await baseQuery('/admin/sellers')
          if (sellersResult.error) {
            return { data: null }
          }

          const sellers = sellersResult.data as SellerProfileDto[]
          const userSeller = sellers.find(seller => seller.customerId === user.id)
          
          return { data: userSeller || null }
        } catch (error) {
          console.error('Error fetching seller profile:', error)
          return { data: null }
        }
      },
      providesTags: ['Seller']
    })
  })
})

export const { 
  useGetSellerByIdQuery,
  useBecomeSellerMutation,
  useGetCurrentSellerProfileQuery
} = sellerApi
