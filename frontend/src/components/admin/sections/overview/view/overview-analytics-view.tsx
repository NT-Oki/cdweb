import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Box, Button } from '@mui/material';

import { DashboardContent } from '../../../layouts/dashboard';
import API_URLS from '../../../../../config/api';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';

// ----------------------------------------------------------------------

interface SeatsWeeklyData {
    date: string;
    seats: number;
}

export function OverviewAnalyticsView() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [seatsWeekly, setSeatsWeekly] = useState<SeatsWeeklyData[]>([]);

    useEffect(() => {
        const fetchSeatsWeekly = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error(t('auth.login.required'));
                    navigate('/login');
                    return;
                }
                const response = await axios.get(API_URLS.ADMIN.booking.SEATS_WEEKLY, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept-Language': i18n.language,
                    },
                });
                console.log('API response:', response.data); // Debug
                const data = response.data.data || [];
                if (!data.length) {
                    toast.warn(t('dashboard.noData'));
                }
                setSeatsWeekly(data);
            } catch (error: any) {
                console.error('Lỗi khi lấy thống kê ghế:', error);
                toast.error(t('booking.stats.failed'));
            }
        };

        fetchSeatsWeekly();
    }, [t, i18n.language, navigate]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DashboardContent maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 3, md: 5 } }}>
                <Typography variant="h4">
                    {t('dashboard.welcome')} {/* "Hi, Welcome back 👋" hoặc "Chào mừng quay lại 👋" */}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        onClick={() => changeLanguage('vi')}
                        sx={{
                            color: 'primary.main',
                            fontWeight: i18n.language === 'vi' ? 'bold' : 'normal',
                        }}
                    >
                        VI
                    </Button>
                    <Button
                        onClick={() => changeLanguage('en')}
                        sx={{
                            color: 'primary.main',
                            fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                        }}
                    >
                        EN
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                    {seatsWeekly.length ? (
                        <AnalyticsWebsiteVisits
                            title={t('dashboard.seatsSoldWeekly')}
                            subheader={t('dashboard.seatsSoldSubheader')}
                            chart={{
                                categories: seatsWeekly.map((item) => item.date),
                                series: [
                                    {
                                        name: t('seat.normal'),
                                        data: seatsWeekly.map((item) => item.seats),
                                    },
                                ],
                            }}
                        />
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            {t('dashboard.noData')}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </DashboardContent>
    );
}