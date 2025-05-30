import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, CardMedia,
    Chip, Toolbar
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_URLS from '../config/api';
import Header from './Header';
import Footer from './Footer';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        if (!id) return;
        axios.get(API_URLS.MOVIE.detail(id))
            .then(res => setMovie(res.data))
            .catch(err => console.error("Lỗi khi tải chi tiết phim:", err));
    }, [id]);

    if (!movie) {
        return <Typography variant="h6" sx={{ padding: 4 }}>Không tìm thấy phim</Typography>;
    }

    const castList = movie.actor ? movie.actor.split(',') : [];

    return (
        <Box>
            <Header />
            <Toolbar />
            <Box px={{ padding: 20 }} sx={{ padding: 10 }}>
                {/* Hình + Thông tin: layout 2 cột */}
                <Box sx={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {/* Cột trái: Hình ảnh */}
                    <CardMedia
                        component="img"
                        image={movie.avatar}
                        alt={movie.nameMovie}
                        sx={{
                            width: 450,
                            height: 500,
                            objectFit: 'cover',
                            borderRadius: 2
                        }}
                    />

                    {/* Cột phải: Thông tin phim */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h3" fontWeight="bold" mb={4}>{movie.nameMovie}</Typography>
                        <Typography variant="h6" gutterBottom>Mô tả</Typography>
                        <Typography paragraph>{movie.content}</Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>Diễn viên</Typography>
                        <Box sx={{ mb: 1 }}>
                            {castList.map((actor, idx) => (
                                <Chip key={idx} label={actor.trim()} color="primary" sx={{ m: 0.5 }} />
                            ))}
                        </Box>

                        <Typography variant="h6" sx={{ mt: 2 }}>Đạo diễn</Typography>
                        <Typography>{movie.director}</Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>Thời lượng</Typography>
                        <Typography>{movie.durationMovie}</Typography>

                        <Box sx={{ mt: 4 }}>
                            <Button variant="contained" color="error" size="large">
                                Đặt vé ngay
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Trailer phía dưới */}
                <Typography variant="h5" sx={{ mt: 6 }}>Trailer</Typography>
                <Box sx={{ mt: 2, mb: 4 }}>
                    <iframe
                        width="100%"
                        height="450"
                        src={movie.trailer}
                        title="Trailer"
                        allowFullScreen
                        style={{ borderRadius: '12px' }}
                    />
                </Box>
            </Box>
            <Toolbar />
            <Footer />
        </Box>
    );
};

export default MovieDetail;
