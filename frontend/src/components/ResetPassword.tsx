import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import API_URLS from '../config/api';
import LanguageSwitcher from './LanguageSwitcher';

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .required('validation.password.empty')
        .min(8, 'validation.password.short'),
    confirmPassword: Yup.string()
        .required('validation.confirmPassword.empty')
        .oneOf([Yup.ref('newPassword')], 'validation.password.mismatch'),
});

const ResetPassword = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [code, setCode] = useState<string>('');

    useEffect(() => {
        const resetCode = searchParams.get('code');
        if (!resetCode) {
            setServerError(t('auth.reset.code.invalid'));
            setLoading(false);
            toast.error(t('auth.reset.code.invalid'));
            return;
        }
        setCode(resetCode);
        setLoading(false);
    }, [searchParams, t]);

    const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
        try {
            const response = await fetch(API_URLS.AUTH.resetPassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                },
                body: JSON.stringify({ resetCode: code, newPassword: values.newPassword, confirmPassword: values.confirmPassword }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                setServerError(t(data.error || 'auth.reset.failed'));
                setSuccessMessage('');
                toast.error(t(data.error || 'auth.reset.failed'));
                return;
            }

            setSuccessMessage(t(data.message || 'auth.reset.success'));
            setServerError('');
            toast.success(t(data.message || 'auth.reset.success'));
            setTimeout(() => navigate('/login'), 3000);
        } catch (error: any) {
            setServerError(t('auth.reset.failed'));
            setSuccessMessage('');
            toast.error(t('auth.reset.failed'));
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <LanguageSwitcher />
            </Box>
            <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t('auth.reset')} {/* "Reset Password" hoặc "Đặt lại mật khẩu" */}
                </Typography>

                {loading && <CircularProgress />}
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

                {!loading && (
                    <Formik
                        initialValues={{ newPassword: '', confirmPassword: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleResetPassword}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="newPassword"
                                    label={t('auth.reset.password')}
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.newPassword && !!errors.newPassword}
                                    helperText={touched.newPassword && t(errors.newPassword || '')}
                                />
                                <Field
                                    as={TextField}
                                    name="confirmPassword"
                                    label={t('validation.confirmPassword.empty')}
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.confirmPassword && !!errors.confirmPassword}
                                    helperText={touched.confirmPassword && t(errors.confirmPassword || '')}
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
                                    {t('auth.reset')} {/* "Reset Password" hoặc "Đặt lại mật khẩu" */}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}

                <Typography variant="body2" sx={{ mt: 2 }}>
                    {t('auth.login')} <a href="/login">{t('auth.login')}</a> {/* "Login" hoặc "Đăng nhập" */}
                </Typography>
            </Paper>
        </Box>
    );
};

export default ResetPassword;