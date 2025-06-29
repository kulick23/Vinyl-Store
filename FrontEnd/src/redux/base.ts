import { fetchBaseQuery, FetchBaseQueryArgs } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { clearCredentials, setCredentials } from './auth/authSlice'

const API = import.meta.env.VITE_API_URL ?? ''

export function createBaseQuery({ baseUrl = '', ...rest }: FetchBaseQueryArgs) {
  const isDev = import.meta.env.MODE === 'development'
  const root = isDev ? '/api' : `${API}/api`

  const baseQuery = fetchBaseQuery({
    baseUrl: `${root}${baseUrl}`,
    credentials: 'omit',
    prepareHeaders: headers => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        // Check if token is expired before sending
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Date.now() / 1000
          if (payload.exp && payload.exp < now) {
            console.warn('Token expired, clearing credentials')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            return headers
          }
        } catch (error) {
          console.warn('Invalid token format, clearing credentials')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          return headers
        }
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
    responseHandler: async (response) => {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      }
      return response.text()
    },
    ...rest
  })

  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
      console.log('401 error detected, attempting token refresh...')
      
      // Try to refresh the token
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: JSON.stringify(refreshToken),
            headers: { 'Content-Type': 'application/json' }
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          const tokens = refreshResult.data as any
          // Store new tokens
          api.dispatch(setCredentials({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }))
          
          // Retry the original query with new token
          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log('Token refresh failed, clearing credentials')
          api.dispatch(clearCredentials())
          // Redirect to login
          window.location.href = '/login'
        }
      } else {
        console.log('No refresh token available, clearing credentials')
        api.dispatch(clearCredentials())
        window.location.href = '/login'
      }
    }

    return result
  }

  return baseQueryWithReauth
}