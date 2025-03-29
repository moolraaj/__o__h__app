import { GetUsersQueryParams, PaginatedUsersResponse } from '@/utils/Types';
import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUsersResponse, GetUsersQueryParams>({
      query: ({ page = 1, limit = 10, role }) => {
        
        const params: { page: number; limit: number; role?: string } = { page, limit };
        if (role) params.role = role;
        return {
          url: '/api/auth/users',
          params,
        };
      },
      providesTags: ['User'],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
