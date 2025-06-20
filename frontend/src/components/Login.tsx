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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import API_URLS from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const validationSchema = Yup.object({
  email: Yup.string()
      .email('validation.email.invalid')
      .required('validation.email.empty'),
  password: Yup.string()
      .required('validation.password.empty')
      .min(8, 'validation.password.short'),
});

const Login = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setServerErrors({});
      const response = await fetch(API_URLS.AUTH.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': i18n.language,
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        setServerErrors({ message: t(data.error || 'auth.login.failed') });
        toast.error(t(data.error || 'auth.login.failed'));
        return;
      }

      const rawRole = data.role;
      const mappedRole = rawRole === 'ROLE_ADMIN' ? 'admin' : 'user';

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
      toast.success(t('auth.login.success'));
      localStorage.setItem("userId", data.userId);
      console.log('Chuyển hướng sau đăng nhập:', mappedRole === 'admin' ? '/admin/dashboard' : '/');
      navigate(mappedRole === 'admin' ? '/admin/dashboard' : '/', { replace: true });
    } catch (error: any) {
      setServerErrors({ message: t('auth.login.failed') });
      toast.error(t('auth.login.failed'));
    }
  };

  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <LanguageSwitcher />
        </Box>
        <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {t('auth.login')} {/* "Login" hoặc "Đăng nhập" */}
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
                      label={t('validation.email')}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.email && !!errors.email) || !!serverErrors.message}
                      helperText={(touched.email && t(errors.email || '')) || serverErrors.message}
                  />
                  <Field
                      as={TextField}
                      name="password"
                      label={t('validation.password')}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type={showPass ? 'text' : 'password'}
                      error={(touched.password && !!errors.password) || !!serverErrors.message}
                      helperText={(touched.password && t(errors.password || '')) || serverErrors.message}
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
                    {t('auth.login')} {/* "Login" hoặc "Đăng nhập" */}
                  </Button>
                </Form>
            )}
          </Formik>

          <Typography variant="body2" sx={{ mt: 2 }}>
            {t('auth.forgot')}? <a href="/forgot-password">{t('auth.forgot')}</a> {/* "Forgot Password" hoặc "Quên mật khẩu" */}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t('auth.register')}? <a href="/register">{t('auth.register')}</a> {/* "Register" hoặc "Đăng ký" */}
          </Typography>
        </Paper>
      </Box>
  );
};

export default Login;