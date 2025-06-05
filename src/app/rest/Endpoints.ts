const Endpoints = {
  APARTMENT: {
    GET_ALL: '/apartment',
    GET_BY_ID: (id: number) => `/apartment/${id}`,
  },
  USER: {
    LOGIN: '/user/login',
    REGISTER: '/user/register',
  },
};

export default Endpoints;
