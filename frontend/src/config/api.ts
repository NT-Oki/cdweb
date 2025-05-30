const BASE_URL = "http://localhost:8080";
const BOOKING_URL=`${BASE_URL}/booking`;
const MOVIE_URL = `${BASE_URL}/movies`;
const LOGIN_URL=`${BASE_URL}/login`;
const REGISTER_URL = `${BASE_URL}/register`;
const ADMIN_USER_URL = `${BASE_URL}/admin/users`;

const API_URLS = {
  BOOKING: {
    chooseSeat: `${BOOKING_URL}/choose-seat`,
  },
  MOVIE: {
    list: `${MOVIE_URL}/list`,
    detail: (id) => `${BASE_URL}/movies/detail/${id}`,
  },
  AUTH: {
    login: LOGIN_URL,
    register: REGISTER_URL,
  },
  ADMIN_USER: {
    list: `${ADMIN_USER_URL}/list`,
    add: `${ADMIN_USER_URL}/add`,
    delete: (id) => `${ADMIN_USER_URL}/delete/${id}`,
    deleteMultiple: `${ADMIN_USER_URL}/delete-multiple`,
    detail: (id) => `${ADMIN_USER_URL}/detail/${id}`,
  },
};


export default API_URLS;
