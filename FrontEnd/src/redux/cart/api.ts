import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { CartDto, CartItemPayload } from './types'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: createBaseQuery({ baseUrl: '/Cart' }),
  tagTypes: ['Cart'],
  endpoints: builder => ({
    /**
     * GET /api/Cart
     * Response: CartDto
     */
    getCart: builder.query<CartDto, void>({
      query: () => '',
      providesTags: ['Cart']
    }),

    /**
     * DELETE /api/Cart
     * Response: void
     */
    clearCart: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'DELETE' }),
      invalidatesTags: ['Cart']
    }),

    /**
     * POST /api/Cart/items
     * Body: CartItemPayload
     * Response: void
     */
    addCartItem: builder.mutation<void, CartItemPayload>({
      query: payload => ({
        url: 'items',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Cart']
    }),

    /**
     * PATCH /api/Cart/items/{itemId}
     * Body: { quantity: number }
     * Response: void
     */
    updateCartItem: builder.mutation<
      void,
      { itemId: number; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `items/${itemId}`,
        method: 'PATCH',
        body: { quantity }
      }),
      invalidatesTags: ['Cart']
    }),

    /**
     * DELETE /api/Cart/items/{itemId}
     * Response: void
     */
    deleteCartItem: builder.mutation<void, number>({
      query: itemId => ({
        url: `items/${itemId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    }),

    /**
     * POST /api/Cart/merge
     * Body: CartItemPayload[]
     * Response: void
     */
    mergeCart: builder.mutation<void, CartItemPayload[]>({
      query: items => ({
        url: 'merge',
        method: 'POST',
        body: items
      }),
      invalidatesTags: ['Cart']
    })
  })
})

export const {
  useGetCartQuery,
  useClearCartMutation,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useMergeCartMutation
} = cartApi
