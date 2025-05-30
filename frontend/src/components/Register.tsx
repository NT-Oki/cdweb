import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper
} from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cardId, setCardId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState(true); // true: Nam, false: Nữ
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không trùng khớp');
      return;
    }

    const registerData = {
      email,
      password,
      confirmPassword,
      name,
      cardId,
      phoneNumber,
      gender,
      address,
    };

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
        credentials: 'include'
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.message || "Đăng ký thất bại");
        } else {
          const text = await response.text();
          throw new Error(text || "Đăng ký thất bại");
        }
      }

      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');
    } catch (err: any) {
      setError(err.message);
    }
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

          <TextField
              label="Xác nhận mật khẩu"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <TextField
              label="Số CMND/CCCD"
              fullWidth
              margin="normal"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
          />

          <TextField
              label="Số điện thoại"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <TextField
              label="Địa chỉ"
              fullWidth
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
          />

          <TextField
              label="Giới tính (true=Nam, false=Nữ)"
              fullWidth
              margin="normal"
              value={gender.toString()}
              onChange={(e) => setGender(e.target.value === 'true')}
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

          {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
          )}

          {success && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                {success}
              </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </Typography>
        </Paper>
      </Box>
  );
};

export default Register;
