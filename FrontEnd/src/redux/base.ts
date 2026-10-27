import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { isSupabaseProvider } from '../config/dataProvider';

const API = import.meta.env.VITE_API_URL ?? '';

function createLazySupabaseBaseQuery(
  baseUrl: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  let implementation:
    | BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
    | undefined;

  return async (args, api, extraOptions) => {
    if (!implementation) {
      const { createSupabaseBaseQuery } = await import('./supabaseBaseQuery');
      implementation = createSupabaseBaseQuery(baseUrl);
    }

    return implementation(args, api, extraOptions);
  };
}

export function createBaseQuery({
  baseUrl = '',
  ...rest
}: FetchBaseQueryArgs): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> {
  if (isSupabaseProvider) {
    return createLazySupabaseBaseQuery(baseUrl);
  }

  const isDev = import.meta.env.MODE === 'development';
  const root = isDev ? '/api' : `${API}/api`;

  return fetchBaseQuery({
    baseUrl: `${root}${baseUrl}`,
    credentials: 'omit',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    responseHandler: async (response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      return response.text();
    },
    ...rest,
  });
}
