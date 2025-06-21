import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Toolbar,
    Typography,
    Button,
    Stack,
    Paper,
    CircularProgress,
    Alert,
    AlertTitle,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';
import API_URLS from '../config/api';

interface ShowtimeSeatResponseDTO {
    seatId: number;
    showtimeSeatId: number;
    seatNumber: string;
    seatRow: string;
    seatColumn: number;
    description: string;
    price: number;
    status: number;
    locked_by_user_id: Number|null;
    lockedAt: string|null;
    lockExpiresAt: string|null;
    bookingId: Number;
}

interface ShowtimeDetail {
    showtimeId: number;
    movieName: string;
    roomName: string;
    startTime: string;
    durationMovie: string;
    seats: ShowtimeSeatResponseDTO[];
}

interface ChooseSeatResponseDTO {
    showtimeDetail: ShowtimeDetail;
}

interface DisplaySeatInfo extends ShowtimeSeatResponseDTO {
    isCoupleSeat: boolean;
}

const StyledSeat = styled(Box)<{ seatStatus: number; isSelected: boolean; isCoupleSeat: boolean }>(
    ({ theme, seatStatus, isSelected, isCoupleSeat }) => ({
        width: 40,
        height: 40,
        borderRadius: theme.spacing(0.75),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        cursor: seatStatus === 2 ? 'not-allowed' : 'pointer',
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none',
        position: 'relative',
        ...(isCoupleSeat && {
            width: 85,
            height: 45,
            backgroundColor: isSelected ? theme.palette.info.main : theme.palette.warning.light,
            borderColor: isSelected ? theme.palette.info.dark : theme.palette.warning.dark,
            marginRight: theme.spacing(0.5),
        }),
        backgroundColor:
            seatStatus === 2
                ? theme.palette.grey[500]
                : isSelected
                    ? theme.palette.success.main
                    : isCoupleSeat
                        ? theme.palette.warning.light
                        : theme.palette.primary.light,
        color: seatStatus === 2 || isSelected ? theme.palette.common.white : theme.palette.text.primary,
        '&:hover': {
            backgroundColor:
                seatStatus === 0 || isSelected
                    ? isCoupleSeat
                        ? theme.palette.info.dark
                        : theme.palette.primary.dark
                    : undefined,
            boxShadow:
                seatStatus === 0 || isSelected
                    ? `0px 4px 8px ${theme.palette.action.disabledBackground}`
                    : undefined,
        },
    })
);

const Seat = ({ seat, onClick, isSelected }: { seat: DisplaySeatInfo; onClick: () => void; isSelected: boolean }) => {
    const { t } = useTranslation();
    return (
        <StyledSeat seatStatus={seat.status} isSelected={isSelected} isCoupleSeat={seat.isCoupleSeat} onClick={onClick}>
            <Typography variant="caption">{seat.seatColumn}</Typography>
            {seat.isCoupleSeat && (
                <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.5, fontWeight: 'normal' }}>
                    {t('seat.couple')}
                </Typography>
            )}
        </StyledSeat>
    );
};

