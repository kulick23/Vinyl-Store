import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { catalogApi } from './catalog/api';
import { authApi } from './auth/api';
import authReducer from './auth/authSlice';
import { cartApi } from './cart/api';
import { adminApi } from './admin/api';
import { inventoryApi } from './inventory/api';
import { ordersApi } from './orders/api';
import { sellerApi } from './seller/api';

// ПЕРЕОПРЕДЕЛЯЕМ fetch, чтобы все запросы ‘/api/…’ шли на PROD API
const API_URL = import.meta.env.VITE_API_URL ?? '';
const nativeFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    input = API_URL + input;
  }
  return nativeFetch(input, init);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
  },
  middleware: (gDM) =>
    gDM({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(catalogApi.middleware)
      .concat(cartApi.middleware)
      .concat(adminApi.middleware)
      .concat(inventoryApi.middleware)
      .concat(ordersApi.middleware)
      .concat(sellerApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
