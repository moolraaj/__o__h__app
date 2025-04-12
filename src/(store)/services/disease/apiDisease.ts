import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const diseaseSlice = createApi({
     
  reducerPath: 'diseaseApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Disease'],
  endpoints: () => ({}), 
});
