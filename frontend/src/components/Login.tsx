import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import API_URLS from '../config/api';
import { useAuth } from '../contexts/useAuth';

// Validation schema đồng bộ với LoginDto
const validationSchema = Yup.object({
  email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
  password: Yup.string()
      .required('Mật khẩu không được để trống')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'), // Thêm yêu cầu 8 ký tự
});

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch(API_URLS.AUTH.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      // Kiểm tra content-type của response
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Response không phải JSON
        const text = await response.text();
        throw new Error(`Response không phải JSON: ${text}`);
      }

      if (!response.ok) {
        alert(data.message || 'Đăng nhập thất bại');
        return;
      }

      const rawRole = data.role;
      const mappedRole = rawRole === 'ROLE_ADMIN' ? 'admin' : 'user';

      console.log('API response:', data);
      console.log('User trước khi login:', { name: data.name, role: mappedRole });

      login(
          {
            name: data.name || 'User',
            role: mappedRole,
          },
          data.token
      );

      alert('Đăng nhập thành công!');
      console.log('Chuyển hướng sau đăng nhập:', mappedRole === 'admin' ? '/admin/dashboard' : '/');
      navigate(mappedRole === 'admin' ? '/admin/dashboard' : '/');
    } catch (error: any) {
      console.error('Lỗi khi gọi API login:', error);
      alert(`Đã xảy ra lỗi: ${error.message || 'Kết nối thất bại'}`);
    }
  };

  useEffect(() => {
    if (user && location.pathname !== '/login') {
      console.log('User sau khi login:', user);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, [user, navigate, location]);

  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Đăng nhập tài khoản
          </Typography>

          <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
          >
            {({ errors, touched }) => (
                <Form>
                  <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                  />

                  <Field
                      as={TextField}
                      name="password"
                      label="Mật khẩu"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type={showPass ? 'text' : 'password'}
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
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
                      type="submit"
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      sx={{ mt: 2 }}
                  >
                    Đăng nhập
                  </Button>
                </Form>
            )}
          </Formik>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </Typography>
        </Paper>
      </Box>
  );
};

export default Login;