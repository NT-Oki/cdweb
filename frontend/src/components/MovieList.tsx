import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MoviesList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/movies/list') // Thay bằng URL thật nếu khác
        .then(res => setMovies(res.data))
        .catch(err => console.error("Lỗi khi tải danh sách phim:", err));
  }, []);

  return (
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
  );
}
