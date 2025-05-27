import { Apartment } from '@app/definitions';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const customBaseQuery: BaseQueryFn<
  string | FetchArgs, // The argument to the query (path or FetchArgs object)
  unknown, // The returned data type (you can specify if known)
  FetchBaseQueryError // The error type
> = async (args, api, extraOptions) => {
  console.log('Making request with args:', args);

  const rawBaseQuery = fetchBaseQuery({ baseUrl: 'http://10.41.177.155:3000' });
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    console.error(`Error while fetching ${args}:`, result.error);
  }

  return result;
};

export const apartmentApi = createApi({
  reducerPath: 'apartmentApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getApartments: builder.query<Apartment[], void>({
      query: () => '/apartment',
    }),
    getApartmentById: builder.query<Apartment, number>({
      query: (id) => `/apartment/${id}`,
    }),
  }),
});

export const { useGetApartmentsQuery, useGetApartmentByIdQuery } = apartmentApi;
