const BASE_URL = "http://localhost:8080";
const BOOKING_URL=`${BASE_URL}/booking`;
const ADMIN_URL=`${BASE_URL}/admin`;
const MOVIE_URL = `${BASE_URL}/movies`;
const LOGIN_URL=`${BASE_URL}/login`;
const REGISTER_URL = `${BASE_URL}/register`;
const ADMIN_ROOMS_URL = `${ADMIN_URL}/rooms`;

const API_URLS = {
  BOOKING: {
    chooseSeat: `${BOOKING_URL}/choose-seat`,
  },
  MOVIE: {
    list: `${MOVIE_URL}/list`,
    detail: (id: number) => `${BASE_URL}/movies/detail/${id}`,
  },
  AUTH: {
    login: LOGIN_URL,
    register: REGISTER_URL,
  },
  ADMIN: {
    room:{
      list_room:`${ADMIN_ROOMS_URL}/list-room`,
      delete: (id:number)=>`${ADMIN_ROOMS_URL}/status/${id}`,
      update: (id:number)=>`${ADMIN_ROOMS_URL}/${id}`,
      save: `${ADMIN_ROOMS_URL}/add`,
    }
  }
};


export default API_URLS;
