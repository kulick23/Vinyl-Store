import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  AdminArtist,
  AdminGenre,
  AdminRelease,
  AdminReleasePayload,
  AdminSeller,
  AdminUser
} from './types'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/admin',
    credentials: 'include'
  }),
  tagTypes: [
    'AdminArtists',
    'AdminArtist',
    'AdminGenres',
    'AdminGenre',
    'AdminReleases',
    'AdminRelease',
    'AdminSellers',
    'AdminSeller',
    'AdminUsers',
    'AdminUser'
  ],
  endpoints: builder => ({
    // ARTISTS
    getAdminArtists: builder.query<AdminArtist[], void>({
      query: () => 'artists',
      providesTags: ['AdminArtists']
    }),
    createAdminArtist: builder.mutation<AdminArtist, AdminArtist>({
      query: artist => ({
        url: 'artists',
        method: 'POST',
        body: artist
      }),
      invalidatesTags: ['AdminArtists']
    }),
    updateAdminArtist: builder.mutation<AdminArtist, AdminArtist>({
      query: artist => ({
        url: `artists/${artist.id}`,
        method: 'PUT',
        body: artist
      }),
      invalidatesTags: (res, err, artist) => [
        { type: 'AdminArtist', id: artist.id },
        'AdminArtists'
      ]
    }),
    deleteAdminArtist: builder.mutation<void, number>({
      query: id => ({
        url: `artists/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminArtists']
    }),

    // GENRES
    getAdminGenres: builder.query<AdminGenre[], void>({
      query: () => 'genres',
      providesTags: ['AdminGenres']
    }),
    createAdminGenre: builder.mutation<AdminGenre, AdminGenre>({
      query: genre => ({
        url: 'genres',
        method: 'POST',
        body: genre
      }),
      invalidatesTags: ['AdminGenres']
    }),
    updateAdminGenre: builder.mutation<AdminGenre, AdminGenre>({
      query: genre => ({
        url: `genres/${genre.id}`,
        method: 'PUT',
        body: genre
      }),
      invalidatesTags: (res, err, genre) => [
        { type: 'AdminGenre', id: genre.id },
        'AdminGenres'
      ]
    }),
    deleteAdminGenre: builder.mutation<void, number>({
      query: id => ({
        url: `genres/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminGenres']
    }),

    // RELEASES
    getAdminReleases: builder.query<AdminRelease[], void>({
      query: () => 'releases',
      providesTags: ['AdminReleases']
    }),
    createAdminRelease: builder.mutation<AdminRelease, AdminRelease>({
      query: rel => ({
        url: 'releases',
        method: 'POST',
        body: rel
      }),
      invalidatesTags: ['AdminReleases']
    }),
    updateAdminRelease: builder.mutation<AdminRelease, { id: number; data: AdminReleasePayload }>(
      {
        query: ({ id, data }) => ({
          url: `releases/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: (res, err, { id }) => [
          { type: 'AdminRelease', id },
          'AdminReleases'
        ]
      }
    ),
    deleteAdminRelease: builder.mutation<void, number>({
      query: id => ({
        url: `releases/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminReleases']
    }),

    // SELLERS
    getAdminSellers: builder.query<AdminSeller[], void>({
      query: () => 'sellers',
      providesTags: ['AdminSellers']
    }),
    createAdminSeller: builder.mutation<AdminSeller, AdminSeller>({
      query: seller => ({
        url: 'sellers',
        method: 'POST',
        body: seller
      }),
      invalidatesTags: ['AdminSellers']
    }),
    updateAdminSeller: builder.mutation<AdminSeller, AdminSeller>({
      query: seller => ({
        url: `sellers/${seller.id}`,
        method: 'PUT',
        body: seller
      }),
      invalidatesTags: (res, err, seller) => [
        { type: 'AdminSeller', id: seller.id },
        'AdminSellers'
      ]
    }),
    deleteAdminSeller: builder.mutation<void, number>({
      query: id => ({
        url: `sellers/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminSellers']
    }),

    // USERS
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => 'users',
      providesTags: ['AdminUsers']
    }),
    createAdminUser: builder.mutation<AdminUser, AdminUser>({
      query: user => ({
        url: 'users',
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['AdminUsers']
    }),
    updateAdminUser: builder.mutation<AdminUser, { id: string; data: Partial<AdminUser> }>(
      {
        query: ({ id, data }) => ({
          url: `users/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: (res, err, { id }) => [
          { type: 'AdminUser', id },
          'AdminUsers'
        ]
      }
    ),
    deleteAdminUser: builder.mutation<void, string>({
      query: id => ({
        url: `users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminUsers']
    })
  })
})

export const {
  useGetAdminArtistsQuery,
  useCreateAdminArtistMutation,
  useUpdateAdminArtistMutation,
  useDeleteAdminArtistMutation,

  useGetAdminGenresQuery,
  useCreateAdminGenreMutation,
  useUpdateAdminGenreMutation,
  useDeleteAdminGenreMutation,

  useGetAdminReleasesQuery,
  useCreateAdminReleaseMutation,
  useUpdateAdminReleaseMutation,
  useDeleteAdminReleaseMutation,

  useGetAdminSellersQuery,
  useCreateAdminSellerMutation,
  useUpdateAdminSellerMutation,
  useDeleteAdminSellerMutation,

  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation
} = adminApi