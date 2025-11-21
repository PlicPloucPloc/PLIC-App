const Endpoints = {
  USER: {
    MY_INFO: '/user/check',
    OTHER_INFO: (userId: string) => `/user/?id=${userId}`,
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
    POST_RELATION: '/relations',
    UPDATE_RELATION: '/relations',
    DELETE_RELATION: '/relations',
    UPDATE_ALLOW_COLLOC: (allowColloc: boolean) =>
      `/relations/allowColloc?allowColloc=${allowColloc}`,
    IS_COLLOC_ENABLED: '/relations/isColloc',
  },
  APARTMENT: {
    NO_RELATIONS_PAGINATED: (offset: number, limit: number, filters: string) =>
      `/apt/noRelations?offset=${offset}&limit=${limit}&${filters}`,
    GET_INFO_BY_ID: (id: number) => `/apartment/${id}`,
  },
  CHAT: {
    GET_ROOMS: '/chat/rooms',
    UPDATE_ROOMS: '/chat/rooms',
    CREATE_ROOM: '/chat/rooms',
    DELETE_ROOM: (id: number) => `/chat/rooms/${id}`,
    GET_MESSAGE: (id: number) => `/chat/rooms/${id}`,
  },
};

export default Endpoints;
