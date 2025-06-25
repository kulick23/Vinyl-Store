import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
} from '@reduxjs/toolkit/query/react';
import type {
  VinylRecord,
  Genre,
  Artist,
  Listing,
  ReleaseResponse,
  ReleasesResponse,
  FilterOptions,
} from './types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/catalog',
  credentials: 'include',
});

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: async (args: string | FetchArgs, api, extraOptions) => {
    const {
      url,
      method = 'GET',
      params,
      body,
    } = typeof args === 'string'
      ? { url: args, method: 'GET', params: undefined, body: undefined }
      : args;
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, any>).toString()
      : '';
    console.log(`📡 Request → ${method} ${url}${qs}`, body ?? '');
    return rawBaseQuery(args, api, extraOptions);
  },
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
