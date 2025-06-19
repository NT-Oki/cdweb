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
  // Không cần import Dialog, DialogTitle, etc. ở đây nữa vì đã được bọc trong RoomDialog
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_URLS from '../../../config/api'; // Đảm bảo đường dẫn này đúng
import RoomDialog from './RoomDialog'; // Import RoomDialog đã được tách ra
import { SnackbarProvider, useSnackbar } from 'notistack';

// Định nghĩa lại interface Room để khớp với backend
interface Room {
  id: number;
  roomName: string;
  totalSeats: number; // Thêm trường này để hiển thị tổng số ghế
  status: 1 | 2 | 3; // Sử dụng string literal types cho status
  description: string;
  quantityNormalSeat: number;
  quantityCoupleSeat: number;
  quantityVipSeat: number; // Giả định có (nếu không có thì xóa đi)
  priceNormalSeat: number;
  priceCoupleSeat: number;
  priceVipSeat: number; // Giả định có (nếu không có thì xóa đi)
}
export default function RoomAdminWrapper() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <RoomAdmin />
    </SnackbarProvider>
  );
}

 function RoomAdmin() {
  const token = localStorage.getItem("token");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    // States cho Confirm Dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [roomToDeleteId, setRoomToDeleteId] = useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar(); // Hook từ notistack

  const fetchRoom = async () => {
    try {
      const response = await axios.get(API_URLS.ADMIN.room.list_room, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setRooms(response.data);
      enqueueSnackbar("Tải danh sách phòng thành công", { variant: 'info' });
    } catch (err: any) {
      console.log("Lỗi khi lấy danh sách phòng: " + (err.response?.data || err.message));
      enqueueSnackbar("Lỗi khi tải danh sách phòng.", { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  const filteredRooms = rooms.filter((r) =>
    r.roomName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenDialog = (room?: Room) => {
    setEditingRoom(room || null); // Nếu không có room, sẽ là null -> chế độ thêm mới
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoom(null); // Đảm bảo reset editingRoom khi đóng dialog
  };

  const handleSaveSuccess = () => {
    setOpenDialog(false);
    setEditingRoom(null); // Reset editingRoom sau khi lưu thành công
    fetchRoom(); // Cập nhật danh sách lại từ API
      enqueueSnackbar("Lưu phòng chiếu thành công!", { variant: 'success' });
  };
    const handleOpenConfirmDelete = (id: number) => {
    setRoomToDeleteId(id);
    setOpenConfirmDialog(true);
  };
    const handleCloseConfirmDelete = () => {
    setOpenConfirmDialog(false);
    setRoomToDeleteId(null);
  };

  // const handleDeleteRoom = async (id: number) => {
  //   if (window.confirm('Bạn có chắc muốn xóa phòng chiếu này?')) {
  //     try {
  //       const response = await axios.put(API_URLS.ADMIN.room.delete(id), {
          
  //       }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })
  //       alert(response.data); // Hoặc hiển thị thông báo thành công đẹp hơn
  //       fetchRoom(); // Tải lại danh sách sau khi xóa
  //     } catch (err: any) {
  //       console.error("Lỗi khi xóa phòng: ", err.response?.data || err.message);
  //       alert("Lỗi khi xóa phòng: " + (err.response?.data || err.message));
  //     }
  //   }
  // };
  const handleConfirmDelete = async () => {
    if (roomToDeleteId === null) return; // Đảm bảo có ID để xóa

    try {
      const response = await axios.put(API_URLS.ADMIN.room.delete(roomToDeleteId), {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      enqueueSnackbar(response.data || "Xóa phòng chiếu thành công!", { variant: 'success' }); // Snackbar thông báo thành công
      fetchRoom();
    } catch (err: any) {
      console.error("Lỗi khi xóa phòng: ", err.response?.data || err.message);
      enqueueSnackbar("Lỗi khi xóa phòng: " + (err.response?.data?.message || err.message), { variant: 'error' }); // Snackbar thông báo lỗi
    } finally {
      handleCloseConfirmDelete(); // Luôn đóng dialog sau khi xử lý
    }
  };

  const getStatusText = (status: 1 | 2 | 3) => {
    switch (status) {
      case 1:
        return 'Đang hoạt động';
      case 2:
        return 'Tạm ngưng';
      case 3:
        return 'Đã xóa';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: 1 | 2 | 3)  => {
    switch (status) {
      case 1:
        return 'green';
      case 2:
        return 'orange';
      case 3:
        return 'red';
      default:
        return 'black';
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="h1"> {/* Thêm component="h1" cho ngữ nghĩa tốt hơn */}
        Quản lý phòng chiếu
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <TextField
          label="Tìm kiếm theo tên phòng"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          variant="outlined" // Thêm variant
          sx={{ width: { xs: '100%', sm: 300 } }} // Đáp ứng di động
        />
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{ height: '40px' }} // Đồng bộ chiều cao với TextField
        >
          Thêm phòng chiếu mới
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}> {/* Thêm elevation */}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}> {/* Màu nền cho header */}
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên phòng</TableCell>
              <TableCell align="center">Tổng số ghế</TableCell> {/* Căn phải */}
               <TableCell align="center">Ghế thường</TableCell> 
                <TableCell align="center">Ghế đôi</TableCell> 
              <TableCell>Trạng thái</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="center">Hành động</TableCell> {/* Căn giữa */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((r, index) => (
                <TableRow
                  key={r.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row"> {/* Thêm ngữ nghĩa */}
                    {index + 1}
                  </TableCell>
                  <TableCell>{r.roomName}</TableCell>
                  <TableCell align="center">{r.totalSeats}</TableCell> {/* Hiển thị totalSeats */}
                   <TableCell align="center">{r.quantityNormalSeat}</TableCell> 
                <TableCell align="center">{r.quantityCoupleSeat}</TableCell>
                  <TableCell style={{
                    color: getStatusColor(r.status),
                    fontWeight: "bold",
                  }}>
                    {getStatusText(r.status)}
                  </TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenDialog(r)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenConfirmDelete(r.id)} color="error" size="small"
                      disabled={r.status === 3} // Vô hiệu hóa nút xóa nếu đã bị xóa
                      title={r.status === 3 ? 'Phòng đã bị xóa' : 'Xóa phòng'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}> {/* Tăng padding để đẹp hơn */}
                  <Typography variant="subtitle1" color="text.secondary">
                    Không có phòng chiếu nào
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* RoomDialog được hiển thị khi openDialog là true */}
      <RoomDialog
        open={openDialog}
        onClose={handleCloseDialog}
        initialData={editingRoom} // Đổi tên prop từ `room` thành `initialData` cho rõ ràng
        onSubmit={handleSaveSuccess} // Hàm này sẽ gọi fetchRoom() sau khi lưu thành công
      />
       <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{"Xác nhận xóa phòng?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa phòng chiếu này không? 
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