import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URLS from '../config/api';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
// import Navbar from './Navbar';

export default function MoviesList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(API_URLS.MOVIE.list)
        .then(res => setMovies(res.data))
        .catch(err => console.error("Lỗi khi tải danh sách phim:", err));
  }, []);

  return (
      <Box> {/* chừa chỗ cho Header fixed và Footer fixed */}
        <Header />
        <Toolbar /> {/* Đẩy nội dung xuống dưới Header fixed */}
        <Banner />
        {/*<Navbar />*/}
        <Grid container spacing={4} sx={{ padding: '20px' }}>
          {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} key={movie.id}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                      component="img"
                      height="200"
                      image={movie.avatar}
                      alt={movie.nameMovie}
                  />
                  <CardContent>
                    <Typography variant="h6">{movie.nameMovie}</Typography>
                    <Link to={`/movie/${movie.id}`}>
                      <Button variant="contained" sx={{ mt: 2, backgroundColor: '#e50914' }}>
                        Xem chi tiết
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
        <Footer />
      </Box>
  );
}
