/** Order item details */
export interface OrderItemDto {
  inventoryItemId: number
  title: string
  quantity: number
  unitPrice: number
  subtotal: number
}

/** Complete order information from backend */
export interface OrderDto {
  orderId: number
  orderDate: string
  total: number
  items: OrderItemDto[]
}

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

/** Подтверждение заказа через payment intent */
export interface ConfirmOrderRequest {
  intentId: string
}
