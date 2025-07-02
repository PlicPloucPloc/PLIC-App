const Endpoints = {
  APARTMENT: {
    GET_INFO_PAGINATED: (offset: number) => `/apt?offset=${offset}`,
    GET_INFO_BY_ID: (id: number) => `/apartment/${id}`,
  },
  USER: {
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    CHECK_EMAIL: (email: string) => `/user/checkEmail/${email.toLowerCase()}`,
    GET_ID: '/user/id',
    REFRESH: '/user/refresh',
  },
};

export default Endpoints;
