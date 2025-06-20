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
import Header from './Header';
import Footer from './Footer';
// import Banner from './Banner'; // Banner không được sử dụng ở đây

import API_URLS from '../config/api';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';



// --- Interfaces (Đảm bảo khớp với Response từ Backend) ---
interface ShowtimeSeatResponseDTO {
    showtimeSeatId: number;
    seatNumber: string;
    seatRow: string;
    seatColumn: number;
    description: string;
    price: number;
    status: number; // 0: Available, 1: selected by current user, 2: Booked/Blocked
    locked_by_user_id: Number;
    lockedAt: string;
    lockExpiresAt: string;
    bookingId: Number;
}

interface ShowtimeDetail {
    showtimeId: number;
    movieName: string;
    roomName: string;
    startTime: string; // "HH:mm dd/MM/yyyy"
    durationMovie: string;
    seats: ShowtimeSeatResponseDTO[];
}

interface ChooseSeatResponseDTO {
    showtimeDetail: ShowtimeDetail;
}

// Interface mở rộng cho ghế khi hiển thị ở frontend (có thêm isCoupleSeat sau khi xử lý)
interface DisplaySeatInfo extends ShowtimeSeatResponseDTO {
    isCoupleSeat: boolean; // THÊM: Biến này để xác định ghế đôi
}

// --- Styled Component cho Ghế ---
const StyledSeat = styled(Box)<{ seatStatus: number; isSelected: boolean; isCoupleSeat: boolean }>(
    ({ theme, seatStatus, isSelected, isCoupleSeat }) => ({
        // Kích thước mặc định cho ghế thường
        width: 40,
        height: 40,
        borderRadius: theme.spacing(0.75),
        display: 'flex',
        flexDirection: 'column', // THÊM: Để chứa cả số ghế và label "Đôi"
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        cursor: (seatStatus === 2) ? 'not-allowed' : 'pointer',
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none',
        position: 'relative', // Để căn chỉnh label

        // THAY ĐỔI: Kích thước và kiểu dáng đặc biệt cho ghế đôi
        ...(isCoupleSeat && {
            width: 85, // Rộng hơn để tạo cảm giác ghế đôi
            height: 45,
            backgroundColor: isSelected
                ? theme.palette.info.main // Màu xanh đặc biệt cho ghế đôi đang chọn
                : theme.palette.warning.light, // Màu cam nhạt cho ghế đôi trống
            borderColor: isSelected
                ? theme.palette.info.dark
                : theme.palette.warning.dark,
            marginRight: theme.spacing(0.5), // Khoảng cách giữa các ghế đôi (chỉ ảnh hưởng đến layout flex)
        }),

        // Màu nền chung, sẽ bị ghi đè nếu là ghế đôi hoặc đang chọn
        backgroundColor:
            seatStatus === 2
                ? theme.palette.grey[500] // Đã bán/Không khả dụng
                : isSelected
                    ? theme.palette.success.main // Đang chọn
                    : isCoupleSeat // Ưu tiên màu ghế đôi nếu là ghế đôi và không chọn
                        ? theme.palette.warning.light // Màu riêng cho ghế đôi trống
                        : theme.palette.primary.light, // Ghế thường trống

        color:
            (seatStatus === 2) || isSelected
                ? theme.palette.common.white
                : theme.palette.text.primary,

        '&:hover': {
            backgroundColor:
                (seatStatus === 0 || isSelected)
                    ? (isCoupleSeat ? theme.palette.info.dark : theme.palette.primary.dark) // Màu hover riêng cho ghế đôi
                    : undefined, // Không hover nếu đã bán
            boxShadow:
                (seatStatus === 0 || isSelected)
                    ? `0px 4px 8px ${theme.palette.action.disabledBackground}`
                    : undefined, // Không hover nếu đã bán
        },
    })
);

// --- Component Ghế con ---
const Seat = ({ seat, onClick, isSelected }: { seat: DisplaySeatInfo; onClick: () => void; isSelected: boolean }) => (
    <StyledSeat seatStatus={seat.status} isSelected={isSelected} isCoupleSeat={seat.isCoupleSeat} onClick={onClick}>
        <Typography variant="caption">{seat.seatColumn}</Typography> {/* Hiển thị số cột */}
        {/* THÊM: Hiển thị label "Đôi" cho ghế đôi */}
        {seat.isCoupleSeat && (
            <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.5, fontWeight: 'normal' }}>
                (Ghế Đôi)
            </Typography>
        )}
    </StyledSeat>
);

