const Endpoints = {
  USER: {
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    CHECK_EMAIL: (email: string) => `/user/checkEmail/${email.toLowerCase()}`,
    GET_ID: '/user/id',
    REFRESH: '/user/refresh',
  },
  RELATIONS: {
    GET_ALL_PAGINATED: (offset: number) => `/relations/all?skip=${offset}`,
    GET_LIKES_PAGINATED: (isFilterColoc: boolean, offset: number) =>
      `/relations/likes/${isFilterColoc}?skip=${offset}`,
    GET_DISLIKES_PAGINATED: (offset: number) => `/relations/dislikes?skip=${offset}`,
    POST_RELATION: '/relations',
    UPDATE_RELATION: '/relations',
    DELETE_RELATION: '/relations',
  },
  APARTMENT: {
    GET_INFO_PAGINATED: (offset: number) => `/apt?offset=${offset}`,
    GET_INFO_BY_ID: (id: number) => `/apartment/${id}`,
    NO_RELATIONS_PAGINATED: (offset: number) => `/apt/noRelations?offset=${offset}`,
  },
};

export default Endpoints;
