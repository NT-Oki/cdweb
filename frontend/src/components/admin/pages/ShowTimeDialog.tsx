// components/ShowtimeDialog.tsx (hoặc .jsx)
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress, // Để hiển thị trạng thái loading
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import API_URLS from '../../../config/api'; // Đảm bảo đường dẫn đúng

interface ShowtimeRequestDTO { // Đổi tên để rõ ràng hơn
  movieId: number;
  roomId: number;
  showDate: string; // Đây sẽ là "dd/MM/yyyy"
  startTime: string; // Đây sẽ là "yyyy-MM-dd'T'HH:mm"
}

// NOTE: Interface cho Movie (từ API list_movie)
interface MovieOption {
  id: number;
  nameMovie: string;
  // Có thể thêm durationMovie nếu muốn hiển thị thông tin phim khi chọn
  durationMovie?: string; // Giả định có để tính toán kết thúc
}

// NOTE: Interface cho Room (từ API list_room)
interface RoomOption {
  id: number;
  roomName: string;
}

// NOTE: Showtime (để truyền vào initialData khi edit)
interface Showtime {
  id: number;
  movie: { id: number; nameMovie: string; durationMovie?: string; }; // Chỉ cần ID và tên cho initialData
  room: { id: number; roomName: string; };   // Chỉ cần ID và tên cho initialData
  showDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm:ss" hoặc "HH:mm"
}


interface ShowtimeDialogProps {
  open: boolean;
  onClose: () => void;
  initialData: Showtime | null; // Đổi tên prop từ `showtime`
  onSubmit: () => void; // Hàm này sẽ gọi useSnackbar trong ShowTimeAdmin
}
interface ShowtimeDialogErrors {
  movieId?: string;
  roomId?: string;
  showDate?: string;
  startTime?: string;
}

