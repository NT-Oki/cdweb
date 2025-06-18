// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; // Thêm useParams
// import axios from 'axios';
// import {
//     Box,
//     Toolbar,
//     Typography,
//     Button,
//     Stack,
//     Paper,
//     CircularProgress,
//     Alert,
//     AlertTitle,
//     Container, // Thêm Container để giới hạn chiều rộng
// } from '@mui/material';
// import { styled } from '@mui/system'; // Để tạo styled component
// import Header from './Header';
// import Footer from './Footer'; // Đảm bảo đúng tên file Footer của bạn
// import Banner from './Banner'; // Nếu bạn muốn dùng Banner

// import API_URLS from '../config/api';

// // --- Interfaces (Đảm bảo khớp với Response từ Backend) ---
// interface ShowtimeDetail {
//     id: number;
//     movieName: string;
//     cinemaName: string;
//     roomName: string;
//     showDate: string; // "yyyy-MM-dd"
//     startTime: string; // "HH:mm"
//     seats: SeatInfo[]; // Danh sách ghế kèm trạng thái
// }

// interface SeatInfo {
//     id: number;
//     seatNumber: string; // ví dụ: "A1", "B5"
//     rowNumber: string; // ví dụ: "A", "B"
//     columnNumber: string; // ví dụ: "1", "5"
//     status: 'AVAILABLE' | 'BOOKED' | 'SELECTED' | 'BLOCKED'; // SELECTED là trạng thái tạm thời trên frontend
// }

// // --- Styled Component cho Ghế ---
// const StyledSeat = styled(Box)<{ seatStatus: SeatInfo['status']; isSelected: boolean }>(
//     ({ theme, seatStatus, isSelected }) => ({
//         width: 40, // Tăng kích thước ghế một chút
//         height: 40,
//         borderRadius: theme.spacing(0.75), // Bo tròn nhẹ
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontWeight: 'bold',
//         cursor: (seatStatus === 'BOOKED' || seatStatus === 'BLOCKED') ? 'not-allowed' : 'pointer',
//         border: '1px solid',
//         borderColor: theme.palette.grey[400],
//         transition: 'all 0.2s ease-in-out',
//         userSelect: 'none', // Ngăn không cho text trong ghế bị chọn

//         // Màu sắc dựa trên trạng thái
//         backgroundColor:
//             seatStatus === 'BOOKED' || seatStatus === 'BLOCKED'
//                 ? theme.palette.grey[500] // Đã bán hoặc bị chặn
//                 : isSelected
//                     ? theme.palette.success.main // Đã chọn
//                     : theme.palette.primary.light, // Có sẵn

//         color:
//             (seatStatus === 'BOOKED' || seatStatus === 'BLOCKED') || isSelected
//                 ? theme.palette.common.white
//                 : theme.palette.text.primary,

//         '&:hover': {
//             backgroundColor:
//                 (seatStatus === 'AVAILABLE' || isSelected)
//                     ? theme.palette.primary.dark // Hover cho ghế có sẵn/đã chọn
//                     : undefined,
//             boxShadow:
//                 (seatStatus === 'AVAILABLE' || isSelected)
//                     ? `0px 4px 8px ${theme.palette.action.disabledBackground}`
//                     : undefined,
//         },
//     })
// );

// // --- Component Ghế con ---
// const Seat = ({ seat, onClick, isSelected }: { seat: SeatInfo; onClick: () => void; isSelected: boolean }) => (
//     <StyledSeat seatStatus={seat.status} isSelected={isSelected} onClick={onClick}>
//         <Typography variant="caption">{seat.columnNumber}</Typography>
//     </StyledSeat>
// );

// // --- Component SeatSelector chính ---
// export default function SeatSelector() {
//     const { showtimeId } = useParams(); // Lấy showtimeId từ URL
//     const navigate = useNavigate(); // Để điều hướng
//     const [showtimeDetails, setShowtimeDetails] = useState<ShowtimeDetail | null>(null);
//     const [selectedSeats, setSelectedSeats] = useState<SeatInfo[]>([]); // Lưu object SeatInfo
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [bookingError, setBookingError] = useState<string | null>(null);
//     const token = localStorage.getItem("token");

//     const SEAT_PRICE = 85000; // Giá mỗi ghế

//     useEffect(() => {
//         const fetchShowtimeDetails = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 // Endpoint giả định: GET /api/showtimes/{id}/seats
//                 const response = await axios.get(API_URLS.BOOKING.GET_SEAT,{
//                   params:{
//                     showtimeId:showtimeId
//                   },headers:{
//                     Authorization: `Bearer ${token}`,
//                   }
//                 });
//                 setShowtimeDetails(response.data.seats);
//             } catch (err: any) {
//                 console.error("Lỗi khi tải chi tiết suất chiếu và ghế:", err);
//                 setError(err.response?.data?.message || "Không thể tải thông tin suất chiếu. Vui lòng thử lại sau.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (showtimeId) {
//             fetchShowtimeDetails();
//         }
//     }, [showtimeId]);

