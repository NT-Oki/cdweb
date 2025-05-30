const BASE_URL = "http://localhost:8080";
const BOOKING_URL=`${BASE_URL}/booking`;
const MOVIE_URL = `${BASE_URL}/movies`;
const LOGIN_URL=`${BASE_URL}/login`;
const REGISTER_URL = `${BASE_URL}/register`;

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
  }
};


export default API_URLS;
