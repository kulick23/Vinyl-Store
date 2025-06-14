import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react'
import type {
  VinylRecord,
  Genre,
  Artist,
  Listing,
  ReleaseResponse
} from './types'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/catalog',
  credentials: 'include'
})

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: async (args: string | FetchArgs, api, extraOptions) => {
    const { url, method = 'GET', params, body } =
      typeof args === 'string'
        ? { url: args, method: 'GET', params: undefined, body: undefined }
        : args
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, any>).toString()
      : ''
    console.log(`📡 Request → ${method} ${url}${qs}`, body ?? '')
    return rawBaseQuery(args, api, extraOptions)
  },
  tagTypes: ['Genres', 'Artists', 'Releases', 'Release', 'Listings'],
  endpoints: builder => ({
    /**
     * GET /genres
     * Response: Genre[]
     * [
     *   { id: 1, name: 'Rock' },
     *   { id: 2, name: 'Jazz' },
     *   …
     * ]
     */
    getGenres: builder.query<Genre[], void>({
      query: () => 'genres',
      providesTags: ['Genres']
    }),

    /**
     * GET /artists
     * Response: Artist[]
     * [
     *   { id: 1, name: 'The Beatles' },
     *   { id: 2, name: 'Pink Floyd' },
     *   …
     * ]
     */
    getArtists: builder.query<Artist[], void>({
      query: () => 'artists',
      providesTags: ['Artists']
    }),

    /**
     * GET /releases
     * Query params: 
     *   keyword?, artistId?, genreId?, yearFrom?, yearTo?,
     *   priceMin?, priceMax?, condition?, includePrice?
     *
     * Response without includePrice (default=false): VinylRecord[]
     * [
     *   { id: 8, title: 'Led Zeppelin IV', year: 1971, artist: 'Led Zeppelin', genre: 'Rock' },
     *   …
     * ]
     *
     * Response with includePrice=true adds pricing fields:
     * [
     *   {
     *     id: 3,
     *     title: 'The Dark Side of the Moon',
     *     year: 1973,
     *     artist: 'Pink Floyd',
     *     genre: 'Rock',
     *     price: 27.99,
     *     imageUrl: '…',
     *     isOnSale: false,
     *     originalPrice: null
     *   },
     *   …
     * ]
     */
    getReleases: builder.query<
      VinylRecord[],
      {
        keyword?: string
        artistId?: number
        genreId?: number
        yearFrom?: number
        yearTo?: number
        priceMin?: number
        priceMax?: number
        condition?: number
        includePrice?: boolean
      }
   >({
      query: params => ({ url: 'releases', params }),
      providesTags: ['Releases']
    }),

    /**
     * GET /releases/{id}
     * Path param: id
     *
     * Response: ReleaseResponse
     * {
     *   release: {
     *     id: 3,
     *     title: 'The Dark Side of the Moon',
     *     year: 1973,
     *     artist: 'Pink Floyd',
     *     genre: 'Rock'
     *   },
     *   listings: [
     *     {
     *       id: 3,
     *       releaseId: 3,
     *       sellerId: 1,
     *       sellerDisplayName: 'Vinyl Market Store',
     *       price: 27.99,
     *       quantity: 3,
     *       condition: 3,
     *       sellerRating: 4.8,
     *       notes: 'High quality VG condition vinyl record'
     *     }
     *   ]
     * }
     */
    getReleaseById: builder.query<VinylRecord, number>({
      query: id => ({
        url: `releases/${id}`,
        params: { includePrice: true }
      }),
      transformResponse: (res: ReleaseResponse) => res.release,
      providesTags: (release, err, id) =>
        release ? [{ type: 'Release', id }] : []
    }),

    /**
     * GET /releases/{id}/listings
     * Path param: id, optional query sort
     *
     * Response: Listing[]
     * [
     *   {
     *     id: 3,
     *     releaseId: 3,
     *     sellerId: 1,
     *     sellerDisplayName: 'Vinyl Market Store',
     *     price: 27.99,
     *     quantity: 3,
     *     condition: 3,
     *     sellerRating: 4.8,
     *     notes: 'High quality VG condition vinyl record'
     *   }
     * ]
     */
    getReleaseListings: builder.query<Listing[], { id: number; sort?: number }>({
      query: ({ id, sort }) => ({
        url: `releases/${id}/listings`,
        params: sort != null ? { sort } : undefined
      }),
      providesTags: (res, err, { id }) => [{ type: 'Listings', id }]
    })
  })
})

export const {
  useGetGenresQuery,
  useGetArtistsQuery,
  useGetReleasesQuery,
  useGetReleaseByIdQuery,
  useGetReleaseListingsQuery
} = catalogApi