//     const handleSeatClick = (seat: SeatInfo) => {
//         if (seat.status === 'BOOKED' || seat.status === 'BLOCKED') {
//             return; // Không cho phép chọn ghế đã đặt hoặc bị chặn
//         }

//         const isCurrentlySelected = selectedSeats.some(s => s.id === seat.id);

//         if (isCurrentlySelected) {
//             setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
//         } else {
//             // Giới hạn số lượng ghế có thể chọn, ví dụ: tối đa 10 ghế
//             // if (selectedSeats.length >= 10) {
//             //     setBookingError("Bạn chỉ có thể chọn tối đa 10 ghế.");
//             //     return;
//             // }
//             setSelectedSeats([...selectedSeats, { ...seat, status: 'SELECTED' }]); // Cập nhật trạng thái tạm thời
//         }
//         setBookingError(null); // Xóa lỗi nếu người dùng đã chọn/bỏ chọn ghế
//     };

//     const handleProceedToCheckout = async () => {
//         if (selectedSeats.length === 0) {
//             setBookingError("Vui lòng chọn ít nhất một ghế để tiếp tục.");
//             return;
//         }
//         setBookingError(null);

//         const token = localStorage.getItem('token');
//         const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage hoặc từ Context/Redux

//         if (!token || !userId) {
//             setBookingError("Bạn cần đăng nhập để đặt vé. Đang chuyển hướng...");
//             setTimeout(() => navigate('/login'), 1500); // Điều hướng sau 1.5 giây
//             return;
//         }

//         try {
//             const bookingRequest = {
//                 userId: parseInt(userId),
//                 showtimeId: parseInt(showtimeId || '0'),
//                 selectedSeatIds: selectedSeats.map(s => s.id),
//                 // Các trường khác như totalAmount có thể được tính ở backend
//             };

//             const response = await axios.post(
//                 API_URLS.BOOKING.CHOOSE_SHOWTIME, // ví dụ: /api/bookings
//                 bookingRequest,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const bookingId = response.data.bookingId;
//             localStorage.setItem("bookingId", bookingId);
//             navigate("/checkout"); // Điều hướng đến trang thanh toán
//         } catch (err: any) {
//             console.error("Lỗi khi tạo booking:", err.response?.data || err.message);
//             setBookingError(err.response?.data?.message || "Đã xảy ra lỗi khi tạo booking. Vui lòng thử lại.");
//         }
//     };

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//                 <CircularProgress />
//                 <Typography sx={{ ml: 2 }}>Đang tải sơ đồ ghế...</Typography>
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//                 <Alert severity="error">
//                     <AlertTitle>Lỗi</AlertTitle>
//                     {error}
//                 </Alert>
//             </Box>
//         );
//     }

//     if (!showtimeDetails) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//                 <Alert severity="warning">
//                     <AlertTitle>Không tìm thấy suất chiếu</AlertTitle>
//                     Không tìm thấy thông tin suất chiếu cho ID này.
//                 </Alert>
//             </Box>
//         );
//     }

//     // Nhóm ghế theo hàng và sắp xếp
//     const seatsByRow = showtimeDetails.seats.reduce((acc, seat) => {
//         (acc[seat.rowNumber] = acc[seat.rowNumber] || []).push(seat);
//         return acc;
//     }, {} as Record<string, SeatInfo[]>);

//     const sortedRowKeys = Object.keys(seatsByRow).sort();
//     sortedRowKeys.forEach(rowKey => {
//         seatsByRow[rowKey].sort((a, b) => parseInt(a.columnNumber) - parseInt(b.columnNumber));
//     });

//     const totalAmount = selectedSeats.length * SEAT_PRICE;

//     return (
//         <Box
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 minHeight: '100vh',
//             }}
//         >
//             <Header />
//             <Toolbar /> {/* Để tạo khoảng trống dưới Header cố định */}

//             {/* <Banner /> */} {/* Có thể bỏ Banner nếu không muốn */}

//             <Box
//                 component="main"
//                 sx={{
//                     flexGrow: 1,
//                     padding: { xs: '10px', md: '20px 0' }, // Responsive padding
//                     backgroundColor: '#f0f2f5',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
//                 }}
//             >
//                 <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, py: 4 }}>
//                     {/* Phần Sơ đồ ghế */}
//                     <Paper elevation={6} sx={{ flex: 2, p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
//                         <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
//                             Chọn Ghế
//                         </Typography>
//                         <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 1 }}>
//                             {showtimeDetails.movieName}
//                         </Typography>
//                         <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
//                             {showtimeDetails.cinemaName} - Phòng: {showtimeDetails.roomName}
//                         </Typography>
//                         <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
//                             Ngày: {showtimeDetails.showDate} - Giờ: {showtimeDetails.startTime}
//                         </Typography>

