import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Banner() {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                backgroundImage: 'url(https://forbes.vn/wp-content/uploads/2023/08/forbes2.png)', // Thay URL với ảnh thật
                height: '400px',
                backgroundSize: 'contain',
                // backgroundRepeat: "no-repeat",
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
            }}
        >
            <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                {t('banner.welcome')}
            </Typography>
            <Button variant="contained" sx={{ mt: 2, backgroundColor: '#e50914' }}>
                {t('banner.watchNow')}
            </Button>
        </Box>
    );
}