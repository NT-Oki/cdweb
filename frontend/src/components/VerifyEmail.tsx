import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import API_URLS from '../config/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setError('Mã xác minh không hợp lệ');
            setLoading(false);
            return;
        }

        fetch(`${API_URLS.AUTH.verifyEmail}?code=${code}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
            .then(async (res) => {
                const contentType = res.headers.get('content-type');
                let data;
                if (contentType && contentType.includes('application/json')) {
                    data = await res.json();
                } else {
                    const text = await res.text();
                    throw new Error(`Response không phải JSON: ${text}`);
                }

                if (!res.ok) {
                    throw new Error(data.error || 'Xác minh thất bại');
                }

                setMessage(data.message || 'Xác minh email thành công. Bạn có thể đăng nhập ngay.');
                setLoading(false);
                setTimeout(() => navigate('/login'), 3000); // Chuyển hướng sau 3 giây
            })
            .catch((err) => {
                setError(err.message || 'Lỗi kết nối');
                setLoading(false);
            });
    }, [searchParams, navigate]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Box sx={{ textAlign: 'center', width: 400 }}>
                {loading && <CircularProgress />}
                {message && (
                    <Typography color="success.main" variant="h6" sx={{ mb: 2 }}>
                        {message}
                    </Typography>
                )}
                {error && (
                    <Typography color="error" variant="h6" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                {!loading && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/login')}
                        sx={{ mt: 2 }}
                    >
                        Đi đến trang đăng nhập
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default VerifyEmail;