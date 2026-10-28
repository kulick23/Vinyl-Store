import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabase';

type QueryArgs = string | FetchArgs;
type QueryParams = Record<string, string | number | boolean | null | undefined>;

type ArtistRow = { id: number; name: string };
type GenreRow = { id: number; name: string };
type SellerRow = { id: number; display_name: string; rating: number | string };
type ListingRow = {
  id: number;
  release_id: number;
  seller_id: number;
  price: number | string;
  quantity: number;
  condition: number;
  notes: string | null;
  created_at?: string;
  seller?: SellerRow | SellerRow[] | null;
};
type ReleaseRow = {
  id: number;
  title: string;
  year: number;
  image_url: string | null;
  artist_id: number;
  genre_id: number;
  artist?: ArtistRow | ArtistRow[] | null;
  genre?: GenreRow | GenreRow[] | null;
  listings?: ListingRow[] | null;
};

const releaseSelect = `
  id,
  title,
  year,
  image_url,
  artist_id,
  genre_id,
  artist:artists(id,name),
  genre:genres(id,name),
  listings:inventory_items(
    id,
    release_id,
    seller_id,
    price,
    quantity,
    condition,
    notes,
    created_at,
    seller:seller_profiles(id,display_name,rating)
  )
`;

function first<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

function mapListing(row: ListingRow) {
  const seller = first(row.seller);

  return {
    id: row.id,
    releaseId: row.release_id,
    sellerId: row.seller_id,
    sellerDisplayName: seller?.display_name ?? 'Unknown seller',
    price: Number(row.price),
    quantity: row.quantity,
    condition: row.condition,
    sellerRating: Number(seller?.rating ?? 0),
    notes: row.notes ?? undefined,
  };
}

function mapRelease(row: ReleaseRow) {
  const artist = first(row.artist);
  const genre = first(row.genre);
  const prices = (row.listings ?? [])
    .filter((listing) => listing.quantity > 0)
    .map((listing) => Number(listing.price));

  return {
    id: row.id,
    title: row.title,
    artist: artist?.name ?? 'Unknown artist',
    year: row.year,
    releaseYear: row.year,
    genre: genre?.name,
    price: prices.length > 0 ? Math.min(...prices) : undefined,
    imageUrl: row.image_url ?? undefined,
    isOnSale: false,
    originalPrice: null,
  };
}

function normalizeRequest(baseUrl: string, args: QueryArgs) {
  const request = typeof args === 'string' ? { url: args } : args;
  const route = `${baseUrl}/${request.url}`.replace(/\/+/g, '/');

  return {
    route: route.startsWith('/') ? route : `/${route}`,
    method: (request.method ?? 'GET').toUpperCase(),
    params: (request.params ?? {}) as QueryParams,
  };
}

function errorResult(error: unknown): { error: FetchBaseQueryError } {
  const message = error instanceof Error ? error.message : String(error);

  return {
    error: {
      status: 'CUSTOM_ERROR',
      error: message,
    },
  };
}

async function getGenres(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('genres')
    .select('id,name')
    .order('name');

  if (error) throw error;
  return data ?? [];
}

async function getArtists(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('artists')
    .select('id,name')
    .order('name');

  if (error) throw error;
  return data ?? [];
}

async function getCurrentUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('No authenticated Supabase user');

  const fullName = String(user.user_metadata.full_name ?? '').trim();
  const nameParts = fullName ? fullName.split(/\s+/) : [];

  return {
    id: user.id,
    email: user.email ?? '',
    firstName:
      user.user_metadata.first_name ??
      user.user_metadata.given_name ??
      nameParts[0] ??
      '',
    lastName:
      user.user_metadata.last_name ??
      user.user_metadata.family_name ??
      nameParts.slice(1).join(' '),
    phone: user.phone ?? undefined,
    isEmailConfirmed: Boolean(user.email_confirmed_at),
    role: 'Customer',
    lastLoginAt: user.last_sign_in_at ?? user.created_at,
    createdAt: user.created_at,
    avatarPath:
      user.user_metadata.avatar_url ?? user.user_metadata.picture ?? undefined,
  };
}

