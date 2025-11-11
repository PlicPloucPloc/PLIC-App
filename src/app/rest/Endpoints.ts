const Endpoints = {
  USER: {
    INFO: '/user/id',
    OTHER_INFO: (userId: string) => `/user/${userId}`,
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    CHECK_EMAIL: (email: string) => `/user/checkEmail/${email.toLowerCase()}`,
    RESEND_EMAIL: () => '/user/resend',
    REFRESH: '/user/refresh',
    RECOMMENDED_COLLOC: (offset: number, limit: number) =>
      `/user/recommendedColloc?skip=${offset}&limit=${limit}`,
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
  CHAT: {
    GET_ROOMS: '/rooms',
    UPDATE_ROOMS: '/rooms',
    CREATE_ROOM: '/rooms',
    DELETE_ROOM: (id: number) => `/rooms/${id}`,
    GET_MESSAGE: (id: number) => `/rooms/${id}`,
  },
};

export default Endpoints;
