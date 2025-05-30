import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Đăng nhập thất bại
        alert(data.message || "Đăng nhập thất bại");
      } else {
        // Đăng nhập thành công
        localStorage.setItem("token", data.token);
        alert("Đăng nhập thành công!");
        // Điều hướng sang trang khác nếu cần
        window.location.href = "/"; // hoặc dùng useNavigate nếu bạn dùng React Router
      }
    } catch (error) {
      alert("Đã xảy ra lỗi kết nối: " + error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Đăng nhập tài khoản CGV
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Mật khẩu"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPass ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass((prev) => !prev)}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="error"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
