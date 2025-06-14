import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { catalogApi } from './catalog/api';
import { authApi } from './auth/api';
import { cartApi } from './cart/api';
import { adminApi } from './admin/api';
import { inventoryApi } from './inventory/api';
import { ordersApi } from './orders/api';
import { sellerApi } from './seller/api';


export const store = configureStore({
  reducer: {
    [catalogApi.reducerPath]: catalogApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(catalogApi.middleware)
      .concat(authApi.middleware)
      .concat(cartApi.middleware)
      .concat(adminApi.middleware)
      .concat(inventoryApi.middleware)
      .concat(ordersApi.middleware)
      .concat(sellerApi.middleware),

});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
