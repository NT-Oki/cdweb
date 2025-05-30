import React, { useState } from 'react';
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

interface Showtime {
  id: string;
  movie: string;
  room: string;
  startTime: string; // ISO string or display string
  price: number;
  status: 'Active' | 'Inactive';
}

const sampleShowtimes: Showtime[] = [
  {
    id: 'SC001',
    movie: 'Avengers: Endgame',
    room: 'Room 1',
    startTime: '2025-06-30 18:00',
    price: 100000,
    status: 'Active',
  },
  {
    id: 'SC002',
    movie: 'Spider-Man: No Way Home',
    room: 'Room 2',
    startTime: '2025-06-30 20:00',
    price: 90000,
    status: 'Active',
  },
];

export default function ShowTimeAdmin() {
  const [showtimes, setShowtimes] = useState<Showtime[]>(sampleShowtimes);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);

  // Filter showtimes by search text (movie name or room)
  const filteredShowtimes = showtimes.filter(
    (sc) =>
      sc.movie.toLowerCase().includes(searchText.toLowerCase()) ||
      sc.room.toLowerCase().includes(searchText.toLowerCase())
  );

  // Open dialog to add or edit
  const handleOpenDialog = (showtime?: Showtime) => {
    setEditingShowtime(showtime || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Save new or edited showtime
  const handleSaveShowtime = (newShowtime: Showtime) => {
    setShowtimes((prev) => {
      const exists = prev.find((sc) => sc.id === newShowtime.id);
      if (exists) {
        // Edit existing
        return prev.map((sc) => (sc.id === newShowtime.id ? newShowtime : sc));
      }
      // Add new
      return [...prev, newShowtime];
    });
    setOpenDialog(false);
  };

  // Delete showtime
  const handleDeleteShowtime = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa suất chiếu này?')) {
      setShowtimes((prev) => prev.filter((sc) => sc.id !== id));
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
              <TableCell>Mã suất chiếu</TableCell>
              <TableCell>Phim</TableCell>
              <TableCell>Phòng chiếu</TableCell>
              <TableCell>Thời gian bắt đầu</TableCell>
              <TableCell>Giá vé (VNĐ)</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShowtimes.length > 0 ? (
              filteredShowtimes.map((sc) => (
                <TableRow key={sc.id}>
                  <TableCell>{sc.id}</TableCell>
                  <TableCell>{sc.movie}</TableCell>
                  <TableCell>{sc.room}</TableCell>
                  <TableCell>{sc.startTime}</TableCell>
                  <TableCell>{sc.price.toLocaleString()}</TableCell>
                  <TableCell>{sc.status}</TableCell>
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

      {/* Dialog thêm/sửa suất chiếu */}
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

// Component dialog thêm/sửa suất chiếu
interface ShowtimeDialogProps {
  open: boolean;
  onClose: () => void;
  showtime: Showtime | null;
  onSave: (showtime: Showtime) => void;
}

function ShowtimeDialog({ open, onClose, showtime, onSave }: ShowtimeDialogProps) {
  const [id, setId] = useState(showtime?.id || '');
  const [movie, setMovie] = useState(showtime?.movie || '');
  const [room, setRoom] = useState(showtime?.room || '');
  const [startTime, setStartTime] = useState(showtime?.startTime || '');
  const [price, setPrice] = useState(showtime?.price || 0);
  const [status, setStatus] = useState<Showtime['status']>(showtime?.status || 'Active');

  const isEdit = Boolean(showtime);

  const handleSubmit = () => {
    if (!id || !movie || !room || !startTime || price <= 0) {
      alert('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }
    onSave({ id, movie, room, startTime, price, status });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu mới'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Mã suất chiếu"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isEdit}
          />
          <TextField label="Phim" value={movie} onChange={(e) => setMovie(e.target.value)} />
          <TextField label="Phòng chiếu" value={room} onChange={(e) => setRoom(e.target.value)} />
          <TextField
            label="Thời gian bắt đầu"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Giá vé (VNĐ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <FormControl>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={status} label="Trạng thái" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="Active">Hoạt động</MenuItem>
              <MenuItem value="Inactive">Không hoạt động</MenuItem>
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
