import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CardMedia, Chip, Rating } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/movies/detail/${id}`)
            .then(res => setMovie(res.data))
            .catch(err => console.error("Lỗi khi tải chi tiết phim:", err));
    }, [id]);

    if (!movie) {
        return <Typography variant="h6" sx={{ padding: 4 }}>Không tìm thấy phim</Typography>;
    }

    const castList = movie.actor ? movie.actor.split(',') : [];

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h3" fontWeight="bold">{movie.nameMovie}</Typography>

            {/* Hình ảnh phim */}
            <CardMedia
                component="img"
                height="450"
                image={movie.avatar}
                alt={movie.nameMovie}
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
            <Typography>{movie.content}</Typography>

            {/* Dàn diễn viên */}
            <Typography variant="h6" fontWeight="medium" sx={{ mt: 4 }}>Diễn viên</Typography>
            {castList.map((actor, idx) => (
                <Box key={idx} sx={{ display: 'inline-block', m: 0.5 }}>
                    <Chip label={actor.trim()} color="primary" />
                </Box>
            ))}

            {/* Đạo diễn */}
            <Typography variant="h6" fontWeight="medium" sx={{ mt: 4 }}>Đạo diễn</Typography>
            <Typography>{movie.director}</Typography>

            {/* Thời lượng */}
            <Typography variant="h6" fontWeight="medium" sx={{ mt: 2 }}>Thời lượng</Typography>
            <Typography>{movie.durationMovie}</Typography>

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
