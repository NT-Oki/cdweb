import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import API_URLS from '../config/api';
import LanguageSwitcher from './LanguageSwitcher';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('validation.email.invalid') // Key từ i18n.ts
        .required('validation.email.empty'),
});

const ForgotPassword = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleForgotPassword = async (values: { email: string }) => {
        try {
            const response = await fetch(API_URLS.AUTH.forgotPassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language, // Gửi ngôn ngữ hiện tại
                },
                body: JSON.stringify({ email: values.email }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                setServerError(t(data.error || 'auth.forgot.failed'));
                setSuccessMessage('');
                toast.error(t(data.error || 'auth.forgot.failed'));
                return;
            }

            setSuccessMessage(t(data.message || 'auth.forgot.success'));
            setServerError('');
            toast.success(t(data.message || 'auth.forgot.success'));
        } catch (error: any) {
            setServerError(t('auth.forgot.failed'));
            setSuccessMessage('');
            toast.error(t('auth.forgot.failed'));
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <LanguageSwitcher />
            </Box>
            <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t('auth.forgot.success').split(' ')[0]} {/* "Forgot Password" hoặc "Quên mật khẩu" */}
                </Typography>

                {successMessage && (
                    <Typography color="success.main" variant="body2" sx={{ mb: 2 }}>
                        {successMessage}
                    </Typography>
                )}

                {serverError && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {serverError}
                    </Typography>
                )}

                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleForgotPassword}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Field
                                as={TextField}
                                name="email"
                                label={t('validation.email.empty')}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={touched.email && !!errors.email}
                                helperText={touched.email && t(errors.email || '')}
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
                                {t('auth.forgot.success').split(' ')[0]} {/* "Send Request" hoặc "Gửi yêu cầu" */}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    {t('auth.login.success').split(' ')[0]} <a href="/login">{t('auth.login.success')}</a>
                </Typography>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;