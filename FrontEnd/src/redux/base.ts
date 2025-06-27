import { fetchBaseQuery, FetchBaseQueryArgs } from '@reduxjs/toolkit/query/react'

const API = import.meta.env.VITE_API_URL ?? 'https://ibm-team-project-production.up.railway.app'

export function createBaseQuery({ baseUrl = '', ...rest }: FetchBaseQueryArgs) {
  const isDev = import.meta.env.MODE === 'development'
  // Use Railway backend for all environments
  const root = `${API}/api`

  return fetchBaseQuery({
    baseUrl: `${root}${baseUrl}`,
    credentials: 'omit',
    prepareHeaders: headers => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
    ...rest
  })
}