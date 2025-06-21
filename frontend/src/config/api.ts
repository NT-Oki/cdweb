const BASE_URL = "http://localhost:8080";
const BOOKING_URL = `${BASE_URL}/booking`;
const ADMIN_URL = `${BASE_URL}/admin`;
const MOVIE_URL = `${BASE_URL}/movies`;
const LOGIN_URL = `${BASE_URL}/auth/login`;
const REGISTER_URL = `${BASE_URL}/auth/register`;
const VERIFY_URL = `${BASE_URL}/auth/verify-email`;
const FORGOT_URL = `${BASE_URL}/auth/forgot-password`;
const RESET_URL = `${BASE_URL}/auth/reset-password`;
const LOGOUT_URL = `${BASE_URL}/logout`;
const ADMIN_ROOMS_URL = `${ADMIN_URL}/rooms`;
const ADMIN_SHOWTIMES_URL = `${ADMIN_URL}/showtimes`;
const ADMIN_MOVIES_URL = `${ADMIN_URL}/movies`;
const ADMIN_USER_URL = `${BASE_URL}/admin/users`;
const ADMIN_BOOKING_URL = `${ADMIN_URL}/bookings`;
const PAYMENT_URL = `${BOOKING_URL}/payment`;

const API_URLS = {
  BOOKING: {
    CHOOSE_SHOWTIME: `${BOOKING_URL}/show-time`,
    GET_SEAT: `${BOOKING_URL}/seats`,
    TOCHECKOUT: `${BOOKING_URL}/choose-seat`,
    PAYMENT:`${BOOKING_URL}/payment`,
    CREATE_BOOKING_SUCCESSFUL:(bookingId:number)=>`${BOOKING_URL}/payment-sucessful/${bookingId}`,
    TICKET:(bookingId:number)=>`${BOOKING_URL}/ticket/${bookingId}`,
  },
  MOVIE: {
    list: `${MOVIE_URL}/list`,
    detail: (id: number) => `${BASE_URL}/movies/detail/${id}`,
  },
  AUTH: {
    login: LOGIN_URL,
    register: REGISTER_URL,
    verifyEmail: VERIFY_URL,
    logout: LOGOUT_URL,
    forgotPassword: FORGOT_URL,
    resetPassword: RESET_URL,
  },
  ADMIN: {
    room: {
      list_room: `${ADMIN_ROOMS_URL}/list-room`,
      delete: (id: number) => `${ADMIN_ROOMS_URL}/soft-delete/${id}`,
      update: (id: number) => `${ADMIN_ROOMS_URL}/${id}`,
      save: `${ADMIN_ROOMS_URL}/add`,
    },
    showtime: {
      list_showtime: `${ADMIN_SHOWTIMES_URL}/`,
      add: `${ADMIN_SHOWTIMES_URL}/`,
      delete:(id:number)=> `${ADMIN_SHOWTIMES_URL}/status/${id}`,
      update:(id:number)=> `${ADMIN_SHOWTIMES_URL}/${id}`
    },
    movie: {
      list_movie: `${ADMIN_MOVIES_URL}/list`,
      add: `${ADMIN_MOVIES_URL}/add`,
      detail: (id: number) => `${ADMIN_MOVIES_URL}/detail/${id}`,
      delete: (id: number) => `${ADMIN_MOVIES_URL}/delete/${id}`,
    },
    booking:{
      list_booking:`${ADMIN_BOOKING_URL}/`,
      delete_booking:(bookingId:number)=>`${ADMIN_BOOKING_URL}/`,
      SEATS_WEEKLY: `${ADMIN_BOOKING_URL}/seats-weekly`,
    }
  },
  ADMIN_USER: {
    list: `${ADMIN_USER_URL}/list`,
    add: `${ADMIN_USER_URL}/add`,
    delete: (id: number) => `${ADMIN_USER_URL}/delete/${id}`,
    deleteMultiple: `${ADMIN_USER_URL}/delete-multiple`,
    detail: (id: number) => `${ADMIN_USER_URL}/detail/${id}`,
  },
  PAYMENT:{
    create_payment:`${PAYMENT_URL}/create_payment`
  }
};

export const apiRequest = async (
    url: string,
    options: RequestInit = {},
    logout?: () => void,
    navigate?: (path: string) => void
) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (logout && navigate) {
          logout();
          navigate('/login');
        }
        throw new Error('Phiên đăng nhập không hợp lệ hoặc không có quyền truy cập');
      }
      let errorMessage = 'Lỗi không xác định';
      try {
        const errorData = await response.json();
        if (typeof errorData === 'object' && errorData !== null) {
          errorMessage = errorData.message || Object.values(errorData).join(', ') || errorMessage;
        } else {
          errorMessage = errorData || errorMessage;
        }
      } catch (e) {
        // Nếu không parse được JSON, dùng status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return {};
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export default API_URLS;