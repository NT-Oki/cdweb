import React from 'react';
import { Box, Typography, Paper, Divider,Button } from '@mui/material';
import logo from '../assets/images/logo_ticket.png';
import { useNavigate } from 'react-router';

export default function Ticket() {
    const navigate = useNavigate();
    
    return (
        <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', bgcolor: '#f9fbfd' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                }}
            >
                {/* Cột trái: Hình + barcode + thông tin người mua */}
                <Paper
                    elevation={8}
                    sx={{ flex: 4, p: 3, textAlign: 'center', flexDirection: "row", display: "flex" }}>
                    <Box
                        sx={{
                            alignContent: "center",
                            flex: 1
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="monster"
                            sx={{ height: 120, mb: 2, mx: 'auto' }}
                        />
                        <Typography color="error">Cám ơn bạn đã lựa chọn</Typography>
                        <Typography fontWeight="bold" color="error">ThuThao Cinema</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1.5
                        }}
                    >

                        <Typography mt={3}>
                            Bạn đã mua vé thành công tại ThuThao Cinema!
                        </Typography>

                        <Typography fontWeight="bold" mt={1}>ThuThao Cinema</Typography>
                        <Typography fontSize={14} color="text.secondary">
                            khu phố 6, Thủ Đức, Hồ Chí Minh
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ mt: 1, mb: 2 }}>
                            xem bản đồ
                        </Typography>

                        <Typography fontSize={14}>
                            Hãy đưa mã này cho nhân viên quầy vé để đổi vé của bạn.
                        </Typography>

                        <Box
                            component="img"
                            src="https://barcode.tec-it.com/barcode.ashx?data=143585234&code=Code128&dpi=96"
                            alt="barcode"
                            sx={{ my: 2, width: '80%', maxWidth: 300 }}
                        />
                        <Typography fontWeight="bold">143585234</Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2">
                            Thông tin vé cũng được gửi về:
                        </Typography>
                        <Typography variant="body2">
                            Email: <strong>giadinh05082003@gmail.com</strong>
                        </Typography>
                        <Typography variant="body2">
                            SĐT: <strong>0869 065 848</strong>
                        </Typography>
                    </Box>




                </Paper>

                {/* Cột phải: Thông tin vé */}
                <Paper elevation={8} sx={{ flex: 2, p: 3,}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Phim Điện Ảnh Doraemon: Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh
                    </Typography>
                    <Typography fontWeight="bold">ThuThao Cinema</Typography>
                    <Typography>
                        Suất <strong>12:00</strong> - Thứ Ba, <strong>25/02</strong>
                    </Typography>
                    <Typography>
                        Phòng chiếu <strong>05</strong> - Ghế <strong>J12</strong>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Tóm tắt đơn hàng
                    </Typography>

                    <Box display="flex" justifyContent="space-between">
                        <Typography>1x Ghế đơn</Typography>
                        <Typography>45,000 đ</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Phí tiện ích</Typography>
                        <Typography>2,500 đ</Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight="bold">Tổng</Typography>
                        <Typography fontWeight="bold">47,500 đ</Typography>
                    </Box>
                      <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt:3 }}
        >
          <Button variant="outlined" color="primary"
          onClick={()=>{navigate("/")}}
          >
            Về trang chủ
          </Button>
        </Box>
                </Paper>
            </Box>
        </Box>
    );
}
