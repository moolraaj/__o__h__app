import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sliderSlice = createApi({
  reducerPath: 'sliderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://o-h-app.vercel.app' }),
  tagTypes: ['Slider'],
  endpoints: () => ({}), 
});
