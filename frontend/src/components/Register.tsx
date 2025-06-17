import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import API_URLS from '../config/api';

// Validation schema đồng bộ với RegisterDto
const validationSchema = Yup.object({
  email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
  name: Yup.string()
      .required('Họ tên không được để trống'),
  password: Yup.string()
      .required('Mật khẩu không được để trống')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  confirmPassword: Yup.string()
      .required('Vui lòng xác nhận lại mật khẩu')
      .oneOf([Yup.ref('password')], 'Mật khẩu không tương ứng'),
  cardId: Yup.string().nullable(), // Không bắt buộc
  phoneNumber: Yup.string()
      .required('Số điện thoại không được để trống')
      .matches(/^0[0-9]{9}$/, 'Số điện thoại không hợp lệ (phải có 10 chữ số, bắt đầu bằng 0)'),
  gender: Yup.boolean()
      .required('Giới tính không được để trống'),
  address: Yup.string().nullable(), // Không bắt buộc
});

const Register = () => {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>({});

  const handleRegister = async (values: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    cardId: string;
    phoneNumber: string;
    gender: boolean;
    address: string;
  }) => {
    try {
      console.log('Request body:', values);
      const response = await fetch(API_URLS.AUTH.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Response không phải JSON: ${text}`);
      }

      if (!response.ok) {
        if (data.email || data.name || data.password || data.confirmPassword || data.cardId || data.phoneNumber || data.gender || data.address) {
          setServerErrors({
            email: data.email,
            name: data.name,
            password: data.password,
            confirmPassword: data.confirmPassword,
            cardId: data.cardId,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            address: data.address,
          });
        } else {
          setServerErrors({ message: data.message || 'Đăng ký thất bại' });
        }
        return;
      }

      setServerErrors({});
      alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      console.error('Lỗi khi gọi API register:', error);
      setServerErrors({ message: `Đã xảy ra lỗi: ${error.message || 'Kết nối thất bại'}` });
    }
  };

  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Đăng ký tài khoản
          </Typography>

          {serverErrors.message && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {serverErrors.message}
              </Typography>
          )}

          <Formik
              initialValues={{
                email: '',
                name: '',
                password: '',
                confirmPassword: '',
                cardId: '',
                phoneNumber: '',
                gender: true,
                address: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
          >
            {({ errors, touched }) => (
                <Form>
                  <Field
                      as={TextField}
                      name="name"
                      label="Họ tên"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.name && !!errors.name) || !!serverErrors.name}
                      helperText={(touched.name && errors.name) || serverErrors.name}
                  />

                  <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.email && !!errors.email) || !!serverErrors.email}
                      helperText={(touched.email && errors.email) || serverErrors.email}
                  />

                  <Field
                      as={TextField}
                      name="password"
                      label="Mật khẩu"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.password && !!errors.password) || !!serverErrors.password}
                      helperText={(touched.password && errors.password) || serverErrors.password}
                  />

                  <Field
                      as={TextField}
                      name="confirmPassword"
                      label="Xác nhận mật khẩu"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.confirmPassword && !!errors.confirmPassword) || !!serverErrors.confirmPassword}
                      helperText={(touched.confirmPassword && errors.confirmPassword) || serverErrors.confirmPassword}
                  />

                  <Field
                      as={TextField}
                      name="cardId"
                      label="Số CMND/CCCD"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.cardId && !!errors.cardId) || !!serverErrors.cardId}
                      helperText={(touched.cardId && errors.cardId) || serverErrors.cardId}
                  />

                  <Field
                      as={TextField}
                      name="phoneNumber"
                      label="Số điện thoại"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.phoneNumber && !!errors.phoneNumber) || !!serverErrors.phoneNumber}
                      helperText={(touched.phoneNumber && errors.phoneNumber) || serverErrors.phoneNumber}
                  />

                  <Field
                      name="gender"
                      as={Select}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2, mb: 1 }}
                      error={(touched.gender && !!errors.gender) || !!serverErrors.gender}
                  >
                    <MenuItem value="true">Nam</MenuItem>
                    <MenuItem value="false">Nữ</MenuItem>
                  </Field>
                  {(touched.gender && errors.gender) || serverErrors.gender ? (
                      <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                        {(touched.gender && errors.gender) || serverErrors.gender}
                      </Typography>
                  ) : null}

                  <Field
                      as={TextField}
                      name="address"
                      label="Địa chỉ"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.address && !!errors.address) || !!serverErrors.address}
                      helperText={(touched.address && errors.address) || serverErrors.address}
                  />

                  <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      sx={{ mt: 2 }}
                  >
                    Đăng ký
                  </Button>
                </Form>
            )}
          </Formik>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </Typography>
        </Paper>
      </Box>
  );
};

export default Register;