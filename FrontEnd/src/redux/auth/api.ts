import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RegisterRequest, LoginRequest, AuthResponse } from './types'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/auth',
  credentials: 'include'
})

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async (args, api, extra) => {
    // логируем
    const { url, method = 'POST', body } =
      typeof args === 'string' ? { url: args, method: 'POST', body: undefined } : args
    console.log(`🔐 Auth Request → ${method} ${url}`, body ?? '')
    return rawBaseQuery(args, api, extra)
  },
  tagTypes: ['Auth'],
  endpoints: builder => ({
    /** POST /register */
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: data => ({
        url: 'register',
        method: 'POST',
        body: data
      })
    }),
    /** POST /login */
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: creds => ({
        url: 'login',
        method: 'POST',
        body: creds
      })
    }),
    /** POST /refresh */
    refresh: builder.mutation<AuthResponse, string>({
      query: token => ({
        url: 'refresh',
        method: 'POST',
        // swagger ожидает просто строку в теле
        body: JSON.stringify(token),
        headers: { 'Content-Type': 'application/json' }
      })
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation
} = authApi