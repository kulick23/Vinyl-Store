/** Модель продавца */
export interface Seller {
  /** уникальный ID продавца */
  id: number
  /** отображаемое имя */
  displayName: string
  /** описание профиля */
  description: string
  /** рейтинг продавца */
  rating: number
  /** общее количество продаж */
  totalSales: number
  /** ID связанного пользователя (customer) */
  userId: number
  /** опционально: ссылка на пользователя */
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

/** Запрос на создание профиля продавца */
export interface BecomeSellerRequest {
  DisplayName: string
  Description: string
}

/** Профиль продавца с отзывами */
export interface SellerProfile {
  sellerId: number
  displayName: string
  description: string
  rating: number
  reviews: ReviewDto[]
}

/** Обзор/отзыв о продавце */
export interface ReviewDto {
  id: number
  customerId: number
  customerName: string
  rating: number
  comment: string
  created: string
}

/** Запрос на обновление профиля продавца */
export interface UpdateSellerProfileRequest {
  DisplayName: string
  Description: string
}