//                         {/* Màn hình chiếu */}
//                         <Box
//                             sx={{
//                                 width: '80%',
//                                 maxWidth: '400px', // Giới hạn chiều rộng màn hình
//                                 height: '15px',
//                                 backgroundColor: '#333',
//                                 margin: '0 auto 25px',
//                                 borderRadius: '5px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 fontSize: '0.8rem',
//                             }}
//                         >
//                             MÀN HÌNH
//                         </Box>

//                         {/* Sơ đồ ghế */}
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', overflowX: 'auto', pb: 2 }}>
//                             {sortedRowKeys.map(rowKey => (
//                                 <Box key={rowKey} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Typography variant="body2" sx={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>
//                                         {rowKey}
//                                     </Typography>
//                                     <Box
//                                         sx={{
//                                             display: 'grid',
//                                             gridTemplateColumns: `repeat(${seatsByRow[rowKey].length}, 1fr)`, // Số cột linh hoạt
//                                             gap: 1,
//                                             ml: 1,
//                                         }}
//                                     >
//                                         {seatsByRow[rowKey].map(seat => (
//                                             <Seat
//                                                 key={seat.id}
//                                                 seat={seat}
//                                                 isSelected={selectedSeats.some(s => s.id === seat.id)}
//                                                 onClick={() => handleSeatClick(seat)}
//                                             />
//                                         ))}
//                                     </Box>
//                                 </Box>
//                             ))}
//                         </Box>

//                         {/* Chú thích trạng thái ghế */}
//                         <Stack
//                             direction={{ xs: 'column', sm: 'row' }}
//                             spacing={2}
//                             mt={4}
//                             justifyContent="center"
//                             alignItems="center"
//                             flexWrap="wrap"
//                         >
//                             <Stack direction="row" alignItems="center" spacing={1}>
//                                 <Box sx={{ width: 24, height: 24, bgcolor: 'primary.light', borderRadius: '4px', border: '1px solid #ccc' }} />
//                                 <Typography variant="body2">Trống</Typography>
//                             </Stack>
//                             <Stack direction="row" alignItems="center" spacing={1}>
//                                 <Box sx={{ width: 24, height: 24, bgcolor: 'success.main', borderRadius: '4px' }} />
//                                 <Typography variant="body2">Đang chọn</Typography>
//                             </Stack>
//                             <Stack direction="row" alignItems="center" spacing={1}>
//                                 <Box sx={{ width: 24, height: 24, bgcolor: 'grey.500', borderRadius: '4px' }} />
//                                 <Typography variant="body2">Đã bán/Không khả dụng</Typography>
//                             </Stack>
//                         </Stack>
//                     </Paper>

//                     {/* Phần Thông tin vé và Tiếp tục */}
//                     <Paper elevation={6} sx={{ flex: 1, p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
//                         <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//                             Thông tin đặt vé
//                         </Typography>
//                         <Stack spacing={1}>
//                             <Typography variant="body1">
//                                 <Typography component="span" fontWeight="bold">Phim:</Typography> {showtimeDetails.movieName}
//                             </Typography>
//                             <Typography variant="body1">
//                                 <Typography component="span" fontWeight="bold">Suất:</Typography> {showtimeDetails.startTime} - {showtimeDetails.showDate}
//                             </Typography>
//                             <Typography variant="body1">
//                                 <Typography component="span" fontWeight="bold">Rạp/Phòng:</Typography> {showtimeDetails.cinemaName} / {showtimeDetails.roomName}
//                             </Typography>
//                             <Typography variant="body1">
//                                 <Typography component="span" fontWeight="bold">Ghế đã chọn:</Typography> {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(', ') : '(Chưa chọn ghế)'}
//                             </Typography>
//                             <Typography variant="h6" sx={{ mt: 2, color: 'primary.dark' }}>
//                                 Tổng tiền: {totalAmount.toLocaleString('vi-VN')} VNĐ
//                             </Typography>
//                         </Stack>

//                         {bookingError && (
//                             <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
//                                 {bookingError}
//                             </Alert>
//                         )}

//                         <Button
//                             variant="contained"
//                             color="success"
//                             fullWidth
//                             size="large"
//                             sx={{ mt: 3, py: 1.5, borderRadius: '8px' }}
//                             onClick={handleProceedToCheckout}
//                             disabled={selectedSeats.length === 0}
//                         >
//                             Tiếp tục
//                         </Button>
//                     </Paper>
//                 </Container>
//             </Box>

//             <Footer />
//         </Box>
//     );
// }