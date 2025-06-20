import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    return (
        <Box
            component="footer"
            sx={{
                // position: 'fixed', // Đặt footer cố định
                bottom: 0, // Đảm bảo footer luôn ở dưới cùng
                left: 0, // Căn chỉnh footer từ bên trái
                width: '100%', // Chiếm toàn bộ chiều rộng màn hình
                backgroundColor: '#111',
                color: 'white',
                padding: '20px',
                textAlign: 'center',
            }}
        >
            <Typography variant="body2" sx={{ mb: 1 }}>
                {t('footer.copyright')} {/* "© 2025 CGV Việt Nam" hoặc "© 2025 CGV Vietnam" */}
            </Typography>
            <Typography variant="body2">
                <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
                    {t('footer.about')} {/* "Giới thiệu" hoặc "About" */}
                </Link>
                <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
                    {t('footer.privacy')} {/* "Chính sách bảo mật" hoặc "Privacy Policy" */}
                </Link>
                <Link href="#" color="inherit">
                    {t('footer.terms')} {/* "Điều khoản sử dụng" hoặc "Terms of Use" */}
                </Link>
            </Typography>
        </Box>
    );
}
