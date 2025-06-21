// components/ShowTimeAdmin.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress, // Thêm để hiển thị loading
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_URLS from '../../../config/api';
import { SnackbarProvider, useSnackbar } from 'notistack'; // Import notistack

// Import ShowtimeDialog mới
import ShowtimeDialog from './ShowTimeDialog';

// NOTE: Cập nhật lại các interface theo dữ liệu thực tế từ API và DTO
// Tạm bỏ StatusFilm nếu không dùng trực tiếp trong ShowtimeAdmin
// interface StatusFilm {
//   id: number;
//   name: string;
// }

interface Movie {
  id: number;
  nameMovie: string;
  releaseDate?: string; // Optional nếu không phải lúc nào cũng có
  durationMovie?: string;
  actor?: string;
  director?: string;
  studio?: string;
  content?: string;
  trailer?: string;
  avatar?: string;
  statusFilmId?: { id: number; name: string }; // Có thể là object chứa id và name
}

interface Room {
  id: number;
  roomName: string;
  quantitySeat?: number; // Tạm thời để optional
  status?: string;
  description?: string;
  // Bổ sung các trường cần thiết khác nếu có
}

// NOTE: Interface Showtime cần khớp với dữ liệu nhận được từ backend (sau khi JOIN)
interface Showtime {
  id: number;
  movie: Movie; // Toàn bộ đối tượng Movie
  room: Room;   // Toàn bộ đối tượng Room
  showDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm:ss" hoặc "HH:mm"
  // Có thể có thêm các trường khác như price, availableSeats, v.v.
}

// NOTE: ShowtimeDTO (để gửi lên API)
interface ShowtimeRequestDTO {
  movieId: number;
  roomId: number;
  showDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss hoặc HH:mm (backend của bạn sẽ xử lý)
}


// Bọc ShowTimeAdmin với SnackbarProvider
export default function ShowTimeAdminWrapper() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <ShowTimeAdmin />
    </SnackbarProvider>
  );
}


function ShowTimeAdmin() {
  const token = localStorage.getItem("token");
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);

  // States cho Confirm Dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [showtimeToDeleteId, setShowtimeToDeleteId] = useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar(); // Hook từ notistack

  const fetchShowtime = async () => {
    try {
      const response = await axios.get(API_URLS.ADMIN.showtime.list_showtime, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowtimes(response.data);
    } catch (err: any) {
      console.error("Lỗi khi lấy danh sách suất chiếu:", err.response?.data || err.message);
      enqueueSnackbar("Lỗi khi tải danh sách suất chiếu.", { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchShowtime();
  }, []);

  const filteredShowtimes = showtimes.filter(
    (sc) =>
      sc.movie.nameMovie.toLowerCase().includes(searchText.toLowerCase()) ||
      sc.room.roomName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenDialog = (showtime?: Showtime) => {
    setEditingShowtime(showtime || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingShowtime(null); // Reset editingShowtime khi đóng dialog
  };

  // NOTE: onSave bây giờ không nhận Showtime mà chỉ re-fetch và thông báo
  const handleSaveSuccess = () => {
    setOpenDialog(false);
    setEditingShowtime(null);
    fetchShowtime(); // Re-fetch data sau khi lưu/cập nhật thành công
    enqueueSnackbar("Lưu suất chiếu thành công!", { variant: 'success' });
  };


  // Mở hộp thoại xác nhận xóa
  const handleOpenConfirmDelete = (id: number) => {
    setShowtimeToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  // Đóng hộp thoại xác nhận xóa
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDialog(false);
    setShowtimeToDeleteId(null);
  };

  // Thực hiện xóa sau khi xác nhận
  const handleConfirmDelete = async () => {
    if (showtimeToDeleteId === null) return;

    try {
      const response = await axios.post(API_URLS.ADMIN.showtime.delete(showtimeToDeleteId),{}, { // NOTE: Sử dụng DELETE thay vì PUT cho xóa
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      enqueueSnackbar(response.data || "Xóa suất chiếu thành công!", { variant: 'success' });
      fetchShowtime(); // Tải lại danh sách sau khi xóa
    } catch (err: any) {
      console.error("Lỗi khi xóa suất chiếu: ", err.response?.data || err.message);
      enqueueSnackbar("Lỗi khi xóa suất chiếu: " + (err.response?.data?.message || err.message), { variant: 'error' });
    } finally {
      handleCloseConfirmDelete(); // Luôn đóng dialog sau khi xử lý
    }
  };

  const getStatusText = (status: number) => { // NOTE: Đổi kiểu từ 1|2|3 sang number vì có thể lấy từ Movie.statusFilmId.id
    switch (status) {
      case 1:
        return 'Đang chiếu';
      case 2:
        return 'Sắp chiếu';
      case 3:
        return 'Ngừng chiếu';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: number) => { // NOTE: Đổi kiểu từ 1|2|3 sang number
    switch (status) {
      case 1:
        return 'green';
      case 2:
        return 'blue';
      case 3:
        return 'coral';
      default:
        return 'black';
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý suất chiếu
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Tìm kiếm phim hoặc phòng"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ width: 300 }}
        />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm suất chiếu mới
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ maxWidth: "80px" }}>Mã suất chiếu</TableCell>
              <TableCell sx={{ maxWidth: "150px" }}>Phim</TableCell>
              <TableCell>Phòng chiếu</TableCell>
              <TableCell>Trạng thái phim</TableCell> {/* Đổi tên cột cho rõ ràng */}
              <TableCell>Ngày chiếu</TableCell>    {/* Thêm cột Ngày chiếu */}
              <TableCell>Thời gian bắt đầu</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShowtimes.length > 0 ? (
              filteredShowtimes.map((sc) => (
                <TableRow key={sc.id}>
                  <TableCell>{sc.id}</TableCell>
                  <TableCell sx={{ maxWidth: "150px" }}>{sc.movie.nameMovie}</TableCell>
                  <TableCell>{sc.room.roomName}</TableCell>
                  <TableCell
                    sx={{
                      color: getStatusColor(sc.movie.statusFilmId?.id || 0), // Lấy status từ movie
                      fontWeight: "bold"
                    }}
                  >
                    {getStatusText(sc.movie.statusFilmId?.id || 0)}
                  </TableCell>
                  <TableCell>{sc.showDate}</TableCell> {/* Hiển thị ngày chiếu */}
                  <TableCell>{sc.startTime}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(sc)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenConfirmDelete(sc.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có suất chiếu nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ShowTimeDialog được hiển thị khi openDialog là true */}
      {openDialog && (
        <ShowtimeDialog
          open={openDialog}
          onClose={handleCloseDialog}
          initialData={editingShowtime} // Đổi tên prop cho thống nhất
          onSubmit={handleSaveSuccess} // Hàm này sẽ kích hoạt Snackbar trong ShowTimeAdmin
        />
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{"Xác nhận xóa suất chiếu?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa suất chiếu này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}