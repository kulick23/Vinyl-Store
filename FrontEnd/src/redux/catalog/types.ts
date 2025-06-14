export interface VinylRecord {
  id: number;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  genre?: string;
  releaseYear?: number;
  isOnSale: boolean;
  originalPrice: number | null;
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
  price: number;
  condition: number;
  [key: string]: any;
}

// Если в будущем понадобится обёртка из API
export interface ReleaseResponse {
  release: VinylRecord;
  listings: Listing[];
}
