import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import API_URLS from '../config/api';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email không được để trống'),
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleForgotPassword = async (values: { email: string }) => {
        try {
            const response = await fetch(API_URLS.AUTH.forgotPassword, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                setServerError(data.error || 'Yêu cầu đặt lại mật khẩu thất bại');
                setSuccessMessage('');
                return;
            }

            setSuccessMessage(data.message || 'Vui lòng kiểm tra email để đặt lại mật khẩu');
            setServerError('');
        } catch (error: any) {
            setServerError(error.message || 'Lỗi kết nối');
            setSuccessMessage('');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Quên mật khẩu
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
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
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
                                Gửi yêu cầu
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Quay lại <a href="/login">Đăng nhập</a>
                </Typography>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;