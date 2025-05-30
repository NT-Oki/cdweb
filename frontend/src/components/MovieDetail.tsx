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
import ShowtimeSchedule from './ShowtimeSchedule';
import ShowtimeSchedule2 from './ShowtimeSchedule2';

const MovieDetail = () => {
 interface Movie {
  id: number;
  nameMovie: string;
  releaseDate: string;     // giữ string nếu backend trả ngày dưới dạng chuỗi ISO
  durationMovie: string;
  actor: string;
  director: string;
  studio: string;
  content: string;
  trailer: string;
  avatar: string;
  statusFilmId: StatusFilm;  // kiểu này là object hoặc bạn có thể chỉ để id nếu backend trả id
}

interface StatusFilm {
  id: number;
  name: string;
  // các thuộc tính khác của StatusFilm nếu có
}
    const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);


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
    const getEmbedUrl=(url: string)=> {
  if (!url) return "";

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  return url; // Nếu đã là embed hoặc link khác
}

    return (
        <Box>
            <Header />
            <Toolbar />
            <Box sx={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 10, paddingTop: 10 }}>
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
                        src={getEmbedUrl(movie.trailer)}
                        title="Trailer"
                        allowFullScreen
                        style={{ borderRadius: '12px' }}
                    />
                </Box>

                {/* Showtime lịch chiếu */}
                <Typography variant="h5" sx={{ mt: 6 }}>Lịch chiếu</Typography>
                <ShowtimeSchedule2/>
            </Box>
            <Toolbar />
            <Footer />
        </Box>
    );
};

export default MovieDetail;
