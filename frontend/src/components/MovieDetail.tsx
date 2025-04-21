import React from 'react';
import { Box, Typography, Button, CardMedia, Chip, Rating } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useParams } from 'react-router-dom';

const movies = [
    {
        id: '1',
        title: 'Phim 1',
        description: 'Một bộ phim hành động kịch tính với những pha rượt đuổi nghẹt thở.',
        image: 'https://example.com/movie1.jpg',
        trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        cast: ['Diễn viên A', 'Diễn viên B', 'Diễn viên C'],
        rating: 4.5,
    },
    {
        id: '2',
        title: 'Phim 2',
        description: 'Một câu chuyện tình yêu cảm động giữa hai con người xa lạ.',
        image: 'https://example.com/movie2.jpg',
        trailer: 'https://www.youtube.com/embed/kXYiU_JCYtU',
        cast: ['Diễn viên D', 'Diễn viên E'],
        rating: 4.0,
    },
];

const MovieDetail = () => {
    const { id } = useParams();
    const movie = movies.find((movie) => movie.id === id);

    if (!movie) {
        return <Typography variant="h6" sx={{ padding: 4 }}>Không tìm thấy phim</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h3" fontWeight="bold">{movie.title}</Typography>

            {/* Hình ảnh phim */}
            <CardMedia
                component="img"
                height="450"
                image={movie.image}
                alt={movie.title}
                sx={{ my: 3, borderRadius: 2 }}
            />

            {/* Trailer */}
            <Typography variant="h5" fontWeight="medium">Trailer</Typography>
            <Box sx={{ mt: 2, mb: 4 }}>
                <iframe
                    width="100%"
                    height="400"
                    src={movie.trailer}
                    title="Trailer"
                    allowFullScreen
                    style={{ borderRadius: '12px' }}
                />
            </Box>

            {/* Mô tả */}
            <Typography variant="h6" fontWeight="medium" gutterBottom>Mô tả</Typography>
            <Typography>{movie.description}</Typography>

            {/* Dàn diễn viên */}
            <Typography variant="h6" fontWeight="medium" sx={{ mt: 4 }}>Diễn viên</Typography>
            {movie.cast.map((actor, idx) => (
  <Box key={idx} sx={{ display: 'inline-block', m: 0.5 }}>
    <Chip label={actor} color="primary" />
  </Box>
))}



            {/* Đánh giá */}
            <Typography variant="h6" fontWeight="medium" sx={{ mt: 4 }}>Đánh giá</Typography>
            <Rating value={movie.rating} precision={0.5} readOnly />

            {/* Nút đặt vé */}
            <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="error" size="large">
                    Đặt vé ngay
                </Button>
            </Box>
        </Box>
    );
};

export default MovieDetail;
