import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{
     // position: 'fixed', // Đặt footer cố định
      bottom: 0,         // Đảm bảo footer luôn ở dưới cùng
      left: 0,           // Căn chỉnh footer từ bên trái
      width: '100%',     // Chiếm toàn bộ chiều rộng màn hình
      backgroundColor: '#111', 
      color: 'white', 
      padding: '20px',
      textAlign: 'center',
    }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        © 2025 ThuThao Cinema
      </Typography>
      {/* <Typography variant="body2">
        <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>Giới thiệu</Link>
        <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>Chính sách bảo mật</Link>
        <Link href="#" color="inherit">Điều khoản sử dụng</Link>
      </Typography> */}
    </Box>
  );
}
