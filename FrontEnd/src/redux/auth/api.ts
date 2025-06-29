import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { RegisterRequest, LoginRequest, AuthResponse, User, WishlistItem } from './types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery({ baseUrl: '/auth' }),
  tagTypes: ['Auth', 'User', 'Wishlist'],
  endpoints: builder => ({
    /** POST /register */
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: data => ({ url: 'register', method: 'POST', body: data })
    }),
    /** POST /login */
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: creds => ({ url: 'login', method: 'POST', body: creds })
    }),
    /** POST /refresh */
    refresh: builder.mutation<AuthResponse, string>({
      query: token => ({
        url: 'refresh',
        method: 'POST',
        body: JSON.stringify(token),
        headers: { 'Content-Type': 'application/json' }
      })
    }),
    /** GET /myAccount - Get current user profile */
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: 'myAccount', method: 'GET' }),
      providesTags: ['User']
    }),
    /** POST /confirm - Confirm email address */
    confirmEmail: builder.mutation<string, string>({
      query: token => ({
        url: 'confirm',
        method: 'POST',
        body: JSON.stringify(token),
        headers: { 'Content-Type': 'application/json' },
        responseHandler: async (response) => {
          // Handle text response instead of JSON
          const text = await response.text()
          return text
        }
      })
    }),
    /** POST /editProfile - Edit user profile */
    editProfile: builder.mutation<User, Partial<User>>({
      query: data => ({ url: 'editProfile', method: 'POST', body: data }),
      invalidatesTags: ['User']
    }),
    /** POST /password/forgot - Send password reset email */
    forgotPassword: builder.mutation<void, { email: string }>({
      query: data => ({ url: 'password/forgot', method: 'POST', body: { Email: data.email } })
    }),
    /** POST /password/reset - Reset password with token */
    resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
      query: data => ({ url: 'password/reset', method: 'POST', body: { Token: data.token, NewPassword: data.newPassword } })
    }),
    /** GET /wishlist - Get user's wishlist */
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => ({ url: 'wishlist', method: 'GET' }),
      providesTags: ['Wishlist']
    }),
    /** POST /wishlist/{releaseId} - Add item to wishlist */
    addToWishlist: builder.mutation<void, number>({
      query: releaseId => ({ url: `wishlist/${releaseId}`, method: 'POST' }),
      invalidatesTags: ['Wishlist']
    }),
    /** DELETE /wishlist/{releaseId} - Remove item from wishlist */
    removeFromWishlist: builder.mutation<void, number>({
      query: releaseId => ({ url: `wishlist/${releaseId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist']
    }),
    /** Clear entire wishlist by removing all items */
    clearWishlist: builder.mutation<void, void>({
      queryFn: async (arg, { getState, dispatch }, extraOptions, baseQuery) => {
        // Get current wishlist items
        const wishlistResult = await baseQuery({ url: 'wishlist', method: 'GET' })
        if (wishlistResult.error) {
          return { error: wishlistResult.error }
        }
        
        const wishlistItems = wishlistResult.data as WishlistItem[]
        
        // Remove each item individually
        for (const item of wishlistItems) {
          const removeResult = await baseQuery({ 
            url: `wishlist/${item.id}`, 
            method: 'DELETE' 
          })
          if (removeResult.error) {
            return { error: removeResult.error }
          }
        }
        
        return { data: undefined }
      },
      invalidatesTags: ['Wishlist']
    }),
    /** PUT /account/avatar - Upload user avatar */
    uploadUserAvatar: builder.mutation<{ avatarPath: string }, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: 'account/avatar',
          method: 'PUT',
          body: formData,
        }
      },
      invalidatesTags: ['User']
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useGetCurrentUserQuery,
  useConfirmEmailMutation,
  useEditProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useUploadUserAvatarMutation
} = authApi
