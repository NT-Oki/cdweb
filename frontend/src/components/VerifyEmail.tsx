import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import API_URLS from '../config/api';
import LanguageSwitcher from "./LanguageSwitcher.tsx";

const VerifyEmail = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setError(t('auth.verify.invalid'));
            setLoading(false);
            return;
        }

        fetch(`${API_URLS.AUTH.verifyEmail}?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': i18n.language,
            },
            credentials: 'include',
        })
            .then(async (res) => {
                const contentType = res.headers.get('content-type');
                let data;
                if (contentType && contentType.includes('application/json')) {
                    data = await res.json();
                } else {
                    const text = await res.text();
                    throw new Error(t('error.json', { message: text }));
                }

                if (!res.ok) {
                    throw new Error(t(data.error || 'auth.verify.failed'));
                }

                setMessage(t(data.message || 'auth.verify.success'));
                setLoading(false);
                setTimeout(() => navigate('/login'), 3000);
            })
            .catch((err) => {
                setError(t(err.message || 'auth.verify.failed'));
                setLoading(false);
            });
    }, [searchParams, navigate, t, i18n.language]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Box sx={{ textAlign: 'center', width: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <LanguageSwitcher />
                </Box>
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
                        {t('auth.login')} {/* "Login" hoặc "Đăng nhập" */}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default VerifyEmail;