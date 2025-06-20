import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URLS from '../config/api';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
// import Navbar from './Navbar';

interface Movie {
  id: number;
  nameMovie: string;
  releaseDate: string; // giữ string nếu backend trả ngày dưới dạng chuỗi ISO
  durationMovie: string;
  actor: string;
  director: string;
  studio: string;
  content: string;
  trailer: string;
  avatar: string;
  statusFilmId: StatusFilm; // kiểu này là object hoặc bạn có thể chỉ để id nếu backend trả id
}

interface StatusFilm {
  id: number;
  name: string;
  // các thuộc tính khác của StatusFilm nếu có
}

export default function MoviesList() {
  const [movies, setMovies] = useState<Movie[] | null>([]);

  useEffect(() => {
    axios.get(API_URLS.MOVIE.list)
      .then(res => setMovies(res.data))
      .catch(err => console.error("Lỗi khi tải danh sách phim:", err));
  }, []);

  return (
    <Box>
      <Header />
      <Toolbar />
      <Banner />

      {/* Box mới để chứa các thẻ phim có thể cuộn ngang */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto', // Cho phép cuộn ngang khi nội dung tràn
          gap: 3, // Khoảng cách giữa các thẻ phim
          padding: '20px',
          '&::-webkit-scrollbar': { // Tùy chỉnh thanh cuộn cho trình duyệt Webkit (Chrome, Safari)
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': { // Màu của thanh cuộn
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': { // Nền của thanh cuộn
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          scrollSnapType: 'x mandatory', // Tùy chọn: giúp cuộn từng phần tử một cách mượt mà
        }}
      >
        {movies?.map((movie) => (
          // Thay Grid item bằng Box để các Card nằm trên cùng một hàng
          <Box
            key={movie.id}
            sx={{
              flexShrink: 0, // Ngăn không cho các thẻ co lại
              width: {
                xs: 'calc(100% - 40px)', // Chiếm gần hết chiều rộng trên màn hình nhỏ
                sm: 'calc(50% - 40px)',  // Khoảng 2 phim trên màn hình trung bình
                md: 'calc(25% - 40px)',  // Khoảng 4 phim trên màn hình lớn
              },
              maxWidth: 370, // Giới hạn kích thước tối đa của mỗi Card
              scrollSnapAlign: 'start', // Tùy chọn: căn chỉnh khi cuộn snap
            }}
          >
            <Card sx={{ height: "350px", display: 'flex', flexDirection: 'column' }}> {/* Đảm bảo Card có chiều cao cố định và flex column */}
              <CardMedia
                component="img"
                height="200"
                image={movie.avatar}
                alt={movie.nameMovie}
                sx={{
                  objectFit: 'contain'
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}> {/* flexGrow để CardContent chiếm hết không gian còn lại */}
                <Typography
                  variant="h6"
                  sx={{
                    height: "50px", // Đảm bảo tiêu đề phim có chiều cao cố định
                    overflow: 'hidden', // Ẩn phần văn bản tràn
                    textOverflow: 'ellipsis', // Thêm dấu ... nếu văn bản bị cắt
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Giới hạn số dòng hiển thị
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {movie.nameMovie}
                </Typography>
                <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}> {/* Loại bỏ gạch chân mặc định của Link */}
                  <Button variant="contained" sx={{ mt: 1, backgroundColor: '#e50914', width: '100%' }}>
                    Xem chi tiết
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      <Footer />
    </Box>
  );
}