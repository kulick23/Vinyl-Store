import { fetchBaseQuery, FetchBaseQueryArgs } from '@reduxjs/toolkit/query/react'

const API = import.meta.env.VITE_API_URL || 'https://ibm-team-project-production.up.railway.app'

export function createBaseQuery({ baseUrl = '', ...rest }: FetchBaseQueryArgs) {
  const isDev = import.meta.env.MODE === 'development'
  
  // In development, use proxy to /api
  // In production, use the full API URL
  const root = isDev ? '/api' : `${API}/api`

  return fetchBaseQuery({
    baseUrl: `${root}${baseUrl}`,
    credentials: 'omit',
    prepareHeaders: headers => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
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
}