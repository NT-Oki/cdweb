import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import API_URLS from '../config/api';

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .required('Mật khẩu không được để trống')
        .min(8, 'Mật khẩu phải từ 8 ký tự trở lên'),
    confirmPassword: Yup.string()
        .required('Vui lòng xác nhận lại mật khẩu')
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu không tương ứng'),
});

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [code, setCode] = useState<string>('');

    useEffect(() => {
        const resetCode = searchParams.get('code');
        if (!resetCode) {
            setServerError('Mã đặt lại mật khẩu không hợp lệ');
            setLoading(false);
            return;
        }
        setCode(resetCode);
        setLoading(false);
    }, [searchParams]);

    const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
        try {
            const response = await fetch(API_URLS.AUTH.resetPassword, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetCode: code, newPassword: values.newPassword, confirmPassword: values.confirmPassword }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                setServerError(data.error || 'Đặt lại mật khẩu thất bại');
                setSuccessMessage('');
                return;
            }

            setSuccessMessage(data.message || 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay.');
            setServerError('');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error: any) {
            setServerError(error.message || 'Lỗi kết nối');
            setSuccessMessage('');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Đặt lại mật khẩu
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
                                    label="Mật khẩu mới"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.newPassword && !!errors.newPassword}
                                    helperText={touched.newPassword && errors.newPassword}
                                />

                                <Field
                                    as={TextField}
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.confirmPassword && !!errors.confirmPassword}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
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
                                    Đặt lại mật khẩu
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Quay lại <a href="/login">Đăng nhập</a>
                </Typography>
            </Paper>
        </Box>
    );
};

export default ResetPassword;