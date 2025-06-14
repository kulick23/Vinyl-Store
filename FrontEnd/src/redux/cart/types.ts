/** Товар в корзине */
export interface CartItem {
  /** уникальный ID записи в корзине */
  id: number
  /** ID элемента инвентаря */
  inventoryItemId: number
  /** количество */
  quantity: number
}

/** Пэйлоад для добавления/слияния товара */
export interface CartItemPayload {
  inventoryItemId: number
  quantity: number
}