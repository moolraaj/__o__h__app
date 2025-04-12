
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '../services/user/apiSlice';
import { sliderSlice } from '../services/slider/apiSlider';
import { diseaseSlice } from '../services/disease/apiDisease';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [sliderSlice.reducerPath]: sliderSlice.reducer,
    [diseaseSlice.reducerPath]: diseaseSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(sliderSlice.middleware)
      .concat(diseaseSlice.middleware),
      
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
