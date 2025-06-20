import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    CardMedia,
    Chip,
    Toolbar,
    Tabs,
    Tab,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import API_URLS from '../config/api';
import Header from './Header';
import Footer from './Footer';

interface ShowtimeDetail {
    id: number;
    startTime: string;
    cinema: string;
    room: string;
}

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

interface GroupedShowtimesMap {
    [date: string]: ShowtimeDetail[];
}

interface MovieDetailResponse {
    movie: Movie;
    showtimes: GroupedShowtimesMap;
}

const MovieDetail = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtimesMap | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const showtimeSectionRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!id) return;
        axios
            .get<MovieDetailResponse>(API_URLS.MOVIE.detail(id), {
                headers: { 'Accept-Language': i18n.language },
            })
            .then((res) => {
                setMovie(res.data.movie);
                const fetchedShowtimes = res.data.showtimes || {};
                setGroupedShowtimes(fetchedShowtimes);
                const sortedDates = Object.keys(fetchedShowtimes).sort(
                    (a, b) => new Date(a).getTime() - new Date(b).getTime()
                );
                if (sortedDates.length > 0) {
                    setSelectedDate(sortedDates[0]);
                }
            })
            .catch((err) => {
                console.error('Lỗi khi tải chi tiết phim:', err);
                toast.error(t('movie.notfound'));
            });
    }, [id, t, i18n.language]);

    useEffect(() => {
        const shouldScroll = location.state && (location.state as { scrollToShowtime?: boolean }).scrollToShowtime;
        if (shouldScroll && groupedShowtimes && Object.keys(groupedShowtimes).length > 0) {
            handleScrollToShowtime();
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [groupedShowtimes, location.state, navigate, location.pathname]);

    if (!movie) {
        return (
            <Typography variant="h6" sx={{ padding: 4 }}>
                {t('movie.loading')} {/* "Loading movie details..." hoặc "Đang tải chi tiết phim..." */}
            </Typography>
        );
    }

    const castList = movie.actor ? movie.actor.split(',') : [];
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        return url;
    };

    const sortedDates = groupedShowtimes
        ? Object.keys(groupedShowtimes).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        : [];

    const showtimesForSelectedDate = selectedDate && groupedShowtimes ? groupedShowtimes[selectedDate] : [];

    const groupedShowtimesByCinema: { [cinemaName: string]: ShowtimeDetail[] } = {};
    showtimesForSelectedDate.forEach((st) => {
        if (!groupedShowtimesByCinema[st.cinema]) {
            groupedShowtimesByCinema[st.cinema] = [];
        }
        groupedShowtimesByCinema[st.cinema].push(st);
    });

    const handleDateChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedDate(newValue);
    };

    const handleScrollToShowtime = () => {
        if (showtimeSectionRef.current) {
            showtimeSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleChooseShowTime = async (id: number) => {
        try {
            const res = await axios.post(
                API_URLS.BOOKING.CHOOSE_SHOWTIME,
                { userId: parseInt(userId || '0'), showtimeId: id },
                { headers: { Authorization: `Bearer ${token}`, 'Accept-Language': i18n.language } }
            );
            const bookingId = res.data.id;
            localStorage.setItem('bookingId', bookingId);
            toast.success(t(res.data.message, { 0: bookingId }));
            navigate(`/booking/${bookingId}/${movie.id}/${id}/choose-seat`);
        } catch (err: any) {
            toast.error(t(err.response?.data?.error || 'booking.create.failed'));
        }
    };

    return (
        <Box>
            <Header />
            <Toolbar />
            <Box sx={{ paddingLeft: { xs: 2, md: 20 }, paddingRight: { xs: 2, md: 20 }, paddingBottom: 10, paddingTop: 10 }}>
                <Box sx={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <CardMedia
                        component="img"
                        image={movie.avatar}
                        alt={movie.nameMovie}
                        sx={{ width: { xs: '100%', sm: 400, md: 450 }, height: { xs: 400, sm: 450, md: 500 }, objectFit: 'cover', borderRadius: 2 }}
                    />
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}>
                        <Typography variant="h3" fontWeight="bold" mb={2} sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                            {movie.nameMovie}
                        </Typography>
                        <Typography variant="h6" gutterBottom>{t('movie.description')}</Typography>
                        <Typography paragraph sx={{ textAlign: 'justify' }}>{movie.content}</Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>{t('movie.actor')}</Typography>
                        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {castList.map((actor, idx) => (
                                <Chip key={idx} label={actor.trim()} color="primary" sx={{ m: 0.5 }} />
                            ))}
                        </Box>
                        <Typography variant="h6" sx={{ mt: 2 }}>{t('movie.director')}</Typography>
                        <Typography>{movie.director}</Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>{t('movie.duration')}</Typography>
                        <Typography>{movie.durationMovie}</Typography>
                        <Box sx={{ mt: 4 }}>
                            <Button variant="contained" color="error" size="large" onClick={handleScrollToShowtime}>
                                {t('booking.create.success').split(' ')[0]} {/* "Book Now" hoặc "Đặt vé ngay" */}
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Typography variant="h5" sx={{ mt: 6 }}>{t('movie.trailer')}</Typography>
                <Box sx={{ mt: 2, mb: 4 }}>
                    <iframe
                        width="100%"
                        height="450"
                        src={getEmbedUrl(movie.trailer)}
                        title={t('movie.trailer')}
                        allowFullScreen
                        style={{ borderRadius: '12px' }}
                    />
                </Box>
                <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>{t('showtime.schedule')}</Typography>
                <Box>
                    {sortedDates.length === 0 ? (
                        <Typography>{t('showtime.none')}</Typography>
                    ) : (
                        <Box
                            ref={showtimeSectionRef}
                            sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
                        >
                            <Tabs
                                value={selectedDate}
                                onChange={handleDateChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label={t('showtime.schedule')}
                            >
                                {sortedDates.map((date) => (
                                    <Tab
                                        key={date}
                                        label={new Date(
                                            parseInt(date.substring(0, 4)),
                                            parseInt(date.substring(5, 7)) - 1,
                                            parseInt(date.substring(8, 10))
                                        ).toLocaleDateString('vi-VN', { weekday: 'short', month: '2-digit', day: '2-digit' })}
                                        value={date}
                                        sx={{ minWidth: 120 }}
                                    />
                                ))}
                            </Tabs>
                        </Box>
                    )}
                    {selectedDate && groupedShowtimes && groupedShowtimes[selectedDate] && (
                        <Box sx={{ mt: 3 }}>
                            {Object.keys(groupedShowtimesByCinema).length === 0 ? (
                                <Typography>{t('showtime.none')}</Typography>
                            ) : (
                                Object.keys(groupedShowtimesByCinema).map((cinemaName) => (
                                    <Box key={cinemaName} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                        <Typography variant="h6" color="secondary" sx={{ mb: 1 }}>
                                            {cinemaName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {groupedShowtimesByCinema[cinemaName].map((st) => (
                                                <Button
                                                    key={st.id}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{
                                                        minWidth: 'unset',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold',
                                                        '&:hover': { backgroundColor: 'primary.light' },
                                                    }}
                                                    onClick={() => handleChooseShowTime(st.id)}
                                                >
                                                    {st.startTime}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
            <Toolbar />
            <Footer />
        </Box>
    );
};

export default MovieDetail;