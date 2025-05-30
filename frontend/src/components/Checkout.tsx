import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router";
const CheckoutPage = () => {
    const navigate= useNavigate();
    const getTicket = ()=>{
        navigate("/ticket")
    }
  return (

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
        <Box
        sx={{
            flex:2,
            
        }}
        >
  {/* Tóm tắt đơn hàng */}
        <Box
          sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1 }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold",
          backgroundColor:"rgb(149, 170, 201)",
          position:"relative",
          width:"100%",
          borderRadius: 2,
          height:"50px",
          display:"flex",
          justifyContent:"center",
          alignItems:"center"

          }}>
            Tóm tắt đơn hàng
          </Typography>
          <Box
            sx={{ 
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                p:"0 12px 12px 12px"
                
              
             }}
          >
            <Typography 
            sx={{
                fontWeight: "bold",
                color: "rgb(149, 170, 201)",
            }}
            >Mô tả</Typography>
            <Typography
             sx={{
                fontWeight: "bold",
                color: "rgb(149, 170, 201)",
            }}
            >Số lượng</Typography>
            <Typography
             sx={{
                fontWeight: "bold",
                color: "rgb(149, 170, 201)",
            }}
            >Thành tiền</Typography>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 2 ,borderBottom: "1px solid rgba(0, 0, 0, 0.12)",p:1}}
          >
            <Typography>Ghế Đơn</Typography>
            <Typography>3</Typography>
            <Typography>210.000 đ</Typography>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 2,borderBottom: "1px solid rgba(0, 0, 0, 0.12)",p:1 }}
          >
            <Typography>Phí tiện ích</Typography>
            <Typography>2.500 đ</Typography>
          </Box>
          <Box  sx={{ display: "flex", justifyContent: "space-between", mb: 2,p:1 }}>
            <Typography fontWeight="bold">Tổng</Typography>
            <Typography fontWeight="bold">212.500 đ</Typography>
          </Box>
        </Box>
          {/* Form thông tin cá nhân */}
        <Box
          sx={{ bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 1,mt:3 }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Thông tin cá nhân
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField required label="Họ và tên" fullWidth />
            <TextField required label="Số điện thoại" fullWidth />
            <TextField label="Email" fullWidth />
          </Box>
        </Box>
        </Box>
        {/* endleft------------------------------------- */}
        <Box
        sx={{
            flex:1
        }}
        >
 {/* Thông tin vé */}
        <Box
          sx={{ bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 1 }}
        >
          <Typography variant="body1">
            <strong>Phim Điện Ảnh Doraemon: Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>ThuThao Cinema</strong>
          </Typography>
          <Typography variant="body2">
            Suất <strong>14:50 30/05/2025</strong>
          </Typography>
          <Typography variant="body2">
            Phòng chiếu <strong>05</strong> – Ghế <strong>E4, E5, E6</strong>
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography fontWeight="bold" variant="h6">
              Tổng đơn hàng: 212.500 đ
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Vé đã mua không thể đổi hoặc hoàn tiền. <br /> Mã vé sẽ được gửi
              <strong> 01 </strong> lần qua số điện thoại và email đã nhập. Vui
              lòng kiểm tra lại thông tin trước khi tiếp tục.
            </Typography>
          </Box>
        </Box>

      

        {/* Xác nhận */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button variant="outlined">Quay lại</Button>
          <Button variant="contained" color="primary"
          onClick={getTicket}
          >
            Xác nhận
          </Button>
        </Box>
      </Box>

        </Box>

        
      

       
    </Box>
  );
};

export default CheckoutPage;
