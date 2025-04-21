import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const movies = [
  { id: '1', title: 'Phim 1', image: 'https://example.com/movie1.jpg' },
  { id: '2', title: 'Phim 2', image: 'https://example.com/movie2.jpg' },
  { id: '3', title: 'Phim 3', image: 'https://example.com/movie3.jpg' },
  // Thêm phim khác ở đây...
];

export default function MoviesList() {
  return (
    <Grid container spacing={4} sx={{ padding: '20px' }}>
      {movies.map((movie, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="200"
              image={movie.image}
              alt={movie.title}
            />
            <CardContent>
              <Typography variant="h6">{movie.title}</Typography>
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
