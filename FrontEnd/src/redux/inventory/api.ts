import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  InventoryItem,
  CreateInventoryPayload,
  UpdateInventoryPayload,
  PatchInventoryPayload
} from './types'

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/inventory',
    credentials: 'include'
  }),
  tagTypes: ['Inventory'],
  endpoints: builder => ({
    /**
     * GET /api/inventory
     * Response: InventoryItem[]
     */
    getInventory: builder.query<InventoryItem[], void>({
      query: () => '',
      providesTags: ['Inventory']
    }),

    /**
     * POST /api/inventory
     * Body: CreateInventoryPayload
     * Response: InventoryItem
     */
    createInventoryItem: builder.mutation<InventoryItem, CreateInventoryPayload>({
      query: payload => ({
        url: '',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Inventory']
    }),

    /**
     * GET /api/inventory/{id}
     * Response: InventoryItem
     */
    getInventoryById: builder.query<InventoryItem, number>({
      query: id => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Inventory', id }]
    }),

    /**
     * DELETE /api/inventory/{id}
     * Response: void
     */
    deleteInventoryItem: builder.mutation<void, number>({
      query: id => ({
        url: `${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Inventory']
    }),

    /**
     * PUT /api/inventory/{id}
     * Body: UpdateInventoryPayload
     * Response: InventoryItem
     */
    updateInventoryItem: builder.mutation<InventoryItem, { id: number; data: UpdateInventoryPayload }>({
      query: ({ id, data }) => ({
        url: `${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }, 'Inventory']
    }),

    /**
     * PATCH /api/inventory/{id}
     * Body: PatchInventoryPayload
     * Response: InventoryItem
     */
    patchInventoryItem: builder.mutation<InventoryItem, { id: number; data: PatchInventoryPayload }>({
      query: ({ id, data }) => ({
        url: `${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }, 'Inventory']
    })
  })
})

export const {
  useGetInventoryQuery,
  useCreateInventoryItemMutation,
  useGetInventoryByIdQuery,
  useDeleteInventoryItemMutation,
  useUpdateInventoryItemMutation,
  usePatchInventoryItemMutation
} = inventoryApi