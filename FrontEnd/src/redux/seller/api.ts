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
  useUploadSellerAvatarMutation
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
