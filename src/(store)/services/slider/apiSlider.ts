import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sliderSlice = createApi({
  reducerPath: 'sliderApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Slider'],
  endpoints: () => ({}), 
});
