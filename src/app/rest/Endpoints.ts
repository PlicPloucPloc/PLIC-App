const Endpoints = {
  USER: {
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    CHECK_EMAIL: (email: string) => `/user/checkEmail/${email.toLowerCase()}`,
    GET_ID: '/user/id',
    REFRESH: '/user/refresh',
  },
  RELATIONS: {
    GET_ALL_PAGINATED: (offset: number, limit: number) =>
      `/relations/all?skip=${offset}&limit=${limit}`,
    GET_LIKES_PAGINATED: (isFilterColoc: boolean, offset: number, limit: number) =>
      `/relations/likes/${isFilterColoc}?skip=${offset}&limit=${limit}`,
    GET_DISLIKES_PAGINATED: (offset: number, limit: number) =>
      `/relations/dislikes?skip=${offset}&limit=${limit}`,
    POST_RELATION: '/relations',
    UPDATE_RELATION: '/relations',
    DELETE_RELATION: '/relations',
  },
  APARTMENT: {
    NO_RELATIONS_PAGINATED: (offset: number, limit: number) =>
      `/apt/noRelations?offset=${offset}&limit=${limit}`,
    GET_INFO_PAGINATED: (offset: number, limit: number) => `/apt?offset=${offset}&limit=${limit}`,
    GET_INFO_BY_ID: (id: number) => `/apartment/${id}`,
  },
};

export default Endpoints;
