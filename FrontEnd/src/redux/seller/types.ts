/** Модель продавца для страницы продавца */
export interface SellerPageDto {
  /** уникальный ID продавца */
  sellerId: number
  /** отображаемое имя */
  displayName: string
  /** описание профиля */
  description: string
  /** рейтинг продавца */
  rating: number
  /** отзывы о продавце */
  reviews: ReviewDto[]
}

/** DTO профиля продавца */
export interface SellerProfileDto {
  /** ID связанного пользователя (customer) */
  customerId: number
  /** отображаемое имя магазина */
  displayName: string
  /** описание магазина */
  description?: string
  /** рейтинг продавца */
  rating: number
  /** путь к аватару */
  avatarPath?: string
}

/** DTO для создания профиля продавца */
export interface SellerProfileCreateDto {
  /** отображаемое имя магазина */
  displayName: string
  /** описание магазина */
  description: string
}

/** DTO для обновления профиля продавца */
export interface SellerProfileUpdateDto {
  /** отображаемое имя магазина */
  displayName: string
  /** описание магазина */
  description: string
}

/** DTO отзыва */
export interface ReviewDto {
  id: number
  sellerId: number
  customerId: number
  rating: number
  comment: string
  created: string
  customer?: {
    id: number
    firstName: string
    lastName: string
  }
}

/** DTO для создания отзыва */
export interface CreateReviewDto {
  rating: number
  comment: string
  sellerId: number
}

// Legacy type for backward compatibility
export interface Seller extends SellerProfileDto {
  id: number
  sellerProfile?: string
}