// --- Component SeatSelector chính ---
export default function SeatSelector() {
    const { showtimeId, bookingId, movieId } = useParams();
    const navigate = useNavigate();
    const [showtimeDetails, setShowtimeDetails] = useState<ShowtimeDetail | null>(null);
    // Sử dụng ShowtimeSeatResponseDTO cho selectedSeats để nhất quán với backend
    const [selectedSeats, setSelectedSeats] = useState<ShowtimeSeatResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const token = localStorage.getItem("token");

    // State cho ghế được nhóm theo hàng để hiển thị
    const [seatsGroupedByRow, setSeatsGroupedByRow] = useState<Record<string, DisplaySeatInfo[]>>({});
    const [orderedRowKeys, setOrderedRowKeys] = useState<string[]>([]);

    // State cho bộ đếm ngược (thời gian còn lại tính bằng giây)
    const [timeLeft, setTimeLeft] = useState<number>(60); // 10 phút = 600 giây
    const timerRef = useRef<number | null>(null); // Để lưu trữ ID của setInterval cho timer
    const [openTimeoutDialog, setOpenTimeoutDialog] = useState<boolean>(false);

    //////Socket
    const stompClientRef = useRef<Client | null>(null);



    const fetchShowtimeDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ChooseSeatResponseDTO>(API_URLS.BOOKING.GET_SEAT, {
                params: {
                    showtimeId: showtimeId,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setShowtimeDetails(response.data.showtimeDetail);
        } catch (err: any) {
            console.error("Lỗi khi tải chi tiết suất chiếu và ghế:", err);
            setError(err.response?.data?.message || "Không thể tải thông tin suất chiếu. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showtimeId) {
            fetchShowtimeDetails();
        }
    }, [showtimeId, token]);
    useEffect(() => {
    if (!showtimeId || !token) return;

    const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);// Đúng endpoint Spring Boot WebSocket
    const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
        console.log("WebSocket connected");

        // Tham gia phòng
        stompClient.publish({
            destination: `/app/join/${showtimeId}`,
        });

        // Nhận cập nhật trạng thái ghế
        stompClient.subscribe(`/topic/showtime/${showtimeId}/seats`, (message: IMessage) => {
            const seatUpdate = JSON.parse(message.body) as { seatId: number; status: number; userId: number | null };

            setShowtimeDetails((prev) => {
                if (!prev) return prev;
                const updatedSeats = prev.seats.map((seat) =>
                    seat.showtimeSeatId === seatUpdate.seatId
                        ? { ...seat, status: seatUpdate.status }
                        : seat
                );
                return { ...prev, seats: updatedSeats };
            });
        });

        // Thông báo lỗi
        stompClient.subscribe(`/user/queue/errors`, (message: IMessage) => {
            const errorMsg = message.body;
            alert(`Lỗi: ${errorMsg}`);
        });

        // (Tùy chọn) Nhận xác nhận thành công
        stompClient.subscribe(`/user/queue/seat-selection-success`, (message: IMessage) => {
            console.log("Thành công chọn ghế:", message.body);
        });
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
        }
    };
}, [showtimeId, token]);


    // New useEffect để xử lý dữ liệu ghế thô thành dữ liệu được nhóm và sắp xếp để hiển thị
    useEffect(() => {
        if (showtimeDetails && showtimeDetails.seats) {
            const tempSeatsGroupedByRow: Record<string, DisplaySeatInfo[]> = {};

            showtimeDetails.seats.forEach(seat => {
                const displaySeat: DisplaySeatInfo = {
                    ...seat,
                    isCoupleSeat: seat.description === "Ghế đôi",
                };

                if (!tempSeatsGroupedByRow[seat.seatRow]) {
                    tempSeatsGroupedByRow[seat.seatRow] = [];
                }
                tempSeatsGroupedByRow[seat.seatRow].push(displaySeat);
            });

            // Sắp xếp ghế trong mỗi hàng theo seatColumn
            Object.keys(tempSeatsGroupedByRow).forEach(rowKey => {
                tempSeatsGroupedByRow[rowKey].sort((a, b) => a.seatColumn - b.seatColumn);
            });

            // Sắp xếp các khóa hàng theo thứ tự bảng chữ cái (A, B, C, sau đó I cho ghế đôi, v.v.)
            const tempOrderedRowKeys = Object.keys(tempSeatsGroupedByRow).sort();

            setSeatsGroupedByRow(tempSeatsGroupedByRow);
            setOrderedRowKeys(tempOrderedRowKeys);
        }
    }, [showtimeDetails]); // Chạy lại khi showtimeDetails thay đổi

    // useEffect cho Timer
    useEffect(() => {
        // Chỉ khởi tạo timer nếu showtimeDetails đã được tải thành công và thời gian còn lại lớn hơn 0
        if (showtimeDetails && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        // Khi hết giờ
                        clearInterval(timerRef.current!); // Dừng timer
                        setBookingError("Hết thời gian chọn ghế. Vui lòng chọn lại.");
                        setSelectedSeats([]); // Xóa các ghế đã chọn
                        setOpenTimeoutDialog(true); // Mở dialog hết giờ
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000); // Giảm 1 giây mỗi giây

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current); // Dọn dẹp timer khi component unmount
                }
            };
        } else if (timeLeft === 0 && timerRef.current) {
            clearInterval(timerRef.current); // Đảm bảo timer được xóa nếu đã về 0
        }
    }, [showtimeDetails, timeLeft]); // Thêm showtimeDetails vào dependency để đảm bảo timer chỉ chạy khi dữ liệu có

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCloseTimeoutDialog = () => {
        setOpenTimeoutDialog(false); // Đóng dialog
        navigate(`/movie/${movieId}`, { state: { scrollToShowtime: true } }); // Chuyển hướng về trang chi tiết phim
    };

    const handleSeatClick = (seat: ShowtimeSeatResponseDTO) => {
    if (seat.status === 2) return;

    const userId = localStorage.getItem("userId");
    if (!userId || !stompClientRef.current?.connected) return;

    const isCurrentlySelected = selectedSeats.some(s => s.showtimeSeatId === seat.showtimeSeatId);

    if (isCurrentlySelected) {
        setSelectedSeats(selectedSeats.filter(s => s.showtimeSeatId !== seat.showtimeSeatId));
        stompClientRef.current.publish({
            destination: "/app/releaseSeat",
            body: JSON.stringify({
                showtimeId: parseInt(showtimeId || "0"),
                showtimeSeatId: seat.showtimeSeatId,
                userId: parseInt(userId)
            }),
        });
    } else {
        setSelectedSeats([...selectedSeats, { ...seat, status: 1 }]);
        stompClientRef.current.publish({
            destination: "/app/selectSeat",
            body: JSON.stringify({
                showtimeId: parseInt(showtimeId || "0"),
                showtimeSeatId: seat.showtimeSeatId,
                userId: parseInt(userId)
            }),
        });
    }

    setBookingError(null);
};


    const handleProceedToCheckout = async () => {
        if (selectedSeats.length === 0) {
            setBookingError("Vui lòng chọn ít nhất một ghế để tiếp tục.");
            return;
        }
        setBookingError(null);

        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            setBookingError("Bạn cần đăng nhập để đặt vé. Đang chuyển hướng...");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {
            const bookingRequest = {
                userId: parseInt(userId),
                showtimeId: parseInt(showtimeId || '0'),
                selectedSeatIds: selectedSeats.map(s => s.showtimeSeatId), // Gửi showtimeSeatId
            };

            const response = await axios.post(
                API_URLS.BOOKING.CHOOSE_SHOWTIME,
                bookingRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const receivedBookingId = response.data.bookingId;
            localStorage.setItem("bookingId", receivedBookingId);
            navigate("/checkout");
        } catch (err: any) {
            console.error("Lỗi khi tạo booking:", err.response?.data || err.message);
            setBookingError(err.response?.data?.message || "Đã xảy ra lỗi khi tạo booking. Vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Đang tải sơ đồ ghế...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Alert severity="error">
                    <AlertTitle>Lỗi</AlertTitle>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!showtimeDetails) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Alert severity="warning">
                    <AlertTitle>Không tìm thấy suất chiếu</AlertTitle>
                    Không tìm thấy thông tin suất chiếu cho ID này.
                </Alert>
            </Box>
        );
    }

    const showDate = showtimeDetails.startTime.split(' ')[1];


    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
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
                    {/* Phần Sơ đồ ghế */}
                    <Paper elevation={6} sx={{ flex: 2, p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
                        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                            Chọn Ghế
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 1 }}>
                            {showtimeDetails.movieName}
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                            Phòng: {showtimeDetails.roomName}
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                            Ngày: {showDate} - Giờ: {showtimeDetails.startTime.split(' ')[0]}
                        </Typography>
                        {/* Timer */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h6" color={timeLeft <= 60 ? 'error.main' : 'text.primary'}>
                                Thời gian còn lại: **{formatTime(timeLeft)}**
                            </Typography>
                        </Box>

                        {/* Màn hình chiếu */}
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
                            MÀN HÌNH
                        </Box>

                        {/* Sơ đồ ghế */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', overflowX: 'auto', pb: 2 }}>
                            {orderedRowKeys.map(rowKey => (
                                <Box
                                    key={rowKey}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        // Điều chỉnh khoảng cách giữa các hàng và căn giữa nếu hàng đó chứa ghế đôi
                                        ...(seatsGroupedByRow[rowKey].some(s => s.isCoupleSeat) && { mb: 1.5, justifyContent: 'center' })
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
                                            // Căn giữa các ghế trong hàng nếu hàng đó là ghế đôi
                                            ...(seatsGroupedByRow[rowKey].some(s => s.isCoupleSeat) && { justifyContent: 'center' }),
                                        }}
                                    >
                                        {seatsGroupedByRow[rowKey].map(seat => (
                                            <Seat
                                                key={seat.showtimeSeatId} // Sử dụng showtimeSeatId làm khóa duy nhất
                                                seat={seat}
                                                // Kiểm tra selectedSeats bằng showtimeSeatId
                                                isSelected={selectedSeats.some(s => s.showtimeSeatId === seat.showtimeSeatId)}
                                                onClick={() => handleSeatClick(seat)}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Chú thích trạng thái ghế */}
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
                                <Typography variant="body2">Ghế Thường Trống</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'warning.light', borderRadius: '4px', border: '1px solid orange' }} />
                                <Typography variant="body2">Ghế Đôi Trống</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'success.main', borderRadius: '4px' }} />
                                <Typography variant="body2">Đang Chọn</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 24, height: 24, bgcolor: 'grey.500', borderRadius: '4px' }} />
                                <Typography variant="body2">Đã Bán/Không Khả Dụng</Typography>
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Phần Thông tin vé và Tiếp tục */}
                    <Paper elevation={6} sx={{ flex: 1, p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Thông tin đặt vé
                        </Typography>
                        <Stack spacing={1}>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">Phim:</Typography> {showtimeDetails.movieName}
                            </Typography>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">Suất:</Typography> {showtimeDetails.startTime}
                            </Typography>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">Phòng:</Typography> {showtimeDetails.roomName}
                            </Typography>
                            <Typography variant="body1">
                                <Typography component="span" fontWeight="bold">Ghế đã chọn:</Typography> {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(', ') : '(Chưa chọn ghế)'}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2, color: 'primary.dark' }}>
                                Tổng tiền: {totalAmount.toLocaleString('vi-VN')} VNĐ
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
                            Tiếp tục
                        </Button>
                    </Paper>
                </Container>
            </Box>

            <Footer />
            <Dialog
                open={openTimeoutDialog}
                onClose={handleCloseTimeoutDialog} // Khi người dùng nhấn ESC hoặc click ra ngoài
                aria-labelledby="timeout-dialog-title"
                aria-describedby="timeout-dialog-description"
            >
                <DialogTitle id="timeout-dialog-title" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {"Hết thời gian chọn ghế!"}
                </DialogTitle>
                <DialogContent>
                    <Typography id="timeout-dialog-description" sx={{ mb: 2 }}>
                        Thời gian dành cho việc chọn ghế của bạn đã hết.
                        <br />
                        Vui lòng chọn lại suất chiếu hoặc phim khác.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Hệ thống sẽ tự động đưa bạn về trang chi tiết phim.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTimeoutDialog} variant="contained" color="primary">
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}