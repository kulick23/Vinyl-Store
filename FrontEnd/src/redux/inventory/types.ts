/** Элемент инвентаря */
export interface InventoryItem {
  id: number
  releaseId: number
  price: number
  quantity: number
  condition: number
  notes?: string
  isActive: boolean
}

/** Пэйлоад для создания нового элемента */
export interface CreateInventoryPayload {
  releaseId: number
  price: number
  quantity: number
  condition: number
  notes?: string
}

/** Пэйлоад для полной замены элемента */
export interface UpdateInventoryPayload {
  releaseId: number
  price: number
  quantity: number
  condition: number
  notes?: string
}

/** Пэйлоад для частичного обновления */
export interface PatchInventoryPayload {
  price?: number
  quantity?: number
  condition?: number
  notes?: string
  isActive?: boolean
}
