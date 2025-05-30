const BASE_URL = "http://localhost:8080";
const BOOKING_URL=`${BASE_URL}/booking`;
const ADMIN_URL=`${BASE_URL}/admin`;
const MOVIE_URL = `${BASE_URL}/movies`;
const LOGIN_URL=`${BASE_URL}/login`;
const REGISTER_URL = `${BASE_URL}/register`;
const ADMIN_ROOMS_URL = `${ADMIN_URL}/rooms`;
const ADMIN_SHOWTIMES_URL = `${ADMIN_URL}/showtimes`;
const ADMIN_MOVIES_URL = `${ADMIN_URL}/movies`;
const ADMIN_USER_URL = `${BASE_URL}/admin/users`;

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
    },
    showtime:{
      list_showtime:`${ADMIN_SHOWTIMES_URL}/`
    },
    movie:{
      list_movie:`${ADMIN_MOVIES_URL}/list`,
      add:`${ADMIN_MOVIES_URL}/add`,
    }
  },
  ADMIN_USER: {
    list: `${ADMIN_USER_URL}/list`,
    add: `${ADMIN_USER_URL}/add`,
    delete: (id:number) => `${ADMIN_USER_URL}/delete/${id}`,
    deleteMultiple: `${ADMIN_USER_URL}/delete-multiple`,
    detail: (id: number) => `${ADMIN_USER_URL}/detail/${id}`,
  },
};


export default API_URLS;
