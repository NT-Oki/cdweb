import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import API_URLS from '../config/api';
import LanguageSwitcher from './LanguageSwitcher';

const validationSchema = Yup.object({
  email: Yup.string()
      .email('validation.email.invalid')
      .required('validation.email.empty'),
  name: Yup.string().required('validation.name.empty'),
  password: Yup.string()
      .required('validation.password.empty')
      .min(8, 'validation.password.short'),
  confirmPassword: Yup.string()
      .required('validation.confirmPassword.empty')
      .oneOf([Yup.ref('password')], 'validation.password.mismatch'),
  cardId: Yup.string().nullable(),
  phoneNumber: Yup.string()
      .required('validation.phone.empty')
      .matches(/^0[0-9]{9}$/, 'validation.phone.invalid'),
  gender: Yup.boolean().required('validation.gender.empty'),
  address: Yup.string().nullable(),
});

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

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
      const response = await fetch(API_URLS.AUTH.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': i18n.language,
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });

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
            email: t(data.email || ''),
            name: t(data.name || ''),
            password: t(data.password || ''),
            confirmPassword: t(data.confirmPassword || ''),
            cardId: t(data.cardId || ''),
            phoneNumber: t(data.phoneNumber || ''),
            gender: t(data.gender || ''),
            address: t(data.address || ''),
            message: t(data.error || 'auth.register.failed'),
          });
          toast.error(t(data.error || 'auth.register.failed'));
        } else {
          setServerErrors({ message: t(data.error || 'auth.register.failed') });
          toast.error(t(data.error || 'auth.register.failed'));
        }
        setSuccessMessage('');
        return;
      }

      setServerErrors({});
      setSuccessMessage(t(data.message || 'auth.register.success'));
      toast.success(t(data.message || 'auth.register.success'));
    } catch (error: any) {
      setServerErrors({ message: t('auth.register.failed') });
      setSuccessMessage('');
      toast.error(t('auth.register.failed'));
    }
  };

  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <LanguageSwitcher />
        </Box>
        <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {t('auth.register')} {/* "Register" hoặc "Đăng ký" */}
          </Typography>

          {successMessage && (
              <Typography color="success.main" variant="body2" sx={{ mb: 2 }}>
                {successMessage}
              </Typography>
          )}

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
                      label={t('validation.name')}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.name && !!errors.name) || !!serverErrors.name}
                      helperText={(touched.name && t(errors.name || '')) || serverErrors.name}
                  />
                  <Field
                      as={TextField}
                      name="email"
                      label={t('validation.email')}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.email && !!errors.email) || !!serverErrors.email}
                      helperText={(touched.email && t(errors.email || '')) || serverErrors.email}
                  />
                  <Field
                      as={TextField}
                      name="password"
                      label={t('validation.password')}
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.password && !!errors.password) || !!serverErrors.password}
                      helperText={(touched.password && t(errors.password || '')) || serverErrors.password}
                  />
                  <Field
                      as={TextField}
                      name="confirmPassword"
                      label={t('validation.confirmPassword')}
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.confirmPassword && !!errors.confirmPassword) || !!serverErrors.confirmPassword}
                      helperText={(touched.confirmPassword && t(errors.confirmPassword || '')) || serverErrors.confirmPassword}
                  />
                  <Field
                      as={TextField}
                      name="cardId"
                      label={t('validation.cardId')}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.cardId && !!errors.cardId) || !!serverErrors.cardId}
                      helperText={(touched.cardId && t(errors.cardId || '')) || serverErrors.cardId}
                  />
                  <Field
                      as={TextField}
                      name="phoneNumber"
                      label={t('validation.phone')}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.phoneNumber && !!errors.phoneNumber) || !!serverErrors.phoneNumber}
                      helperText={(touched.phoneNumber && t(errors.phoneNumber || '')) || serverErrors.phoneNumber}
                  />
                  <Field
                      name="gender"
                      as={Select}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2, mb: 1 }}
                      error={(touched.gender && !!errors.gender) || !!serverErrors.gender}
                  >
                    <MenuItem value="true">{t('gender.male')}</MenuItem>
                    <MenuItem value="false">{t('gender.female')}</MenuItem>
                  </Field>
                  {(touched.gender && errors.gender) || serverErrors.gender ? (
                      <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                        {(touched.gender && t(errors.gender || '')) || serverErrors.gender}
                      </Typography>
                  ) : null}
                  <Field
                      as={TextField}
                      name="address"
                      label={t('validation.address')}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={(touched.address && !!errors.address) || !!serverErrors.address}
                      helperText={(touched.address && t(errors.address || '')) || serverErrors.address}
                  />
                  <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      sx={{ mt: 2 }}
                      disabled={!!successMessage}
                  >
                    {t('auth.register')} {/* "Register" hoặc "Đăng ký" */}
                  </Button>
                </Form>
            )}
          </Formik>

          <Typography variant="body2" sx={{ mt: 2 }}>
            {t('auth.login')}? <a href="/login">{t('auth.login')}</a> {/* "Login" hoặc "Đăng nhập" */}
          </Typography>
        </Paper>
      </Box>
  );
};

export default Register;