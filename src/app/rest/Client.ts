import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

// 3001 = User API
// 3002 = Apartment API
const PORT = 3002;

const HOST = '10.68.251.33';
const API_URL = `http://${HOST}:${PORT}`;

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  console.log('Making request with args:', args);

  const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL });
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    console.error(
      `Error while fetching ${typeof args === 'string' ? args : args.url}:`,
      result.error,
    );
  }

  return result;
};

export default customBaseQuery;
