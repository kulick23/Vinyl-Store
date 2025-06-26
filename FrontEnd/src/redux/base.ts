import { fetchBaseQuery, FetchBaseQueryArgs } from '@reduxjs/toolkit/query/react'

const API = import.meta.env.VITE_API_URL ?? ''

export function createBaseQuery({ baseUrl = '', ...rest }: FetchBaseQueryArgs) {
  const isDev = import.meta.env.MODE === 'development'
  const root = isDev ? '/api' : `${API}/api`

  return fetchBaseQuery({
    baseUrl: `${root}${baseUrl}`,
    credentials: 'include',
    prepareHeaders: headers => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
    ...rest
  })
}