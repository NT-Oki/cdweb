import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import API_URLS from '../config/api';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
interface Movie {
    id: number;
    nameMovie: string;
    releaseDate: string;
    durationMovie: string;
    actor: string;
    director: string;
    studio: string;
    content: string;
    trailer: string;
    avatar: string;
    statusFilmId: StatusFilm;
}

interface StatusFilm {
    id: number;
    name: string;
}
export default function Home() {
    const { t, i18n } = useTranslation();
    const [movies, setMovies] = useState<Movie[] | null>([]);

    useEffect(() => {
        axios
            .get(API_URLS.MOVIE.list, {
                headers: { 'Accept-Language': i18n.language },
            })
            .then((res) => setMovies(res.data))
            .catch((err) => {
                console.error('Lỗi khi tải danh sách phim:', err);
                toast.error(t('movie.notfound'));
            });
    }, [t, i18n.language]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Toolbar />
            <Box component="main" sx={{ flexGrow: 1, padding: '20px' }}>
                <Banner />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t('movie.list.title')} {/* "Danh sách phim" hoặc "Movies List" */}
                </Typography>
                <Grid container spacing={4}>
                    {movies?.map((movie) => (
                        <Grid item xs={12} sm={6} md={4} key={movie.id}>
                            <Card sx={{ maxWidth: 370, height: '350px' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={movie.avatar}
                                    alt={movie.nameMovie}
                                    sx={{ objectFit: 'contain' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" sx={{ height: '50px' }}>
                                        {movie.nameMovie}
                                    </Typography>
                                    <Link to={`/movie/${movie.id}`}>
                                        <Button variant="contained" sx={{ mt: 2, backgroundColor: '#e50914' }}>
                                            {t('movie.detail')} {/* "Xem chi tiết" hoặc "View Details" */}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Footer />
        </Box>
    );
}