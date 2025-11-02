const Endpoints = {
  USER: {
    INFO: '/user/id',
    OTHER_INFO: (userId: string) => `/user/${userId}`,
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    CHECK_EMAIL: (email: string) => `/user/checkEmail/${email.toLowerCase()}`,
    RESEND_EMAIL: () => '/user/resend',
    REFRESH: '/user/refresh',
    RECOMMENDED_COLLOC: '/user/recommendedColloc',
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
    UPDATE_ALLOW_COLLOC: (allowColloc: boolean) =>
      `/relations/allowColloc?allowColloc=${allowColloc}`,
  },
  APARTMENT: {
    NO_RELATIONS_PAGINATED: (offset: number, limit: number) =>
      `/apt/noRelations?offset=${offset}&limit=${limit}`,
    GET_INFO_PAGINATED: (offset: number, limit: number) => `/apt?offset=${offset}&limit=${limit}`,
    GET_INFO_BY_ID: (id: number) => `/apartment/${id}`,
  },
};

export default Endpoints;
