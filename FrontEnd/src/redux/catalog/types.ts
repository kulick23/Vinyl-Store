export interface VinylRecord {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre?: string;
  price?: number;
  imageUrl?: string;
  isOnSale?: boolean;
  originalPrice?: number | null;
  releaseYear?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Artist {
  id: number;
  name: string;
}

export interface Listing {
  id: number;
  releaseId: number;
  sellerId: number;
  sellerDisplayName: string;
  price: number;
  quantity: number;
  condition: number;
  sellerRating: number;
  notes?: string;
}

export interface ReleaseResponse {
  release: VinylRecord;
  listings: Listing[];
}

// Add type for paginated response from backend
export interface ReleasesResponse {
  items: VinylRecord[];
}

export interface FilterOptions {
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
