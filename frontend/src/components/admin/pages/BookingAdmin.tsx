// components/BookingAdmin.tsx
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
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_URLS from '../../../config/api';
import { SnackbarProvider, useSnackbar } from 'notistack';

// ShowtimeDialog không còn cần thiết cho BookingAdmin
// import ShowtimeDialog from './ShowTimeDialog'; 

interface BookingCheckoutDto {
  bookingId: number;
  userId: number;
  nameSeats: string[];
  quantityNormalSeat: number;
  totalPriceNormalSeat: number;
  quantityCoupleSeat: number;
  totalPriceCoupleSeat: number;
  totalPrice: number|null;
  movieName: string;
  startTime: string;
  roomName: string;
  bookingCode: string|null;
  userName: string;
  userEmail: string;
  userCode: string;
}

// Bọc BookingAdmin với SnackbarProvider
export default function BookingAdminW() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <BookingAdmin />
    </SnackbarProvider>
  );
}

function BookingAdmin() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState<BookingCheckoutDto[]>([]); // Khởi tạo là mảng rỗng
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

  // States cho Confirm Dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [bookingToDeleteId, setBookingToDeleteId] = useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const fetchBookings = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(API_URLS.ADMIN.booking.list_booking, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data);
    } catch (err: any) {
      console.error("Lỗi khi lấy danh sách đặt vé", err.response?.data || err.message);
      enqueueSnackbar("Lỗi khi lấy danh sách đặt vé", { variant: 'error' });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = data.filter(
    (booking) =>
      booking.movieName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.bookingCode?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Mở hộp thoại xác nhận xóa
  const handleOpenConfirmDelete = (id: number) => {
    setBookingToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  // Đóng hộp thoại xác nhận xóa
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDialog(false);
    setBookingToDeleteId(null);
  };

  // Thực hiện xóa sau khi xác nhận
  const handleConfirmDelete = async () => {
    if (bookingToDeleteId === null) return;

    try {
      const response = await axios.delete(API_URLS.ADMIN.booking.delete_booking(bookingToDeleteId), { // Cần có API endpoint cho việc xóa booking
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      enqueueSnackbar(response.data?.message || "Xóa đặt vé thành công!", { variant: 'success' });
      fetchBookings(); // Tải lại danh sách sau khi xóa
    } catch (err: any) {
      console.error("Lỗi khi xóa đặt vé: ", err.response?.data || err.message);
      enqueueSnackbar("Lỗi khi xóa đặt vé: " + (err.response?.data?.message || err.message), { variant: 'error' });
    } finally {
      handleCloseConfirmDelete(); // Luôn đóng dialog sau khi xử lý
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý đặt vé
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Tìm kiếm theo tên phim, phòng, khách hàng hoặc mã vé"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ width: 400 }}
        />
        {/* Nút "Thêm suất chiếu mới" không còn phù hợp với quản lý đặt vé */}
        {/* <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm suất chiếu mới
        </Button> */}
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>Mã đặt vé</TableCell>
                <TableCell sx={{ width: '120px' }}>Khách hàng</TableCell>
                {/* <TableCell>Email</TableCell> */}
                <TableCell sx={{ width: '200px' }}>Tên phim</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Thời gian chiếu</TableCell>
                <TableCell>Ghế</TableCell>
                {/* <TableCell>Số lượng ghế thường</TableCell>
                <TableCell>Tổng tiền ghế thường</TableCell> */}
                {/* <TableCell>Số lượng ghế đôi</TableCell>
                <TableCell>Tổng tiền ghế đôi</TableCell> */}
                <TableCell>Tổng tiền</TableCell>
                {/* <TableCell>Hành động</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>{booking?.bookingCode==null?"":booking.bookingCode}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    {/* <TableCell>{booking.userEmail}</TableCell> */}
                    <TableCell>{booking.movieName}</TableCell>
                    <TableCell>{booking.roomName}</TableCell>
                    <TableCell>{booking?.startTime||""}</TableCell>
                    <TableCell>{booking.nameSeats.join(', ')}</TableCell>
                    {/* <TableCell>{booking.quantityNormalSeat}</TableCell>
                    <TableCell>{booking.totalPriceNormalSeat.toLocaleString('vi-VN')} VND</TableCell>
                    <TableCell>{booking.quantityCoupleSeat}</TableCell>
                    <TableCell>{booking.totalPriceCoupleSeat.toLocaleString('vi-VN')} VND</TableCell> */}
                    <TableCell>{booking.totalPrice==null?"":booking.totalPrice?.toLocaleString('vi-VN')} VND</TableCell>
                    {/* <TableCell> */}
                      {/* Chức năng chỉnh sửa không còn phù hợp trực tiếp với BookingCheckoutDto */}
                      {/* <IconButton onClick={() => handleOpenDialog(sc)} color="primary" size="small">
                        <EditIcon />
                      </IconButton> */}
                      {/* <IconButton
                        onClick={() => handleOpenConfirmDelete(booking.bookingId)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    Không có đặt vé nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ShowtimeDialog đã được loại bỏ vì không phù hợp với việc quản lý đặt vé */}
      {/* {openDialog && (
        <ShowtimeDialog
          open={openDialog}
          onClose={handleCloseDialog}
          initialData={editingShowtime}
          onSubmit={handleSaveSuccess}
        />
      )} */}

      {/* Confirm Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{"Xác nhận xóa đặt vé?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa đặt vé này không? Hành động này không thể hoàn tác.
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