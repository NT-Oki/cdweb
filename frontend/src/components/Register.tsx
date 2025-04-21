import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper
} from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Logic gửi dữ liệu đăng ký
    console.log({ email, name, password });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Đăng ký tài khoản CGV
        </Typography>

        <TextField
          label="Tên người dùng"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          Đăng ký
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
