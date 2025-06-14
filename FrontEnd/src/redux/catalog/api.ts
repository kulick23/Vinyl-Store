import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import type {
  VinylRecord,
  Genre,
  Artist,
  Listing,
  ReleaseResponse,
} from './types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/catalog',
  credentials: 'include',
});

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: async (args: string | FetchArgs, api, extraOptions) => {
    // логирование запроса
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
    getReleases: builder.query<
      VinylRecord[],
      {
        keyword?: string;
        artistId?: number;
        genreId?: number;
        yearFrom?: number;
        yearTo?: number;
        priceMin?: number;
        priceMax?: number;
        condition?: number;
        includePrice?: boolean;
      }
    >({
      query: (params) => ({
        url: 'releases',
        params,
      }),
      providesTags: ['Releases'],
    }),
    getReleaseById: builder.query<VinylRecord, number>({
      query: (id) => ({
        url: `releases/${id}`,
        params: { includePrice: true },
      }),
      transformResponse: (res: ReleaseResponse) => res.release,
      providesTags: (release, err, id) =>
        release ? [{ type: 'Release', id }] : [],
    }),
    getReleaseListings: builder.query<Listing[], { id: number; sort?: number }>(
      {
        query: ({ id, sort }) => ({
          url: `releases/${id}/listings`,
          params: sort != null ? { sort } : undefined,
        }),
        providesTags: (res, err, { id }) => [{ type: 'Listings', id }],
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
