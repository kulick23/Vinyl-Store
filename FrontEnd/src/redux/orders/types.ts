/** Позиция в заказе (для запроса и ответа) */
export interface OrderItemPayload {
  inventoryItemId: number
  quantity: number
}

/** Тело запроса на создание заказа */
export interface CreateOrderRequest {
  items: OrderItemPayload[]
  shippingAddress: string
  paymentMethod: string
}

/** Модель заказа, возвращаемая сервером */
export interface Order {
  id: number
  items: OrderItemPayload[]
  shippingAddress: string
  paymentMethod: string
  // при необходимости можно добавить здесь orderDate, status и т.п.
}