export default function SeatSelector() {
    const { t, i18n } = useTranslation();
    const { showtimeId, bookingId, movieId } = useParams();
    const navigate = useNavigate();
    const [showtimeDetails, setShowtimeDetails] = useState<ShowtimeDetail | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<ShowtimeSeatResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const token = localStorage.getItem("token");
    const userId=localStorage.getItem("userId")
    

    // State cho ghế được nhóm theo hàng để hiển thị
    const [seatsGroupedByRow, setSeatsGroupedByRow] = useState<Record<string, DisplaySeatInfo[]>>({});
    const [orderedRowKeys, setOrderedRowKeys] = useState<string[]>([]);

    // State cho bộ đếm ngược (thời gian còn lại tính bằng giây)
    const [timeLeft, setTimeLeft] = useState<number>(15); // 10 phút = 600 giây
    const timerRef = useRef<number | null>(null); // Để lưu trữ ID của setInterval cho timer
    const [openTimeoutDialog, setOpenTimeoutDialog] = useState<boolean>(false);

    const fetchShowtimeDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URLS.BOOKING.GET_SEAT, {
                params: { showtimeId: Number(showtimeId) },
                headers: { Authorization: `Bearer ${token}`, 'Accept-Language': i18n.language },
            });
            setShowtimeDetails(response.data.showtimeDetail);
        } catch (err: any) {
            console.error('Lỗi khi tải:', err);
            setError(t(err.response?.data?.message || 'booking.seats.get.failed'));
            toast.error(t(err.response?.data?.message || 'booking.seats.get.failed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showtimeId) {
            fetchShowtimeDetails();
        }
    }, [showtimeId, token, i18n.language]);

    useEffect(() => {
        if (showtimeDetails && showtimeDetails.seats) {
            const tempSeatsGroupedByRow: Record<string, DisplaySeatInfo[]> = {};
            showtimeDetails.seats.forEach((seat) => {
                const displaySeat: DisplaySeatInfo = { ...seat, isCoupleSeat: seat.description === 'Ghế đôi' };
                if (!tempSeatsGroupedByRow[seat.seatRow]) {
                    tempSeatsGroupedByRow[seat.seatRow] = [];
                }
                tempSeatsGroupedByRow[seat.seatRow].push(displaySeat);
            });
            Object.keys(tempSeatsGroupedByRow).forEach((rowKey) => {
                tempSeatsGroupedByRow[rowKey].sort((a, b) => a.seatColumn - b.seatColumn);
            });
            const tempOrderedRowKeys = Object.keys(tempSeatsGroupedByRow).sort();
            setSeatsGroupedByRow(tempSeatsGroupedByRow);
            setOrderedRowKeys(tempOrderedRowKeys);
        }
    }, [showtimeDetails]);

    useEffect(() => {
        if (showtimeDetails && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current!);
                        setBookingError(t('booking.timeout'));
                        toast.error(t('booking.timeout'));
                        setSelectedSeats([]);
                        setOpenTimeoutDialog(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [showtimeDetails, timeLeft, t]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCloseTimeoutDialog = () => {
        setOpenTimeoutDialog(false);
        navigate(`/movie/${movieId}`, { state: { scrollToShowtime: true } });
    };

    const handleSeatClick = (seat: ShowtimeSeatResponseDTO) => {
        if (seat.status === 2) {
            return;
        }
        const isCurrentlySelected = selectedSeats.some((s) => s.showtimeSeatId === seat.showtimeSeatId);
        if (isCurrentlySelected) {
            setSelectedSeats(selectedSeats.filter((s) => s.showtimeSeatId !== seat.showtimeSeatId));
        } else {
            setSelectedSeats([...selectedSeats, { ...seat, status: 1 }]);
        }
        setBookingError(null);
    };

    const handleProceedToCheckout = async () => {
        if (selectedSeats.length === 0) {
            setBookingError(t('booking.seats.none'));
            toast.error(t('booking.seats.none'));
            return;
        }
        setBookingError(null);

        // if (!token || !userId) {
        //     setBookingError(t('auth.login.required'));
        //     toast.error(t('auth.login.required'));
        //     setTimeout(() => navigate('/login'), 1500);
        //     return;
        // }

        try {
            const bookingRequest = {
                bookingId:Number(bookingId),
                showtimeSeats: selectedSeats.map(s => s.showtimeSeatId), // Gửi showtimeSeatId
                totalAmount:totalAmount
            };

            const response = await axios.post(
                API_URLS.BOOKING.TOCHECKOUT,
                bookingRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept-Language': i18n.language
                    },
                }
            );

            const receivedBookingId = response.data.bookingId;
            localStorage.setItem("bookingId", receivedBookingId);
            sessionStorage.setItem("bookingCheckoutDto", JSON.stringify(response.data));
            toast.success(t(response.data.message || 'booking.create.success', { 0: receivedBookingId }));
            navigate("/checkout");

        } catch (err: any) {
            setBookingError(t(err.response?.data?.message || 'booking.create.failed'));
            toast.error(t(err.response?.data?.message || 'booking.create.failed'));
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>{t('seat.loading')}</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Alert severity="error">
                    <AlertTitle>{t('error')}</AlertTitle>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!showtimeDetails) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Alert severity="warning">
                    <AlertTitle>{t('showtime.notfound')}</AlertTitle>
                    {t('showtime.notfound.message')}
                </Alert>
            </Box>
        );
    }

    const showDate = showtimeDetails.startTime.split(' ')[1];
    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Toolbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: { xs: '10px', md: '20px 0' },
                    backgroundColor: '#f0f2f5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, py: 4 }}>
                    <Paper elevation={6} sx={{ flex: 2, p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
                        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                            {t('booking.seats.success').split(' ')[0]} {/* "Select Seats" hoặc "Chọn ghế" */}
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 1 }}>
                            {showtimeDetails.movieName}
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                            {t('room')}: {showtimeDetails.roomName}
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                            {t('date')}: {showDate} - {t('time')}: {showtimeDetails.startTime.split(' ')[0]}
                        </Typography>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h6" color={timeLeft <= 60 ? 'error.main' : 'text.primary'}>
                                {t('time.left')}: <strong>{formatTime(timeLeft)}</strong>
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: '80%',
                                maxWidth: '400px',
                                height: '15px',
                                backgroundColor: '#333',
                                margin: '0 auto 25px',
                                borderRadius: '5px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                            }}
                        >
                            {t('screen')}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', overflowX: 'auto', pb: 2 }}>
                            {orderedRowKeys.map((rowKey) => (
                                <Box
                                    key={rowKey}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        ...(seatsGroupedByRow[rowKey].some((s) => s.isCoupleSeat) && { mb: 1.5, justifyContent: 'center' }),
                                    }}
                                >
                                    <Typography variant="body2" sx={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                                        {rowKey}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridAutoFlow: 'column',
                                            gap: 1,
                                            ml: 1,
                                            ...(seatsGroupedByRow[rowKey].some((s) => s.isCoupleSeat) && { justifyContent: 'center' }),
                                        }}
                                    >
                                        {seatsGroupedByRow[rowKey].map((seat) => (
                                            <Seat
                                                key={seat.showtimeSeatId}
                                                seat={seat}
                                                isSelected={selectedSeats.some((s) => s.showtimeSeatId === seat.showtimeSeatId)}
                                                onClick={() => handleSeatClick(seat)}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            mt={4}
                            justifyContent="center"
                            alignItems="center"
                            flexWrap="wrap"
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'primary.light', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <Typography variant="body2">{t('seat.normal.available')}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'warning.light', borderRadius: '4px', border: '1px solid orange' }} />
                                <Typography variant="body2">{t('seat.couple.available')}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'success.main', borderRadius: '4px' }} />
                                <Typography variant="body2">{t('seat.selected.legend')}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'grey.500', borderRadius: '4px' }} />
                                <Typography variant="body2">{t('seat.unavailable')}</Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                    <Paper elevation={6} sx={{ flex: 1, p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {t('booking.info')}
                        </Typography>
                        <Stack spacing={1}>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">{t('movie')}:</Typography> {showtimeDetails.movieName}
                            </Typography>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">{t('showtime')}:</Typography> {showtimeDetails.startTime}
                            </Typography>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">{t('room')}:</Typography> {showtimeDetails.roomName}
                            </Typography>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">{t('seat.selected.label')}:</Typography>{' '}
                                {selectedSeats.length > 0 ? selectedSeats.map((s) => s.seatNumber).join(', ') : t('seat.none')}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2, color: 'primary.dark' }}>
                                {t('total')}: {totalAmount.toLocaleString('vi-VN')} VNĐ
                            </Typography>
                        </Stack>
                        {bookingError && (
                            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                                {bookingError}
                            </Alert>
                        )}
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            size="large"
                            sx={{ mt: 3, py: 1.5, borderRadius: '8px' }}
                            onClick={handleProceedToCheckout}
                            disabled={selectedSeats.length === 0}
                        >
                            {t('continue')}
                        </Button>
                    </Paper>
                </Container>
            </Box>
            <Footer />
            <Dialog
                open={openTimeoutDialog}
                onClose={handleCloseTimeoutDialog}
                aria-labelledby="timeout-dialog-title"
                aria-describedby="timeout-dialog-description"
            >
                <DialogTitle id="timeout-dialog-title" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {t('booking.timeout')}
                </DialogTitle>
                <DialogContent>
                    <Typography id="timeout-dialog-description" sx={{ mb: 2 }}>
                        {t('booking.timeout.message')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('booking.timeout.redirect')}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTimeoutDialog} variant="contained" color="primary">
                        {t('ok')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}