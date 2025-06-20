import React, { useState } from "react";
import { Box, Typography, TextField, Button, Toolbar, Alert } from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import Header from "./Header";
import axios from "axios";
import API_URLS from "../config/api";
import Footer from "./Footer";

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
}

const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dataJson = sessionStorage.getItem("bookingCheckoutDto");
  const data: BookingCheckoutDto | null = dataJson ? JSON.parse(dataJson) : null;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


    const getTicket = async () => {
      try {
        const response = await axios.get(
          API_URLS.PAYMENT.create_payment,
          {
            params: {
              amount: Number(data?.totalPrice),
              bookingId: data?.bookingId
            },
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        if (response.data.status === 'OK' && response.data.url) {
          setMessage('Đang chuyển hướng đến trang thanh toán VNPAY...');
          // Chuyển hướng người dùng đến URL của VNPAY
          window.location.href = response.data.url;
        } else {
          setError(response.data.message || 'Có lỗi xảy ra khi tạo thanh toán.');
        }

      } catch (error) {
        console.error("Lỗi khi gửi thanh toán:", error);
      }
    };



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

        <Box sx={{ p: 4, bgcolor: "#f9fafc", minHeight: "100vh" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              maxWidth: 1200,
              mx: "auto",
              gap: 4,
            }}
          >
            {/* left===================================== */}
            <Box sx={{ flex: 2 }}>
              {/* Tóm tắt đơn hàng */}
              <Box sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    backgroundColor: "rgb(149, 170, 201)",
                    position: "relative",
                    width: "100%",
                    borderRadius: 2,
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {t('booking.summary')} {/* "Tóm tắt đơn hàng" hoặc "Order Summary" */}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    p: "0 12px 12px 12px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "rgb(149, 170, 201)",
                    }}
                  >
                    {t('booking.description')} {/* "Mô tả" hoặc "Description" */}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "rgb(149, 170, 201)",
                    }}
                  >
                    {t('booking.quantity')} {/* "Số lượng" hoặc "Quantity" */}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "rgb(149, 170, 201)",
                    }}
                  >
                    {t('booking.subtotal')} {/* "Thành tiền" hoặc "Subtotal" */}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                  }}
                >
                  <Typography>{t('seat.normal')} {/* "Ghế Đơn" hoặc "Normal Seat" */}</Typography>
                  <Typography>{data?.quantityNormalSeat}</Typography>
                  <Typography>{data?.totalPriceNormalSeat.toLocaleString('vi-VN')} vnđ</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    p: 1,
                  }}
                >
                  <Typography>{t('seat.couple')} {/* "Ghế Đôi" hoặc "Couple Seat" */}</Typography>
                  <Typography>{data?.quantityCoupleSeat}</Typography>
                  <Typography>{data?.totalPriceCoupleSeat.toLocaleString('vi-VN')} vnđ</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, p: 1 }}>
                  <Typography fontWeight="bold">{t('total')} {/* "Tổng" hoặc "Total" */}</Typography>
                  <Typography fontWeight="bold">{data?.totalPrice.toLocaleString('vi-VN')} vnđ</Typography>
                </Box>
              </Box>
            </Box>
            {/* endleft------------------------------------- */}
            <Box sx={{ flex: 1 }}>
              {/* Thông tin vé */}
              <Box sx={{ bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 1 }}>
                <Typography variant="body1">
                  <strong>{data?.movieName}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>{t('app.name')} {/* "ThuThao Cinema" hoặc "ThuThao Cinema" */}</strong>
                </Typography>
                <Typography variant="body2">
                  {t('showtime')} <strong>{data?.startTime.split(' ')[0]} {data?.startTime.split(' ')[1]}</strong> {/* "Suất" hoặc "Showtime" */}
                </Typography>
                <Typography variant="body2">
                  {t('room')} <strong>{data?.roomName}</strong> {/* "Phòng chiếu" hoặc "Room" */}
                </Typography>
                <Typography variant="body2">
                  {t('seat.selected.label')} <strong>{data?.nameSeats.map((name: string) => name).join(", ")}</strong> {/* "Ghế" hoặc "Seats" */}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography fontWeight="bold" variant="h6">
                    {t('booking.total')} {data?.totalPrice.toLocaleString('vi-VN')} {/* "Tổng đơn hàng" hoặc "Total Order" */}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {t('booking.ticketPolicy')} {/* "Vé đã mua không thể đổi hoặc hoàn tiền..." */}
                    <br />
                    {t('booking.ticketSent')} <strong>01</strong> {t('booking.ticketSent2')} {/* "Mã vé sẽ được gửi..." */}
                  </Typography>
                </Box>
              </Box>

              {/* Xác nhận */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined">{t('back')} {/* "Quay lại" hoặc "Back" */}</Button>
                <Button variant="contained" color="primary" onClick={getTicket}>
                  {t('confirm')} {/* "Xác nhận" hoặc "Confirm" */}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Footer />
        { message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert> }
    { error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> }
      </Box>
      
  
    
    
                
  );
};

export default CheckoutPage;