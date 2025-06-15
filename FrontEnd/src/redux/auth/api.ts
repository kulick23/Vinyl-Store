import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { RegisterRequest, LoginRequest, AuthResponse, User } from './types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery({ baseUrl: '/api/auth' }),
  tagTypes: ['Auth', 'User'],
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
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useGetCurrentUserQuery,
  useConfirmEmailMutation,
  useEditProfileMutation
} = authApi
