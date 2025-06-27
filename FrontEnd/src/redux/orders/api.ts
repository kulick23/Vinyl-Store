import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { Order, CreateOrderRequest } from './types'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: createBaseQuery({ baseUrl: '/orders' }),
  tagTypes: ['Orders', 'Order'],
  endpoints: builder => ({
    /**
     * POST /api/orders
     * Создать новый заказ
     * Body: CreateOrderRequest
     * Response: Order
     */
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: data => ({
        url: '',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Orders']
    }),

    /**
     * GET /api/orders
     * Получить список всех заказов
     * Response: Order[]
     */
    getOrders: builder.query<Order[], void>({
      query: () => '',
      providesTags: ['Orders']
    }),

    /**
     * GET /api/orders/{id}
     * Получить один заказ по ID
     * Response: Order
     */
    getOrderById: builder.query<Order, number>({
      query: id => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    })
  })
})

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery
} = ordersApi
