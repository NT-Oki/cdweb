// src/components/Login.tsx
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import API_URLS, { apiRequest } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
  password: Yup.string()
      .required('Mật khẩu không được để trống')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setServerErrors({});
      const data = await apiRequest(API_URLS.AUTH.login, {
        method: 'POST',
        body: JSON.stringify(values),
      });

      const rawRole = data.role;
      const mappedRole = rawRole === 'ROLE_ADMIN' ? 'admin' : 'user';

      console.log('API response:', data);
      console.log('User trước khi login:', { email: data.email, name: data.name, role: mappedRole });

      login(
          {
            email: data.email,
            userId: data.userId,
            avatar: data.avatar,
            name: data.name || 'User',
            role: mappedRole,
          },
          data.token
      );
      alert('Đăng nhập thành công!');
      console.log('Chuyển hướng sau đăng nhập:', mappedRole === 'admin' ? '/admin/dashboard' : '/');
      navigate(mappedRole === 'admin' ? '/admin/dashboard' : '/', { replace: true });
    } catch (error: any) {
      console.error('Lỗi khi gọi API login:', error);
      setServerErrors({ message: error.message || 'Đăng nhập thất bại' });
    }
  };

  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Đăng nhập tài khoản
          </Typography>

          {serverErrors.message && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {serverErrors.message}
              </Typography>
          )}

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
                      error={(touched.email && !!errors.email) || !!serverErrors.message}
                      helperText={(touched.email && errors.email) || serverErrors.message}
                  />
                  <Field
                      as={TextField}
                      name="password"
                      label="Mật khẩu"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type={showPass ? 'text' : 'password'}
                      error={(touched.password && !!errors.password) || !!serverErrors.message}
                      helperText={(touched.password && errors.password) || serverErrors.message}
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