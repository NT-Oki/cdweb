// components/RoomDialog.jsx hoặc RoomDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  // FormControl, // Không cần nếu bỏ trạng thái
  // FormLabel, // Không cần nếu bỏ trạng thái
  Grid,
  // MenuItem, // Không cần nếu bỏ trạng thái
  // Select, // Không cần nếu bỏ trạng thái
  Box,
  Typography,
  FormControl,
  FormLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import API_URLS from '../../../config/api';

// Interface để định nghĩa cấu trúc dữ liệu Room cho Dialog (đã bỏ VIP và status)
interface RoomData {
  id?: number;
  roomName: string;
  totalSeats?: number;
  status: 1 | 2 | 3; 
  description: string;
  quantityNormalSeat: number;
  quantityCoupleSeat: number;
  priceNormalSeat: number;
  priceCoupleSeat: number;
}

interface RoomDialogProps {
  open: boolean;
  onClose: () => void;
  initialData: RoomData | null;
  onSubmit: () => void;
}

function RoomDialog({ open, onClose, initialData, onSubmit }: RoomDialogProps) {
  const token = localStorage.getItem("token");

  // States cho từng trường input (đã bỏ VIP và status)
  const [id, setId] = useState<number | undefined>(initialData?.id);
  const [roomName, setRoomName] = useState(initialData?.roomName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<RoomData['status']>(initialData?.status || 1); // Đã bỏ
  const [quantityNormalSeat, setQuantityNormalSeat] = useState(initialData?.quantityNormalSeat || 0);
  const [quantityCoupleSeat, setQuantityCoupleSeat] = useState(initialData?.quantityCoupleSeat || 0);
  const [priceNormalSeat, setPriceNormalSeat] = useState(initialData?.priceNormalSeat || 0);
  const [priceCoupleSeat, setPriceCoupleSeat] = useState(initialData?.priceCoupleSeat || 0);

  const [errors, setErrors] = useState<Partial<Record<keyof RoomData, string>>>({});
  const isEdit = initialData !== null;

  // Cập nhật state khi `initialData` hoặc `open` thay đổi (đã bỏ VIP và status)
  useEffect(() => {
    if (open) {
      if (initialData) {
        setId(initialData.id);
        setRoomName(initialData.roomName);
        setDescription(initialData.description);
        setStatus(initialData.status);
        setQuantityNormalSeat(initialData.quantityNormalSeat);
        setQuantityCoupleSeat(initialData.quantityCoupleSeat);
        setPriceNormalSeat(initialData.priceNormalSeat);
        setPriceCoupleSeat(initialData.priceCoupleSeat);
      } else {
        setId(undefined);
        setRoomName('');
        setDescription('');
        setStatus(1); 
        setQuantityNormalSeat(0);
        setQuantityCoupleSeat(0);
        setPriceNormalSeat(0);
        setPriceCoupleSeat(0);
      }
      setErrors({});
    }
  }, [open, initialData]);

  // Hàm kiểm tra lỗi (đã bỏ VIP và status)
  const validateForm = (): boolean => {
    let tempErrors: Partial<Record<keyof RoomData, string>> = {};
    let isValid = true;

    if (!roomName.trim()) {
      tempErrors.roomName = 'Tên phòng không được để trống.';
      isValid = false;
    }
    // if (!status) { // Đã bỏ
    //   tempErrors.status = 'Trạng thái phòng không được để trống.';
    //   isValid = false;
    // }

    if (quantityNormalSeat < 50) {
      tempErrors.quantityNormalSeat = 'Số lượng ghế thường không hợp lệ.';
      isValid = false;
    }
    if (quantityCoupleSeat < 3) {
      tempErrors.quantityCoupleSeat = 'Số lượng ghế đôi không hợp lệ.';
      isValid = false;
    }

    if (priceNormalSeat < 45000) {
      tempErrors.priceNormalSeat = 'Giá ghế thường không hợp lệ.';
      isValid = false;
    }
    if (priceCoupleSeat < 65000) {
      tempErrors.priceCoupleSeat = 'Giá ghế đôi không hợp lệ.';
      isValid = false;
    }
    if (quantityNormalSeat > 0 && priceNormalSeat <= 0) {
        tempErrors.priceNormalSeat = 'Giá ghế thường phải lớn hơn 0.';
        isValid = false;
    }
    if (quantityCoupleSeat > 0 && priceCoupleSeat <= 0) {
        tempErrors.priceCoupleSeat = 'Giá ghế đôi phải lớn hơn 0.';
        isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Vui lòng kiểm tra lại các thông tin đã nhập.');
      return;
    }

    const totalSeatsCalculated = quantityNormalSeat + quantityCoupleSeat;
    if (totalSeatsCalculated === 0) {
      alert('Tổng số ghế không thể là 0. Vui lòng nhập số lượng ghế.');
      return;
    }

    // roomDataToSave (đã bỏ VIP và status, nếu status được quản lý ở backend và luôn là ACTIVE khi tạo mới, không cần gửi lên)
    const roomDataToSave: RoomData = { // Sử dụng Omit để loại bỏ 'status' khỏi type
      roomName,
      description,
      quantityNormalSeat,
      quantityCoupleSeat,
      priceNormalSeat,
      priceCoupleSeat,
      status,
    };

    if (isEdit) {
      // Khi edit, có thể cần gửi status lên nếu backend cần, tùy thuộc vào API.
      // Hiện tại bỏ status khỏi RoomData, nếu cần lại, bạn sẽ phải thêm nó vào interface và state.
      (roomDataToSave as RoomData).id = id; // Cast lại để gán id nếu cần
    }

    try {
      if (isEdit) {
        await axios.put(API_URLS.ADMIN.room.update(id!), roomDataToSave, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật phòng chiếu thành công!');
      } else {
        await axios.post(API_URLS.ADMIN.room.save, roomDataToSave, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Thêm phòng chiếu mới thành công!');  
      }
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error("Lỗi khi lưu phòng: ", err.response?.data || err.message);
      alert("Lỗi khi lưu phòng: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
        {isEdit ? 'Chỉnh sửa phòng chiếu' : 'Thêm phòng chiếu mới'}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Stack spacing={3}>

          {isEdit && (
            <TextField
              label="ID Phòng"
              value={id || ''}
              disabled
              variant="filled"
              size="small"
            />
          )}

          <TextField
            label="Tên phòng"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            required
            error={!!errors.roomName}
            helperText={errors.roomName}
          />

          <TextField
            label="Mô tả"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
            {isEdit?(
                  <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>Trạng thái</FormLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomData['status'])}
              size="small"
              sx={{ width: '50%' }}
              required
              error={!!errors.status}
            >
              <MenuItem value='1'>Đang hoạt động</MenuItem>
              <MenuItem value='2'>Tạm ngưng</MenuItem>
              {isEdit && status !== 3 && (
                <MenuItem value="3">Đã xóa</MenuItem>
              )}
            </Select>
             {errors.status && <Typography color="error" variant="caption" sx={{ ml: 1, mt: 0.5 }}>{errors.status}</Typography>}
          </FormControl>

            ):null}
         

          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom color="text.secondary">Cấu hình số lượng và giá ghế:</Typography>
            {/* Ghế thường */}
            <Grid container spacing={2}> {/* container */}
              <Grid > 
                <TextField
                  label="Số lượng ghế thường"
                  type="number"
                  value={quantityNormalSeat}
                  onChange={(e) => setQuantityNormalSeat(Number(e.target.value))}
                  fullWidth // Để TextField chiếm toàn bộ Grid item
                  variant="outlined"
                  size="small"
                  required
                  error={!!errors.quantityNormalSeat}
                  helperText={errors.quantityNormalSeat}
                  inputProps={{ min: 0 }}
                   disabled={isEdit}
                />
              </Grid>
              <Grid > 
                <TextField
                  label="Giá ghế thường (VNĐ)"
                  type="number"
                  value={priceNormalSeat}
                  onChange={(e) => setPriceNormalSeat(Number(e.target.value))}
                  fullWidth // Để TextField chiếm toàn bộ Grid item
                  variant="outlined"
                  size="small"
                  required
                  error={!!errors.priceNormalSeat}
                  helperText={errors.priceNormalSeat}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {/* Ghế đôi */}
            <Grid container spacing={2} sx={{ mt: 1 }}> {/* container và khoảng cách */}
              <Grid >
                <TextField
                  label="Số lượng ghế đôi"
                  type="number"
                  value={quantityCoupleSeat}
                  onChange={(e) => setQuantityCoupleSeat(Number(e.target.value))}
                  fullWidth // Để TextField chiếm toàn bộ Grid item
                  variant="outlined"
                  size="small"
                  required
                  error={!!errors.quantityCoupleSeat}
                  helperText={errors.quantityCoupleSeat}
                  inputProps={{ min: 0 }}
                  disabled={isEdit}
                />
              </Grid>
              <Grid >
                <TextField
                  label="Giá ghế đôi (VNĐ)"
                  type="number"
                  value={priceCoupleSeat}
                  onChange={(e) => setPriceCoupleSeat(Number(e.target.value))}
                  fullWidth // Để TextField chiếm toàn bộ Grid item
                  variant="outlined"
                  size="small"
                  required
                  error={!!errors.priceCoupleSeat}
                  helperText={errors.priceCoupleSeat}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid #eee' }}>
        <Button onClick={onClose} color="error" variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? 'Lưu thay đổi' : 'Thêm phòng'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoomDialog;