import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { catalogApi } from './catalog/api';
import { authApi } from './auth/api';
import authReducer from './auth/authSlice';
import { cartApi } from './cart/api';
import { checkoutApi } from './checkout/api';
import { adminApi } from './admin/api';
import { inventoryApi } from './inventory/api';
import { ordersApi } from './orders/api';
import { sellerApi } from './seller/api';
import { reviewsApi } from './reviews/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      catalogApi.middleware,
      cartApi.middleware,
      checkoutApi.middleware,
      adminApi.middleware,
      inventoryApi.middleware,
      ordersApi.middleware,
      sellerApi.middleware,
      reviewsApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
