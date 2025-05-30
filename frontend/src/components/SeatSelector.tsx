import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, Box, Paper, Stack } from "@mui/material";
import axios from "axios";
import API_URLS from "../config/api";
import { useNavigate } from "react-router";


const rows = "ABCDEFGH".split("");
const cols = Array.from({ length: 12 }, (_, i) => i + 1);

const Seat = ({ selected, sold, onClick, seatId }: any) => (
  <Box
    onClick={onClick}
    sx={{
      width: 35,
      height: 35,
      borderRadius: 0.5,
      bgcolor: sold ? "grey.500" : selected ? "green" : "#e0e0e0",
      cursor: sold ? "not-allowed" : "pointer",
      display: "flex",
      border: sold ? "none" : "1px solid #ccc",
      justifyContent:"center",
      alignItems:"center"

    }}
  >
    <Typography>{seatId}</Typography>
  </Box>
);


export default function SeatSelection() {
  const navigate=useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const soldSeats = ["G8", "G9", "H8", "H9", "I8", "I9", "J8", "J9"];

  const toggleSeat = (seatId: string) => {
    if (soldSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };
  const checkout = ()=>{
    navigate('/checkout')

  }

  return (
    <Box
    sx={{
      display:"flex",
      justifyContent:"space-evenly"
    }}
    >
<Box p={4}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "100vw",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Chọn ghế
      </Typography>
      <Typography
       sx={{
          display: "flex",
          backgroundColor:"gray",
          p: 1,
          width: "50%",
          height:"30px",
          justifyContent:"center",
          alignItems: "center",
          mb:"15px"

        }}
      >MÀN HÌNH</Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {rows.map((row) => (
          <Box key={row} display="flex" alignItems="center">
            <Typography sx={{ width: 20 }}>{row}</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 35px)", // đúng 12 ghế mỗi hàng
                gap: 1,
                ml: 1,
              }}
            >
              {cols.map((col) => {
                const seatId = `${row}${col}`;
                return (
                  <Seat
                    key={seatId}
                    selected={selectedSeats.includes(seatId)}
                    sold={soldSeats.includes(seatId)}
                    onClick={() => toggleSeat(seatId)}
                    seatId={seatId}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>


      <Stack direction="row" spacing={2} mt={4} alignItems="center">
        <Box sx={{ width: 24, height: 24, bgcolor: "green" }} />
        <Typography variant="body2">Ghế bạn chọn</Typography>
        <Box sx={{ width: 24, height: 24, bgcolor: "#e0e0e0", border: "1px solid #ccc" }} />
        <Typography variant="body2">Chưa chọn</Typography>
        <Box sx={{ width: 24, height: 24, bgcolor: "grey.500" }} />
        <Typography variant="body2">Đã bán</Typography>
      </Stack>

    </Box>
    
    <Box>

      <Paper elevation={2} sx={{ p: 2, mt: 4, width: 300 }}>
        <Typography variant="subtitle1">Thông tin vé</Typography>
        <Typography variant="body2">Phim Điện Ảnh Doraemon: Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh</Typography>
        <Typography variant="body2">Suất: 14:50 - 30/05/2025</Typography>
        <Typography variant="body2">Phòng chiếu: 05</Typography>
        <Typography variant="body2">Ghế: {selectedSeats.join(", ") || "(chưa chọn)"}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Tổng: {selectedSeats.length * 70000} đ
        </Typography>
        <Button variant="contained" fullWidth sx={{ mt: 2 }}
        onClick={checkout}
        >
          Tiếp tục
        </Button>
      </Paper>
      </Box>
    </Box>
  );
}
