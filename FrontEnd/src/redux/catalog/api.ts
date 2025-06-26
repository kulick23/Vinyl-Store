import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../base';
import type {
  VinylRecord,
  Genre,
  Artist,
  Listing,
  ReleaseResponse,
  ReleasesResponse,
  FilterOptions,
} from './types';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: createBaseQuery({ baseUrl: '/catalog' }),
  tagTypes: ['Genres', 'Artists', 'Releases', 'Release', 'Listings'],
  endpoints: (builder) => ({
    getGenres: builder.query<Genre[], void>({
      query: () => 'genres',
      providesTags: ['Genres'],
    }),

    getArtists: builder.query<Artist[], void>({
      query: () => 'artists',
      providesTags: ['Artists'],
    }),

    getReleases: builder.query<VinylRecord[], FilterOptions>({
      query: (params) => ({ url: 'releases', params }),
      transformResponse: (response: ReleasesResponse) => response.items,
      providesTags: ['Releases'],
    }),

    getReleaseById: builder.query<ReleaseResponse, number>({
      query: (id) => `releases/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: 'Release', id }] : [],
    }),

    getReleaseListings: builder.query<Listing[], { id: number; sort?: number }>(
      {
        query: ({ id, sort }) => ({
          url: `releases/${id}/listings`,
          params: sort != null ? { sort } : undefined,
        }),
        providesTags: (result, error, { id }) => [{ type: 'Listings', id }],
      }
    ),
  }),
});

export const {
  useGetGenresQuery,
  useGetArtistsQuery,
  useGetReleasesQuery,
  useGetReleaseByIdQuery,
  useGetReleaseListingsQuery,
} = catalogApi;
