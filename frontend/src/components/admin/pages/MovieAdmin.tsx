import React, { useEffect, useState } from 'react';
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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert, Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API_URLS, { apiRequest } from '../../../config/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {Iconify} from "../components/iconify";

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
    statusFilmId: StatusFilm; // Khôi phục thành StatusFilm
}

export default function MovieManagement() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Partial<Movie> | null>(null);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchMovies();
    }, [user, navigate]);

    const fetchMovies = async () => {
        try {
            const data = await apiRequest(API_URLS.ADMIN.movie.list_movie, { method: 'GET' }, logout, navigate);
            setMovies(data);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lấy danh sách phim');
        }
    };

    const handleEdit = async (movie: Movie) => {
        try {
            const data = await apiRequest(API_URLS.ADMIN.movie.detail(movie.id), { method: 'GET' }, logout, navigate);
            setSelectedMovie(data);
            setOpen(true);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lấy chi tiết phim');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa phim này?')) return;
        try {
            await apiRequest(API_URLS.ADMIN.movie.delete(id), { method: 'DELETE' }, logout, navigate);
            fetchMovies();
        } catch (err: any) {
            setError(err.message || 'Lỗi khi xóa phim');
        }
    };

    const handleAdd = () => {
        setSelectedMovie({
            nameMovie: '',
            releaseDate: '',
            durationMovie: '',
            actor: '',
            director: '',
            studio: '',
            content: '',
            trailer: '',
            avatar: '',
            statusFilmId: { id: 1, nameStatus: 'Đang chiếu' },
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMovie(null);
        setFormError(null);
    };

    const handleSave = async () => {
        if (!selectedMovie) return;
        setFormError(null);

        // Kiểm tra dữ liệu
        if (!selectedMovie.nameMovie || !selectedMovie.releaseDate || !selectedMovie.durationMovie || !selectedMovie.actor || !selectedMovie.director) {
            setFormError('Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }

        // Chuẩn bị dữ liệu gửi đi
        const movieData = {
            ...selectedMovie,
            statusFilmId: selectedMovie.statusFilmId?.id, // Gửi id dưới dạng number
        };

        try {
            await apiRequest(API_URLS.ADMIN.movie.add, {
                method: 'POST',
                body: JSON.stringify(movieData),
            }, logout, navigate);
            fetchMovies();
            handleClose();
        } catch (err: any) {
            setFormError(err.message || 'Lỗi khi lưu phim');
        }
    };

    const filteredMovies = movies.filter((m) =>
        m.nameMovie.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusText = (id: number) => {
        switch (id) {
            case 1: return 'Đang chiếu';
            case 2: return 'Sắp chiếu';
            default: return 'Ngừng chiếu';
        }
    };

    const getStatusColor = (id: number) => {
        switch (id) {
            case 1: return '#4caf50'; // green
            case 2: return '#2196f3'; // blue
            default: return '#f44336'; // red
        }
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý phim
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    label="Tìm kiếm phim"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleAdd}
                >
                    Thêm phim
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ maxWidth: '150px' }}>Tên phim</TableCell>
                            <TableCell>Ngày chiếu</TableCell>
                            <TableCell>Thời lượng</TableCell>
                            <TableCell>Đạo diễn</TableCell>
                            <TableCell sx={{ maxWidth: '200px' }}>Diễn viên</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMovies.map((movie) => (
                            <TableRow key={movie.id}>
                                <TableCell sx={{ maxWidth: '150px' }}>{movie.nameMovie}</TableCell>
                                <TableCell>{movie.releaseDate}</TableCell>
                                <TableCell>{movie.durationMovie} phút</TableCell>
                                <TableCell>{movie.director}</TableCell>
                                <TableCell sx={{ maxWidth: '200px' }}>{movie.actor}</TableCell>
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
                                    <IconButton onClick={() => handleDelete(movie.id)} color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{selectedMovie?.id ? 'Chỉnh sửa phim' : 'Thêm phim'}</DialogTitle>
                <DialogContent>
                    {formError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {formError}
                        </Alert>
                    )}
                    <TextField
                        label="Tên phim"
                        fullWidth
                        margin="normal"
                        value={selectedMovie?.nameMovie || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, nameMovie: e.target.value })}
                        required
                    />
                    <TextField
                        label="Ngày phát hành"
                        fullWidth
                        margin="normal"
                        type="date"
                        value={selectedMovie?.releaseDate || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, releaseDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Thời lượng (phút)"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={selectedMovie?.durationMovie || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, durationMovie: e.target.value })}
                        required
                    />
                    <TextField
                        label="Đạo diễn"
                        fullWidth
                        margin="normal"
                        value={selectedMovie?.director || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, director: e.target.value })}
                        required
                    />
                    <TextField
                        label="Diễn viên"
                        fullWidth
                        margin="normal"
                        value={selectedMovie?.actor || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, actor: e.target.value })}
                        required
                    />
                    <TextField
                        label="Hãng phim"
                        fullWidth
                        margin="normal"
                        value={selectedMovie?.studio || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, studio: e.target.value })}
                    />
                    <TextField
                        label="Nội dung"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={selectedMovie?.content || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, content: e.target.value })}
                    />
                    <TextField
                        label="Trailer (URL)"
                        fullWidth
                        margin="normal"
                        value={selectedMovie?.trailer || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, trailer: e.target.value })}
                    />
                    <TextField
                        label="Avatar (URL)"
                        fullWidth
                        margin="normal"
                        value={selectedMovie?.avatar || ''}
                        onChange={(e) => setSelectedMovie({ ...selectedMovie!, avatar: e.target.value })}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={selectedMovie?.statusFilmId?.id || 1}
                            onChange={(e) =>
                                setSelectedMovie({
                                    ...selectedMovie!,
                                    statusFilmId: { id: Number(e.target.value), nameStatus: getStatusText(Number(e.target.value)) },
                                })
                            }
                        >
                            <MenuItem value={1}>Đang chiếu</MenuItem>
                            <MenuItem value={2}>Sắp chiếu</MenuItem>
                            <MenuItem value={3}>Ngừng chiếu</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSave} variant="contained" disabled={!selectedMovie?.nameMovie}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}