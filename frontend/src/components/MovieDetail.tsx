import React, { useEffect, useRef, useState } from 'react';
import {
    Box, Typography, Button, CardMedia,
    Chip, Toolbar,
    Tabs,
    Tab
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URLS from '../config/api';
import Header from './Header';
import Footer from './Footer';
// import ShowtimeSchedule from './ShowtimeSchedule'; // Not used in this component's render
// import ShowtimeSchedule2 from './ShowtimeSchedule2'; // Not used in this component's render

const MovieDetail = () => {
    // Define the interface for the Showtime details received from the backend DTO
    interface ShowtimeDetail {
        id: number;
        startTime: string; // Expected format: "HH:MM"
        cinema: string;    // Cinema name (string)
        room: string;      // Room name (string), e.g., "Phòng 1", "Room A"
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

    // Map for grouped showtimes, where key is "YYYY-MM-DD" date string
    interface GroupedShowtimesMap {
        [date: string]: ShowtimeDetail[];
    }

    // Interface for the overall API response (assuming backend sends { movie, groupedShowtimes })
    interface MovieDetailResponse {
        movie: Movie;
        showtimes: GroupedShowtimesMap;
    }

    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtimesMap | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const showtimeSectionRef = useRef<HTMLDivElement>(null); 
      const token = localStorage.getItem('token');
      console.log(token);
      
      const userId=localStorage.getItem("userId");
      const navigate=useNavigate();

    useEffect(() => {
        if (!id) return;
        axios.get<MovieDetailResponse>(API_URLS.MOVIE.detail(id))
            .then(res => {
                setMovie(res.data.movie);
                // --- FIX 1: Access the correct key for showtimes from the response ---
                const fetchedShowtimes = res.data.showtimes || {};
                setGroupedShowtimes(fetchedShowtimes);

                // Set the first available date as selected by default
                const sortedDates = Object.keys(fetchedShowtimes).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
                if (sortedDates.length > 0) {
                    setSelectedDate(sortedDates[0]);
                }
            })
            .catch(err => console.error("Lỗi khi tải chi tiết phim:", err));
    }, [id]);

    if (!movie) {
        return <Typography variant="h6" sx={{ padding: 4 }}>Đang tải chi tiết phim...</Typography>;
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

    const sortedDates = groupedShowtimes ? Object.keys(groupedShowtimes).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) : [];

    // Get showtimes for the selected date
    const showtimesForSelectedDate = selectedDate && groupedShowtimes ? groupedShowtimes[selectedDate] : [];

    // Group showtimes on the selected date by cinema
    const groupedShowtimesByCinema: { [cinemaName: string]: ShowtimeDetail[] } = {};
    showtimesForSelectedDate.forEach(st => {
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
            showtimeSectionRef.current.scrollIntoView({
                behavior: 'smooth', // Cuộn mượt mà
                block: 'start',     // Đặt phần tử ở đầu viewport
            });
        }
    };
    const handleChooseShowTime=async(id:number)=>{
        const res= await axios.post(API_URLS.BOOKING.CHOOSE_SHOWTIME,{
            userId: 2,
            showtimeId: id
        },{
            headers:{
                 Authorization: `Bearer ${token}`,
            }
        })
        const bookingId= res.data.id;
        localStorage.setItem("bookingId",bookingId);
        navigate(`/booking/${bookingId}/${id}/choose-seat`)
    }

    return (
        <Box>
            <Header />
            <Toolbar />
            <Box sx={{ paddingLeft: { xs: 2, md: 20 }, paddingRight: { xs: 2, md: 20 }, paddingBottom: 10, paddingTop: 10 }}>
                {/* Image + Info: 2-column layout */}
                <Box sx={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Left Column: Image */}
                    <CardMedia
                        component="img"
                        image={movie.avatar}
                        alt={movie.nameMovie}
                        sx={{
                            width: { xs: '100%', sm: 400, md: 450 },
                            height: { xs: 400, sm: 450, md: 500 },
                            objectFit: 'cover',
                            borderRadius: 2
                        }}
                    />

                    {/* Right Column: Movie Info */}
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}>
                        <Typography variant="h3" fontWeight="bold" mb={2} sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>{movie.nameMovie}</Typography>
                        <Typography variant="h6" gutterBottom>Mô tả</Typography>
                        <Typography paragraph sx={{ textAlign: 'justify' }}>{movie.content}</Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>Diễn viên</Typography>
                        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {castList.map((actor, idx) => (
                                <Chip key={idx} label={actor.trim()} color="primary" sx={{ m: 0.5 }} />
                            ))}
                        </Box>

                        <Typography variant="h6" sx={{ mt: 2 }}>Đạo diễn</Typography>
                        <Typography>{movie.director}</Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>Thời lượng</Typography>
                        <Typography>{movie.durationMovie}</Typography>

                        <Box sx={{ mt: 4 }}>
                            <Button variant="contained" color="error" size="large"
                            onClick={handleScrollToShowtime}
                            >
                                Đặt vé ngay
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Trailer section */}
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
                <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>Lịch chiếu</Typography>
                <Box>
                    {/* Tabs để chọn ngày */}
                    {sortedDates.length === 0 ? (
                        <Typography>Không có lịch chiếu nào cho phim này.</Typography>
                    ) : (
                        <Box
                        ref={showtimeSectionRef} 
                        sx={{ 
                            borderBottom: 1, borderColor: 'divider', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
                            <Tabs value={selectedDate}
                          
                            onChange={handleDateChange} variant="scrollable" scrollButtons="auto" aria-label="Lịch chiếu theo ngày">
                                {sortedDates.map(date => (
                                    <Tab
                                        key={date}
                                        // --- FIX 2: Correctly parse date string for display to avoid timezone issues ---
                                        label={new Date(
                                            parseInt(date.substring(0, 4)),       // Year
                                            parseInt(date.substring(5, 7)) - 1, // Month (0-indexed)
                                            parseInt(date.substring(8, 10))     // Day
                                        ).toLocaleDateString('vi-VN', { weekday: 'short', month: '2-digit', day: '2-digit' })}
                                        value={date}
                                        sx={{ minWidth: 120 }}
                                    />
                                ))}
                            </Tabs>
                        </Box>
                    )}

                    {/* Hiển thị các suất chiếu của ngày đã chọn */}
                    {selectedDate && groupedShowtimes && groupedShowtimes[selectedDate] && (
                        <Box sx={{ mt: 3 }}>
                            {Object.keys(groupedShowtimesByCinema).length === 0 ? (
                                <Typography>Không có suất chiếu cho ngày này.</Typography>
                            ) : (
                                Object.keys(groupedShowtimesByCinema).map(cinemaName => (
                                    <Box key={cinemaName} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                        <Typography variant="h6" color="secondary" sx={{ mb: 1 }}>
                                            {cinemaName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {groupedShowtimesByCinema[cinemaName].map(st => (
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
                                                        '&:hover': {
                                                            backgroundColor: 'primary.light',
                                                        },
                                                    }}
                                                    onClick={()=>handleChooseShowTime(st.id)}
                                                >
                                                    {/* --- FIX 4: Display startTime directly and re-add room name --- */}
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