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
