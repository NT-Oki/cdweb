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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_URLS from '../../../config/api';

interface StatusFilm {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  nameMovie: string;
  releaseDate: string;
  durationMovie: string;
  actor: string;
  director: string;
  studio: string;
  content: string;
  trailer: string;
  avatar: string;
  statusFilmId: StatusFilm;
}

interface Room {
  id: number;
  roomName: string;
  quantitySeat: number;
  status: string;
  description: string;
}

interface Showtime {
  id: number;
  movie: Movie;
  room: Room;
  showDate: string;
  startTime: string; // ISO date-time string
}

export default function ShowTimeAdmin() {
  const token =localStorage.getItem("token");
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
   const fetchShowtime = async () => {
  try {
    const response = await axios.get(API_URLS.ADMIN.showtime.list_showtime, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setShowtimes(response.data)
  } catch (err: any) {
    console.log("lỗi lấy danh sách room" + err.response.data);
  }
};

useEffect(() => {
  fetchShowtime();
}, []);

  const handleOpenDialog = (showtime?: Showtime) => {
    setEditingShowtime(showtime || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveShowtime = (newShowtime: Showtime) => {
    setShowtimes((prev) => {
      const exists = prev.find((sc) => sc.id === newShowtime.id);
      if (exists) {
        return prev.map((sc) => (sc.id === newShowtime.id ? newShowtime : sc));
      }
      return [...prev, newShowtime];
    });
    setOpenDialog(false);
  };

  const handleDeleteShowtime = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa suất chiếu này?')) {
      setShowtimes((prev) => prev.filter((sc) => sc.id !== id));
    }
  };

  const filteredShowtimes = showtimes.filter(
    (sc) =>
      sc.movie.nameMovie.toLowerCase().includes(searchText.toLowerCase()) ||
      sc.room.roomName.toLowerCase().includes(searchText.toLowerCase())
  );

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
              <TableCell
              sx={{
                maxWidth:"80px"
              }}
              >Mã suất chiếu</TableCell>
              <TableCell 
              sx={{
                maxWidth:"150px"
              }}
              >Phim</TableCell>
              <TableCell>Phòng chiếu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời gian bắt đầu</TableCell>
              {/* <TableCell>Giá vé (VNĐ)</TableCell> */}
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShowtimes.length > 0 ? (
              filteredShowtimes.map((sc) => (
                <TableRow key={sc.id}>
                  <TableCell>{sc.id}</TableCell>
                  <TableCell
                   sx={{
                maxWidth:"150px"
              }}
                  >{sc.movie.nameMovie}</TableCell>
                  <TableCell>{sc.room.roomName}</TableCell>
                 <TableCell
  sx={{
    color:
      sc.movie.statusFilmId.id === 1
        ? 'green'
        : sc.movie.statusFilmId.id === 2
        ? 'blue'
        : 'coral',
        fontWeight:"bold"
 
  }}
>
  {sc.movie.statusFilmId.id === 1
    ? 'Đang chiếu'
    : sc.movie.statusFilmId.id === 2
    ? 'Sắp chiếu'
    : 'Ngừng chiếu'}
</TableCell>

                  <TableCell>{sc.startTime}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(sc)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteShowtime(sc.id)}
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

      {openDialog && (
        <ShowtimeDialog
          open={openDialog}
          onClose={handleCloseDialog}
          showtime={editingShowtime}
          onSave={handleSaveShowtime}
        />
      )}
    </Box>
  );
}

interface ShowtimeDialogProps {
  open: boolean;
  onClose: () => void;
  showtime: Showtime | null;
  onSave: (showtime: Showtime) => void;
}

function ShowtimeDialog({ open, onClose, showtime, onSave }: ShowtimeDialogProps) {
  const isEdit = Boolean(showtime);
  const [id, setId] = useState<number>(showtime?.id || Date.now());
  const [movieName, setMovieName] = useState<string>(showtime?.movie.nameMovie || '');
  const [roomName, setRoomName] = useState<string>(showtime?.room.roomName || '');
  const [startTime, setStartTime] = useState<string>(showtime?.startTime || '');
    const [status, setStatus] = useState<number>(showtime?.movie.statusFilmId.id || 0);

  const handleSubmit = () => {
    if (!movieName || !roomName || !startTime ) {
      alert('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    const movie: Movie = {
      id: Date.now(),
      nameMovie: movieName,
      releaseDate: '',
      durationMovie: '',
      actor: '',
      director: '',
      studio: '',
      content: '',
      trailer: '',
      avatar: '',
      statusFilmId: { id: 1, name: 'Hiển thị' },
    };

    const room: Room = {
      id: Date.now(),
      roomName,
      quantitySeat: 100,
      status: 'Ready',
      description: '',
    };

    onSave({ id, movie, room, showDate: '', startTime });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu mới'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tên phim"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
          />
          <TextField
            label="Phòng chiếu"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <TextField
            label="Thời gian bắt đầu"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          {/* <TextField
            label="Giá vé (VNĐ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />*/}
          <FormControl>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={status} label="Trạng thái" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="1">Đang chiếu</MenuItem>
              <MenuItem value="2">Sắp chiếu</MenuItem>
              <MenuItem value="3">Ngừng chiếu</MenuItem>
            </Select>
          </FormControl> 
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
