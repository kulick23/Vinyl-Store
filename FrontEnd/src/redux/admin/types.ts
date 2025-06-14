/** Админ-артист */
export interface AdminArtist {
  id: number
  name: string
}

/** Админ-жанр */
export interface AdminGenre {
  id: number
  name: string
}

/** Админ-релиз */
export interface AdminRelease {
  id: number
  title: string
  year: number
  artist: string
  genre: string
}

/** Пэйロード для создания/обновления релиза */
export interface AdminReleasePayload {
  title: string
  year: number
  artistId: number
  genreId: number
  listings: {
    id: number
    releaseId: number
    sellerId: number
    price: number
    quantity: number
    condition: number
    notes?: string
    createdAt: string
  }[]
}

/** Админ-продавец */
export interface AdminSeller {
  id: number
  sellerId: number
  displayName: string
  description: string
  rating: number
}

/** Админ-пользователь */
export interface AdminUser {
  id: string
  email: string
  isEmailConfirmed: boolean
  firstName: string
  lastName: string
  phone?: string
  lastLoginAt: string
  createdAt: string
}
