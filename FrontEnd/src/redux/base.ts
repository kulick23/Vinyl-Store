import { fetchBaseQuery, FetchBaseQueryArgs } from '@reduxjs/toolkit/query/react'

export function createBaseQuery(args: FetchBaseQueryArgs) {
  return fetchBaseQuery({
    credentials: 'include',
    prepareHeaders: headers => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
    ...args
  })
}