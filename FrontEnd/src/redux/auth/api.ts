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
    /** GET /me - Get current user profile */
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: 'me', method: 'GET' }),
      providesTags: ['User']
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useGetCurrentUserQuery
} = authApi