async function getReleases(supabase: SupabaseClient, params: QueryParams) {
  let query = supabase.from('releases').select(releaseSelect).order('id');

  if (params.keyword) query = query.ilike('title', `%${params.keyword}%`);
  if (params.artistId) query = query.eq('artist_id', params.artistId);
  if (params.genreId) query = query.eq('genre_id', params.genreId);
  if (params.yearFrom) query = query.gte('year', params.yearFrom);
  if (params.yearTo) query = query.lte('year', params.yearTo);

  const { data, error } = await query;
  if (error) throw error;

  let releases = ((data ?? []) as unknown as ReleaseRow[]).map(mapRelease);

  if (params.priceMin != null) {
    releases = releases.filter(
      (release) =>
        release.price != null && release.price >= Number(params.priceMin)
    );
  }
  if (params.priceMax != null) {
    releases = releases.filter(
      (release) =>
        release.price != null && release.price <= Number(params.priceMax)
    );
  }

  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.max(1, Number(params.limit ?? 20));
  const offset = (page - 1) * limit;

  return { items: releases.slice(offset, offset + limit) };
}

async function getRelease(supabase: SupabaseClient, releaseId: number) {
  const { data, error } = await supabase
    .from('releases')
    .select(releaseSelect)
    .eq('id', releaseId)
    .single();

  if (error) throw error;

  const release = data as unknown as ReleaseRow;
  return {
    release: mapRelease(release),
    listings: (release.listings ?? [])
      .filter((listing) => listing.quantity > 0)
      .map(mapListing),
  };
}

async function getListings(
  supabase: SupabaseClient,
  releaseId: number,
  sort: number
) {
  const { data, error } = await supabase
    .from('inventory_items')
    .select(
      'id,release_id,seller_id,price,quantity,condition,notes,created_at,seller:seller_profiles(id,display_name,rating)'
    )
    .eq('release_id', releaseId)
    .gt('quantity', 0);

  if (error) throw error;

  const listings = ((data ?? []) as unknown as ListingRow[]).map(mapListing);

  return listings.sort((left, right) => {
    if (sort === 1) return right.price - left.price;
    if (sort === 2) return right.sellerRating - left.sellerRating;
    if (sort === 3) return left.condition - right.condition;
    return left.price - right.price;
  });
}

export function createSupabaseBaseQuery(
  baseUrl: string
): BaseQueryFn<QueryArgs, unknown, FetchBaseQueryError> {
  return async (args) => {
    try {
      const supabase = getSupabaseClient();
      const { route, method, params } = normalizeRequest(baseUrl, args);

      if (method !== 'GET') {
        return errorResult(
          new Error(
            `Supabase demo mode does not support ${method} ${route} yet`
          )
        );
      }

      if (route === '/catalog/genres') {
        return { data: await getGenres(supabase) };
      }
      if (route === '/catalog/artists') {
        return { data: await getArtists(supabase) };
      }
      if (route === '/auth/myAccount') {
        return { data: await getCurrentUser(supabase) };
      }
      if (route === '/catalog/releases' || route === '/catalog/releases/all') {
        return { data: await getReleases(supabase, params) };
      }

      const listingsMatch = route.match(
        /^\/catalog\/releases\/(\d+)\/listings$/
      );
      if (listingsMatch) {
        return {
          data: await getListings(
            supabase,
            Number(listingsMatch[1]),
            Number(params.sort ?? 0)
          ),
        };
      }

      const releaseMatch = route.match(/^\/catalog\/releases\/(\d+)$/);
      if (releaseMatch) {
        return { data: await getRelease(supabase, Number(releaseMatch[1])) };
      }

      return errorResult(
        new Error(`Supabase demo mode does not support ${method} ${route} yet`)
      );
    } catch (error) {
      return errorResult(error);
    }
  };
}
