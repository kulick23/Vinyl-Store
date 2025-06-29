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
     * GET current user's seller profile
     * Uses the my-profile endpoint with proper error handling
     */
    getCurrentSellerProfile: builder.query<SellerProfileDto | null, void>({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery('my-profile')
          
          if (result.data) {
            return { data: result.data as SellerProfileDto }
          }
          
          // If error is 400 (Bad Request), user has no seller profile
          if (result.error && (result.error as any).status === 400) {
            return { data: null }
          }
          
          // For other errors, return the error
          return { error: result.error }
        } catch (error) {
          console.error('Error fetching seller profile:', error)
          return { data: null }
        }
      },
      providesTags: ['Seller']
    }),

    /**
     * Update seller profile using admin endpoint
     * Requires seller ID which we need to get first
     */
    updateSellerProfile: builder.mutation<void, { sellerId: number; data: SellerProfileUpdateDto }>({
      query: ({ sellerId, data }) => ({
        url: `../admin/sellers/${sellerId}`,
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

// Enhanced hook that handles getting seller ID for updates
export const useUpdateSellerProfileWithId = () => {
  const { data: currentProfile } = useGetCurrentSellerProfileQuery()
  const [updateProfile, result] = useUpdateSellerProfileMutation()

  const updateSellerProfile = async (data: SellerProfileUpdateDto) => {
    if (!currentProfile) {
      throw new Error('No seller profile found')
    }

    // Get all sellers to find the seller ID
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('No authentication token')
    }

    try {
      const sellersResponse = await fetch('/api/admin/sellers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!sellersResponse.ok) {
        throw new Error('Failed to fetch sellers')
      }

      const sellers = await sellersResponse.json() as Array<{ id: number; customerId: number }>
      const currentSeller = sellers.find(seller => seller.customerId === currentProfile.customerId)
      
      if (!currentSeller) {
        throw new Error('Seller not found')
      }

      return await updateProfile({ sellerId: currentSeller.id, data }).unwrap()
    } catch (error) {
      console.error('Update seller profile error:', error)
      throw error
    }
  }

  return [updateSellerProfile, result] as const
}