function ShowtimeDialog({ open, onClose, initialData, onSubmit }: ShowtimeDialogProps) {
  const token = localStorage.getItem("token");
  const isEdit = Boolean(initialData);

  // States cho form
  const [movieId, setMovieId] = useState<number | ''>(initialData?.movie.id || '');
  const [roomId, setRoomId] = useState<number | ''>(initialData?.room.id || '');
  const [showDate, setShowDate] = useState<string>(initialData?.showDate || ''); // YYYY-MM-DD
  // Nếu startTime từ backend là HH:mm:ss, cần chuyển sang HH:mm
  const [startTime, setStartTime] = useState<string>(initialData?.startTime.substring(0, 5) || ''); // HH:mm

  // States cho dữ liệu dropdown
  const [movies, setMovies] = useState<MovieOption[]>([]);
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // State cho lỗi validation
 const [errors, setErrors] = useState<ShowtimeDialogErrors>({});

  useEffect(() => {
    if (open) { 
      // Reset form khi mở dialog
      setErrors({});
      if (initialData) {
        setMovieId(initialData.movie.id);
        setRoomId(initialData.room.id);
        setShowDate(initialData.showDate);
        setStartTime(initialData.startTime.substring(0, 5)); // Đảm bảo HH:mm
      } else {
        setMovieId('');
        setRoomId('');
        setShowDate('');
        setStartTime('');
      }
      // Fetch movies và rooms mỗi khi dialog mở
      fetchMovies();
      fetchRooms();
    }
  }, [open, initialData]);

  const fetchMovies = async () => {
    setLoadingMovies(true);
    try {
      const response = await axios.get(API_URLS.ADMIN.movie.list_movie, { // Thay đổi API_URLS nếu cần
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phim:", err);
      // alert("Lỗi khi tải danh sách phim."); // Có thể dùng Snackbar ở đây
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const response = await axios.get(API_URLS.ADMIN.room.list_room, { // Thay đổi API_URLS nếu cần
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng:", err);
      // alert("Lỗi khi tải danh sách phòng."); // Có thể dùng Snackbar ở đây
    } finally {
      setLoadingRooms(false);
    }
  };

  const validateForm = (): boolean => {
let tempErrors: ShowtimeDialogErrors = {};
    let isValid = true;

    if (!movieId) {
      tempErrors.movieId = 'Vui lòng chọn phim.';
      isValid = false;
    }
    if (!roomId) {
      tempErrors.roomId = 'Vui lòng chọn phòng chiếu.';
      isValid = false;
    }
    if (!showDate) {
      tempErrors.showDate = 'Vui lòng chọn ngày chiếu.';
      isValid = false;
    }
    if (!startTime) {
      tempErrors.startTime = 'Vui lòng chọn thời gian bắt đầu.';
      isValid = false;
    }

    // TODO: Thêm logic kiểm tra thời gian hợp lệ, trùng lịch chiếu, v.v.
    // Ví dụ: startTime + movieDuration không được trùng với suất khác trong cùng phòng

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
     // --- BẮT ĐẦU: Định dạng lại dữ liệu cho Backend DTO ---

// 1. Định dạng showDate từ "YYYY-MM-DD" sang "dd/MM/yyyy"
const [year, month, day] = showDate.split('-'); // showDate state là "YYYY-MM-DD"
// Sử dụng template literal (dấu ` `` `) và chèn biến `${day}`, `${month}`, `${year}`
const formattedShowDateForBackend = `${day}/${month}/${year}`; // <-- ĐÂY LÀ ĐOẠN MÃ ĐÚNG

// 2. Định dạng startTime từ "HH:mm" thành "yyyy-MM-dd'T'HH:mm"
// Lấy phần ngày từ showDate (state, vẫn đang là "YYYY-MM-DD") và ghép với startTime (state, "HH:mm")
// Sử dụng template literal (dấu ` `` `) và chèn biến `${showDate}`, `${startTime}`
const formattedStartTimeForBackend = `${showDate}T${startTime}`; // <-- ĐÂY LÀ ĐOẠN MÃ ĐÚNG

// --- KẾT THÚC: Định dạng lại dữ liệu ---



      // Xây dựng đối tượng DTO để gửi lên backend
    const showtimeData: ShowtimeRequestDTO = { // Sử dụng interface ShowtimeRequestDTO đã cập nhật
      movieId: movieId as number,
      roomId: roomId as number,
      showDate: formattedShowDateForBackend, // Gán chuỗi đã định dạng
      startTime: formattedStartTimeForBackend, // Gán chuỗi đã định dạng
    };

    try {
      if (isEdit) {
        await axios.put(API_URLS.ADMIN.showtime.update(initialData!.id), showtimeData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(API_URLS.ADMIN.showtime.add, showtimeData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onSubmit(); // Gọi hàm onSubmit của cha để re-fetch data và hiển thị Snackbar
      onClose();
    } catch (err: any) {
      console.error("Lỗi khi lưu suất chiếu:", err.response?.data || err.message);
      // Bạn có thể truyền lỗi cụ thể về component cha để hiển thị Snackbar lỗi
      alert("Lỗi khi lưu suất chiếu: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu mới'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {isEdit && (
            <TextField
              label="ID Suất chiếu"
              value={initialData?.id || ''}
              disabled
              variant="filled"
              size="small"
            />
          )}

          <FormControl fullWidth error={!!errors.movieId}>
            <InputLabel id="movie-select-label">Phim</InputLabel>
            <Select
              labelId="movie-select-label"
              value={movieId}
              label="Phim"
              onChange={(e) => setMovieId(Number(e.target.value))}
              disabled={loadingMovies || isEdit} // Vô hiệu hóa khi đang tải hoặc ở chế độ chỉnh sửa (thường không đổi phim)
            >
              {loadingMovies ? (
                <MenuItem disabled>
                  <CircularProgress size={20} /> Đang tải phim...
                </MenuItem>
              ) : movies.length === 0 ? (
                <MenuItem disabled>Không có phim nào</MenuItem>
              ) : (
                movies.map((movie) => (
                  <MenuItem key={movie.id} value={movie.id}>
                    {movie.nameMovie}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.movieId && <Typography color="error" variant="caption">{errors.movieId}</Typography>}
          </FormControl>

          <FormControl fullWidth error={!!errors.roomId}>
            <InputLabel id="room-select-label">Phòng chiếu</InputLabel>
            <Select
              labelId="room-select-label"
              value={roomId}
              label="Phòng chiếu"
              onChange={(e) => setRoomId(Number(e.target.value))}
              disabled={loadingRooms || isEdit} // Vô hiệu hóa khi đang tải hoặc ở chế độ chỉnh sửa (thường không đổi phòng)
            >
              {loadingRooms ? (
                <MenuItem disabled>
                  <CircularProgress size={20} /> Đang tải phòng...
                </MenuItem>
              ) : rooms.length === 0 ? (
                <MenuItem disabled>Không có phòng nào</MenuItem>
              ) : (
                rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.roomName}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.roomId && <Typography color="error" variant="caption">{errors.roomId}</Typography>}
          </FormControl>

          <TextField
            label="Ngày chiếu"
            type="date"
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            error={!!errors.showDate}
            helperText={errors.showDate}
          />

          <TextField
            label="Thời gian bắt đầu"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            error={!!errors.startTime}
            helperText={errors.startTime}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShowtimeDialog;