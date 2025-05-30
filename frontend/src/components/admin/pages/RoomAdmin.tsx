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
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_URLS from '../../../config/api';

interface Room {
  id: number;
  roomName: string;
  quantitySeat: number;
  status: string;
  description: string;
}

const sampleRooms: Room[] = [
  {
    id: 1,
    roomName: 'Phòng 1',
    quantitySeat: 100,
    status: 'Hoạt động',
    description: 'Phòng chiếu lớn nhất',
  },
  {
    id: 2,
    roomName: 'Phòng 2',
    quantitySeat: 60,
    status: 'Đang bảo trì',
    description: 'Phòng chiếu VIP',
  },
];

export default function RoomAdmin() {
  const token = localStorage.getItem("token");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const fetchRoom = async () => {
  try {
    const response = await axios.get(API_URLS.ADMIN.room.list_room, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setRooms(response.data)
  } catch (err: any) {
    console.log("lỗi lấy danh sách room" + err.response.data);
  }
};

useEffect(() => {
  fetchRoom();
}, []);
  const filteredRooms = rooms.filter((r) =>
    r.roomName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenDialog = (room?: Room) => {
    setEditingRoom(room || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

const handleSaveSuccess = () => {
  setOpenDialog(false);
  fetchRoom(); // cập nhật danh sách lại từ API
};

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng chiếu này?')) {
       try{
      const response= await axios.put(API_URLS.ADMIN.room.delete(id),{
        id: id,
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      alert(response.data)
      fetchRoom();
    }catch(err:any){
      console.log(err.response.data);
      alert(err.response.data)
    }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý phòng chiếu
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Tìm kiếm theo tên phòng"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ width: 300 }}
        />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Thêm phòng chiếu mới
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên phòng</TableCell>
              <TableCell>Số ghế</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((r, index) => (
                <TableRow key={r.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{r.roomName}</TableCell>
                  <TableCell>{r.quantitySeat}</TableCell>
                  <TableCell style={{
                    color:
                      r.status === "1"
                        ? "green"
                        : r.status === "2"
                          ? "orange"
                          : "red",
                    fontWeight: "bold",
                  }}
                  >{r.status === "1" ? "Đang hoạt động" : r.status === "2" ? "Không hoạt động" : "Đã xóa"}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(r)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRoom(r.id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có phòng chiếu nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {openDialog && (
      <RoomDialog
  open={openDialog}
  onClose={handleCloseDialog}
  room={editingRoom}
  onSuccess={handleSaveSuccess}
/>
      )}
    </Box>
  );
}

interface RoomDialogProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  onSuccess: () => void;
}

function RoomDialog({ open, onClose, room, onSuccess }: RoomDialogProps) {
  const token = localStorage.getItem("token");
  const [id, setId] = useState(room?.id || 0);
  const [roomName, setRoomName] = useState(room?.roomName || '');
  const [quantitySeat, setQuantitySeat] = useState(room?.quantitySeat || 0);
  const [status, setStatus] = useState(room?.status || '');
  const [description, setDescription] = useState(room?.description || '');

  const isEdit = room !== null;

 const handleSubmit = async () => {
  if (!roomName || quantitySeat <= 0 || !status) {
    alert('Vui lòng điền đầy đủ thông tin hợp lệ');
    return;
  }
  try {
    if (isEdit) {
      await axios.put(API_URLS.ADMIN.room.update(id), { id, roomName, quantitySeat, status, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post(API_URLS.ADMIN.room.save, { roomName, quantitySeat, status, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    onSuccess();
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    alert("Có lỗi xảy ra khi lưu phòng.");
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Chỉnh sửa phòng chiếu' : 'Thêm phòng chiếu mới'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {isEdit && <TextField label="ID" value={id} disabled />}
          <TextField
            label="Tên phòng"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <TextField
            label="Số ghế"
            type="number"
            value={quantitySeat}
            onChange={(e) => setQuantitySeat(Number(e.target.value))}
          />
        <FormControl>
  <FormLabel>Trạng thái</FormLabel>
  <RadioGroup
    row
    value={status}
    onChange={(e) => setStatus(e.target.value)}
  >
    <FormControlLabel value="1" control={<Radio />} label="Đang hoạt động" />
    <FormControlLabel value="2" control={<Radio />} label="Tạm ngưng" />
  </RadioGroup>
</FormControl>
          <TextField
            label="Mô tả"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
