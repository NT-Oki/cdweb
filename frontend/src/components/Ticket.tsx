import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, Button, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo_ticket.png';
import { useLocation, useNavigate } from 'react-router';
import API_URLS from '../config/api';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';

interface BookingCheckoutDto {
  bookingId: number;
  userId: number;
  nameSeats: string[];
  quantityNormalSeat: number;
  totalPriceNormalSeat: number;
  quantityCoupleSeat: number;
  totalPriceCoupleSeat: number;
  totalPrice: number;
  movieName: string;
  startTime: string;
  roomName: string;
  bookingCode: string;
}

export default function Ticket() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<BookingCheckoutDto | null>(null);
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get('bookingId');
  const [qrUrl, setQrUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchQR = async () => {
      if (!bookingId) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          API_URLS.BOOKING.TICKET(Number(bookingId)),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept-Language': i18n.language,
            },

          }
        );


        setData(response.data.bookingCheckoutDto);
        setQrUrl(`data:image/png;base64,${response.data.image}`);
      } catch (e) {
        console.error("Lỗi tải QR:", e);
      }
    };

    fetchQR();
  }, [bookingId, i18n.language]);

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
      <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', bgcolor: '#f9fbfd' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          {/* Cột trái: Hình + barcode + thông tin người mua */}
          <Paper elevation={8} sx={{ flex: 4, p: 3, textAlign: 'center', flexDirection: "row", display: "flex" }}>
            <Box sx={{ alignContent: "center", flex: 1 }}>
              <Box
                component="img"
                src={logo}
                alt="monster"
                sx={{ height: 120, mb: 2, mx: 'auto' }}
              />
              <Typography color="error">{t('booking.thankYou')} {/* "Cám ơn bạn đã lựa chọn" hoặc "Thank you for choosing" */}</Typography>
              <Typography fontWeight="bold" color="error">{t('app.name')} {/* "ThuThao Cinema" */}</Typography>
            </Box>
            <Box sx={{ flex: 1.5 }}>
              <Typography mt={3}>
                {t('booking.successMessage')} {/* "Bạn đã mua vé thành công..." hoặc "You have successfully purchased..." */}
              </Typography>
              <Typography fontWeight="bold" mt={1}>{t('app.name')}</Typography>
              <Typography fontSize={14} color="text.secondary">
                {t('cinema.address')} {/* "khu phố 6, Thủ Đức, Hồ Chí Minh" hoặc "Khu phố 6, Thủ Đức, Ho Chi Minh City" */}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mt: 1, mb: 2 }}>
                {t('cinema.map')} {/* "xem bản đồ" hoặc "view map" */}
              </Typography>
              <Typography fontSize={14}>
                {t('booking.showCode')} {/* "Hãy đưa mã này..." hoặc "Please show this code..." */}
              </Typography>
              <Box
                component="img"
                src={qrUrl}
                alt="barcode"
                sx={{ my: 2, width: '80%', maxWidth: 300 }}
              />
              <Typography fontWeight="bold">{data?.bookingCode}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                {t('booking.emailSent')} {/* "Thông tin vé cũng được gửi về Email" hoặc "Ticket information has also been sent to email" */}
              </Typography>
            </Box>
          </Paper>

          {/* Cột phải: Thông tin vé */}
          <Paper elevation={8} sx={{ flex: 2, p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {data?.movieName}
            </Typography>
            <Typography fontWeight="bold">{t('app.name')}</Typography>
            <Typography>
              {t('showtime')} <strong>{data?.startTime}</strong> {/* "Suất" hoặc "Showtime" */}
            </Typography>
            <Typography>
              {t('room')} <strong>{data?.roomName}</strong> - {t('seat.selected.label')} <strong>{data?.nameSeats.map((s: string) => s).join(", ")}</strong> {/* "Phòng chiếu" hoặc "Room", "Ghế" hoặc "Seats" */}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('booking.summary')} {/* "Tóm tắt đơn hàng" hoặc "Order Summary" */}
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>{data?.quantityNormalSeat}x {t('seat.normal')}</Typography>
              <Typography>{(data?.totalPriceNormalSeat || 0).toLocaleString('vi-VN')} vnđ</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>{data?.quantityCoupleSeat}x {t('seat.couple')}</Typography>
              <Typography>{(data?.totalPriceCoupleSeat || 0).toLocaleString('vi-VN')} vnđ</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">{t('total')}</Typography>
              <Typography fontWeight="bold">
                {data?.totalPrice?.toLocaleString('vi-VN')} vnđ
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button variant="outlined" color="primary" onClick={() => navigate("/")}>
                {t('nav.home')} {/* "Về trang chủ" hoặc "Back to Home" */}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}