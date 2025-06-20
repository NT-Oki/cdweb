import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider,Button, Toolbar } from '@mui/material';
import logo from '../assets/images/logo_ticket.png';
import { href, useLocation, useNavigate } from 'react-router';
import { Image } from '@mui/icons-material';
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
    const navigate = useNavigate();
      const location = useLocation();
      const[data,setData] = useState<BookingCheckoutDto|null>(null);
  const bookingId = location.state?.bookingId;
  const [qrUrl, setQrUrl] = useState<string | undefined>(undefined);
    useEffect(() => {
    const fetchQR = async () => {
      if (!bookingId) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          API_URLS.BOOKING.TICKET(bookingId),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
   
          }
        );

        // const imageUrl = URL.createObjectURL(response.data.image);
        setData(response.data.bookingCheckoutDto);
         setQrUrl(`data:image/png;base64,${response.data.image}`);
      } catch (e) {
        console.error("Lỗi tải QR:", e);
      }
    };

    fetchQR();
  }, [bookingId]);
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
                <Paper
                    elevation={8}
                    sx={{ flex: 4, p: 3, textAlign: 'center', flexDirection: "row", display: "flex" }}>
                    <Box
                        sx={{
                            alignContent: "center",
                            flex: 1
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="monster"
                            sx={{ height: 120, mb: 2, mx: 'auto' }}
                        />
                        <Typography color="error">Cám ơn bạn đã lựa chọn</Typography>
                        <Typography fontWeight="bold" color="error">ThuThao Cinema</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1.5
                        }}
                    >

                        <Typography mt={3}>
                            Bạn đã mua vé thành công tại ThuThao Cinema!
                        </Typography>

                        <Typography fontWeight="bold" mt={1}>ThuThao Cinema</Typography>
                        <Typography fontSize={14} color="text.secondary">
                            khu phố 6, Thủ Đức, Hồ Chí Minh
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ mt: 1, mb: 2 }}>
                            xem bản đồ
                        </Typography>

                        <Typography fontSize={14}>
                            Hãy đưa mã này cho nhân viên quầy vé để đổi vé của bạn.
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
                            Thông tin vé cũng được gửi về Email
                        </Typography>
                        
                    </Box>




                </Paper>

                {/* Cột phải: Thông tin vé */}
                <Paper elevation={8} sx={{ flex: 2, p: 3,}}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {data?.movieName}
                    </Typography>
                    <Typography fontWeight="bold">ThuThao Cinema</Typography>
                    <Typography>
                        Suất <strong>{data?.startTime}</strong>
                    </Typography>
                    <Typography>
                        Phòng chiếu <strong>{data?.roomName}</strong> - Ghế <strong>{data?.nameSeats.map((s:string)=>s).join(", ")}</strong>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
  Tóm tắt đơn hàng
</Typography>

<Box display="flex" justifyContent="space-between" mb={1}>
  <Typography>{data?.quantityNormalSeat}x Ghế đơn</Typography>
  <Typography>{(data?.totalPriceNormalSeat || 0).toLocaleString('vi-VN')} vnđ</Typography>
</Box>

<Box display="flex" justifyContent="space-between" mb={1}>
  <Typography>{data?.quantityCoupleSeat}x Ghế đôi</Typography>
  <Typography>{(data?.totalPriceCoupleSeat || 0).toLocaleString('vi-VN')} vnđ</Typography>
</Box>

<Divider sx={{ my: 1 }} />

<Box display="flex" justifyContent="space-between">
  <Typography fontWeight="bold">Tổng</Typography>
  <Typography fontWeight="bold">
    {data?.totalPrice?.toLocaleString('vi-VN')} vnđ
  </Typography>
</Box>

                      <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt:3 }}
        >
          <Button variant="outlined" color="primary"
          onClick={()=>{navigate("/")}}
          >
            Về trang chủ
          </Button>
        </Box>
                </Paper>
            </Box>
        </Box>
        <Footer></Footer>
        </Box>
    );
}
