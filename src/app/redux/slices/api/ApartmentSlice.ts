import { Apartment } from '@app/definitions';
import customBaseQuery from '@app/rest/Client';
import Endpoints from '@app/rest/Endpoints';
import { createApi } from '@reduxjs/toolkit/query/react';

export const apartmentApi = createApi({
  reducerPath: 'apartmentApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getApartments: builder.query<Apartment[], void>({
      query: () => Endpoints.APARTMENT.GET_ALL,
    }),
    getApartmentById: builder.query<Apartment, number>({
      query: (id) => Endpoints.APARTMENT.GET_BY_ID(id),
    }),
  }),
});

export const { useGetApartmentsQuery, useGetApartmentByIdQuery } = apartmentApi;
