import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import API_URLS from '../../../config/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export interface StatusFilm {
    id: number;
    nameStatus: string;
}

export interface Movie {
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


export default function MovieManagement() {
    const token = localStorage.getItem("token");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await axios.get(API_URLS.ADMIN.movie.list_movie, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMovies(res.data);
        } catch (err: any) {
            console.log(err.response.data);
        }
    };

    const handleEdit = (movie: Movie) => {
        setSelectedMovie(movie);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMovie(null);
    };

    const handleSave = async () => {
        await axios.put(API_URLS.ADMIN.movie.add, selectedMovie);
        fetchMovies();
        handleClose();
    };

    const filteredMovies = movies.filter((m) =>
        m.nameMovie.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusText = (id: number) => {
        switch (id) {
            case 1:
                return 'Đang chiếu';
            case 2:
                return 'Sắp chiếu';
            default:
                return 'Ngừng chiếu';
        }
    };

    const getStatusColor = (id: number) => {
        switch (id) {
            case 1:
                return '#4caf50'; // green
            case 2:
                return '#2196f3'; // blue
            default:
                return '#f44336'; // red
        }
    };

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý phim
            </Typography>
            <TextField
                label="Tìm kiếm phim"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell

                                sx={{
                                    maxWidth: "150px"
                                }}>Tên phim</TableCell>
                            <TableCell>Ngày chiếu</TableCell>
                            <TableCell>Thời lượng</TableCell>
                            <TableCell>Đạo diễn</TableCell>
                            <TableCell
                                sx={{
                                    maxWidth: "200px"
                                }}
                            >Diễn viên</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMovies.map((movie, index) => (
                            <TableRow key={movie.id}>
                                <TableCell
                                    sx={{
                                        maxWidth: "150px"
                                    }}
                                >{movie.nameMovie}</TableCell>
                                <TableCell>{movie.releaseDate}</TableCell>
                                <TableCell>{movie.durationMovie} phút</TableCell>
                                <TableCell>{movie.director}</TableCell>
                                <TableCell
                                    sx={{
                                        maxWidth: "200px"
                                    }}
                                >{movie.actor}</TableCell>
                                <TableCell
                                    sx={{
                                        color: getStatusColor(movie.statusFilmId.id),
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {getStatusText(movie.statusFilmId.id)}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(movie)} color="primary" size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleEdit(movie)}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Chỉnh sửa phim</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên phim"
                        fullWidth
                        margin="normal"
                        value={selectedMovie?.nameMovie || ''}
                        onChange={(e) => {
                            if (selectedMovie) {
                                setSelectedMovie({ ...selectedMovie, nameMovie: e.target.value });
                            }
                        }}

                    />
                    {/* Thêm các field khác nếu cần */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSave} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
