/** Модель продавца */
export interface Seller {
  /** уникальный ID продавца */
  id: number
  /** ID связанного пользователя (customer) */
  customerId: number
  /** отображаемое имя */
  displayName: string
  /** описание профиля */
  description: string
  /** рейтинг продавца */
  rating: number
  /** опционально: ссылка на профиль или дополнительные поля */
  sellerProfile?: string
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
