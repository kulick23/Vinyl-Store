import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '../base'
import type { Order, OrderDto, CreateOrderRequest, ConfirmOrderRequest } from './types'

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
     * Response: OrderDto[]
     */
    getOrders: builder.query<OrderDto[], void>({
      query: () => '',
      providesTags: ['Orders']
    }),

    /**
     * GET /api/orders/{id}
     * Получить один заказ по ID
     * Response: OrderDto
     */
    getOrderById: builder.query<OrderDto, number>({
      query: id => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    }),

    /**
     * POST /api/orders/confirm
     * Подтвердить заказ через payment intent
     * Body: ConfirmOrderRequest
     * Response: OrderDto
     */
    confirmOrder: builder.mutation<OrderDto, ConfirmOrderRequest>({
      query: data => ({
        url: 'confirm',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Orders']
    })
  })
})

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useConfirmOrderMutation
} = ordersApi
